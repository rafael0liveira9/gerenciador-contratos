import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { selectAllVariaveis } from '../store/variaveisSlice';
import theme from '../theme';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
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
const HTML_TAGS = [
  { value: 'p', label: 'Parágrafo' },
  { value: 'h1', label: 'Titulo 1' },
  { value: 'h2', label: 'Titulo 2' },
  { value: 'h3', label: 'Titulo 3' },
  { value: 'h4', label: 'Titulo 4' },
  { value: 'div', label: 'Div' }
];

function RichTextEditor({ value, onChange, htmlTag, onHtmlTagChange, styles, onStylesChange }) {
  const editorRef = useRef(null);
  const menuRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const variaveis = useSelector(selectAllVariaveis);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Fechar menu de contexto ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu({ show: false, x: 0, y: 0 });
      }
    };
    if (contextMenu.show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu.show]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Salvar seleção atual
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Restaurar seleção salva
  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Menu de contexto (botão direito)
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveSelection();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Inserir variável na posição do cursor
  const insertVariavel = (tag) => {
    const variavelText = `{{${tag}}}`;
    restoreSelection();
    editorRef.current?.focus();
    document.execCommand('insertText', false, variavelText);
    handleInput();
    setContextMenu({ show: false, x: 0, y: 0 });
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
          table += `<td style="border:1px solid ${theme.colors.border.dark};padding:8px;">Celula</td>`;
        }
        table += '</tr>';
      }
      table += '</table>';
      execCmd('insertHTML', table);
    }
  };

  const currentStyles = styles || {};

  const editorStyles = {
    container: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.border.main
    },
    toolbar: {
      backgroundColor: theme.colors.background.subtle,
      borderBottomColor: theme.colors.border.light
    },
    toolbarBtn: {
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.secondary,
      borderColor: theme.colors.border.main
    },
    toolbarSelect: {
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      borderColor: theme.colors.border.input
    },
    divider: {
      backgroundColor: theme.colors.border.main
    },
    colorDropdown: {
      backgroundColor: theme.colors.background.paper,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      borderColor: theme.colors.border.main
    },
    editorContent: {
      backgroundColor: theme.colors.background.paper,
      color: theme.colors.text.primary,
      borderColor: theme.colors.border.light
    },
    styleControls: {
      backgroundColor: theme.colors.background.subtle,
      borderTopColor: theme.colors.border.light
    },
    styleLabel: {
      color: theme.colors.text.secondary
    },
    styleInput: {
      backgroundColor: theme.colors.background.paper,
      borderColor: theme.colors.border.input,
      color: theme.colors.text.primary
    },
    contextMenu: {
      position: 'fixed',
      backgroundColor: theme.colors.background.paper,
      border: `1px solid ${theme.colors.border.main}`,
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      zIndex: 9999,
      minWidth: '200px',
      maxHeight: '300px',
      overflowY: 'auto'
    },
    contextMenuHeader: {
      padding: '10px 14px',
      borderBottom: `1px solid ${theme.colors.border.light}`,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: theme.colors.text.muted,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    contextMenuItem: {
      padding: '10px 14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.9rem',
      color: theme.colors.text.primary,
      transition: 'background-color 0.15s'
    },
    contextMenuItemHover: {
      backgroundColor: theme.colors.background.subtle
    },
    contextMenuTag: {
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      backgroundColor: theme.colors.accent.purple + '20',
      color: theme.colors.accent.purple,
      padding: '2px 6px',
      borderRadius: '4px'
    },
    contextMenuEmpty: {
      padding: '14px',
      color: theme.colors.text.muted,
      textAlign: 'center',
      fontSize: '0.85rem'
    }
  };

  return (
    <div className="rich-text-editor" style={editorStyles.container}>
      <div className="editor-toolbar" style={editorStyles.toolbar}>
        <div className="toolbar-group">
          <select
            value={htmlTag || 'p'}
            onChange={(e) => onHtmlTagChange(e.target.value)}
            title="Tipo de elemento"
            style={{...editorStyles.toolbarSelect, maxWidth: 100}}
          >
            {HTML_TAGS.map(tag => (
              <option key={tag.value} value={tag.value}>{tag.label}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
          <select
            onChange={(e) => execCmd('fontSize', e.target.value)}
            defaultValue="3"
            title="Tamanho"
            style={{...editorStyles.toolbarSelect, maxWidth: 100}}
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

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
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

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
          <div className="color-picker-wrapper">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Cor do texto"
              className="color-btn"
              style={editorStyles.toolbarBtn}
            >
              A
              <span className="color-indicator" style={{ backgroundColor: theme.colors.text.primary }} />
            </button>
            {showColorPicker && (
              <div className="color-dropdown" style={editorStyles.colorDropdown}>
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
              style={editorStyles.toolbarBtn}
            >
              <span className="bg-icon">A</span>
            </button>
            {showBgColorPicker && (
              <div className="color-dropdown" style={editorStyles.colorDropdown}>
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

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
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

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
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

        <div className="toolbar-divider" style={editorStyles.divider} />

        <div className="toolbar-group">
          <button type="button" onClick={insertTable} title="Inserir tabela" style={editorStyles.toolbarBtn}>
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
        onContextMenu={handleContextMenu}
        suppressContentEditableWarning
        style={editorStyles.editorContent}
      />

      {contextMenu.show && createPortal(
        <div
          ref={menuRef}
          style={{
            ...editorStyles.contextMenu,
            left: contextMenu.x,
            top: contextMenu.y
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div style={editorStyles.contextMenuHeader}>Inserir Variável</div>
          {variaveis.length === 0 ? (
            <div style={editorStyles.contextMenuEmpty}>
              Nenhuma variável cadastrada
            </div>
          ) : (
            variaveis.map(variavel => (
              <div
                key={variavel.id}
                style={editorStyles.contextMenuItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  insertVariavel(variavel.tag);
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = editorStyles.contextMenuItemHover.backgroundColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={editorStyles.contextMenuTag}>{`{{${variavel.tag}}}`}</span>
              </div>
            ))
          )}
        </div>,
        document.body
      )}

      <div className="style-controls" style={editorStyles.styleControls}>
        <div className="style-group">
          <label style={editorStyles.styleLabel}>Margem (px)</label>
          <div className="style-inputs">
            <input
              type="number"
              placeholder="Topo"
              value={currentStyles.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Direita"
              value={currentStyles.marginRight || ''}
              onChange={(e) => handleStyleChange('marginRight', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Baixo"
              value={currentStyles.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Esquerda"
              value={currentStyles.marginLeft || ''}
              onChange={(e) => handleStyleChange('marginLeft', e.target.value)}
              style={editorStyles.styleInput}
            />
          </div>
        </div>

        <div className="style-group">
          <label style={editorStyles.styleLabel}>Padding (px)</label>
          <div className="style-inputs">
            <input
              type="number"
              placeholder="Topo"
              value={currentStyles.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Direita"
              value={currentStyles.paddingRight || ''}
              onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Baixo"
              value={currentStyles.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
              style={editorStyles.styleInput}
            />
            <input
              type="number"
              placeholder="Esquerda"
              value={currentStyles.paddingLeft || ''}
              onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
              style={editorStyles.styleInput}
            />
          </div>
        </div>

        <div className="style-group">
          <label style={editorStyles.styleLabel}>Alinhamento</label>
          <select
            value={currentStyles.textAlign || 'left'}
            onChange={(e) => handleStyleChange('textAlign', e.target.value)}
            style={editorStyles.toolbarSelect}
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
