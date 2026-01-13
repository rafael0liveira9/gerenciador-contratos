const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Limpa dados existentes
  await prisma.bloco.deleteMany();
  await prisma.pagina.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.template.deleteMany();
  await prisma.clausula.deleteMany();
  await prisma.cabecalho.deleteMany();
  await prisma.rodape.deleteMany();
  await prisma.variavel.deleteMany();
  await prisma.responsavel.deleteMany();
  await prisma.empresa.deleteMany();

  // Criar empresa
  const empresa = await prisma.empresa.create({
    data: {
      documento: '12.345.678/0001-90',
      nome: 'Select Contabilidade',
      slug: 'select',
      secret: 'secret123',
      ativo: true
    }
  });
  console.log('Empresa criada:', empresa.nome);

  // Criar responsavel
  const responsavel = await prisma.responsavel.create({
    data: {
      empresaId: empresa.id,
      nome: 'Rafael Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      email: 'rafael@select.com.br'
    }
  });
  console.log('Responsavel criado:', responsavel.nome);

  // Criar variaveis
  const variaveis = await Promise.all([
    prisma.variavel.create({
      data: {
        empresaId: empresa.id,
        label: 'Nome do Cliente',
        tag: '{{nome_cliente}}'
      }
    }),
    prisma.variavel.create({
      data: {
        empresaId: empresa.id,
        label: 'CPF do Cliente',
        tag: '{{cpf_cliente}}'
      }
    }),
    prisma.variavel.create({
      data: {
        empresaId: empresa.id,
        label: 'Data Atual',
        tag: '{{data_atual}}'
      }
    }),
    prisma.variavel.create({
      data: {
        empresaId: empresa.id,
        label: 'Valor do Contrato',
        tag: '{{valor_contrato}}'
      }
    })
  ]);
  console.log('Variaveis criadas:', variaveis.length);

  // Criar cabecalho
  const cabecalho = await prisma.cabecalho.create({
    data: {
      empresaId: empresa.id,
      nome: 'Cabecalho Padrao',
      conteudo: '<div style="text-align: center;"><h1>SELECT CONTABILIDADE</h1><p>CNPJ: 12.345.678/0001-90</p><p>Rua das Empresas, 123 - Centro - Sao Paulo/SP</p></div>',
      versao: 1
    }
  });
  console.log('Cabecalho criado:', cabecalho.nome);

  // Criar rodape
  const rodape = await prisma.rodape.create({
    data: {
      empresaId: empresa.id,
      nome: 'Rodape Padrao',
      conteudo: '<div style="text-align: center; font-size: 10px; color: #666;"><p>Este documento foi gerado eletronicamente e nao necessita de assinatura fisica.</p><p>Pagina 1 de 1</p></div>',
      versao: 1
    }
  });
  console.log('Rodape criado:', rodape.nome);

  // Criar clausulas
  const clausulas = await Promise.all([
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Objeto do Contrato',
        conteudo: '<p>O presente contrato tem por objeto a prestacao de servicos contabeis, incluindo escrituracao contabil, apuracao de impostos e obrigacoes acessorias.</p>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Vigencia',
        conteudo: '<p>O presente contrato tera vigencia de 12 (doze) meses, iniciando-se em {{data_atual}}, podendo ser renovado automaticamente por igual periodo.</p>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Valor e Forma de Pagamento',
        conteudo: '<p>Pelo servico prestado, o CONTRATANTE pagara mensalmente a quantia de {{valor_contrato}}, com vencimento todo dia 10 de cada mes.</p>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Obrigacoes do Contratante',
        conteudo: '<p>Sao obrigacoes do CONTRATANTE:</p><ul><li>Fornecer todos os documentos necessarios para a execucao dos servicos;</li><li>Efetuar o pagamento nas datas acordadas;</li><li>Comunicar qualquer alteracao cadastral.</li></ul>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Obrigacoes do Contratado',
        conteudo: '<p>Sao obrigacoes do CONTRATADO:</p><ul><li>Executar os servicos com zelo e diligencia;</li><li>Manter sigilo sobre as informacoes do cliente;</li><li>Cumprir os prazos estabelecidos.</li></ul>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Rescisao',
        conteudo: '<p>O presente contrato podera ser rescindido por qualquer das partes, mediante aviso previo de 30 (trinta) dias.</p>',
        versao: 1
      }
    }),
    prisma.clausula.create({
      data: {
        empresaId: empresa.id,
        nome: 'Foro',
        conteudo: '<p>Fica eleito o foro da Comarca de Sao Paulo/SP para dirimir quaisquer controversias oriundas do presente contrato.</p>',
        versao: 1
      }
    })
  ]);
  console.log('Clausulas criadas:', clausulas.length);

  // Criar template
  const template = await prisma.template.create({
    data: {
      empresaId: empresa.id,
      nome: 'Contrato de Prestacao de Servicos Contabeis',
      descricao: 'Modelo padrao para contratacao de servicos contabeis',
      versao: 1
    }
  });
  console.log('Template criado:', template.nome);

  // Criar pagina
  const pagina = await prisma.pagina.create({
    data: {
      templateId: template.id,
      ordem: 1,
      conteudo: ''
    }
  });
  console.log('Pagina criada');

  // Criar blocos
  const blocos = await Promise.all([
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        cabecalhoId: cabecalho.id,
        ordem: 1,
        level: 1,
        htmlTag: 'div',
        tipo: 'CABECALHO'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        ordem: 2,
        level: 1,
        htmlTag: 'h1',
        tipo: 'TITULO',
        styles: JSON.stringify({ textAlign: 'center', marginTop: 20, marginBottom: 20 })
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[0].id,
        ordem: 3,
        level: 1,
        numeracao: '1.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[1].id,
        ordem: 4,
        level: 1,
        numeracao: '2.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[2].id,
        ordem: 5,
        level: 1,
        numeracao: '3.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[3].id,
        ordem: 6,
        level: 1,
        numeracao: '4.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[4].id,
        ordem: 7,
        level: 1,
        numeracao: '5.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[5].id,
        ordem: 8,
        level: 1,
        numeracao: '6.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        clausulaId: clausulas[6].id,
        ordem: 9,
        level: 1,
        numeracao: '7.',
        htmlTag: 'div',
        tipo: 'CLAUSULA'
      }
    }),
    prisma.bloco.create({
      data: {
        paginaId: pagina.id,
        rodapeId: rodape.id,
        ordem: 10,
        level: 1,
        htmlTag: 'div',
        tipo: 'RODAPE'
      }
    })
  ]);
  console.log('Blocos criados:', blocos.length);

  console.log('Seed concluido com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
