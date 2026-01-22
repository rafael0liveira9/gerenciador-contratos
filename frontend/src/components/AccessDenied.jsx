import { useLocation } from 'react-router-dom';
import { mdiShieldLockOutline } from '@mdi/js';
import Icon from '@mdi/react';
import theme from '../theme';

export default function AccessDenied() {
  const location = useLocation();
  const motivo = location.state?.motivo;

  const getMensagem = () => {
    switch (motivo) {
      case 'USUARIO_INATIVO':
        return 'Seu usuário está inativo. Entre em contato com o administrador.';
      case 'PAGINA_NAO_ENCONTRADA':
        return 'Esta página não existe no sistema.';
      case 'PAGINA_INATIVA':
        return 'Esta página está temporariamente desativada.';
      case 'USUARIO_SEM_GRUPO':
        return 'Você não está associado a nenhum grupo de acesso.';
      case 'GRUPOS_INATIVOS':
        return 'Seus grupos de acesso estão inativos. Entre em contato com o administrador.';
      case 'SEM_PERMISSAO':
        return 'Você não tem permissão para acessar esta página.';
      default:
        return 'Você não tem permissão para acessar esta página.';
    }
  };

  const styles = {
    page: {
      // background: theme.colors.gradients.error
    },
    container: {
      backgroundColor: theme.colors.background.paper,
      // boxShadow: '0 10px 38px rgba(0, 0, 0, 0.4)'
    },
    code: {
      color: theme.colors.error.main
    },
    title: {
      color: theme.colors.text.primary
    },
    message: {
      color: theme.colors.text.secondary
    },
    footer: {
      color: theme.colors.text.muted
    },
    link: {
      color: theme.colors.primary.main
    }
  };

  return (
    <div className="error-page" style={styles.page}>
      <div className="error-page-container" style={styles.container}>
        <div className="error-page-icon-wrapper">
          <Icon
            path={mdiShieldLockOutline}
            size={8}
            color={theme.colors.error.main}
            style={{ opacity: 0.2 }}
          />
          <h1 className="error-page-code error-page-code--error" style={styles.code}>403</h1>
        </div>

        <h2 className="error-page-title" style={styles.title}>Acesso Negado.</h2>

        <p className="error-page-message" style={styles.message}>{getMensagem()}</p>

        <p className="error-page-footer" style={styles.footer}>
          Se você acredita que deveria ter acesso,{' '}
          <a href="mailto:rafaelmariano01234@hotmail.com" style={styles.link}>entre em contato com o administrador</a>.
        </p>
      </div>
    </div>
  );
}
