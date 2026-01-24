import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { selectEmpresa } from '../store/empresaSlice';
import SimpleHtmlEditor from './SimpleHtmlEditor';
import theme from '../theme';

const API_URL = 'http://localhost:4002/api';

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

      // Inicializar valores (apenas string HTML)
      const initialValues = {};
      uniqueVars.forEach(v => {
        initialValues[v] = '';
      });
      setVariableValues(initialValues);
    };

    extractVariables();
  }, [blocks]);

  const handleValueChange = (varName, value) => {
    setVariableValues(prev => ({
      ...prev,
      [varName]: value
    }));
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

      const response = await fetch(`${API_URL}/documentos/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresaId: empresa.id,
          templateId: template.id,
          template: { content: templateContent },
          variaveis: variableValues
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
      maxWidth: '800px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      padding: '10px 24px',
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
      padding: '12px',
      backgroundColor: theme.colors.background.subtle,
      borderRadius: '8px'
    },
    variableName: {
      fontWeight: 600,
      color: theme.colors.text.primary,
      marginBottom: '10px',
      display: 'block',
      fontFamily: 'monospace',
      fontSize: '0.95rem'
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

  const modalContent = (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {pdfUrl ? 'Documento Gerado' : 'Gerar Documento'}
          </h3>
          {!pdfUrl && !loading && (
            <p style={styles.subtitle}>Preencha o conteudo HTML para cada variavel do documento.</p>
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
              <p>Nenhuma variavel encontrada no template.</p>
              <p>O documento sera gerado sem substituicoes.</p>
            </div>
          ) : (
            variables.map(varName => (
              <div key={varName} style={styles.variableRow}>
                <span style={styles.variableName}>{`{{${varName}}}`}</span>
                <SimpleHtmlEditor
                  value={variableValues[varName] || ''}
                  onChange={(val) => handleValueChange(varName, val)}
                  placeholder="Digite o conteudo..."
                />
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
