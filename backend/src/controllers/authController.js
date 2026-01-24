const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui-mude-em-producao';

const login = async (req, res) => {
  try {
    const { documento, senha } = req.body;

    if (!documento || !senha) {
      return res.status(400).json({ error: 'CNPJ e senha são obrigatórios' });
    }

    // Remove caracteres especiais do documento para comparação
    const documentoLimpo = documento.replace(/[^\d]/g, '');

    const empresa = await prisma.empresa.findFirst({
      where: {
        documento: documentoLimpo,
        dataExclusao: null,
        ativo: true
      }
    });

    if (!empresa) {
      return res.status(401).json({ error: 'CNPJ ou senha inválidos' });
    }

    // Verifica a senha (compara diretamente ou com bcrypt se estiver hasheada)
    const senhaValida = empresa.senha.startsWith('$2')
      ? await bcrypt.compare(senha, empresa.senha)
      : senha === empresa.senha;

    if (!senhaValida) {
      return res.status(401).json({ error: 'CNPJ ou senha inválidos' });
    }

    // Gera o token JWT
    const token = jwt.sign(
      {
        empresaId: empresa.id,
        slug: empresa.slug,
        nome: empresa.nome
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        slug: empresa.slug,
        documento: empresa.documento
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

const verificarToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const empresa = await prisma.empresa.findFirst({
      where: {
        id: decoded.empresaId,
        dataExclusao: null,
        ativo: true
      }
    });

    if (!empresa) {
      return res.status(401).json({ error: 'Empresa não encontrada ou inativa' });
    }

    res.json({
      valid: true,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        slug: empresa.slug,
        documento: empresa.documento
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro ao verificar token' });
  }
};

const verificarEmpresa = async (req, res) => {
  try {
    const { slug } = req.params;

    const empresa = await prisma.empresa.findFirst({
      where: {
        slug,
        dataExclusao: null
      }
    });

    if (!empresa) {
      return res.status(404).json({ error: 'Empresa não encontrada', exists: false });
    }

    if (!empresa.ativo) {
      return res.status(403).json({ error: 'Empresa inativa', exists: true, active: false });
    }

    res.json({
      exists: true,
      active: true,
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        slug: empresa.slug
      }
    });
  } catch (error) {
    console.error('Erro ao verificar empresa:', error);
    res.status(500).json({ error: 'Erro ao verificar empresa' });
  }
};

module.exports = { login, verificarToken, verificarEmpresa };
