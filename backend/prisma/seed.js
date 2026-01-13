const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Limpa dados existentes
  await prisma.contractBlock.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.clause.deleteMany();

  // Cria clausulas de exemplo
  const clauses = await Promise.all([
    prisma.clause.create({
      data: {
        title: 'Objeto do Contrato',
        content: 'O presente contrato tem por objeto a prestacao de servicos de desenvolvimento de software, conforme especificacoes detalhadas no Anexo I.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Prazo de Vigencia',
        content: 'O prazo de vigencia do presente contrato sera de 12 (doze) meses, contados a partir da data de sua assinatura, podendo ser prorrogado mediante termo aditivo.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Valor e Forma de Pagamento',
        content: 'O valor total do presente contrato e de R$ [VALOR], a ser pago em [PARCELAS] parcelas mensais e consecutivas, mediante apresentacao de nota fiscal.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Obrigacoes da Contratada',
        content: 'A CONTRATADA obriga-se a: a) executar os servicos conforme especificacoes tecnicas; b) cumprir os prazos estabelecidos; c) manter sigilo das informacoes.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Obrigacoes do Contratante',
        content: 'O CONTRATANTE obriga-se a: a) fornecer as informacoes necessarias; b) efetuar os pagamentos nas datas acordadas; c) designar responsavel tecnico.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Confidencialidade',
        content: 'As partes comprometem-se a manter sob sigilo todas as informacoes confidenciais trocadas em razao deste contrato, pelo prazo de 5 (cinco) anos apos seu termino.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Rescisao Contratual',
        content: 'O presente contrato podera ser rescindido por qualquer das partes, mediante aviso previo de 30 (trinta) dias, sem onus ou penalidades, salvo disposicao em contrario.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Foro',
        content: 'Fica eleito o foro da Comarca de [CIDADE/ESTADO] para dirimir quaisquer duvidas ou controversias oriundas do presente contrato, com renuncia a qualquer outro.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Penalidades',
        content: 'O descumprimento de qualquer clausula deste contrato sujeitara a parte infratora ao pagamento de multa de 10% (dez por cento) sobre o valor total do contrato.',
        version: 1
      }
    }),
    prisma.clause.create({
      data: {
        title: 'Propriedade Intelectual',
        content: 'Todos os direitos de propriedade intelectual sobre os produtos desenvolvidos em razao deste contrato serao de titularidade exclusiva do CONTRATANTE.',
        version: 1
      }
    })
  ]);

  console.log(`Created ${clauses.length} clauses`);

  // Cria contrato de exemplo
  const contract = await prisma.contract.create({
    data: {
      title: 'Contrato de Prestacao de Servicos de Desenvolvimento',
      description: 'Contrato modelo para prestacao de servicos de desenvolvimento de software'
    }
  });

  console.log(`Created contract: ${contract.title}`);

  // Adiciona blocos ao contrato
  const blocks = await Promise.all([
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'TITLE',
        content: 'DAS DISPOSICOES PRELIMINARES',
        order: 0,
        level: 1,
        numbering: '1'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[0].id,
        order: 1,
        level: 2,
        numbering: '1.1'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[1].id,
        order: 2,
        level: 2,
        numbering: '1.2'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'TITLE',
        content: 'DO VALOR E PAGAMENTO',
        order: 3,
        level: 1,
        numbering: '2'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[2].id,
        order: 4,
        level: 2,
        numbering: '2.1'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'OBS',
        content: 'Nota: Os valores podem ser reajustados anualmente pelo indice IPCA.',
        order: 5,
        level: 2,
        numbering: '2.2'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'TITLE',
        content: 'DAS OBRIGACOES DAS PARTES',
        order: 6,
        level: 1,
        numbering: '3'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[3].id,
        order: 7,
        level: 2,
        numbering: '3.1'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[4].id,
        order: 8,
        level: 2,
        numbering: '3.2'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'TITLE',
        content: 'DAS DISPOSICOES FINAIS',
        order: 9,
        level: 1,
        numbering: '4'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[5].id,
        order: 10,
        level: 2,
        numbering: '4.1'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[6].id,
        order: 11,
        level: 2,
        numbering: '4.2'
      }
    }),
    prisma.contractBlock.create({
      data: {
        contractId: contract.id,
        type: 'CLAUSE',
        clauseId: clauses[7].id,
        order: 12,
        level: 2,
        numbering: '4.3'
      }
    })
  ]);

  console.log(`Created ${blocks.length} blocks`);
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
