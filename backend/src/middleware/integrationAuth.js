const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware de autenticação para rotas de integração
 *
 * O cliente deve enviar um JWT no header Authorization: Bearer {token}
 * O JWT deve ser assinado com a secret_key da empresa
 * Payload do JWT: { access_key, timestamp, exp }
 */
const integrationAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Envie o token JWT no header Authorization: Bearer {token}'
      });
    }

    const token = authHeader.substring(7);

    // Decodificar sem verificar para pegar o access_key
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.access_key) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'O token deve conter access_key no payload'
      });
    }

    // Buscar empresa pelo access_key
    const empresa = await prisma.empresa.findFirst({
      where: {
        acessKey: decoded.access_key,
        ativo: true,
        dataExclusao: null
      }
    });

    if (!empresa) {
      return res.status(401).json({
        error: 'Empresa não encontrada',
        message: 'Access key inválida ou empresa inativa'
      });
    }

    // Verificar o token com a secret_key da empresa
    try {
      jwt.verify(token, empresa.secretKey);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token expirado',
          message: 'Gere um novo token JWT'
        });
      }
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Assinatura do token inválida. Verifique a secret_key.'
      });
    }

    // Adicionar empresa ao request (usar id_empresa como id para compatibilidade)
    req.empresa = { ...empresa, id: empresa.id_empresa };

    next();
  } catch (error) {
    console.error('Erro na autenticação de integração:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao processar autenticação'
    });
  }
};

/**
 * Função para salvar log (opcional)
 * O cliente pode enviar dados de log no body: { log: { name, document, ... } }
 */
const saveLog = async (empresaId, logData) => {
  if (!logData || typeof logData !== 'object') {
    return null;
  }

  try {
    // Converter o objeto log para string, separando por ";"
    // Primeiro, fazer replace de ";" por "." em todos os valores
    const sanitizedEntries = Object.entries(logData).map(([key, value]) => {
      const sanitizedValue = String(value || '').replace(/;/g, '.');
      return `${key}:${sanitizedValue}`;
    });

    const content = sanitizedEntries.join(';');

    // Limitar a 255 caracteres (tamanho da coluna)
    const truncatedContent = content.substring(0, 255);

    const log = await prisma.log.create({
      data: {
        empresaId: empresaId,
        content: truncatedContent
      }
    });

    return log;
  } catch (error) {
    console.error('Erro ao salvar log:', error);
    return null;
  }
};

module.exports = { integrationAuth, saveLog };
