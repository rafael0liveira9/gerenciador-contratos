import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { selectCurrentTemplate, updateTemplate } from '../store/templatesSlice';
import { selectAllBlocos, updateBloco, deleteBloco } from '../store/blocosSlice';
import Block from './Block';
import ContractPreview from './ContractPreview';

function TemplateEditor() {
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentTemplate);
  const blocos = useSelector(selectAllBlocos);
  const [showPreview, setShowPreview] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: 'template-drop-zone'
  });

  if (!template) {
    return (
      <div className="template-editor empty">
        <div className="empty-message">
          <h3>Selecione um template</h3>
          <p>Escolha um template na lista a esquerda ou crie um novo</p>
        </div>
      </div>
    );
  }

  const handleStartEditName = () => {
    setTempName(template.nome);
    setEditingName(true);
  };

  const handleSaveName = () => {
    if (tempName.trim() && tempName !== template.nome) {
      dispatch(updateTemplate({ id: template.id, nome: tempName }));
    }
    setEditingName(false);
  };

  const handleBlockUpdate = (blockId, updates) => {
    dispatch(updateBloco({ id: blockId, ...updates }));
  };

  const handleBlockDelete = (blockId) => {
    dispatch(deleteBloco(blockId));
  };

  const handleSave = () => {
    alert('Template salvo com sucesso!');
  };

  const sortedBlocos = [...blocos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="template-editor">
      <div className="editor-header">
        <div className="template-info">
          {editingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
            />
          ) : (
            <h2 onClick={handleStartEditName}>{template.nome}</h2>
          )}
          {template.descricao && <p className="template-desc">{template.descricao}</p>}
        </div>
        <div className="editor-actions">
          <button onClick={() => setShowPreview(true)} className="btn-preview">
            Visualizar
          </button>
          <button onClick={handleSave} className="btn-save">
            Salvar
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`editor-content ${isOver ? 'drag-over' : ''}`}
      >
        {sortedBlocos.length === 0 ? (
          <div className="drop-placeholder">
            Arraste clausulas, cabecalhos ou rodapes aqui
          </div>
        ) : (
          sortedBlocos.map(bloco => (
            <Block
              key={bloco.id}
              block={bloco}
              onUpdate={(updates) => handleBlockUpdate(bloco.id, updates)}
              onDelete={() => handleBlockDelete(bloco.id)}
            />
          ))
        )}
      </div>

      {showPreview && (
        <ContractPreview
          template={template}
          blocks={sortedBlocos}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

export default TemplateEditor;
