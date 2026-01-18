import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { selectEmpresa } from '../store/empresaSlice';
import theme from '../theme';

const API_URL = 'http://localhost:3001/api';

function GenerateContractModal({ template, blocks, onClose }) {
  const empresa = useSelector(selectEmpresa);
  const [variables, setVariables] = useState([]);
  const [variableValues, setVariableValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Extrair variáveis do template (formato {{variavel}})
  useEffect(() => {
    const extractVariables = () => {
      const allContent = blocks.map(block => {
        if (block.tipo === 'CLAUSULA') return block.clausula?.conteudo || '';
        if (block.tipo === 'CABECALHO') return block.cabecalho?.conteudo || '';
        if (block.tipo === 'RODAPE') return block.rodape?.conteudo || '';
        return block.conteudo || '';
      }).join(' ');

      const regex = /\{\{([^}]+)\}\}/g;
      const matches = [...allContent.matchAll(regex)];
      const uniqueVars = [...new Set(matches.map(m => m[1].trim()))];

      setVariables(uniqueVars);

      // Inicializar valores
      const initialValues = {};
      uniqueVars.forEach(v => {
        initialValues[v] = { type: 'texto', value: '' };
      });
      setVariableValues(initialValues);
    };

    extractVariables();
  }, [blocks]);

  const handleTypeChange = (varName, type) => {
    setVariableValues(prev => ({
      ...prev,
      [varName]: {
        ...prev[varName],
        type,
        value: type === 'tabela' ? [[['', ''], ['', '']]] : (type === 'varios_textos' ? [''] : '')
      }
    }));
  };

  const handleValueChange = (varName, value) => {
    setVariableValues(prev => ({
      ...prev,
      [varName]: { ...prev[varName], value }
    }));
  };

  // Para Varios Textos
  const addText = (varName) => {
    setVariableValues(prev => ({
      ...prev,
      [varName]: {
        ...prev[varName],
        value: [...(prev[varName].value || []), '']
      }
    }));
  };

  const updateTextAt = (varName, index, text) => {
    setVariableValues(prev => {
      const newValue = [...prev[varName].value];
      newValue[index] = text;
      return {
        ...prev,
        [varName]: { ...prev[varName], value: newValue }
      };
    });
  };

  const removeTextAt = (varName, index) => {
    setVariableValues(prev => {
      const newValue = prev[varName].value.filter((_, i) => i !== index);
      return {
        ...prev,
        [varName]: { ...prev[varName], value: newValue.length ? newValue : [''] }
      };
    });
  };

  // Para Tabela
  const addTableRow = (varName) => {
    setVariableValues(prev => {
      const table = prev[varName].value[0] || [['', '']];
      const cols = table[0]?.length || 2;
      return {
        ...prev,
        [varName]: {
          ...prev[varName],
          value: [[...table, Array(cols).fill('')]]
        }
      };
    });
  };

  const addTableColumn = (varName) => {
    setVariableValues(prev => {
      const table = prev[varName].value[0] || [['', '']];
      return {
        ...prev,
        [varName]: {
          ...prev[varName],
          value: [table.map(row => [...row, ''])]
        }
      };
    });
  };

  const updateTableCell = (varName, rowIndex, colIndex, value) => {
    setVariableValues(prev => {
      const table = [...prev[varName].value[0]];
      table[rowIndex] = [...table[rowIndex]];
      table[rowIndex][colIndex] = value;
      return {
        ...prev,
        [varName]: { ...prev[varName], value: [table] }
      };
    });
  };

  // Para Imagem
  const handleImageChange = (varName, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleValueChange(varName, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Converter valores para HTML
  const convertToHtml = () => {
    const htmlVariables = {};

    for (const [varName, data] of Object.entries(variableValues)) {
      switch (data.type) {
        case 'texto':
          htmlVariables[varName] = `<span>${data.value || ''}</span>`;
          break;
        case 'varios_textos':
          htmlVariables[varName] = (data.value || [])
            .filter(t => t.trim())
            .map(t => `<p>${t}</p>`)
            .join('');
          break;
        case 'imagem':
          htmlVariables[varName] = data.value
            ? `<img src="${data.value}" style="max-width: 100%; height: auto;" />`
            : '';
          break;
        case 'tabela':
          const table = data.value?.[0] || [['', '']];
          const rows = table.map(row =>
            `<tr>${row.map(cell => `<td style="border: 1px solid #000; padding: 8px;">${cell}</td>`).join('')}</tr>`
          ).join('');
          htmlVariables[varName] = `<table style="border-collapse: collapse; width: 100%;">${rows}</table>`;
          break;
        default:
          htmlVariables[varName] = data.value || '';
      }
    }

    return htmlVariables;
  };

  // Gerar conteúdo HTML completo do template
  const generateTemplateContent = () => {
    return blocks.map(block => {
      let content = '';
      if (block.tipo === 'CLAUSULA') content = block.clausula?.conteudo || '';
      else if (block.tipo === 'CABECALHO') content = block.cabecalho?.conteudo || '';
      else if (block.tipo === 'RODAPE') content = block.rodape?.conteudo || '';
      else content = block.conteudo || '';

      const Tag = block.htmlTag || 'div';
      return `<${Tag}>${content}</${Tag}>`;
    }).join('\n');
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const templateContent = generateTemplateContent();
      const htmlVariables = convertToHtml();

      const response = await fetch(`${API_URL}/documentos/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId: empresa.id,
          templateId: template.id,
          template: { content: templateContent },
          variaveis: htmlVariables
        })
      });

      if (!response.ok) throw new Error('Erro ao gerar documento');

      const data = await response.json();
      setPdfUrl(`${API_URL.replace('/api', '')}${data.pdfPath}`);
    } catch (error) {
      console.error('Erro ao gerar documento:', error);
      alert('Erro ao gerar documento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      backgroundColor: theme.colors.background.paper,
      borderRadius: '12px',
      width: '90%',
      maxWidth: '700px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      padding: '20px 24px',
      borderBottom: `1px solid ${theme.colors.border.light}`,
      textAlign: 'center'
    },
    title: {
      margin: 0,
      color: theme.colors.text.primary,
      fontSize: '1.25rem'
    },
    subtitle: {
      margin: '8px 0 0',
      color: theme.colors.text.muted,
      fontSize: '0.875rem'
    },
    body: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    variableRow: {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: theme.colors.background.subtle,
      borderRadius: '8px'
    },
    variableHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    variableName: {
      fontWeight: 600,
      color: theme.colors.text.primary,
      minWidth: '120px'
    },
    select: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: `1px solid ${theme.colors.border.input}`,
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      fontSize: '0.875rem'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: `1px solid ${theme.colors.border.input}`,
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      fontSize: '0.875rem',
      marginTop: '8px'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: `1px solid ${theme.colors.border.input}`,
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      fontSize: '0.875rem',
      marginTop: '8px',
      minHeight: '80px',
      resize: 'vertical'
    },
    multiTextRow: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px',
      alignItems: 'center'
    },
    btnAdd: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: theme.colors.primary.main,
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    btnRemove: {
      padding: '6px 10px',
      border: 'none',
      borderRadius: '6px',
      backgroundColor: theme.colors.error.main,
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    tableContainer: {
      marginTop: '12px',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableCell: {
      border: `1px solid ${theme.colors.border.light}`,
      padding: '4px'
    },
    tableCellInput: {
      width: '100%',
      padding: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      color: theme.colors.text.primary
    },
    tableActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    imagePreview: {
      marginTop: '12px',
      maxWidth: '200px',
      borderRadius: '8px'
    },
    footer: {
      padding: '16px 24px',
      borderTop: `1px solid ${theme.colors.border.light}`,
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '12px'
    },
    btnCancel: {
      padding: '10px 24px',
      border: `1px solid ${theme.colors.border.main}`,
      borderRadius: '8px',
      backgroundColor: 'transparent',
      color: theme.colors.text.secondary,
      cursor: 'pointer',
      fontWeight: 500
    },
    btnGenerate: {
      padding: '10px 24px',
      border: 'none',
      borderRadius: '8px',
      background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
      color: '#fff',
      cursor: 'pointer',
      fontWeight: 500
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      color: theme.colors.text.muted
    },
    pdfViewer: {
      width: '100%',
      height: '70vh',
      border: 'none'
    },
    noVariables: {
      textAlign: 'center',
      padding: '40px',
      color: theme.colors.text.muted
    }
  };

  const renderVariableInput = (varName) => {
    const data = variableValues[varName];
    if (!data) return null;

    switch (data.type) {
      case 'texto':
        return (
          <input
            type="text"
            style={styles.input}
            placeholder="Digite o texto..."
            value={data.value || ''}
            onChange={(e) => handleValueChange(varName, e.target.value)}
          />
        );

      case 'varios_textos':
        return (
          <div>
            {(data.value || ['']).map((text, index) => (
              <div key={index} style={styles.multiTextRow}>
                <textarea
                  style={{ ...styles.textarea, flex: 1, marginTop: 0 }}
                  placeholder={`Texto ${index + 1}...`}
                  value={text}
                  onChange={(e) => updateTextAt(varName, index, e.target.value)}
                />
                {(data.value || []).length > 1 && (
                  <button style={styles.btnRemove} onClick={() => removeTextAt(varName, index)}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button style={{ ...styles.btnAdd, marginTop: '8px' }} onClick={() => addText(varName)}>
              + Adicionar Texto
            </button>
          </div>
        );

      case 'imagem':
        return (
          <div>
            <input
              type="file"
              accept="image/png,image/jpg,image/jpeg"
              style={styles.input}
              onChange={(e) => handleImageChange(varName, e)}
            />
            {data.value && (
              <img src={data.value} alt="Preview" style={styles.imagePreview} />
            )}
          </div>
        );

      case 'tabela':
        const table = data.value?.[0] || [['', ''], ['', '']];
        return (
          <div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <tbody>
                  {table.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} style={styles.tableCell}>
                          <input
                            style={styles.tableCellInput}
                            value={cell}
                            onChange={(e) => updateTableCell(varName, rowIndex, colIndex, e.target.value)}
                            placeholder={`${rowIndex + 1},${colIndex + 1}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.tableActions}>
              <button style={styles.btnAdd} onClick={() => addTableRow(varName)}>
                + Linha
              </button>
              <button style={styles.btnAdd} onClick={() => addTableColumn(varName)}>
                + Coluna
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const modalContent = (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {pdfUrl ? 'Documento Gerado' : 'Gerar Contrato'}
          </h3>
          {!pdfUrl && !loading && (
            <p style={styles.subtitle}>Selecione as atribuições para cada variável</p>
          )}
        </div>

        <div style={styles.body}>
          {loading ? (
            <div style={styles.loading}>
              <p>Gerando documento...</p>
              <p>Aguarde...</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              style={styles.pdfViewer}
              title="PDF Viewer"
            />
          ) : variables.length === 0 ? (
            <div style={styles.noVariables}>
              <p>Nenhuma variável encontrada no template.</p>
              <p>O documento será gerado sem substituições.</p>
            </div>
          ) : (
            variables.map(varName => (
              <div key={varName} style={styles.variableRow}>
                <div style={styles.variableHeader}>
                  <span style={styles.variableName}>{`{{${varName}}}`}</span>
                  <select
                    style={styles.select}
                    value={variableValues[varName]?.type || 'texto'}
                    onChange={(e) => handleTypeChange(varName, e.target.value)}
                  >
                    <option value="texto">Texto</option>
                    <option value="varios_textos">Vários Textos</option>
                    <option value="imagem">Imagem</option>
                    <option value="tabela">Tabela</option>
                  </select>
                </div>
                {renderVariableInput(varName)}
              </div>
            ))
          )}
        </div>

        <div style={styles.footer}>
          <button style={styles.btnCancel} onClick={onClose}>
            {pdfUrl ? 'Fechar' : 'Cancelar'}
          </button>
          {!pdfUrl && !loading && (
            <button style={styles.btnGenerate} onClick={handleGenerate}>
              Gerar
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default GenerateContractModal;
