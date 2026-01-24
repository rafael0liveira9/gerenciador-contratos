import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:4002/api';

export const fetchClausulas = createAsyncThunk(
  'clausulas/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/clausulas/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar clausulas');
    return response.json();
  }
);

export const createClausula = createAsyncThunk(
  'clausulas/create',
  async ({ empresaId, nome, conteudo }) => {
    const response = await fetch(`${API_URL}/clausulas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, nome, conteudo })
    });
    if (!response.ok) throw new Error('Erro ao criar clausula');
    return response.json();
  }
);

export const updateClausula = createAsyncThunk(
  'clausulas/update',
  async ({ id, nome, conteudo }) => {
    const response = await fetch(`${API_URL}/clausulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, conteudo })
    });
    if (!response.ok) throw new Error('Erro ao atualizar clausula');
    return response.json();
  }
);

export const deleteClausula = createAsyncThunk(
  'clausulas/delete',
  async (id) => {
    const response = await fetch(`${API_URL}/clausulas/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir clausula');
    return id;
  }
);

const clausulasSlice = createSlice({
  name: 'clausulas',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchTerm: ''
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearClausulas: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClausulas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClausulas.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchClausulas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createClausula.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateClausula.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteClausula.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
      });
  }
});

export const { setSearchTerm, clearClausulas } = clausulasSlice.actions;
export const selectAllClausulas = (state) => state.clausulas.items;
export const selectClausulasLoading = (state) => state.clausulas.loading;
export const selectClausulasSearchTerm = (state) => state.clausulas.searchTerm;
export default clausulasSlice.reducer;
