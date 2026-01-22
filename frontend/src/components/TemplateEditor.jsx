/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import toast from 'react-hot-toast';
import { selectCurrentTemplate, updateTemplate, fetchTemplateById, clearCurrentTemplate, fetchTemplates } from '../store/templatesSlice';
import { selectEmpresa } from '../store/empresaSlice';
import { selectAllBlocos, updateBloco, deleteBloco, reorderBlocos } from '../store/blocosSlice';
import { createPagina, updatePagina } from '../store/paginasSlice';
import Block from './Block';
import ContractPreview from './ContractPreview';
import GenerateContractModal from './GenerateContractModal';
import theme from '../theme';

const defaultPageConfig = {
  marginTop: '',
  marginRight: '',
  marginBottom: '',
  marginLeft: '',
  paddingTop: '',
  paddingRight: '',
  paddingBottom: '',
  paddingLeft: '',
  textAlign: 'left',
  backgroundColor: '#ffffff',
  backgroundImage: ''
};

function TemplateEditor() {
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentTemplate);
  const empresa = useSelector(selectEmpresa);
  const blocos = useSelector(selectAllBlocos);
  const [showPreview, setShowPreview] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [localPageConfig, setLocalPageConfig] = useState(null);

  const creatingPageRef = useRef(false);

  const { setNodeRef, isOver } = useDroppable({
    id: 'template-drop-zone'
  });

  const paginas = template?.paginas || [];
  const currentPage = paginas[currentPageIndex];

  useEffect(() => {
    const createFirstPage = async () => {
      if (template && paginas.length === 0 && !creatingPageRef.current) {
        creatingPageRef.current = true;
        try {
          await dispatch(createPagina({ templateId: template.id })).unwrap();
          await dispatch(fetchTemplateById(template.id));
        } catch (error) {
          console.error('Erro ao criar página inicial:', error);
        }
        creatingPageRef.current = false;
      }
    };
    createFirstPage();
  }, [template?.id, paginas.length, dispatch]);

  const getPageConfig = () => {
    if (localPageConfig) return localPageConfig;
    const conteudo = currentPage?.conteudo;
    if (!conteudo) return defaultPageConfig;
    try {
      const config = JSON.parse(conteudo);
      return { ...defaultPageConfig, ...config };
    } catch {
      return defaultPageConfig;
    }
  };
  const pageConfig = getPageConfig();

  const styles = {
    container: {
    },
    empty: {
    },
    emptyMessage: {
    },
    emptyTitle: {
      color: theme.colors.text.primary
    },
    emptyText: {
      color: theme.colors.text.muted
    },
    header: {
    },
    btnPreview: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    btnSave: {
      background: `linear-gradient(135deg, ${theme.colors.success.main} 0%, ${theme.colors.success.dark} 100%)`,
      color: theme.colors.success.contrast,
      boxShadow: `0 4px 12px ${theme.colors.success.main}40`
    },
    btnClose: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.primary,
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 9
    },
    btnGenerate: {
      background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
      color: theme.colors.primary.contrast,
      boxShadow: `0 4px 12px ${theme.colors.primary.main}40`,
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 500
    },
    infoCard: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    templateName: {
      color: theme.colors.text.primary
    },
    label: {
      color: theme.colors.text.muted,
      lineHeight: '14px'
    },
    value: {
      color: theme.colors.text.primary
    },
    description: {
      color: theme.colors.text.secondary,
      backgroundColor: theme.colors.background.subtle
    },
    dates: {
      // borderTopColor: theme.colors.border.light
    },
    inlineEdit: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.primary.main,
      color: theme.colors.text.primary
    },
    pagesSection: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    pagesLabel: {
      color: theme.colors.text.secondary
    },
    pageTab: (isActive) => ({
      backgroundColor: isActive ? theme.colors.primary.main : theme.colors.background.subtle,
      color: isActive ? theme.colors.primary.contrast : theme.colors.text.secondary
    }),
    pageTabAdd: {
      background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
      color: theme.colors.primary.contrast,
      boxShadow: `0 4px 12px ${theme.colors.primary.main}40`,
      border: 'none'
    },
    pageConfig: {
      backgroundColor: theme.colors.background.subtle,
      borderTopColor: theme.colors.border.light
    },
    configLabel: {
      color: theme.colors.text.secondary
    },
    configInput: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.border.input,
      color: theme.colors.text.primary
    },
    btnUpload: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    editorContent: {
      backgroundColor: theme.colors.background.subtle,
      borderColor: theme.colors.border.light,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    editorContentDragOver: {
      backgroundColor: theme.colors.states.hover,
      borderColor: theme.colors.primary.main
    },
    dropPlaceholder: {
      color: theme.colors.text.muted,
      borderColor: theme.colors.border.main
    }
  };

  if (!template) {
    return (
      <div className="template-editor empty" style={styles.empty}>
        <div className="empty-message" style={styles.emptyMessage}>
          <h3 style={styles.emptyTitle}>Selecione um template</h3>
          <p style={styles.emptyText}>Escolha um template na lista à esquerda ou crie um novo.</p>
        </div>
      </div>
    );
  }

  const getFieldValue = (field) => {
    if (field === 'inicioVigencia' || field === 'fimVigencia') {
      return template[field] ? template[field].split('T')[0] : '';
    }
    return template[field] || '';
  };

  const handleFieldChange = (field, value) => {
    dispatch(updateTemplate({
      id: template.id,
      [field]: value
    }));
  };

  const handleBlockUpdate = (blockId, updates) => {
    return dispatch(updateBloco({ id: blockId, ...updates })).unwrap();
  };

  const handleBlockDelete = (blockId) => {
    return dispatch(deleteBloco(blockId)).unwrap();
  };

  const handleMoveBlock = (blockId, direction) => {
    const blockIndex = sortedBlocos.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= sortedBlocos.length) return;

    const newBlocos = [...sortedBlocos];
    const [movedBlock] = newBlocos.splice(blockIndex, 1);
    newBlocos.splice(newIndex, 0, movedBlock);

    const reorderedBlocos = newBlocos.map((bloco, index) => ({
      id: bloco.id,
      ordem: index + 1
    }));

    dispatch(reorderBlocos(reorderedBlocos));
  };

  const handleSave = async () => {
    try {

      if (currentPage && localPageConfig) {
        await dispatch(updatePagina({
          id: currentPage.id,
          conteudo: JSON.stringify(localPageConfig)
        })).unwrap();
      }

      toast.success('Template salvo com sucesso!');
      if (empresa?.id) {
        dispatch(fetchTemplates(empresa.id));
      }
      dispatch(clearCurrentTemplate());
    } catch (error) {
      toast.error('Erro ao salvar template');
    }
  };

  const handleClose = () => {
    dispatch(clearCurrentTemplate());
  };

  const handleAddPage = async () => {
    try {
      await dispatch(createPagina({ templateId: template.id })).unwrap();
      await dispatch(fetchTemplateById(template.id));
      toast.success('Página adicionada!');
      setCurrentPageIndex(paginas.length);
    } catch (error) {
      toast.error('Erro ao adicionar página');
    }
  };

  const handlePageConfigChange = (field, value) => {
    setLocalPageConfig({ ...pageConfig, [field]: value });
  };

  const sortedBlocos = [...blocos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="template-editor" style={styles.container}>
      <div className="editor-header" style={styles.header}>
        <div className="editor-actions">
          <button onClick={() => setShowGenerateModal(true)} className="btn-generate" style={styles.btnGenerate}>
            Gerar Contrato
          </button>
          <button onClick={() => setShowPreview(true)} className="btn-preview" style={styles.btnPreview}>
            Visualizar
          </button>
          <button onClick={handleSave} className="btn-save" style={styles.btnSave}>
            Salvar
          </button>
          <button onClick={handleClose} className="btn-close" style={styles.btnClose}>
            ×
          </button>
        </div>
      </div>

      <div className="template-info-card" style={styles.infoCard}>
        <div className="template-info-row">
          <div className="template-info-main">
            <input
              type="text"
              className="inline-edit inline-edit--title"
              value={template.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              placeholder="Nome do template"
              style={styles.inlineEdit}
            />
          </div>
          <div className="template-info-version">
            <span className="label" style={styles.label}>V</span>
            <input
              type="number"
              className="inline-edit inline-edit--small"
              value={template.versao}
              onChange={(e) => handleFieldChange('versao', parseInt(e.target.value) || 1)}
              min="1"
              style={styles.inlineEdit}
            />
          </div>
          <div className="template-dates" style={styles.dates}>
            <div className="date-field">
              <span className="label" style={styles.label}>Início da <br></br>Vigência:</span>
              <input
                type="date"
                className="inline-edit"
                value={getFieldValue('inicioVigencia')}
                onChange={(e) => handleFieldChange('inicioVigencia', e.target.value)}
                style={styles.inlineEdit}
              />
            </div>
            <div className="date-field">
              <span className="label" style={styles.label}>Fim da <br></br>Vigência:</span>
              <input
                type="date"
                className="inline-edit"
                value={getFieldValue('fimVigencia')}
                onChange={(e) => handleFieldChange('fimVigencia', e.target.value)}
                style={styles.inlineEdit}
              />
            </div>
          </div>
        </div>

        <textarea
          className="inline-edit inline-edit--desc"
          value={template.descricao || ''}
          onChange={(e) => handleFieldChange('descricao', e.target.value)}
          placeholder="Descrição do template..."
          rows={2}
          style={styles.inlineEdit}
        />

        <div style={{width:'100%', height:'1px', marginTop: 15, backgroundColor:theme.colors.background.subtle }}></div>

        <div className="pages-tabs">
          <span className="pages-label" style={styles.pagesLabel}>Páginas:</span>
          {paginas.map((pagina, index) => (
            <button
              key={pagina.id}
              className={`page-tab ${index === currentPageIndex ? 'active' : ''}`}
              onClick={() => {
                setLocalPageConfig(null);
                setCurrentPageIndex(index);
              }}
              style={styles.pageTab(index === currentPageIndex)}
            >
              {index + 1}
            </button>
          ))}
          <button className="page-tab page-tab--add" title="Adicionar página" onClick={handleAddPage} style={styles.pageTabAdd}>
            +
          </button>
        </div>

        {currentPage && (
          <div className="page-config" style={styles.pageConfig}>
            <div className="page-config-row">
              <div className="config-group">
                <label style={styles.configLabel}>Margem (px)</label>
                <div className="config-inputs">
                  <input
                    type="number"
                    placeholder="T"
                    title="Top"
                    value={pageConfig.marginTop}
                    onChange={(e) => handlePageConfigChange('marginTop', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="R"
                    title="Right"
                    value={pageConfig.marginRight}
                    onChange={(e) => handlePageConfigChange('marginRight', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="B"
                    title="Bottom"
                    value={pageConfig.marginBottom}
                    onChange={(e) => handlePageConfigChange('marginBottom', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="L"
                    title="Left"
                    value={pageConfig.marginLeft}
                    onChange={(e) => handlePageConfigChange('marginLeft', e.target.value)}
                    style={styles.configInput}
                  />
                </div>
              </div>
              <div className="config-group">
                <label style={styles.configLabel}>Padding (px)</label>
                <div className="config-inputs">
                  <input
                    type="number"
                    placeholder="T"
                    title="Top"
                    value={pageConfig.paddingTop}
                    onChange={(e) => handlePageConfigChange('paddingTop', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="R"
                    title="Right"
                    value={pageConfig.paddingRight}
                    onChange={(e) => handlePageConfigChange('paddingRight', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="B"
                    title="Bottom"
                    value={pageConfig.paddingBottom}
                    onChange={(e) => handlePageConfigChange('paddingBottom', e.target.value)}
                    style={styles.configInput}
                  />
                  <input
                    type="number"
                    placeholder="L"
                    title="Left"
                    value={pageConfig.paddingLeft}
                    onChange={(e) => handlePageConfigChange('paddingLeft', e.target.value)}
                    style={styles.configInput}
                  />
                </div>
              </div>
              <div className="config-group">
                <label style={styles.configLabel}>Alinhar</label>
                <select
                  value={pageConfig.textAlign}
                  onChange={(e) => handlePageConfigChange('textAlign', e.target.value)}
                  style={styles.configInput}
                >
                  <option value="left">Esquerda</option>
                  <option value="center">Centro</option>
                  <option value="right">Direita</option>
                  <option value="justify">Justificado</option>
                </select>
              </div>
              <div className="config-group">
                <label style={styles.configLabel}>Fundo</label>
                <input
                  type="color"
                  value={pageConfig.backgroundColor}
                  onChange={(e) => handlePageConfigChange('backgroundColor', e.target.value)}
                />
              </div>
              <div className="config-group">
                <label style={styles.configLabel}>Imagem de Fundo</label>
                <button className="btn-upload" style={styles.btnUpload}>Selecionar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`editor-content ${isOver ? 'drag-over' : ''}`}
        style={{
          ...(isOver ? styles.editorContentDragOver : styles.editorContent),
          backgroundColor: pageConfig.backgroundColor || '#ffffff',
          backgroundImage: pageConfig.backgroundImage ? `url(${pageConfig.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginTop: pageConfig.marginTop ? `${pageConfig.marginTop}px` : undefined,
          marginRight: pageConfig.marginRight ? `${pageConfig.marginRight}px` : undefined,
          marginBottom: pageConfig.marginBottom ? `${pageConfig.marginBottom}px` : undefined,
          marginLeft: pageConfig.marginLeft ? `${pageConfig.marginLeft}px` : undefined,
          paddingTop: pageConfig.paddingTop ? `${pageConfig.paddingTop}px` : undefined,
          paddingRight: pageConfig.paddingRight ? `${pageConfig.paddingRight}px` : undefined,
          paddingBottom: pageConfig.paddingBottom ? `${pageConfig.paddingBottom}px` : undefined,
          paddingLeft: pageConfig.paddingLeft ? `${pageConfig.paddingLeft}px` : undefined,
          textAlign: pageConfig.textAlign || 'left'
        }}
      >
        {sortedBlocos.length === 0 ? (
          <div className="drop-placeholder" style={styles.dropPlaceholder}>
            Arraste cláusulas, cabeçalhos ou rodapés aqui
          </div>
        ) : (
          sortedBlocos.map((bloco, index) => (
            <Block
              key={bloco.id}
              block={bloco}
              onUpdate={(updates) => handleBlockUpdate(bloco.id, updates)}
              onDelete={() => handleBlockDelete(bloco.id)}
              onMoveUp={() => handleMoveBlock(bloco.id, 'up')}
              onMoveDown={() => handleMoveBlock(bloco.id, 'down')}
              isFirst={index === 0}
              isLast={index === sortedBlocos.length - 1}
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

      {showGenerateModal && (
        <GenerateContractModal
          template={template}
          blocks={sortedBlocos}
          onClose={() => setShowGenerateModal(false)}
        />
      )}
    </div>
  );
}

export default TemplateEditor;
