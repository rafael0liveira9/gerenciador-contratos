import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import { selectCurrentContract, updateContract } from '../store/contractsSlice';
import { selectBlocksByContract, updateBlock } from '../store/blocksSlice';
import Block from './Block';
import ContractPreview from './ContractPreview';

function ContractEditor() {
  const dispatch = useDispatch();
  const contract = useSelector(selectCurrentContract);
  const blocks = useSelector(state =>
    contract ? selectBlocksByContract(state, contract.id) : []
  );
  const [showPreview, setShowPreview] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: 'contract-drop-zone'
  });

  if (!contract) {
    return (
      <div className="contract-editor empty">
        <p>Selecione ou crie um contrato para comecar</p>
      </div>
    );
  }

  const handleLevelChange = async (blockId, newLevel) => {
    await dispatch(updateBlock({
      blockId,
      data: { level: newLevel }
    }));
  };

  const handleSave = async () => {
    if (editingTitle || editingDesc) {
      await dispatch(updateContract({
        id: contract.id,
        data: {
          title: title || contract.title,
          description: description || contract.description
        }
      }));
      setEditingTitle(false);
      setEditingDesc(false);
    }
    alert('Contrato salvo com sucesso!');
  };

  const startEditTitle = () => {
    setTitle(contract.title);
    setEditingTitle(true);
  };

  const startEditDesc = () => {
    setDescription(contract.description || '');
    setEditingDesc(true);
  };

  if (showPreview) {
    return (
      <ContractPreview
        contract={contract}
        blocks={blocks}
        onClose={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="contract-editor">
      <div className="contract-header">
        <div className="contract-header-content">
          {editingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-title-input"
              autoFocus
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            />
          ) : (
            <h2 onClick={startEditTitle}>{contract.title}</h2>
          )}
          {editingDesc ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="edit-desc-input"
              onBlur={() => setEditingDesc(false)}
              rows={2}
            />
          ) : (
            <p className="description" onClick={startEditDesc}>
              {contract.description || 'Clique para adicionar descricao...'}
            </p>
          )}
        </div>
        <div className="contract-header-actions">
          <button
            className="btn-preview"
            onClick={() => setShowPreview(true)}
            title="Visualizar"
          >
            <span className="icon-eye">👁</span>
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            title="Salvar"
          >
            Salvar
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`blocks-container ${isOver ? 'drop-active' : ''}`}
      >
        {blocks.length === 0 && (
          <div className="empty-blocks">
            <p>Arraste clausulas da biblioteca ou adicione titulos e observacoes</p>
          </div>
        )}
        {blocks.map(block => (
          <Block
            key={block.id}
            block={block}
            onLevelChange={handleLevelChange}
          />
        ))}
      </div>
    </div>
  );
}

export default ContractEditor;
