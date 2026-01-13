import { useState } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import store from './store';
import ContractList from './components/ContractList';
import ContractEditor from './components/ContractEditor';
import ClauseLibrary from './components/ClauseLibrary';
import { selectCurrentContract } from './store/contractsSlice';
import { addBlock } from './store/blocksSlice';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const contract = useSelector(selectCurrentContract);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveItem(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!contract) return;

    if (!over || over.id !== 'contract-drop-zone') return;

    if (typeof active.id === 'string' && active.id.startsWith('clause-')) {
      const data = active.data.current;
      dispatch(addBlock({
        contractId: contract.id,
        data: {
          type: 'CLAUSE',
          clauseId: data.clauseId
        }
      }));
    }

    if (typeof active.id === 'string' && active.id.startsWith('new-')) {
      const type = active.data.current.type;
      dispatch(addBlock({
        contractId: contract.id,
        data: {
          type,
          content: type === 'TITLE' ? 'Novo Titulo' : 'Nova Observacao'
        }
      }));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gerenciador de Contratos</h1>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="app-main">
          <aside className="sidebar-left">
            <ContractList />
          </aside>

          <section className="editor-section">
            <ContractEditor />
          </section>

          <aside className="sidebar-right">
            <ClauseLibrary />
          </aside>
        </main>

        <DragOverlay dropAnimation={null}>
          {activeItem && (
            <div className="drag-overlay-item">
              {activeItem.type === 'CLAUSE' && activeItem.clause && (
                <div className="clause-item dragging-clone">
                  <div className="clause-title">{activeItem.clause.title}</div>
                </div>
              )}
              {activeItem.type === 'TITLE' && (
                <div className="new-block-btn title dragging-clone">Titulo</div>
              )}
              {activeItem.type === 'OBS' && (
                <div className="new-block-btn obs dragging-clone">Observacao</div>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
