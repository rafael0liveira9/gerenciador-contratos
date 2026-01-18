import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchBlocosByPagina = createAsyncThunk(
  'blocos/fetchByPagina',
  async (paginaId) => {
    const response = await fetch(`${API_URL}/blocos/pagina/${paginaId}`);
    if (!response.ok) throw new Error('Erro ao buscar blocos');
    return response.json();
  }
);

export const createBloco = createAsyncThunk(
  'blocos/create',
  async (data) => {
    const response = await fetch(`${API_URL}/blocos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao criar bloco');
    return response.json();
  }
);

export const updateBloco = createAsyncThunk(
  'blocos/update',
  async ({ id, ...data }) => {
    const response = await fetch(`${API_URL}/blocos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao atualizar bloco');
    return response.json();
  }
);

export const deleteBloco = createAsyncThunk(
  'blocos/delete',
  async (id) => {
    const response = await fetch(`${API_URL}/blocos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir bloco');
    return id;
  }
);

export const reorderBlocos = createAsyncThunk(
  'blocos/reorder',
  async (blocos) => {
    const response = await fetch(`${API_URL}/blocos/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocos })
    });
    if (!response.ok) throw new Error('Erro ao reordenar blocos');
    return blocos;
  }
);

const blocosSlice = createSlice({
  name: 'blocos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setBlocos: (state, action) => {
      state.items = action.payload;
    },
    clearBlocos: (state) => {
      state.items = [];
      state.error = null;
    },
    localReorder: (state, action) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocosByPagina.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlocosByPagina.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBlocosByPagina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBloco.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((a, b) => a.ordem - b.ordem);
      })
      .addCase(updateBloco.fulfilled, (state, action) => {
        const index = state.items.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBloco.fulfilled, (state, action) => {
        state.items = state.items.filter(b => b.id !== action.payload);
      })
      .addCase(reorderBlocos.fulfilled, (state, action) => {
        // action.payload is [{id, ordem}, ...]
        const orderMap = {};
        action.payload.forEach(b => { orderMap[b.id] = b.ordem; });
        state.items = state.items.map(item => ({
          ...item,
          ordem: orderMap[item.id] ?? item.ordem
        }));
        state.items.sort((a, b) => a.ordem - b.ordem);
      });
  }
});

export const { setBlocos, clearBlocos, localReorder } = blocosSlice.actions;
export const selectAllBlocos = (state) => state.blocos.items;
export const selectBlocosLoading = (state) => state.blocos.loading;
export default blocosSlice.reducer;
