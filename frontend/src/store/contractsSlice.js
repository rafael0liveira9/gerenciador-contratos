import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractsApi } from '../services/api';

export const fetchContracts = createAsyncThunk(
  'contracts/fetchAll',
  async () => {
    const response = await contractsApi.getAll();
    return response.data;
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchById',
  async (id) => {
    const response = await contractsApi.getById(id);
    return response.data;
  }
);

export const createContract = createAsyncThunk(
  'contracts/create',
  async (data) => {
    const response = await contractsApi.create(data);
    return response.data;
  }
);

export const updateContract = createAsyncThunk(
  'contracts/update',
  async ({ id, data }) => {
    const response = await contractsApi.update(id, data);
    return response.data;
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/delete',
  async (id) => {
    await contractsApi.delete(id);
    return id;
  }
);

const contractsSlice = createSlice({
  name: 'contracts',
  initialState: {
    items: {},
    ids: [],
    currentId: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentContract: (state, action) => {
      state.currentId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = action.payload.map(c => c.id);
        state.items = action.payload.reduce((acc, contract) => {
          acc[contract.id] = contract;
          return acc;
        }, {});
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchContractById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.loading = false;
        const contract = action.payload;
        state.items[contract.id] = contract;
        state.currentId = contract.id;
        if (!state.ids.includes(contract.id)) {
          state.ids.push(contract.id);
        }
      })
      .addCase(createContract.fulfilled, (state, action) => {
        const contract = action.payload;
        state.items[contract.id] = contract;
        state.ids.unshift(contract.id);
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        const contract = action.payload;
        state.items[contract.id] = { ...state.items[contract.id], ...contract };
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.items[id];
        state.ids = state.ids.filter(i => i !== id);
        if (state.currentId === id) {
          state.currentId = null;
        }
      });
  }
});

export const { setCurrentContract } = contractsSlice.actions;

export const selectAllContracts = (state) => state.contracts.ids.map(id => state.contracts.items[id]);
export const selectCurrentContract = (state) =>
  state.contracts.currentId ? state.contracts.items[state.contracts.currentId] : null;
export const selectContractsLoading = (state) => state.contracts.loading;

export default contractsSlice.reducer;
