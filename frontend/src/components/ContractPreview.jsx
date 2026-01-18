import { createPortal } from 'react-dom';
import theme from '../theme';

function ContractPreview({ template, blocks, onClose }) {
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
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 10000
        }}
      >
        ×
      </button>

      {/* Document area */}
      <div style={{
        height: '100%',
        overflow: 'auto',
        padding: '32px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '48px',
          maxWidth: '800px',
          width: '100%',
          minHeight: '1000px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
          color: '#000'
        }}>
          {blocks.map(block => renderBlockContent(block))}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default ContractPreview;
