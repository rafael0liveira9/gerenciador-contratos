import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchRodapes = createAsyncThunk(
  'rodapes/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/rodapes/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar rodapes');
    return response.json();
  }
);

export const createRodape = createAsyncThunk(
  'rodapes/create',
  async ({ empresaId, nome, conteudo }) => {
    const response = await fetch(`${API_URL}/rodapes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, nome, conteudo })
    });
    if (!response.ok) throw new Error('Erro ao criar rodape');
    return response.json();
  }
);

const rodapesSlice = createSlice({
  name: 'rodapes',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearRodapes: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRodapes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRodapes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRodapes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRodape.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export const { clearRodapes } = rodapesSlice.actions;
export const selectAllRodapes = (state) => state.rodapes.items;
export const selectRodapesLoading = (state) => state.rodapes.loading;
export default rodapesSlice.reducer;
