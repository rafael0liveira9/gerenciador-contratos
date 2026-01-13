/**
 * Gera numeracao hierarquica para blocos de contrato
 * Exemplo: 1, 1.1, 1.1.1, 2, 2.1, etc.
 */
function generateNumbering(blocks) {
  const counters = {};

  return blocks.map(block => {
    const level = block.level || 1;

    // Inicializa contador para o nivel se nao existir
    if (!counters[level]) {
      counters[level] = 0;
    }

    // Incrementa contador do nivel atual
    counters[level]++;

    // Reseta contadores de niveis inferiores
    for (let i = level + 1; i <= 10; i++) {
      counters[i] = 0;
    }

    // Constroi a numeracao
    const parts = [];
    for (let i = 1; i <= level; i++) {
      parts.push(counters[i] || 0);
    }

    return {
      ...block,
      numbering: parts.join('.')
    };
  });
}

/**
 * Recalcula numeracao de todos os blocos ordenados
 */
function recalculateNumbering(blocks) {
  // Ordena por order
  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  return generateNumbering(sorted);
}

module.exports = {
  generateNumbering,
  recalculateNumbering
};
