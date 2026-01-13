import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';
import EmpresaLayout from './components/EmpresaLayout';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/:slug/*" element={<EmpresaLayout />} />
          <Route path="/" element={<Navigate to="/select" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
