import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import theme from '../theme';

const blockTypeColors = {
  CLAUSULA: theme.colors.primary.main,
  CABECALHO: theme.colors.info.main,
  RODAPE: theme.colors.warning.main,
  TITULO: theme.colors.secondary.main,
  OBSERVACAO: theme.colors.accent.orange
};

function Block({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editHtmlTag, setEditHtmlTag] = useState('p');
  const [editStyles, setEditStyles] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const blockStyles = block.styles
    ? (typeof block.styles === 'string' ? JSON.parse(block.styles) : block.styles)
    : {};

  const style = {
    marginLeft: `${(block.level - 1) * 24}px`,
    backgroundColor: theme.colors.background.paper,
    borderLeftColor: blockTypeColors[block.tipo] || theme.colors.primary.main,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
  };

  const contentStyle = {
    marginTop: blockStyles.marginTop ? `${blockStyles.marginTop}px` : undefined,
    marginRight: blockStyles.marginRight ? `${blockStyles.marginRight}px` : undefined,
    marginBottom: blockStyles.marginBottom ? `${blockStyles.marginBottom}px` : undefined,
    marginLeft: blockStyles.marginLeft ? `${blockStyles.marginLeft}px` : undefined,
    paddingTop: blockStyles.paddingTop ? `${blockStyles.paddingTop}px` : undefined,
    paddingRight: blockStyles.paddingRight ? `${blockStyles.paddingRight}px` : undefined,
    paddingBottom: blockStyles.paddingBottom ? `${blockStyles.paddingBottom}px` : undefined,
    paddingLeft: blockStyles.paddingLeft ? `${blockStyles.paddingLeft}px` : undefined,
    textAlign: blockStyles.textAlign || undefined
  };

  useEffect(() => {
    if (isEditing) {
      const content = getContent();
      setEditContent(content || '');
      setEditHtmlTag(block.htmlTag || 'p');
      setEditStyles(blockStyles);
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await onUpdate({
        htmlTag: editHtmlTag,
        styles: editStyles,
        conteudo: editContent
      });
      setIsEditing(false);
      toast.success('Bloco atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar bloco: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete();
      toast.success('Bloco removido');
    } catch (error) {
      toast.error('Erro ao remover bloco: ' + (error.message || 'Erro desconhecido'));
    }
    setShowDeleteModal(false);
  };

  const handleLevelUp = () => {
    if (block.level > 1) {
      onUpdate({ level: block.level - 1 });
    }
  };

  const handleLevelDown = () => {
    if (block.level < 5) {
      onUpdate({ level: block.level + 1 });
    }
  };

  const getContent = () => {
    switch (block.tipo) {
      case 'CLAUSULA':
        return block.clausula?.conteudo || '[Clausula removida]';
      case 'CABECALHO':
        return block.cabecalho?.conteudo || '[Cabecalho removido]';
      case 'RODAPE':
        return block.rodape?.conteudo || '[Rodape removido]';
      case 'TITULO':
        return block.conteudo || 'Título (clique para editar)';
      case 'OBSERVACAO':
        return block.conteudo || 'Observação (clique para editar)';
      default:
        return '';
    }
  };

  const getBlockInfo = () => {
    switch (block.tipo) {
      case 'CLAUSULA':
        return block.clausula
          ? `${block.clausula.nome} (v${block.clausula.versao})`
          : '';
      case 'CABECALHO':
        return block.cabecalho?.nome || '';
      case 'RODAPE':
        return block.rodape?.nome || '';
      default:
        return '';
    }
  };

  const renderContent = () => {
    const content = getContent();
    const Tag = block.htmlTag || 'p';

    return (
      <Tag
        className="block-html-content"
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  const blockInlineStyles = {
    header: {
      backgroundColor: theme.colors.background.subtle,
      borderBottomColor: theme.colors.border.light
    },
    numbering: {
      backgroundColor: blockTypeColors[block.tipo] || theme.colors.primary.main,
      color: theme.colors.primary.contrast
    },
    type: {
      backgroundColor: blockTypeColors[block.tipo] || theme.colors.primary.main,
      color: theme.colors.primary.contrast
    },
    tag: {
      color: theme.colors.text.muted,
      backgroundColor: theme.colors.background.light
    },
    clauseInfo: {
      color: theme.colors.text.secondary
    },
    actionBtn: {
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    deleteBtn: {
      backgroundColor: theme.colors.error.main,
      color: theme.colors.error.contrast
    },
    editSection: {
      backgroundColor: theme.colors.background.subtle,
      borderTopColor: theme.colors.border.light
    },
    saveBtn: {
      background: `linear-gradient(135deg, ${theme.colors.success.main} 0%, ${theme.colors.success.dark} 100%)`,
      color: theme.colors.success.contrast
    },
    cancelBtn: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    editNote: {
      color: theme.colors.text.muted
    },
    content: {
      color: theme.colors.text.primary
    }
  };

  return (
    <div
      style={style}
      className={`block block-${block.tipo.toLowerCase()}`}
    >
      <div className="block-header" style={blockInlineStyles.header}>
        {block.numeracao && <span className="block-numbering" style={blockInlineStyles.numbering}>{block.numeracao}</span>}
        <span className="block-type" style={blockInlineStyles.type}>{block.tipo}</span>
        <span className="block-tag" style={blockInlineStyles.tag}>&lt;{block.htmlTag || 'p'}&gt;</span>
        {getBlockInfo() && (
          <span className="clause-info" style={blockInlineStyles.clauseInfo}>{getBlockInfo()}</span>
        )}
        <div className="block-actions">
          <button onClick={onMoveUp} disabled={isFirst} title="Mover para cima" style={blockInlineStyles.actionBtn}>
            ↑
          </button>
          <button onClick={onMoveDown} disabled={isLast} title="Mover para baixo" style={blockInlineStyles.actionBtn}>
            ↓
          </button>
          <button onClick={handleLevelUp} disabled={block.level <= 1} title="Subir nivel" style={blockInlineStyles.actionBtn}>
            ←
          </button>
          <button onClick={handleLevelDown} disabled={block.level >= 5} title="Descer nivel" style={blockInlineStyles.actionBtn}>
            →
          </button>
          <button onClick={handleEdit} title="Editar" style={blockInlineStyles.actionBtn}>
            ✎
          </button>
          <button onClick={handleDelete} title="Remover" className="delete-btn" style={blockInlineStyles.deleteBtn}>
            ×
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="block-edit" style={blockInlineStyles.editSection}>
          <RichTextEditor
            value={editContent}
            onChange={setEditContent}
            htmlTag={editHtmlTag}
            onHtmlTagChange={setEditHtmlTag}
            styles={editStyles}
            onStylesChange={setEditStyles}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn" style={blockInlineStyles.saveBtn}>Salvar</button>
            <button onClick={handleCancel} style={blockInlineStyles.cancelBtn}>Cancelar</button>
          </div>
          {block.tipo === 'CLAUSULA' && (
            <small className="edit-note" style={blockInlineStyles.editNote}>
              Ao salvar, uma nova versao da clausula sera criada.
            </small>
          )}
        </div>
      ) : (
        <div className="block-content" onClick={handleEdit} style={blockInlineStyles.content}>
          {renderContent()}
        </div>
      )}

      {showDeleteModal && createPortal(
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: theme.colors.background.paper,
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h4 style={{ margin: '0 0 16px', color: theme.colors.text.primary }}>Confirmar exclusão</h4>
            <p style={{ margin: '0 0 20px', color: theme.colors.text.secondary }}>
              Tem certeza que deseja remover este bloco?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.colors.background.subtle,
                  color: theme.colors.text.secondary,
                  border: `1px solid ${theme.colors.border.main}`,
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.colors.error.main,
                  color: theme.colors.error.contrast,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default Block;
