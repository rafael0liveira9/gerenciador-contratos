import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import { fetchClauses, createClause, selectAllClauses, selectClausesLoading, setSearchTerm, selectSearchTerm } from '../store/clausesSlice';

function DraggableClause({ clause }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `clause-${clause.id}`,
    data: {
      type: 'CLAUSE',
      clauseId: clause.id,
      clause
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
      <div className="clause-title">{clause.id} - {clause.title}</div>
      {/* <div className="clause-version">v{clause.version}</div> */}
      <div className="clause-preview">{clause.content.substring(0, 80)}...</div>
    </div>
  );
}

function AddNewClauseButton({ onClick }) {
  return (
    <div className="clause-item add-new-clause" onClick={onClick}>
      <div className="add-new-icon">+</div>
      <div className="add-new-text">Adicionar Nova Clausula</div>
    </div>
  );
}

function ClauseLibrary() {
  const dispatch = useDispatch();
  const clauses = useSelector(selectAllClauses);
  const loading = useSelector(selectClausesLoading);
  const searchTerm = useSelector(selectSearchTerm);
  const [localSearch, setLocalSearch] = useState('');
  const [showNewClauseModal, setShowNewClauseModal] = useState(false);
  const [newClauseTitle, setNewClauseTitle] = useState('');
  const [newClauseContent, setNewClauseContent] = useState('');

  useEffect(() => {
    dispatch(fetchClauses());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
      dispatch(fetchClauses(localSearch));
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  const filteredClauses = clauses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClause = async (e) => {
    e.preventDefault();
    if (!newClauseTitle.trim() || !newClauseContent.trim()) return;

    await dispatch(createClause({
      title: newClauseTitle,
      content: newClauseContent
    }));

    setNewClauseTitle('');
    setNewClauseContent('');
    setShowNewClauseModal(false);
  };

  return (
    <div className="clause-library">
      <h3>Biblioteca de Clausulas</h3>
      <input
        type="text"
        placeholder="Buscar clausulas..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="search-input"
      />

      <div className="clause-list" style={{overflowY:'auto'}}>
        <AddNewClauseButton onClick={() => setShowNewClauseModal(true)} />
        {loading && <div className="loading">Carregando...</div>}
        {!loading && filteredClauses.map(clause => (
          <DraggableClause key={clause.id} clause={clause} />
        ))}
      </div>

      {showNewClauseModal && (
        <div className="modal-overlay">
          <div className="new-clause-modal">
            <h4>Nova Clausula</h4>
            <form onSubmit={handleCreateClause}>
              <input
                type="text"
                placeholder="Titulo da clausula"
                value={newClauseTitle}
                onChange={(e) => setNewClauseTitle(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Conteudo da clausula..."
                value={newClauseContent}
                onChange={(e) => setNewClauseContent(e.target.value)}
                rows={5}
              />
              <div className="modal-actions">
                <button type="submit">Criar</button>
                <button type="button" onClick={() => setShowNewClauseModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="add-block-buttons">
        <h4>Adicionar Bloco</h4>
        <DraggableNewBlock type="TITLE" label="Novo Titulo" />
        <DraggableNewBlock type="OBS" label="Nova Observação" />
      </div>
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

export default ClauseLibrary;
