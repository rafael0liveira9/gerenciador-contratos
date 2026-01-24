import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:4002/api';

export const fetchCabecalhos = createAsyncThunk(
  'cabecalhos/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/cabecalhos/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar cabecalhos');
    return response.json();
  }
);

export const createCabecalho = createAsyncThunk(
  'cabecalhos/create',
  async ({ empresaId, nome, conteudo }) => {
    const response = await fetch(`${API_URL}/cabecalhos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, nome, conteudo })
    });
    if (!response.ok) throw new Error('Erro ao criar cabecalho');
    return response.json();
  }
);

const cabecalhosSlice = createSlice({
  name: 'cabecalhos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearCabecalhos: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCabecalhos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCabecalhos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCabecalhos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCabecalho.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export const { clearCabecalhos } = cabecalhosSlice.actions;
export const selectAllCabecalhos = (state) => state.cabecalhos.items;
export const selectCabecalhosLoading = (state) => state.cabecalhos.loading;
export default cabecalhosSlice.reducer;
