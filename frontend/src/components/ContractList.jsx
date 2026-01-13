import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchContracts,
  createContract,
  deleteContract,
  fetchContractById,
  selectAllContracts,
  selectCurrentContract,
  selectContractsLoading
} from '../store/contractsSlice';
import { selectBlocksByContract } from '../store/blocksSlice';
import ContractPreview from './ContractPreview';

function ContractList() {
  const dispatch = useDispatch();
  const contracts = useSelector(selectAllContracts);
  const currentContract = useSelector(selectCurrentContract);
  const loading = useSelector(selectContractsLoading);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [previewContract, setPreviewContract] = useState(null);

  const previewBlocks = useSelector(state =>
    previewContract ? selectBlocksByContract(state, previewContract.id) : []
  );

  useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const result = await dispatch(createContract({
      title: newTitle,
      description: newDescription
    }));

    if (result.payload) {
      dispatch(fetchContractById(result.payload.id));
    }

    setNewTitle('');
    setNewDescription('');
    setShowNewForm(false);
  };

  const handleSelect = (contract) => {
    dispatch(fetchContractById(contract.id));
  };

  const handlePreview = async (e, contract) => {
    e.stopPropagation();
    // Carrega o contrato primeiro para ter os blocos
    await dispatch(fetchContractById(contract.id));
    setPreviewContract(contract);
  };

  const handleDelete = async (e, contract) => {
    e.stopPropagation();
    if (confirm(`Deletar contrato "${contract.title}"?`)) {
      dispatch(deleteContract(contract.id));
    }
  };

  if (previewContract) {
    return (
      <div className="preview-fullscreen">
        <ContractPreview
          contract={previewContract}
          blocks={previewBlocks}
          onClose={() => setPreviewContract(null)}
        />
      </div>
    );
  }

  return (
    <div className="contract-list">
      <div className="list-header">
        <h3>Contratos</h3>
        <button onClick={() => setShowNewForm(true)} className="new-btn">
          + Novo
        </button>
      </div>

      {showNewForm && (
        <form onSubmit={handleCreate} className="new-contract-form">
          <input
            type="text"
            placeholder="Titulo do contrato"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <textarea
            placeholder="Descricao (opcional)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />
          <div className="form-actions">
            <button type="submit">Criar</button>
            <button type="button" onClick={() => setShowNewForm(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {loading && <div className="loading">Carregando...</div>}

      <div className="contracts">
        {contracts.map(contract => (
          <div
            key={contract.id}
            className={`contract-item ${currentContract?.id === contract.id ? 'active' : ''}`}
            onClick={() => handleSelect(contract)}
          >
            <div className="contract-info">
              <span className="contract-title">{contract.title}</span>
              <span className="contract-blocks">
                {contract._count?.blocks || 0} blocos
              </span>
            </div>
            <div className="contract-item-actions">
              <button
                className="preview-btn"
                onClick={(e) => handlePreview(e, contract)}
                title="Visualizar"
              >
                👁
              </button>
              <button
                className="delete-btn"
                onClick={(e) => handleDelete(e, contract)}
                title="Deletar"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {!loading && contracts.length === 0 && (
          <div className="no-contracts">
            Nenhum contrato criado
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractList;
