import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

function Block({ block, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editHtmlTag, setEditHtmlTag] = useState('p');
  const [editStyles, setEditStyles] = useState({});

  const blockStyles = block.styles
    ? (typeof block.styles === 'string' ? JSON.parse(block.styles) : block.styles)
    : {};

  const style = {
    marginLeft: `${(block.level - 1) * 24}px`
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

  const handleSave = () => {
    onUpdate({
      htmlTag: editHtmlTag,
      styles: editStyles
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Remover este bloco?')) {
      onDelete();
    }
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
        return 'Titulo';
      case 'OBSERVACAO':
        return 'Observacao';
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

  return (
    <div
      style={style}
      className={`block block-${block.tipo.toLowerCase()}`}
    >
      <div className="block-header">
        {block.numeracao && <span className="block-numbering">{block.numeracao}</span>}
        <span className="block-type">{block.tipo}</span>
        <span className="block-tag">&lt;{block.htmlTag || 'p'}&gt;</span>
        {getBlockInfo() && (
          <span className="clause-info">{getBlockInfo()}</span>
        )}
        <div className="block-actions">
          <button onClick={handleLevelUp} disabled={block.level <= 1} title="Subir nivel">
            ←
          </button>
          <button onClick={handleLevelDown} disabled={block.level >= 5} title="Descer nivel">
            →
          </button>
          <button onClick={handleEdit} title="Editar">
            ✎
          </button>
          <button onClick={handleDelete} title="Remover" className="delete-btn">
            ×
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="block-edit">
          <RichTextEditor
            value={editContent}
            onChange={setEditContent}
            htmlTag={editHtmlTag}
            onHtmlTagChange={setEditHtmlTag}
            styles={editStyles}
            onStylesChange={setEditStyles}
          />
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">Salvar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
          {block.tipo === 'CLAUSULA' && (
            <small className="edit-note">
              Ao salvar, uma nova versao da clausula sera criada.
            </small>
          )}
        </div>
      ) : (
        <div className="block-content" onClick={handleEdit}>
          {renderContent()}
        </div>
      )}
    </div>
  );
}

export default Block;
