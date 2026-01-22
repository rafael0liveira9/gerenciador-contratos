import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import theme from '../theme';

export default function NotFound() {
  const styles = {
    page: {
      // background: theme.colors.gradients.dark
    },
    container: {
      backgroundColor: theme.colors.background.paper,
      // boxShadow: '0 10px 38px rgba(0, 0, 0, 0.4)'
    },
    code: {
      color: theme.colors.primary.main
    },
    title: {
      color: theme.colors.text.primary
    },
    message: {
      color: theme.colors.text.secondary
    },
    suggestions: {
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.secondary
    },
    suggestionsList: {
      color: theme.colors.text.muted
    }
  };

  return (
    <div className="error-page" style={styles.page}>
      <div className="error-page-container" style={styles.container}>
        <div className="error-page-icon-wrapper">
          <Icon
            path={mdiAlertCircleOutline}
            size={8}
            color={theme.colors.primary.main}
            style={{ opacity: 0.2 }}
          />
          <h1 className="error-page-code" style={styles.code}>404</h1>
        </div>

        <h2 className="error-page-title" style={styles.title}>Página não encontrada</h2>

        <p className="error-page-message" style={styles.message}>
          Ops! A página que você está procurando não existe ou foi movida.
          Verifique o endereço e tente novamente.
        </p>

        <div className="error-page-suggestions" style={styles.suggestions}>
          <p>Verifique se:</p>
          <ul style={styles.suggestionsList}>
            <li>O slug da empresa está correto.</li>
            <li>A empresa ainda está ativa no sistema.</li>
            <li>Você tem permissão para acessar.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}