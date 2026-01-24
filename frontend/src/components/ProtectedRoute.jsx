import { useEffect, useState } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsAuthenticated,
  selectEmpresaAuth,
  verificarToken,
  verificarEmpresa
} from '../store/authSlice';
import NotFound from './NotFound';
import theme from '../theme';

function ProtectedRoute({ children }) {
  const { slug } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const empresaAuth = useSelector(selectEmpresaAuth);
  const auth = useSelector(state => state.auth);

  const [checking, setChecking] = useState(true);
  const [empresaExists, setEmpresaExists] = useState(null);
  const [empresaActive, setEmpresaActive] = useState(null);

  useEffect(() => {
    const verificar = async () => {
      setChecking(true);

      // Primeiro verifica se a empresa existe
      const empresaResult = await dispatch(verificarEmpresa(slug));

      if (verificarEmpresa.rejected.match(empresaResult)) {
        const payload = empresaResult.payload;
        if (payload?.status === 404) {
          setEmpresaExists(false);
          setChecking(false);
          return;
        }
        if (payload?.status === 403) {
          setEmpresaExists(true);
          setEmpresaActive(false);
          setChecking(false);
          return;
        }
      }

      setEmpresaExists(true);
      setEmpresaActive(true);

      // Se tem token salvo, verifica se ainda é válido
      const token = localStorage.getItem('token');
      if (token) {
        await dispatch(verificarToken());
      }

      setChecking(false);
    };

    if (slug) {
      verificar();
    }
  }, [slug, dispatch]);

  // Loading
  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.default,
        color: theme.colors.text.secondary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${theme.colors.border.light}`,
            borderTopColor: theme.colors.primary.main,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Empresa não existe - 404
  if (empresaExists === false) {
    return <NotFound />;
  }

  // Empresa inativa
  if (empresaActive === false) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.default,
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: theme.colors.background.paper,
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: theme.colors.warning.main, marginBottom: '16px' }}>
            Empresa Inativa
          </h2>
          <p style={{ color: theme.colors.text.secondary }}>
            Esta empresa está temporariamente desativada.
            Entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  // Não autenticado - redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Verifica se o token é da mesma empresa do slug
  if (empresaAuth && empresaAuth.slug !== slug) {
    // Token é de outra empresa, redireciona para login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Autenticado e empresa válida
  return children;
}

export default ProtectedRoute;
