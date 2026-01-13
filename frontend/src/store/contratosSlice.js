import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3001/api';

export const fetchContratos = createAsyncThunk(
  'contratos/fetchByEmpresa',
  async (empresaId) => {
    const response = await fetch(`${API_URL}/contratos/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Erro ao buscar contratos');
    return response.json();
  }
);

export const createContrato = createAsyncThunk(
  'contratos/create',
  async ({ empresaId, templateId, conteudo }) => {
    const response = await fetch(`${API_URL}/contratos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ empresaId, templateId, conteudo })
    });
    if (!response.ok) throw new Error('Erro ao criar contrato');
    return response.json();
  }
);

export const updateContrato = createAsyncThunk(
  'contratos/update',
  async ({ id, conteudo }) => {
    const response = await fetch(`${API_URL}/contratos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conteudo })
    });
    if (!response.ok) throw new Error('Erro ao atualizar contrato');
    return response.json();
  }
);

export const assinarContrato = createAsyncThunk(
  'contratos/assinar',
  async (id) => {
    const response = await fetch(`${API_URL}/contratos/${id}/assinar`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Erro ao assinar contrato');
    return response.json();
  }
);

export const concluirContrato = createAsyncThunk(
  'contratos/concluir',
  async (id) => {
    const response = await fetch(`${API_URL}/contratos/${id}/concluir`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Erro ao concluir contrato');
    return response.json();
  }
);

export const cancelarContrato = createAsyncThunk(
  'contratos/cancelar',
  async (id) => {
    const response = await fetch(`${API_URL}/contratos/${id}/cancelar`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Erro ao cancelar contrato');
    return response.json();
  }
);

const contratosSlice = createSlice({
  name: 'contratos',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearContratos: (state) => {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContratos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContratos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContratos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createContrato.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateContrato.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(assinarContrato.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(concluirContrato.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(cancelarContrato.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { clearContratos } = contratosSlice.actions;
export const selectAllContratos = (state) => state.contratos.items;
export const selectContratosLoading = (state) => state.contratos.loading;
export default contratosSlice.reducer;
