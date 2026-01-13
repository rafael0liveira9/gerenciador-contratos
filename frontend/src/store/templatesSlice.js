import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchTemplates = createAsyncThunk(
  'templates/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/templates/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar templates');
    return response.json();
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchById',
  async (id) => {
    const response = await fetch(`${API_URL}/templates/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar template');
    return response.json();
  }
);

export const createTemplate = createAsyncThunk(
  'templates/create',
  async ({ empresaId, nome, descricao }) => {
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, nome, descricao })
    });
    if (!response.ok) throw new Error('Erro ao criar template');
    return response.json();
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/update',
  async ({ id, nome, descricao }) => {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao })
    });
    if (!response.ok) throw new Error('Erro ao atualizar template');
    return response.json();
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/delete',
  async (id) => {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao excluir template');
    return id;
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    items: [],
    current: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentTemplate: (state, action) => {
      state.current = action.payload;
    },
    clearCurrentTemplate: (state) => {
      state.current = null;
    },
    clearTemplates: (state) => {
      state.items = [];
      state.current = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.current?.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
        if (state.current?.id === action.payload) {
          state.current = null;
        }
      });
  }
});

export const { setCurrentTemplate, clearCurrentTemplate, clearTemplates } = templatesSlice.actions;
export const selectAllTemplates = (state) => state.templates.items;
export const selectCurrentTemplate = (state) => state.templates.current;
export const selectTemplatesLoading = (state) => state.templates.loading;
export default templatesSlice.reducer;
