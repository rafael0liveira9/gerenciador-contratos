import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBlock, removeBlock, setEditingBlock, selectEditingBlockId } from '../store/blocksSlice';
import { createClauseVersion } from '../store/clausesSlice';
import RichTextEditor from './RichTextEditor';

function Block({ block, onLevelChange }) {
  const dispatch = useDispatch();
  const editingBlockId = useSelector(selectEditingBlockId);
  const isEditing = editingBlockId === block.id;
  const [editContent, setEditContent] = useState('');
  const [editHtmlTag, setEditHtmlTag] = useState('p');
  const [editStyles, setEditStyles] = useState({});

  // Parse styles from block
  const blockStyles = block.styles ? (typeof block.styles === 'string' ? JSON.parse(block.styles) : block.styles) : {};

  const style = {
    marginLeft: `${(block.level - 1) * 24}px`
  };

  // Estilos customizados do bloco
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
      const content = block.type === 'CLAUSE' ? block.clause?.content : block.content;
      setEditContent(content || '');
      setEditHtmlTag(block.htmlTag || 'p');
      setEditStyles(blockStyles);
    }
  }, [isEditing]);

  const handleEdit = () => {
    dispatch(setEditingBlock(block.id));
  };

  const handleSave = async () => {
    if (block.type === 'CLAUSE' && block.clause) {
      // Cria nova versao da clausula com o conteudo HTML
      await dispatch(createClauseVersion({
        id: block.clause.parentId || block.clause.id,
        data: { content: editContent }
      }));
      // Atualiza estilos do bloco
      await dispatch(updateBlock({
        blockId: block.id,
        data: {
          htmlTag: editHtmlTag,
          styles: editStyles
        }
      }));
    } else {
      await dispatch(updateBlock({
        blockId: block.id,
        data: {
          content: editContent,
          htmlTag: editHtmlTag,
          styles: editStyles
        }
      }));
    }
    dispatch(setEditingBlock(null));
  };

  const handleCancel = () => {
    dispatch(setEditingBlock(null));
  };

  const handleDelete = () => {
    if (confirm('Remover este bloco?')) {
      dispatch(removeBlock(block.id));
    }
  };

  const handleLevelUp = () => {
    if (block.level > 1) {
      onLevelChange(block.id, block.level - 1);
    }
  };

  const handleLevelDown = () => {
    if (block.level < 5) {
      onLevelChange(block.id, block.level + 1);
    }
  };

  const getContent = () => {
    if (block.type === 'CLAUSE') {
      return block.clause?.content || '[Clausula removida]';
    }
    return block.content || '';
  };

  const renderContent = () => {
    const content = getContent();
    const Tag = block.htmlTag || 'p';

    // Renderiza o conteudo HTML
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
      className={`block block-${block.type.toLowerCase()}`}
    >
      <div className="block-header">
        <span className="block-numbering">{block.numbering}</span>
        <span className="block-type">{block.type}</span>
        <span className="block-tag">&lt;{block.htmlTag || 'p'}&gt;</span>
        {block.type === 'CLAUSE' && block.clause && (
          <span className="clause-info">
            {block.clause.title} (v{block.clause.version})
          </span>
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
          {block.type === 'CLAUSE' && (
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
