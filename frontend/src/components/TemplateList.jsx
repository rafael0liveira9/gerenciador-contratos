import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllTemplates,
  selectTemplatesLoading,
  selectCurrentTemplate,
  setCurrentTemplate,
  createTemplate
} from '../store/templatesSlice';
import { selectEmpresa } from '../store/empresaSlice';
import { setBlocos } from '../store/blocosSlice';
import theme from '../theme';

function TemplateList() {
  const dispatch = useDispatch();
  const empresa = useSelector(selectEmpresa);
  const templates = useSelector(selectAllTemplates);
  const loading = useSelector(selectTemplatesLoading);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newDescricao, setNewDescricao] = useState('');
  const [newVersao, setNewVersao] = useState('1');
  const [newInicioVigencia, setNewInicioVigencia] = useState('');
  const [newFimVigencia, setNewFimVigencia] = useState('');

  const handleSelectTemplate = (template) => {
    dispatch(setCurrentTemplate(template));
    if (template.paginas?.[0]?.blocos) {
      dispatch(setBlocos(template.paginas[0].blocos));
    } else {
      dispatch(setBlocos([]));
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!newNome.trim() || !newVersao.trim() || !newInicioVigencia) return;

    await dispatch(createTemplate({
      empresaId: empresa.id,
      nome: newNome,
      descricao: newDescricao || null,
      versao: parseInt(newVersao),
      inicioVigencia: newInicioVigencia,
      fimVigencia: newFimVigencia || null
    }));

    setNewNome('');
    setNewDescricao('');
    setNewVersao('1');
    setNewInicioVigencia('');
    setNewFimVigencia('');
    setShowNewModal(false);
  };

  const styles = {
    container: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '2px 0 16px rgba(0, 0, 0, 0.15)'
    },
    title: {
      color: theme.colors.secondary.main,
      borderBottomColor: theme.colors.border.light,
      fontSize: 17,
      fontWeight: 700,
      padding: '20px 0px 0px 20px'
    },
    btnAdd: {
      background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
      color: theme.colors.primary.contrast,
      boxShadow: `0 4px 12px ${theme.colors.primary.main}40`,
      fontSize: '0.95rem',
      fontWeight: 600
    },
    templateItem: (isActive) => ({
      backgroundColor: isActive ? theme.colors.states.active : theme.colors.background.paper,
      borderLeftColor: isActive ? theme.colors.primary.main : 'transparent',
      boxShadow: isActive
        ? `0 4px 20px rgba(0, 0, 0, 0.25)`
        : '0 2px 10px rgba(0, 0, 0, 0.2)',
      position: 'relative'
    }),
    templateName: {
      color: theme.colors.text.primary
    },
    templateVersion: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary
    },
    chipVigente: {
      backgroundColor: theme.colors.success.dark,
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: '10px',
      letterSpacing: '0.3px',
      position: 'absolute',
      top: -5,
      right: 2
    },
    templateDescription: {
      color: theme.colors.text.muted
    },
    loading: {
      color: theme.colors.text.muted
    },
    noTemplates: {
      color: theme.colors.text.muted,
      backgroundColor: theme.colors.background.subtle
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
      borderBottomColor: theme.colors.border.light
    },
    label: {
      color: theme.colors.text.secondary
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
    }
  };

  return (
    <div className="template-list" style={styles.container}>
      <h3 style={{ ...styles.title }}>Meus Templates</h3>
      <button
        className="btn-add-template"
        onClick={() => setShowNewModal(true)}
        style={styles.btnAdd}
      >
        <span style={{ fontSize: 15, marginRight: 5 }}>+</span>Novo Template
      </button>

      <div className="templates">
        {loading && <div className="loading" style={styles.loading}>Carregando...</div>}

        {!loading && templates.map(template => (
          <div
            key={template.id}
            className={`template-item ${currentTemplate?.id === template.id ? 'active' : ''}`}
            onClick={() => handleSelectTemplate(template)}
            style={styles.templateItem(currentTemplate?.id === template.id)}
          >
            {template.vigente && <span style={styles.chipVigente}>Em Vigência</span>}
            <div className="template-name" style={styles.templateName}>{template.nome}</div>
            <div className="template-version" style={styles.templateVersion}>v{template.versao}</div>
            {template.descricao && (
              <div className="template-description" style={styles.templateDescription}>{template.descricao}</div>
            )}
          </div>
        ))}

        {!loading && templates.length === 0 && (
          <div className="no-templates" style={styles.noTemplates}>Nenhum template encontrado</div>
        )}
      </div>

      {showNewModal && (
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="new-template-modal" style={styles.modal}>
            <h4 style={styles.modalTitle}>Novo Template</h4>
            <form onSubmit={handleCreateTemplate}>
              <div className="form-group">
                <label style={styles.label}>Nome *</label>
                <input
                  type="text"
                  placeholder="Nome do template"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  required
                  autoFocus
                  style={styles.input}
                />
              </div>

              <div className="form-group">
                <label style={styles.label}>Versão *</label>
                <input
                  type="number"
                  placeholder="1"
                  value={newVersao}
                  onChange={(e) => setNewVersao(e.target.value)}
                  min="1"
                  required
                  style={styles.input}
                />
              </div>

              <div className="form-group">
                <label style={styles.label}>Descrição</label>
                <textarea
                  placeholder="Descrição (opcional)"
                  value={newDescricao}
                  onChange={(e) => setNewDescricao(e.target.value)}
                  rows={3}
                  style={styles.input}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label style={styles.label}>Início Vigência *</label>
                  <input
                    type="date"
                    value={newInicioVigencia}
                    onChange={(e) => setNewInicioVigencia(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>

                <div className="form-group">
                  <label style={styles.label}>Fim Vigência</label>
                  <input
                    type="date"
                    value={newFimVigencia}
                    onChange={(e) => setNewFimVigencia(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" style={styles.btnSubmit}>Criar</button>
                <button type="button" onClick={() => setShowNewModal(false)} style={styles.btnCancel}>
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

export default TemplateList;
