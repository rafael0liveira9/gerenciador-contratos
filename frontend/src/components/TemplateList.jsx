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

function TemplateList() {
  const dispatch = useDispatch();
  const empresa = useSelector(selectEmpresa);
  const templates = useSelector(selectAllTemplates);
  const loading = useSelector(selectTemplatesLoading);
  const currentTemplate = useSelector(selectCurrentTemplate);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newDescricao, setNewDescricao] = useState('');

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
    if (!newNome.trim()) return;

    await dispatch(createTemplate({
      empresaId: empresa.id,
      nome: newNome,
      descricao: newDescricao
    }));

    setNewNome('');
    setNewDescricao('');
    setShowNewModal(false);
  };

  return (
    <div className="template-list">
      <h3>Templates</h3>

      <button
        className="btn-add-template"
        onClick={() => setShowNewModal(true)}
      >
        + Novo Template
      </button>

      <div className="templates">
        {loading && <div className="loading">Carregando...</div>}

        {!loading && templates.map(template => (
          <div
            key={template.id}
            className={`template-item ${currentTemplate?.id === template.id ? 'active' : ''}`}
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="template-name">{template.nome}</div>
            <div className="template-version">v{template.versao}</div>
            {template.descricao && (
              <div className="template-description">{template.descricao}</div>
            )}
          </div>
        ))}

        {!loading && templates.length === 0 && (
          <div className="no-templates">Nenhum template encontrado</div>
        )}
      </div>

      {showNewModal && (
        <div className="modal-overlay">
          <div className="new-template-modal">
            <h4>Novo Template</h4>
            <form onSubmit={handleCreateTemplate}>
              <input
                type="text"
                placeholder="Nome do template"
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                autoFocus
              />
              <textarea
                placeholder="Descricao (opcional)"
                value={newDescricao}
                onChange={(e) => setNewDescricao(e.target.value)}
                rows={3}
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

export default TemplateList;
