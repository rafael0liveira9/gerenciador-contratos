function ContractPreview({ contract, blocks, onClose }) {
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

    const content = block.type === 'CLAUSE'
      ? block.clause?.content
      : block.content;

    const Tag = block.htmlTag || 'p';

    return (
      <div key={block.id} className="preview-block">
        {/* {block.numbering && <span className="preview-numbering">{block.numbering}</span>} */}
        <Tag style={style} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="contract-preview">
      <div className="preview-header no-print">
        <h3>Visualizacao</h3>
        <div className="preview-actions">
          <button onClick={handlePrint} className="btn-print">
            Imprimir
          </button>
          <button onClick={onClose} className="btn-close">
            Fechar
          </button>
        </div>
      </div>

      <div className="preview-document">
        <div className="document-content">
          {blocks.map(block => renderBlockContent(block))}
        </div>
      </div>
    </div>
  );
}

export default ContractPreview;
