import { useRef, useEffect, useState } from 'react';
import theme from '../theme';

const COLORS = [
  '#000000',
  theme.colors.text.primary,
  theme.colors.text.secondary,
  theme.colors.text.light,
  theme.colors.error.main,
  theme.colors.accent.orange,
  theme.colors.warning.light,
  theme.colors.success.main,
  theme.colors.primary.main,
  theme.colors.accent.purple
];

function SimpleHtmlEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const isInternalChange = useRef(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  // Só sincroniza o valor inicial ou mudanças externas
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command, cmdValue = null) => {
    document.execCommand(command, false, cmdValue);
    editorRef.current?.focus();
    handleInput();
  };

  const insertTable = () => {
    const rows = prompt('Numero de linhas:', '3');
    const cols = prompt('Numero de colunas:', '3');
    if (rows && cols) {
      let table = '<table style="width:100%;border-collapse:collapse;margin:10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        table += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          table += `<td style="border:1px solid ${theme.colors.border.dark};padding:8px;">Celula</td>`;
        }
        table += '</tr>';
      }
      table += '</table>';
      execCmd('insertHTML', table);
    }
  };

  const editorStyles = {
    container: {
      backgroundColor: theme.colors.background.paper,
      border: `1px solid ${theme.colors.border.main}`,
      borderRadius: '8px',
      overflow: 'hidden'
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      padding: '8px',
      backgroundColor: theme.colors.background.subtle,
      borderBottom: `1px solid ${theme.colors.border.light}`
    },
    toolbarGroup: {
      display: 'flex',
      gap: '2px'
    },
    toolbarBtn: {
      padding: '6px 10px',
      border: `1px solid ${theme.colors.border.main}`,
      borderRadius: '4px',
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.secondary,
      cursor: 'pointer',
      fontSize: '0.875rem',
      minWidth: '32px'
    },
    toolbarSelect: {
      padding: '6px 8px',
      border: `1px solid ${theme.colors.border.input}`,
      borderRadius: '4px',
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      fontSize: '0.875rem'
    },
    divider: {
      width: '1px',
      backgroundColor: theme.colors.border.main,
      margin: '0 4px'
    },
    colorPickerWrapper: {
      position: 'relative'
    },
    colorDropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '4px',
      padding: '8px',
      backgroundColor: theme.colors.background.paper,
      border: `1px solid ${theme.colors.border.main}`,
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      zIndex: 10
    },
    colorBtn: {
      width: '24px',
      height: '24px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    editorContent: {
      minHeight: '120px',
      padding: '12px',
      outline: 'none',
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      fontSize: '0.875rem',
      lineHeight: 1.6
    }
  };

  return (
    <div style={editorStyles.container}>
      <div style={editorStyles.toolbar}>
        <div style={editorStyles.toolbarGroup}>
          <select
            onChange={(e) => execCmd('fontSize', e.target.value)}
            defaultValue="3"
            title="Tamanho"
            style={editorStyles.toolbarSelect}
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

        <div style={editorStyles.divider} />

        <div style={editorStyles.toolbarGroup}>
          <button type="button" onClick={() => execCmd('bold')} title="Negrito" style={editorStyles.toolbarBtn}>
            <b>B</b>
          </button>
          <button type="button" onClick={() => execCmd('italic')} title="Italico" style={editorStyles.toolbarBtn}>
            <i>I</i>
          </button>
          <button type="button" onClick={() => execCmd('underline')} title="Sublinhado" style={editorStyles.toolbarBtn}>
            <u>U</u>
          </button>
          <button type="button" onClick={() => execCmd('strikeThrough')} title="Riscado" style={editorStyles.toolbarBtn}>
            <s>S</s>
          </button>
        </div>

        <div style={editorStyles.divider} />

        <div style={editorStyles.toolbarGroup}>
          <div style={editorStyles.colorPickerWrapper}>
            <button
              type="button"
              onClick={() => { setShowColorPicker(!showColorPicker); setShowBgColorPicker(false); }}
              title="Cor do texto"
              style={editorStyles.toolbarBtn}
            >
              A
            </button>
            {showColorPicker && (
              <div style={editorStyles.colorDropdown}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    style={{ ...editorStyles.colorBtn, backgroundColor: color }}
                    onClick={() => {
                      execCmd('foreColor', color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div style={editorStyles.colorPickerWrapper}>
            <button
              type="button"
              onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowColorPicker(false); }}
              title="Cor de fundo"
              style={editorStyles.toolbarBtn}
            >
              <span style={{ backgroundColor: theme.colors.warning.light, padding: '0 4px' }}>A</span>
            </button>
            {showBgColorPicker && (
              <div style={editorStyles.colorDropdown}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    style={{ ...editorStyles.colorBtn, backgroundColor: color }}
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

        <div style={editorStyles.divider} />

        <div style={editorStyles.toolbarGroup}>
          <button type="button" onClick={() => execCmd('justifyLeft')} title="Alinhar esquerda" style={editorStyles.toolbarBtn}>
            &#8676;
          </button>
          <button type="button" onClick={() => execCmd('justifyCenter')} title="Centralizar" style={editorStyles.toolbarBtn}>
            &#8596;
          </button>
          <button type="button" onClick={() => execCmd('justifyRight')} title="Alinhar direita" style={editorStyles.toolbarBtn}>
            &#8677;
          </button>
          <button type="button" onClick={() => execCmd('justifyFull')} title="Justificar" style={editorStyles.toolbarBtn}>
            &#8700;
          </button>
        </div>

        <div style={editorStyles.divider} />

        <div style={editorStyles.toolbarGroup}>
          <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Lista" style={editorStyles.toolbarBtn}>
            &#8226;
          </button>
          <button type="button" onClick={() => execCmd('insertOrderedList')} title="Lista numerada" style={editorStyles.toolbarBtn}>
            1.
          </button>
          <button type="button" onClick={() => execCmd('indent')} title="Aumentar recuo" style={editorStyles.toolbarBtn}>
            &#8680;
          </button>
          <button type="button" onClick={() => execCmd('outdent')} title="Diminuir recuo" style={editorStyles.toolbarBtn}>
            &#8678;
          </button>
        </div>

        <div style={editorStyles.divider} />

        <div style={editorStyles.toolbarGroup}>
          <button type="button" onClick={insertTable} title="Inserir tabela" style={editorStyles.toolbarBtn}>
            &#9638;
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        suppressContentEditableWarning
        style={editorStyles.editorContent}
        data-placeholder={placeholder}
      />
    </div>
  );
}

export default SimpleHtmlEditor;
