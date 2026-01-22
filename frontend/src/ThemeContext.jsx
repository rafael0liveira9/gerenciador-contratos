import { createContext, useContext } from 'react';
import theme from './theme';

const ThemeContext = createContext(theme);

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export const createStyles = {
  bgPrimary: { background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` },
  bgSecondary: { background: `linear-gradient(135deg, ${theme.colors.secondary.main} 0%, ${theme.colors.secondary.dark} 100%)` },
  bgSuccess: { background: `linear-gradient(135deg, ${theme.colors.success.main} 0%, ${theme.colors.success.dark} 100%)` },
  bgError: { background: `linear-gradient(135deg, ${theme.colors.error.main} 0%, ${theme.colors.error.dark} 100%)` },
  bgPaper: { backgroundColor: theme.colors.background.paper },
  bgDefault: { backgroundColor: theme.colors.background.default },
  bgSubtle: { backgroundColor: theme.colors.background.subtle },
  bgLight: { backgroundColor: theme.colors.background.light },

  textPrimary: { color: theme.colors.text.primary },
  textSecondary: { color: theme.colors.text.secondary },
  textMuted: { color: theme.colors.text.muted },
  textWhite: { color: '#ffffff' },

  // Borders
  border: { borderColor: theme.colors.border.main },
  borderLight: { borderColor: theme.colors.border.light },

  // Shadows
  shadowSm: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
  shadowMd: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' },
  shadowLg: { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)' },
  shadowPrimary: { boxShadow: `0 4px 12px ${theme.colors.primary.main}50` },
  shadowSuccess: { boxShadow: `0 4px 12px ${theme.colors.success.main}50` },
  shadowError: { boxShadow: `0 4px 12px ${theme.colors.error.main}50` },

  // Sidebar shadows
  shadowLeft: { boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)' },
  shadowRight: { boxShadow: '-2px 0 12px rgba(0, 0, 0, 0.08)' },
};

export default theme;
