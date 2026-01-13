import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import {
  selectAllClausulas,
  selectClausulasLoading,
  selectClausulasSearchTerm,
  setSearchTerm,
  createClausula
} from '../store/clausulasSlice';
import { selectAllCabecalhos } from '../store/cabecalhosSlice';
import { selectAllRodapes } from '../store/rodapesSlice';
import { selectEmpresa } from '../store/empresaSlice';

function DraggableClausula({ clausula }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `clausula-${clausula.id}`,
    data: {
      type: 'CLAUSULA',
      clausulaId: clausula.id,
      clausula
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="clause-item"
    >
      <div className="clause-title">{clausula.id} - {clausula.nome}</div>
      <div className="clause-preview">
        {clausula.conteudo.replace(/<[^>]*>/g, '').substring(0, 80)}...
      </div>
    </div>
  );
}

function DraggableCabecalho({ cabecalho }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `cabecalho-${cabecalho.id}`,
    data: {
      type: 'CABECALHO',
      cabecalhoId: cabecalho.id,
      cabecalho
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="clause-item cabecalho"
    >
      <div className="clause-title">{cabecalho.nome}</div>
    </div>
  );
}

function DraggableRodape({ rodape }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `rodape-${rodape.id}`,
    data: {
      type: 'RODAPE',
      rodapeId: rodape.id,
      rodape
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="clause-item rodape"
    >
      <div className="clause-title">{rodape.nome}</div>
    </div>
  );
}

function DraggableNewBlock({ type, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type,
      isNew: true
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`new-block-btn ${type.toLowerCase()}`}
    >
      {label}
    </div>
  );
}

function AddNewButton({ onClick, label }) {
  return (
    <div className="clause-item add-new-clause" onClick={onClick}>
      <div className="add-new-icon">+</div>
      <div className="add-new-text">{label}</div>
    </div>
  );
}

function ClauseLibrary() {
  const dispatch = useDispatch();
  const empresa = useSelector(selectEmpresa);
  const clausulas = useSelector(selectAllClausulas);
  const cabecalhos = useSelector(selectAllCabecalhos);
  const rodapes = useSelector(selectAllRodapes);
  const loading = useSelector(selectClausulasLoading);
  const searchTerm = useSelector(selectClausulasSearchTerm);
  const [localSearch, setLocalSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newConteudo, setNewConteudo] = useState('');
  const [activeTab, setActiveTab] = useState('clausulas');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    dispatch(setSearchTerm(value));
  };

  const filteredClausulas = clausulas.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClausula = async (e) => {
    e.preventDefault();
    if (!newNome.trim() || !newConteudo.trim()) return;

    await dispatch(createClausula({
      empresaId: empresa.id,
      nome: newNome,
      conteudo: newConteudo
    }));

    setNewNome('');
    setNewConteudo('');
    setShowNewModal(false);
  };

  return (
    <div className="clause-library">
      <div className="library-tabs">
        <button
          className={activeTab === 'clausulas' ? 'active' : ''}
          onClick={() => setActiveTab('clausulas')}
        >
          Clausulas
        </button>
        <button
          className={activeTab === 'cabecalhos' ? 'active' : ''}
          onClick={() => setActiveTab('cabecalhos')}
        >
          Cabecalhos
        </button>
        <button
          className={activeTab === 'rodapes' ? 'active' : ''}
          onClick={() => setActiveTab('rodapes')}
        >
          Rodapes
        </button>
      </div>

      {activeTab === 'clausulas' && (
        <>
          <input
            type="text"
            placeholder="Buscar clausulas..."
            value={localSearch}
            onChange={handleSearchChange}
            className="search-input"
          />

          <div className="clause-list" style={{ overflowY: 'auto' }}>
            <AddNewButton
              onClick={() => setShowNewModal(true)}
              label="Adicionar Nova Clausula"
            />
            {loading && <div className="loading">Carregando...</div>}
            {!loading && filteredClausulas.map(clausula => (
              <DraggableClausula key={clausula.id} clausula={clausula} />
            ))}
          </div>
        </>
      )}

      {activeTab === 'cabecalhos' && (
        <div className="clause-list" style={{ overflowY: 'auto' }}>
          {cabecalhos.map(cabecalho => (
            <DraggableCabecalho key={cabecalho.id} cabecalho={cabecalho} />
          ))}
          {cabecalhos.length === 0 && (
            <div className="no-items">Nenhum cabecalho encontrado</div>
          )}
        </div>
      )}

      {activeTab === 'rodapes' && (
        <div className="clause-list" style={{ overflowY: 'auto' }}>
          {rodapes.map(rodape => (
            <DraggableRodape key={rodape.id} rodape={rodape} />
          ))}
          {rodapes.length === 0 && (
            <div className="no-items">Nenhum rodape encontrado</div>
          )}
        </div>
      )}

      <div className="add-block-buttons">
        <h4>Adicionar Bloco</h4>
        <DraggableNewBlock type="TITULO" label="Novo Titulo" />
        <DraggableNewBlock type="OBSERVACAO" label="Nova Observacao" />
      </div>

      {showNewModal && (
        <div className="modal-overlay">
          <div className="new-clause-modal">
            <h4>Nova Clausula</h4>
            <form onSubmit={handleCreateClausula}>
              <input
                type="text"
                placeholder="Nome da clausula"
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Conteudo da clausula..."
                value={newConteudo}
                onChange={(e) => setNewConteudo(e.target.value)}
                rows={5}
              />
              <div className="modal-actions">
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowNewModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClauseLibrary;
