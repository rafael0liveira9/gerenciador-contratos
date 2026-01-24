import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:4002/api';

export const fetchBiblioteca = createAsyncThunk(
  'biblioteca/fetch',
  async ({ empresaId, search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ search, page, limit });
      const response = await fetch(`${API_URL}/biblioteca/${empresaId}?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar biblioteca');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoreBiblioteca = createAsyncThunk(
  'biblioteca/fetchMore',
  async ({ empresaId, search = '', page, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ search, page, limit });
      const response = await fetch(`${API_URL}/biblioteca/${empresaId}?${params}`);
      if (!response.ok) throw new Error('Erro ao buscar mais itens');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bibliotecaSlice = createSlice({
  name: 'biblioteca',
  initialState: {
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    searchTerm: '',
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasMore: false
    }
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearBiblioteca: (state) => {
      state.items = [];
      state.error = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasMore: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch inicial
      .addCase(fetchBiblioteca.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBiblioteca.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBiblioteca.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch mais itens (infinite scroll)
      .addCase(fetchMoreBiblioteca.pending, (state) => {
        state.loadingMore = true;
      })
      .addCase(fetchMoreBiblioteca.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.items = [...state.items, ...action.payload.items];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMoreBiblioteca.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload;
      });
  }
});

export const { setSearchTerm, clearBiblioteca } = bibliotecaSlice.actions;

export const selectBibliotecaItems = (state) => state.biblioteca.items;
export const selectBibliotecaLoading = (state) => state.biblioteca.loading;
export const selectBibliotecaLoadingMore = (state) => state.biblioteca.loadingMore;
export const selectBibliotecaSearchTerm = (state) => state.biblioteca.searchTerm;
export const selectBibliotecaPagination = (state) => state.biblioteca.pagination;

export default bibliotecaSlice.reducer;
