import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchEmpresaBySlug = createAsyncThunk(
  'empresa/fetchBySlug',
  async (slug) => {
    const response = await fetch(`${API_URL}/empresas/slug/${slug}`);
    if (!response.ok) throw new Error('Empresa nao encontrada');
    return response.json();
  }
);

const empresaSlice = createSlice({
  name: 'empresa',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearEmpresa: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpresaBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmpresaBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmpresaBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearEmpresa } = empresaSlice.actions;
export const selectEmpresa = (state) => state.empresa.data;
export const selectEmpresaLoading = (state) => state.empresa.loading;
export const selectEmpresaError = (state) => state.empresa.error;
export default empresaSlice.reducer;
