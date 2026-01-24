import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:4002/api';

// Recupera dados do localStorage
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const empresa = localStorage.getItem('empresa');
    return {
      token,
      empresa: empresa ? JSON.parse(empresa) : null
    };
  } catch {
    return { token: null, empresa: null };
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ documento, senha }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documento, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Erro ao fazer login');
      }

      // Salva no localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('empresa', JSON.stringify(data.empresa));

      return data;
    } catch (error) {
      return rejectWithValue('Erro de conexão com o servidor');
    }
  }
);

export const verificarToken = createAsyncThunk(
  'auth/verificarToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token || localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('Token não encontrado');
      }

      const response = await fetch(`${API_URL}/auth/verificar`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('empresa');
        return rejectWithValue(data.error || 'Token inválido');
      }

      return data;
    } catch (error) {
      return rejectWithValue('Erro de conexão com o servidor');
    }
  }
);

export const verificarEmpresa = createAsyncThunk(
  'auth/verificarEmpresa',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/auth/empresa/${slug}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          ...data
        });
      }

      return data;
    } catch (error) {
      return rejectWithValue({ error: 'Erro de conexão com o servidor' });
    }
  }
);

const storedAuth = getStoredAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedAuth.token,
    empresa: storedAuth.empresa,
    isAuthenticated: !!storedAuth.token,
    loading: false,
    error: null,
    empresaVerificada: null,
    verificandoEmpresa: false
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.empresa = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('empresa');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.empresa = action.payload.empresa;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Verificar Token
      .addCase(verificarToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verificarToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.empresa = action.payload.empresa;
      })
      .addCase(verificarToken.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.empresa = null;
        state.isAuthenticated = false;
      })
      // Verificar Empresa
      .addCase(verificarEmpresa.pending, (state) => {
        state.verificandoEmpresa = true;
        state.empresaVerificada = null;
      })
      .addCase(verificarEmpresa.fulfilled, (state, action) => {
        state.verificandoEmpresa = false;
        state.empresaVerificada = action.payload;
      })
      .addCase(verificarEmpresa.rejected, (state, action) => {
        state.verificandoEmpresa = false;
        state.empresaVerificada = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectEmpresaAuth = (state) => state.auth.empresa;

export default authSlice.reducer;
