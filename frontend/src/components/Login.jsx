import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, clearError, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../store/authSlice';
import theme from '../theme';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [documento, setDocumento] = useState('');
  const [senha, setSenha] = useState('');

  // Pega o redirect da URL ou usa o slug salvo
  const from = location.state?.from || '/';

  useEffect(() => {
    if (isAuthenticated) {
      // Se autenticado, redireciona para onde veio ou para a empresa logada
      const empresaStorage = localStorage.getItem('empresa');
      if (empresaStorage) {
        const empresa = JSON.parse(empresaStorage);
        navigate(from !== '/' && from !== '/login' ? from : `/${empresa.slug}`, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Limpa erros ao montar
    dispatch(clearError());
  }, [dispatch]);

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handleDocumentoChange = (e) => {
    setDocumento(formatCNPJ(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documento || !senha) return;

    dispatch(login({ documento, senha }));
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.default,
      padding: '20px'
    },
    container: {
      width: '100%',
      maxWidth: '420px',
      backgroundColor: theme.colors.background.paper,
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: theme.colors.text.primary,
      margin: '0 0 8px 0'
    },
    subtitle: {
      fontSize: '0.95rem',
      color: theme.colors.text.muted,
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.colors.text.secondary
    },
    input: {
      padding: '14px 16px',
      borderRadius: '10px',
      border: `1px solid ${theme.colors.border.input}`,
      backgroundColor: theme.colors.background.subtle,
      color: theme.colors.text.primary,
      fontSize: '1rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: theme.colors.primary.main,
      boxShadow: `0 0 0 3px ${theme.colors.primary.main}20`
    },
    button: {
      padding: '14px 24px',
      borderRadius: '10px',
      border: 'none',
      background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
      color: '#fff',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      marginTop: '8px'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    error: {
      padding: '12px 16px',
      borderRadius: '10px',
      backgroundColor: `${theme.colors.error.main}15`,
      border: `1px solid ${theme.colors.error.main}30`,
      color: theme.colors.error.main,
      fontSize: '0.875rem',
      textAlign: 'center'
    },
    footer: {
      marginTop: '24px',
      textAlign: 'center',
      fontSize: '0.8rem',
      color: theme.colors.text.muted
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Bem-vindo</h1>
          <p style={styles.subtitle}>Entre com suas credenciais para acessar</p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>CNPJ</label>
            <input
              type="text"
              style={styles.input}
              placeholder="00.000.000/0000-00"
              value={documento}
              onChange={handleDocumentoChange}
              disabled={loading}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border.input;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              style={styles.input}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border.input;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading || !documento || !senha}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.footer}>
          Sistema de Gerenciamento de Contratos
        </div>
      </div>
    </div>
  );
}

export default Login;
