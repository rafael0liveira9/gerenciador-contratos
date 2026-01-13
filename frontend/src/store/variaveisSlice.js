import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchVariaveis = createAsyncThunk(
  'variaveis/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/variaveis/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar variaveis');
    return response.json();
  }
);

export const createVariavel = createAsyncThunk(
  'variaveis/create',
  async ({ empresaId, label, tag }) => {
    const response = await fetch(`${API_URL}/variaveis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, label, tag })
    });
    if (!response.ok) throw new Error('Erro ao criar variavel');
    return response.json();
  }
);

export const updateVariavel = createAsyncThunk(
  'variaveis/update',
  async ({ id, label, tag }) => {
    const response = await fetch(`${API_URL}/variaveis/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, tag })
    });
    if (!response.ok) throw new Error('Erro ao atualizar variavel');
    return response.json();
  }
);

export const deleteVariavel = createAsyncThunk(
  'variaveis/delete',
  async (id) => {
    const response = await fetch(`${API_URL}/variaveis/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir variavel');
    return id;
  }
);

const variaveisSlice = createSlice({
  name: 'variaveis',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearVariaveis: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariaveis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariaveis.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchVariaveis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createVariavel.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateVariavel.fulfilled, (state, action) => {
        const index = state.items.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteVariavel.fulfilled, (state, action) => {
        state.items = state.items.filter(v => v.id !== action.payload);
      });
  }
});

export const { clearVariaveis } = variaveisSlice.actions;
export const selectAllVariaveis = (state) => state.variaveis.items;
export const selectVariaveisLoading = (state) => state.variaveis.loading;
export default variaveisSlice.reducer;
