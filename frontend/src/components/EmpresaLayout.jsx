import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { fetchEmpresaBySlug, selectEmpresa, selectEmpresaLoading, selectEmpresaError } from '../store/empresaSlice';
import { fetchClausulas } from '../store/clausulasSlice';
import { fetchCabecalhos } from '../store/cabecalhosSlice';
import { fetchRodapes } from '../store/rodapesSlice';
import { fetchTemplates, selectCurrentTemplate } from '../store/templatesSlice';
import { fetchContratos } from '../store/contratosSlice';
import { fetchVariaveis } from '../store/variaveisSlice';
import { createBloco } from '../store/blocosSlice';
import TemplateList from './TemplateList';
import TemplateEditor from './TemplateEditor';
import ClauseLibrary from './ClauseLibrary';
import NotFound from './NotFound';
import theme from '../theme';

function EmpresaLayout() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const empresa = useSelector(selectEmpresa);
  const loading = useSelector(selectEmpresaLoading);
  const error = useSelector(selectEmpresaError);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchEmpresaBySlug(slug));
    }
  }, [slug, dispatch]);

  useEffect(() => {
    if (empresa?.id) {
      dispatch(fetchClausulas(empresa.id));
      dispatch(fetchCabecalhos(empresa.id));
      dispatch(fetchRodapes(empresa.id));
      dispatch(fetchTemplates(empresa.id));
      dispatch(fetchContratos(empresa.id));
      dispatch(fetchVariaveis(empresa.id));
    }
  }, [empresa?.id, dispatch]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveItem(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!currentTemplate) return;
    if (!over || over.id !== 'template-drop-zone') return;

    const paginaId = currentTemplate.paginas?.[0]?.id;
    if (!paginaId) return;

    if (typeof active.id === 'string' && active.id.startsWith('clausula-')) {
      const data = active.data.current;
      dispatch(createBloco({
        paginaId,
        clausulaId: data.clausulaId,
        tipo: 'CLAUSULA',
        htmlTag: 'div',
        level: 1
      }));
    }

    if (typeof active.id === 'string' && active.id.startsWith('cabecalho-')) {
      const data = active.data.current;
      dispatch(createBloco({
        paginaId,
        cabecalhoId: data.cabecalhoId,
        tipo: 'CABECALHO',
        htmlTag: 'div',
        level: 1
      }));
    }

    if (typeof active.id === 'string' && active.id.startsWith('rodape-')) {
      const data = active.data.current;
      dispatch(createBloco({
        paginaId,
        rodapeId: data.rodapeId,
        tipo: 'RODAPE',
        htmlTag: 'div',
        level: 1
      }));
    }

    if (typeof active.id === 'string' && active.id.startsWith('new-')) {
      const type = active.data.current.type;
      dispatch(createBloco({
        paginaId,
        tipo: type,
        htmlTag: type === 'TITULO' ? 'h2' : 'p',
        level: 1
      }));
    }
  };

  const styles = {
    app: {
      backgroundColor: theme.colors.background.default,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    loadingScreen: {
      backgroundColor: theme.colors.background.default,
      color: theme.colors.text.secondary
    },
    spinner: {
      borderColor: theme.colors.border.light,
      borderTopColor: theme.colors.primary.main
    },
    header: {
      background: `linear-gradient(135deg, ${theme.colors.secondary.main} 0%, ${theme.colors.secondary.dark} 100%)`,
      color: theme.colors.secondary.contrast,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    main: {
      backgroundColor: theme.colors.background.editor
    },
    dragClausula: {
      backgroundColor: theme.colors.background.paper,
      borderLeftColor: theme.colors.primary.main,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      color: theme.colors.text.primary
    },
    dragCabecalho: {
      background: `linear-gradient(135deg, ${theme.colors.info.main} 0%, ${theme.colors.info.dark} 100%)`,
      color: theme.colors.info.contrast,
      boxShadow: `0 4px 12px ${theme.colors.info.main}40`
    },
    dragRodape: {
      background: `linear-gradient(135deg, ${theme.colors.warning.main} 0%, ${theme.colors.warning.dark} 100%)`,
      color: theme.colors.warning.contrast,
      boxShadow: `0 4px 12px ${theme.colors.warning.main}40`
    },
    dragTitulo: {
      background: `linear-gradient(135deg, ${theme.colors.secondary.main} 0%, ${theme.colors.secondary.dark} 100%)`,
      color: theme.colors.secondary.contrast,
      boxShadow: `0 4px 12px ${theme.colors.secondary.main}40`
    },
    dragObs: {
      background: `linear-gradient(135deg, ${theme.colors.accent.orange} 0%, ${theme.colors.warning.dark} 100%)`,
      color: theme.colors.warning.contrast,
      boxShadow: `0 4px 12px ${theme.colors.accent.orange}40`
    }
  };

  if (loading) {
    return (
      <div className="app" style={styles.app}>
        <div className="loading-screen" style={styles.loadingScreen}>
          <div className="loading-spinner" style={styles.spinner}></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !empresa) {
    return <NotFound />;
  }

  return (
    <div className="app" style={styles.app}>
      <header className="app-header" style={styles.header}>
        <h1>{empresa.nome} - Doc's</h1>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="app-main" style={styles.main}>
          <aside className="sidebar-left">
            <TemplateList />
          </aside>

          <section className="editor-section">
            <TemplateEditor />
          </section>

          <aside className="sidebar-right">
            <ClauseLibrary />
          </aside>
        </main>

        <DragOverlay dropAnimation={null}>
          {activeItem && (
            <div className="drag-overlay-item">
              {activeItem.type === 'CLAUSULA' && activeItem.clausula && (
                <div className="clause-item dragging-clone" style={styles.dragClausula}>
                  <div className="clause-title">{activeItem.clausula.nome}</div>
                </div>
              )}
              {activeItem.type === 'CABECALHO' && (
                <div className="new-block-btn cabecalho dragging-clone" style={styles.dragCabecalho}>Cabecalho</div>
              )}
              {activeItem.type === 'RODAPE' && (
                <div className="new-block-btn rodape dragging-clone" style={styles.dragRodape}>Rodape</div>
              )}
              {activeItem.type === 'TITULO' && (
                <div className="new-block-btn title dragging-clone" style={styles.dragTitulo}>Titulo</div>
              )}
              {activeItem.type === 'OBSERVACAO' && (
                <div className="new-block-btn obs dragging-clone" style={styles.dragObs}>Observacao</div>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default EmpresaLayout;
