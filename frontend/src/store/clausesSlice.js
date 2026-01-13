import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clausesApi } from '../services/api';

export const fetchClauses = createAsyncThunk(
  'clauses/fetchAll',
  async (search) => {
    const response = await clausesApi.getAll(search);
    return response.data;
  }
);

export const createClause = createAsyncThunk(
  'clauses/create',
  async (data) => {
    const response = await clausesApi.create(data);
    return response.data;
  }
);

export const createClauseVersion = createAsyncThunk(
  'clauses/createVersion',
  async ({ id, data }) => {
    const response = await clausesApi.createVersion(id, data);
    return response.data;
  }
);

const clausesSlice = createSlice({
  name: 'clauses',
  initialState: {
    items: {},
    ids: [],
    loading: false,
    error: null,
    searchTerm: ''
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClauses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClauses.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload.map(c => c.id);
        state.items = action.payload.reduce((acc, clause) => {
          acc[clause.id] = clause;
          return acc;
        }, {});
      })
      .addCase(fetchClauses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createClause.fulfilled, (state, action) => {
        const clause = action.payload;
        state.items[clause.id] = clause;
        state.ids.unshift(clause.id);
      })
      .addCase(createClauseVersion.fulfilled, (state, action) => {
        const clause = action.payload;
        state.items[clause.id] = clause;
        state.ids.unshift(clause.id);
      });
  }
});

export const { setSearchTerm } = clausesSlice.actions;

export const selectAllClauses = (state) => state.clauses.ids.map(id => state.clauses.items[id]);
export const selectClauseById = (state, id) => state.clauses.items[id];
export const selectClausesLoading = (state) => state.clauses.loading;
export const selectSearchTerm = (state) => state.clauses.searchTerm;

export default clausesSlice.reducer;
