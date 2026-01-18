import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { selectEmpresa } from '../store/empresaSlice';
import {
  fetchBiblioteca,
  fetchMoreBiblioteca,
  setSearchTerm,
  selectBibliotecaItems,
  selectBibliotecaLoading,
  selectBibliotecaLoadingMore,
  selectBibliotecaSearchTerm,
  selectBibliotecaPagination
} from '../store/bibliotecaSlice';
import { createClausula } from '../store/clausulasSlice';
import { createCabecalho } from '../store/cabecalhosSlice';
import { createRodape } from '../store/rodapesSlice';
import {
  fetchVariaveis,
  searchVariaveis,
  createVariavel,
  updateVariavel,
  deleteVariavel,
  selectAllVariaveis,
  selectVariaveisLoading
} from '../store/variaveisSlice';
import theme from '../theme';

// Cores por tipo
const typeColors = {
  CLAUSULA: theme.colors.primary.main,
  CABECALHO: theme.colors.info.main,
  RODAPE: theme.colors.warning.main
};

const typeLabels = {
  CLAUSULA: 'Cláusula',
  CABECALHO: 'Cabeçalho',
  RODAPE: 'Rodapé'
};

// Componente de item draggable unificado
function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${item.tipo.toLowerCase()}-${item.id}`,
    data: {
      type: item.tipo,
      [`${item.tipo.toLowerCase()}Id`]: item.id,
      [item.tipo.toLowerCase()]: item
    }
  });

  const borderColor = typeColors[item.tipo] || theme.colors.primary.main;

  const style = {
    backgroundColor: theme.colors.background.paper,
    borderLeftColor: borderColor,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    ...(transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1
    } : {})
  };

  const chipStyle = {
    backgroundColor: borderColor,
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="clause-item"
    >
      <div className="clause-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div className="clause-title" style={{ color: theme.colors.text.primary, flex: 1 }}>
          {item.nome}
        </div>
        <span style={chipStyle}>{typeLabels[item.tipo]}</span>
      </div>
      <div className="clause-preview" style={{ color: theme.colors.text.muted }}>
        {item.conteudo?.replace(/<[^>]*>/g, '').substring(0, 80)}...
      </div>
    </div>
  );
}

// Botões de adicionar bloco
const btnAddStyle = {
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  color: theme.colors.primary.contrast,
  boxShadow: `0 4px 12px ${theme.colors.primary.main}40`,
  fontSize: '0.95rem',
  fontWeight: 600
};

function DraggableNewBlock({ type, label }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type,
      isNew: true
    }
  });

  const style = {
    ...btnAddStyle,
    ...(transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.5 : 1
    } : {})
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`new-block-btn ${type.toLowerCase()}`}
    >
      <span style={{ fontSize: 18, marginRight: 5 }}>+</span>{label}
    </div>
  );
}

function ClauseLibrary() {
  const dispatch = useDispatch();
  const empresa = useSelector(selectEmpresa);
  const items = useSelector(selectBibliotecaItems);
  const loading = useSelector(selectBibliotecaLoading);
  const loadingMore = useSelector(selectBibliotecaLoadingMore);
  const searchTerm = useSelector(selectBibliotecaSearchTerm);
  const pagination = useSelector(selectBibliotecaPagination);
  const variaveis = useSelector(selectAllVariaveis);
  const variaveisLoading = useSelector(selectVariaveisLoading);

  const [activeTab, setActiveTab] = useState('blocos');
  const [localSearch, setLocalSearch] = useState('');
  const [variavelSearch, setVariavelSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTipo, setNewTipo] = useState('CLAUSULA');
  const [newNome, setNewNome] = useState('');
  const [newConteudo, setNewConteudo] = useState('');
  const [newVariavelTag, setNewVariavelTag] = useState('');
  const [editingVariavel, setEditingVariavel] = useState(null);
  const [showVariavelModal, setShowVariavelModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, type: null });

  const listRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const variavelSearchTimeoutRef = useRef(null);

  // Busca inicial quando empresa carregar
  useEffect(() => {
    if (empresa?.id) {
      dispatch(fetchBiblioteca({ empresaId: empresa.id, search: '', page: 1 }));
      dispatch(fetchVariaveis(empresa.id));
    }
  }, [empresa?.id, dispatch]);

  // Debounce da busca
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);

    // Limpar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce de 500ms
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setSearchTerm(value));
      if (empresa?.id) {
        dispatch(fetchBiblioteca({ empresaId: empresa.id, search: value, page: 1 }));
      }
    }, 500);
  };

  // Debounce da busca de variáveis
  const handleVariavelSearchChange = (e) => {
    const value = e.target.value;
    setVariavelSearch(value);

    // Limpar timeout anterior
    if (variavelSearchTimeoutRef.current) {
      clearTimeout(variavelSearchTimeoutRef.current);
    }

    // Debounce de 500ms
    variavelSearchTimeoutRef.current = setTimeout(() => {
      if (empresa?.id) {
        if (value.trim()) {
          dispatch(searchVariaveis({ empresaId: empresa.id, search: value }));
        } else {
          dispatch(fetchVariaveis(empresa.id));
        }
      }
    }, 500);
  };

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom && !loadingMore && pagination.hasMore) {
      dispatch(fetchMoreBiblioteca({
        empresaId: empresa.id,
        search: searchTerm,
        page: pagination.page + 1
      }));
    }
  }, [dispatch, empresa?.id, searchTerm, pagination, loadingMore]);

  // Criar clausula/cabecalho/rodape
  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newNome.trim() || !newConteudo.trim()) return;

    const data = {
      empresaId: empresa.id,
      nome: newNome,
      conteudo: newConteudo
    };

    if (newTipo === 'CLAUSULA') {
      await dispatch(createClausula(data));
    } else if (newTipo === 'CABECALHO') {
      await dispatch(createCabecalho(data));
    } else if (newTipo === 'RODAPE') {
      await dispatch(createRodape(data));
    }

    // Recarregar lista
    dispatch(fetchBiblioteca({ empresaId: empresa.id, search: searchTerm, page: 1 }));

    setNewTipo('CLAUSULA');
    setNewNome('');
    setNewConteudo('');
    setShowNewModal(false);
  };

  // Criar/Editar variavel
  const handleSaveVariavel = async (e) => {
    e.preventDefault();
    if (!newVariavelTag.trim()) return;

    // Formata a tag removendo espaços e caracteres especiais
    const formattedTag = newVariavelTag.trim().replace(/\s+/g, '_').toLowerCase();

    try {
      if (editingVariavel) {
        await dispatch(updateVariavel({ id: editingVariavel.id, tag: formattedTag })).unwrap();
      } else {
        await dispatch(createVariavel({ empresaId: empresa.id, tag: formattedTag })).unwrap();
      }

      setNewVariavelTag('');
      setEditingVariavel(null);
      setShowVariavelModal(false);
    } catch (error) {
      toast.error(error || 'Erro ao salvar variável');
    }
  };

  // Deletar variavel
  const handleDeleteVariavel = (id) => {
    setDeleteConfirm({ show: true, id, type: 'variavel' });
  };

  // Confirmar exclusão
  const confirmDeleteAction = async () => {
    const { id, type } = deleteConfirm;
    try {
      if (type === 'variavel') {
        await dispatch(deleteVariavel(id)).unwrap();
      }
      setDeleteConfirm({ show: false, id: null, type: null });
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  // Abrir modal de edição
  const handleEditVariavel = (variavel) => {
    setEditingVariavel(variavel);
    setNewVariavelTag(variavel.tag);
    setShowVariavelModal(true);
  };

  const styles = {
    container: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '-2px 0 16px rgba(0, 0, 0, 0.15)'
    },
    header: {
      padding: '16px 20px',
      borderBottom: `1px solid ${theme.colors.border.light}`
    },
    title: {
      color: theme.colors.text.primary,
      fontSize: '1rem',
      fontWeight: 600,
      margin: 0
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
    tab: {
      flex: 1,
      padding: '10px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s'
    },
    tabActive: {
      backgroundColor: theme.colors.primary.main,
      color: theme.colors.primary.contrast
    },
    tabInactive: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary
    },
    variavelItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: theme.colors.background.subtle,
      borderRadius: '8px',
      marginBottom: '8px',
      borderLeft: `3px solid ${theme.colors.accent.purple}`
    },
    variavelTag: {
      fontFamily: 'monospace',
      fontSize: '0.9rem',
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.paper,
      padding: '4px 8px',
      borderRadius: '4px',
      border: `1px solid ${theme.colors.border.light}`,
      wordBreak: 'break-all',
      flex: '1 1 auto',
      minWidth: '150px'
    },
    variavelActions: {
      display: 'flex',
      gap: '8px',
      flexShrink: 0
    },
    variavelBtn: {
      padding: '6px 10px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: 500
    },
    variavelBtnEdit: {
      backgroundColor: theme.colors.info.main,
      color: '#fff'
    },
    variavelBtnDelete: {
      backgroundColor: theme.colors.error.main,
      color: '#fff'
    },
    searchInput: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.border.input,
      color: theme.colors.text.primary,
      width: '100%',
      padding: '12px 16px',
      border: `1px solid ${theme.colors.border.input}`,
      borderRadius: '8px',
      fontSize: '0.875rem',
      marginTop: '12px'
    },
    list: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 20px 20px'
    },
    loading: {
      color: theme.colors.text.muted,
      textAlign: 'center',
      padding: '20px'
    },
    loadingMore: {
      color: theme.colors.text.muted,
      textAlign: 'center',
      padding: '12px',
      fontSize: '0.85rem'
    },
    noItems: {
      color: theme.colors.text.muted,
      textAlign: 'center',
      padding: '32px 24px',
      backgroundColor: theme.colors.background.subtle,
      borderRadius: '10px'
    },
    addBlockSection: {
      padding: '16px 20px',
      borderTop: `1px solid ${theme.colors.border.light}`
    },
    addBlockTitle: {
      color: theme.colors.text.secondary,
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: '0 0 12px 0'
    },
    modalOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modal: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
    },
    modalTitle: {
      color: theme.colors.text.primary,
      borderBottom: `1px solid ${theme.colors.border.light}`,
      paddingBottom: '12px',
      marginBottom: '16px'
    },
    input: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.border.input,
      color: theme.colors.text.primary
    },
    btnSubmit: {
      background: `linear-gradient(135deg, ${theme.colors.success.main} 0%, ${theme.colors.success.dark} 100%)`,
      color: theme.colors.success.contrast,
      boxShadow: `0 4px 12px ${theme.colors.success.main}40`
    },
    btnCancel: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    btnAddClause: {
      ...btnAddStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '14px 16px',
      borderRadius: '10px',
      cursor: 'pointer',
      marginBottom: '12px',
      border: 'none',
      width: '100%'
    }
  };

  return (
    <div className="clause-library" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Biblioteca</h3>
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(activeTab === 'blocos' ? styles.tabActive : styles.tabInactive) }}
            onClick={() => setActiveTab('blocos')}
          >
            Blocos
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'variaveis' ? styles.tabActive : styles.tabInactive) }}
            onClick={() => setActiveTab('variaveis')}
          >
            Variáveis
          </button>
        </div>
        {activeTab === 'blocos' && (
          <input
            type="text"
            placeholder="Buscar cláusulas, cabeçalhos, rodapés..."
            value={localSearch}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        )}
      </div>

      {activeTab === 'blocos' ? (
        <>
          <div
            ref={listRef}
            style={styles.list}
            onScroll={handleScroll}
          >
            <button
              onClick={() => setShowNewModal(true)}
              style={styles.btnAddClause}
            >
              <span style={{ fontSize: 18, marginRight: 5 }}>+</span>
              Novo Item
            </button>

            {loading && <div style={styles.loading}>Carregando...</div>}

            {!loading && items.length === 0 && (
              <div style={styles.noItems}>
                {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item na biblioteca'}
              </div>
            )}

            {!loading && items.map(item => (
              <DraggableItem key={`${item.tipo}-${item.id}`} item={item} />
            ))}

            {loadingMore && (
              <div style={styles.loadingMore}>Carregando mais...</div>
            )}
          </div>

          <div style={styles.addBlockSection}>
            <h4 style={styles.addBlockTitle}>Adicionar Bloco</h4>
            <DraggableNewBlock type="TITULO" label="Novo Título" />
            <DraggableNewBlock type="OBSERVACAO" label="Nova Observação" />
          </div>
        </>
      ) : (
        <div style={styles.list}>
          <input
            type="text"
            placeholder="Buscar variáveis por tag..."
            value={variavelSearch}
            onChange={handleVariavelSearchChange}
            style={{ ...styles.searchInput, marginTop: 0, marginBottom: '12px' }}
          />

          <button
            onClick={() => {
              setEditingVariavel(null);
              setNewVariavelTag('');
              setShowVariavelModal(true);
            }}
            style={styles.btnAddClause}
          >
            <span style={{ fontSize: 18, marginRight: 5 }}>+</span>
            Nova Variável
          </button>

          {variaveisLoading && <div style={styles.loading}>Carregando...</div>}

          {!variaveisLoading && variaveis.length === 0 && (
            <div style={styles.noItems}>
              {variavelSearch ? 'Nenhuma variável encontrada' : 'Nenhuma variável cadastrada'}
            </div>
          )}

          {!variaveisLoading && variaveis.map(variavel => (
            <div key={variavel.id} style={styles.variavelItem}>
              <span style={styles.variavelTag}>{`{{${variavel.tag}}}`}</span>
              <div style={styles.variavelActions}>
                <button
                  onClick={() => handleEditVariavel(variavel)}
                  style={{ ...styles.variavelBtn, ...styles.variavelBtnEdit }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteVariavel(variavel.id)}
                  style={{ ...styles.variavelBtn, ...styles.variavelBtnDelete }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNewModal && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="new-clause-modal" style={styles.modal}>
            <h4 style={styles.modalTitle}>Novo Item</h4>
            <form onSubmit={handleCreateItem}>
              <select
                value={newTipo}
                onChange={(e) => setNewTipo(e.target.value)}
                style={{ ...styles.input, marginBottom: '12px' }}
              >
                <option value="CLAUSULA">Cláusula</option>
                <option value="CABECALHO">Cabeçalho</option>
                <option value="RODAPE">Rodapé</option>
              </select>
              <input
                type="text"
                placeholder={`Nome ${newTipo === 'CLAUSULA' ? 'da cláusula' : newTipo === 'CABECALHO' ? 'do cabeçalho' : 'do rodapé'}`}
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                autoFocus
                style={styles.input}
              />
              <textarea
                placeholder="Conteúdo..."
                value={newConteudo}
                onChange={(e) => setNewConteudo(e.target.value)}
                rows={5}
                style={styles.input}
              />
              <div className="modal-actions">
                <button type="submit" style={styles.btnSubmit}>Criar</button>
                <button type="button" onClick={() => {
                  setShowNewModal(false);
                  setNewTipo('CLAUSULA');
                  setNewNome('');
                  setNewConteudo('');
                }} style={styles.btnCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVariavelModal && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="new-clause-modal" style={styles.modal}>
            <h4 style={styles.modalTitle}>{editingVariavel ? 'Editar Variável' : 'Nova Variável'}</h4>
            <form onSubmit={handleSaveVariavel}>
              <input
                type="text"
                placeholder="Nome da variável (ex: nome_cliente)"
                value={newVariavelTag}
                onChange={(e) => setNewVariavelTag(e.target.value)}
                autoFocus
                style={styles.input}
              />
              <p style={{ fontSize: '0.8rem', color: theme.colors.text.muted, marginTop: '8px' }}>
                A variável será inserida como: <code style={{ backgroundColor: theme.colors.background.subtle, padding: '2px 6px', borderRadius: '4px' }}>{`{{${newVariavelTag.trim().replace(/\s+/g, '_').toLowerCase() || 'nome_variavel'}}}`}</code>
              </p>
              <div className="modal-actions">
                <button type="submit" style={styles.btnSubmit}>{editingVariavel ? 'Salvar' : 'Criar'}</button>
                <button type="button" onClick={() => {
                  setShowVariavelModal(false);
                  setEditingVariavel(null);
                  setNewVariavelTag('');
                }} style={styles.btnCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm.show && (
        <div className="modal-overlay" style={{
          ...styles.modalOverlay,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            ...styles.modal,
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h4 style={{ ...styles.modalTitle, margin: '0 0 16px' }}>Confirmar exclusão</h4>
            <p style={{ margin: '0 0 20px', color: theme.colors.text.secondary }}>
              Tem certeza que deseja excluir esta {deleteConfirm.type === 'variavel' ? 'variável' : 'cláusula'}?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null, type: null })}
                style={styles.btnCancel}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteAction}
                style={{
                  padding: '10px 20px',
                  backgroundColor: theme.colors.error.main,
                  color: theme.colors.error.contrast,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClauseLibrary;
