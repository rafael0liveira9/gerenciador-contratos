import { useRef, useEffect, useState } from 'react';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
const COLORS = ['#000000', '#333333', '#666666', '#999999', '#e74c3c', '#e67e22', '#f1c40f', '#27ae60', '#3498db', '#9b59b6'];
const HTML_TAGS = [
  { value: 'p', label: 'Paragrafo' },
  { value: 'h1', label: 'Titulo 1' },
  { value: 'h2', label: 'Titulo 2' },
  { value: 'h3', label: 'Titulo 3' },
  { value: 'h4', label: 'Titulo 4' },
  { value: 'div', label: 'Div' }
];

function RichTextEditor({ value, onChange, htmlTag, onHtmlTagChange, styles, onStylesChange }) {
  const editorRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleStyleChange = (key, val) => {
    onStylesChange({
      ...styles,
      [key]: val
    });
  };

  const insertTable = () => {
    const rows = prompt('Numero de linhas:', '3');
    const cols = prompt('Numero de colunas:', '3');
    if (rows && cols) {
      let table = '<table style="width:100%;border-collapse:collapse;margin:10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += '<td style="border:1px solid #ccc;padding:8px;">Celula</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      execCmd('insertHTML', table);
    }
  };

  const currentStyles = styles || {};

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <select
            value={htmlTag || 'p'}
            onChange={(e) => onHtmlTagChange(e.target.value)}
            title="Tipo de elemento"
          >
            {HTML_TAGS.map(tag => (
              <option key={tag.value} value={tag.value}>{tag.label}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <select
            onChange={(e) => execCmd('fontSize', e.target.value)}
            defaultValue="3"
            title="Tamanho"
          >
            <option value="1">Muito pequeno</option>
            <option value="2">Pequeno</option>
            <option value="3">Normal</option>
            <option value="4">Medio</option>
            <option value="5">Grande</option>
            <option value="6">Muito grande</option>
            <option value="7">Enorme</option>
          </select>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => execCmd('bold')} title="Negrito">
            <b>B</b>
          </button>
          <button type="button" onClick={() => execCmd('italic')} title="Italico">
            <i>I</i>
          </button>
          <button type="button" onClick={() => execCmd('underline')} title="Sublinhado">
            <u>U</u>
          </button>
          <button type="button" onClick={() => execCmd('strikeThrough')} title="Riscado">
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <div className="color-picker-wrapper">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Cor do texto"
              className="color-btn"
            >
              A
              <span className="color-indicator" style={{ backgroundColor: '#000' }} />
            </button>
            {showColorPicker && (
              <div className="color-dropdown">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      execCmd('foreColor', color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="color-picker-wrapper">
            <button
              type="button"
              onClick={() => setShowBgColorPicker(!showBgColorPicker)}
              title="Cor de fundo"
              className="color-btn bg-color-btn"
            >
              <span className="bg-icon">A</span>
            </button>
            {showBgColorPicker && (
              <div className="color-dropdown">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      execCmd('hiliteColor', color);
                      setShowBgColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => execCmd('justifyLeft')} title="Alinhar esquerda">
            &#8676;
          </button>
          <button type="button" onClick={() => execCmd('justifyCenter')} title="Centralizar">
            &#8596;
          </button>
          <button type="button" onClick={() => execCmd('justifyRight')} title="Alinhar direita">
            &#8677;
          </button>
          <button type="button" onClick={() => execCmd('justifyFull')} title="Justificar">
            &#8700;
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Lista">
            &#8226;
          </button>
          <button type="button" onClick={() => execCmd('insertOrderedList')} title="Lista numerada">
            1.
          </button>
          <button type="button" onClick={() => execCmd('indent')} title="Aumentar recuo">
            &#8680;
          </button>
          <button type="button" onClick={() => execCmd('outdent')} title="Diminuir recuo">
            &#8678;
          </button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <button type="button" onClick={insertTable} title="Inserir tabela">
            &#9638;
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
      />

      <div className="style-controls">
        <div className="style-group">
          <label>Margem (px)</label>
          <div className="style-inputs">
            <input
              type="number"
              placeholder="Topo"
              value={currentStyles.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', e.target.value)}
            />
            <input
              type="number"
              placeholder="Direita"
              value={currentStyles.marginRight || ''}
              onChange={(e) => handleStyleChange('marginRight', e.target.value)}
            />
            <input
              type="number"
              placeholder="Baixo"
              value={currentStyles.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
            />
            <input
              type="number"
              placeholder="Esquerda"
              value={currentStyles.marginLeft || ''}
              onChange={(e) => handleStyleChange('marginLeft', e.target.value)}
            />
          </div>
        </div>

        <div className="style-group">
          <label>Padding (px)</label>
          <div className="style-inputs">
            <input
              type="number"
              placeholder="Topo"
              value={currentStyles.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
            />
            <input
              type="number"
              placeholder="Direita"
              value={currentStyles.paddingRight || ''}
              onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
            />
            <input
              type="number"
              placeholder="Baixo"
              value={currentStyles.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
            />
            <input
              type="number"
              placeholder="Esquerda"
              value={currentStyles.paddingLeft || ''}
              onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
            />
          </div>
        </div>

        <div className="style-group">
          <label>Alinhamento do bloco</label>
          <select
            value={currentStyles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default RichTextEditor;
