/**
 * Theme - Cores centralizadas do projeto
 * Importe este arquivo para usar cores consistentes em todo o projeto
 */

const theme = {
  colors: {
    // Cores primárias
    primary: {
      main: '#3498db',
      dark: '#2980b9',
      light: '#5dade2',
      contrast: '#ffffff',
    },

    // Cores secundárias
    secondary: {
      main: '#2c3e50',
      dark: '#1a252f',
      light: '#34495e',
      contrast: '#ffffff',
    },

    // Cores de sucesso
    success: {
      main: '#27ae60',
      dark: '#1F7A43',
      light: '#2ecc71',
      contrast: '#ffffff',
    },

    // Cores de erro
    error: {
      main: '#e74c3c',
      dark: '#c0392b',
      light: '#f44336',
      contrast: '#ffffff',
    },

    // Cores de aviso
    warning: {
      main: '#f39c12',
      dark: '#d68910',
      light: '#f1c40f',
      contrast: '#ffffff',
    },

    // Cores de informação
    info: {
      main: '#9b59b6',
      dark: '#8e44ad',
      light: '#a569bd',
      contrast: '#ffffff',
    },

    // Cores de destaque/accent
    accent: {
      purple: '#9b59b6',
      orange: '#e67e22',
      teal: '#1abc9c',
      pink: '#ff9ff3',
      cyan: '#48dbfb',
    },

    // Backgrounds
    background: {
      default: '#f5f5f5',
      editor: '#e5e5e5',
      paper: '#ffffff',
      light: '#fafafa',
      subtle: '#f8f9fa',
      dark: '#2c3e50',
    },

    // Textos
    text: {
      primary: '#333333',
      secondary: '#666666',
      muted: '#888888',
      light: '#999999',
      inverse: '#ffffff',
    },

    // Bordas
    border: {
      main: '#e0e0e0',
      light: '#f0f0f0',
      dark: '#cccccc',
      input: '#dddddd',
    },

    // Gradientes (para uso inline)
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      dark: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      error: 'linear-gradient(135deg, #2d1b1b 0%, #3d1f1f 50%, #4a1f1f 100%)',
      colorful: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      success: 'linear-gradient(135deg, #27ae60, #2ecc71)',
    },

    // Estados
    states: {
      hover: 'rgba(52, 152, 219, 0.08)',
      active: 'rgba(52, 152, 219, 0.16)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      focus: 'rgba(52, 152, 219, 0.24)',
    },

    // Sombras
    shadows: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.15)',
      dark: 'rgba(0, 0, 0, 0.25)',
    },
  },

  // Espaçamentos
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  // Border radius
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '50%',
    pill: '30px',
  },

  // Tipografia
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      xxl: '2rem',
    },
  },

  // Transições
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export default theme;

// Export individual colors for convenience
export const { colors } = theme;
