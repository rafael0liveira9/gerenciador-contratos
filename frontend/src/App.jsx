import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import store from './store';
import EmpresaLayout from './components/EmpresaLayout';
import theme from './theme';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/:slug/*" element={<EmpresaLayout />} />
          <Route path="/" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            padding: '16px',
            fontSize: '14px',
            backgroundColor: theme.colors.background.paper,
            color: theme.colors.text.primary,
          },
          success: {
            style: {
              background: theme.colors.success.main,
              color: theme.colors.success.contrast,
            },
          },
          error: {
            style: {
              background: theme.colors.error.main,
              color: theme.colors.error.contrast,
            },
          },
        }}
      />
    </Provider>
  );
}

export default App;
