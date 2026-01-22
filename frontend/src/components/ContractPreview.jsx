import { useState } from 'react';
import { createPortal } from 'react-dom';
import theme from '../theme';

const defaultPageConfig = {
  marginTop: 48,
  marginRight: 48,
  marginBottom: 48,
  marginLeft: 48,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  textAlign: 'left',
  backgroundColor: '#ffffff',
  backgroundImage: ''
};

function ContractPreview({ template, blocks, onClose }) {
  const paginas = template?.paginas || [];
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Parse page config from conteudo JSON
  const getPageConfig = (pagina) => {
    if (!pagina?.conteudo) return defaultPageConfig;
    try {
      const config = JSON.parse(pagina.conteudo);
      return { ...defaultPageConfig, ...config };
    } catch {
      return defaultPageConfig;
    }
  };

  // Get blocks for a specific page
  const getPageBlocks = (pagina) => {
    if (!pagina?.blocos) return [];
    return [...pagina.blocos].sort((a, b) => a.ordem - b.ordem);
  };

  const renderBlockContent = (block) => {
    const blockStyles = block.styles
      ? (typeof block.styles === 'string' ? JSON.parse(block.styles) : block.styles)
      : {};

    const style = {
      marginTop: blockStyles.marginTop ? `${blockStyles.marginTop}px` : undefined,
      marginRight: blockStyles.marginRight ? `${blockStyles.marginRight}px` : undefined,
      marginBottom: blockStyles.marginBottom ? `${blockStyles.marginBottom}px` : undefined,
      marginLeft: blockStyles.marginLeft ? `${blockStyles.marginLeft}px` : (block.level - 1) * 24 + 'px',
      paddingTop: blockStyles.paddingTop ? `${blockStyles.paddingTop}px` : undefined,
      paddingRight: blockStyles.paddingRight ? `${blockStyles.paddingRight}px` : undefined,
      paddingBottom: blockStyles.paddingBottom ? `${blockStyles.paddingBottom}px` : undefined,
      paddingLeft: blockStyles.paddingLeft ? `${blockStyles.paddingLeft}px` : undefined,
      textAlign: blockStyles.textAlign || undefined
    };

    let content = '';
    switch (block.tipo) {
      case 'CLAUSULA':
        content = block.clausula?.conteudo || '';
        break;
      case 'CABECALHO':
        content = block.cabecalho?.conteudo || '';
        break;
      case 'RODAPE':
        content = block.rodape?.conteudo || '';
        break;
      case 'TITULO':
        content = block.conteudo || '';
        break;
      case 'OBSERVACAO':
        content = block.conteudo || '';
        break;
      default:
        content = '';
    }

    const Tag = block.htmlTag || 'p';

    return (
      <div key={block.id} className="preview-block">
        <Tag style={style} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  const renderPage = (pagina, index) => {
    const pageConfig = getPageConfig(pagina);
    const pageBlocks = getPageBlocks(pagina);

    const pageStyle = {
      backgroundColor: pageConfig.backgroundColor || '#ffffff',
      backgroundImage: pageConfig.backgroundImage ? `url(${pageConfig.backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginTop: pageConfig.marginTop ? `${pageConfig.marginTop}px` : '48px',
      marginRight: pageConfig.marginRight ? `${pageConfig.marginRight}px` : '48px',
      marginBottom: pageConfig.marginBottom ? `${pageConfig.marginBottom}px` : '48px',
      marginLeft: pageConfig.marginLeft ? `${pageConfig.marginLeft}px` : '48px',
      paddingTop: pageConfig.paddingTop ? `${pageConfig.paddingTop}px` : '0',
      paddingRight: pageConfig.paddingRight ? `${pageConfig.paddingRight}px` : '0',
      paddingBottom: pageConfig.paddingBottom ? `${pageConfig.paddingBottom}px` : '0',
      paddingLeft: pageConfig.paddingLeft ? `${pageConfig.paddingLeft}px` : '0',
      textAlign: pageConfig.textAlign || 'left',
      minHeight: '900px',
      color: '#000'
    };

    return (
      <div
        key={pagina.id}
        style={{
          backgroundColor: '#fff',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          marginBottom: '32px',
          position: 'relative'
        }}
      >
        {/* Page number badge */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          right: '16px',
          backgroundColor: theme.colors.primary.main,
          color: '#fff',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          Página {index + 1} de {paginas.length}
        </div>

        {/* Page content */}
        <div style={pageStyle}>
          {pageBlocks.length > 0 ? (
            pageBlocks.map(block => renderBlockContent(block))
          ) : (
            <div style={{ color: '#999', textAlign: 'center', padding: '48px' }}>
              Página vazia
            </div>
          )}
        </div>
      </div>
    );
  };

  // Fallback: if no pages, show blocks directly
  const renderFallback = () => (
    <div style={{
      backgroundColor: '#fff',
      padding: '48px',
      maxWidth: '800px',
      width: '100%',
      minHeight: '900px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      color: '#000'
    }}>
      {blocks.map(block => renderBlockContent(block))}
    </div>
  );

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Header with title and close button */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000
      }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>
          {template?.nome || 'Visualização do Contrato'}
        </h3>
        <button
          onClick={onClose}
          style={{
            width: '36px',
            height: '36px',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '24px',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 4
          }}
        >
          ×
        </button>
      </div>

      {/* Document area */}
      <div style={{
        height: '100%',
        overflow: 'auto',
        paddingTop: '80px',
        paddingBottom: '32px',
        paddingLeft: '32px',
        paddingRight: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {paginas.length > 0 ? (
          paginas.map((pagina, index) => renderPage(pagina, index))
        ) : (
          renderFallback()
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ContractPreview;
