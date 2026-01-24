import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:4002/api';

export const createPagina = createAsyncThunk(
  'paginas/create',
  async ({ templateId }) => {
    const response = await fetch(`${API_URL}/paginas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId })
    });
    if (!response.ok) throw new Error('Erro ao criar pagina');
    return response.json();
  }
);

export const updatePagina = createAsyncThunk(
  'paginas/update',
  async ({ id, conteudo }) => {
    const response = await fetch(`${API_URL}/paginas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conteudo })
    });
    if (!response.ok) throw new Error('Erro ao atualizar pagina');
    return response.json();
  }
);

export const deletePagina = createAsyncThunk(
  'paginas/delete',
  async (id) => {
    const response = await fetch(`${API_URL}/paginas/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir pagina');
    return id;
  }
);

const paginasSlice = createSlice({
  name: 'paginas',
  initialState: {
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPagina.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPagina.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPagina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePagina.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePagina.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePagina.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePagina.fulfilled, (state) => {
        state.loading = false;
      });
  }
});

export default paginasSlice.reducer;
