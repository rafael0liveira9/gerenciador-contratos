import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blocksApi } from '../services/api';
import { fetchContractById } from './contractsSlice';

export const addBlock = createAsyncThunk(
  'blocks/add',
  async ({ contractId, data }) => {
    const response = await blocksApi.add(contractId, data);
    return response.data;
  }
);

export const updateBlock = createAsyncThunk(
  'blocks/update',
  async ({ blockId, data }) => {
    const response = await blocksApi.update(blockId, data);
    return response.data;
  }
);

export const removeBlock = createAsyncThunk(
  'blocks/remove',
  async (blockId) => {
    await blocksApi.remove(blockId);
    return blockId;
  }
);

export const reorderBlocks = createAsyncThunk(
  'blocks/reorder',
  async ({ contractId, blocks }) => {
    const response = await blocksApi.reorder(contractId, blocks);
    return { contractId, blocks: response.data };
  }
);

const blocksSlice = createSlice({
  name: 'blocks',
  initialState: {
    items: {},
    byContract: {},
    loading: false,
    error: null,
    editingBlockId: null
  },
  reducers: {
    setEditingBlock: (state, action) => {
      state.editingBlockId = action.payload;
    },
    updateLocalBlockOrder: (state, action) => {
      const { contractId, blocks } = action.payload;
      state.byContract[contractId] = blocks.map(b => b.id);
      blocks.forEach(block => {
        if (state.items[block.id]) {
          state.items[block.id] = { ...state.items[block.id], order: block.order, level: block.level };
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractById.fulfilled, (state, action) => {
        const contract = action.payload;
        if (contract.blocks) {
          state.byContract[contract.id] = contract.blocks.map(b => b.id);
          contract.blocks.forEach(block => {
            state.items[block.id] = block;
          });
        }
      })
      .addCase(addBlock.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBlock.fulfilled, (state, action) => {
        state.loading = false;
        const block = action.payload;
        state.items[block.id] = block;
        if (!state.byContract[block.contractId]) {
          state.byContract[block.contractId] = [];
        }
        state.byContract[block.contractId].push(block.id);
        state.byContract[block.contractId].sort((a, b) =>
          state.items[a].order - state.items[b].order
        );
      })
      .addCase(updateBlock.fulfilled, (state, action) => {
        const block = action.payload;
        state.items[block.id] = block;
      })
      .addCase(removeBlock.fulfilled, (state, action) => {
        const blockId = action.payload;
        const block = state.items[blockId];
        if (block) {
          state.byContract[block.contractId] = state.byContract[block.contractId].filter(
            id => id !== blockId
          );
          delete state.items[blockId];
        }
      })
      .addCase(reorderBlocks.fulfilled, (state, action) => {
        const { contractId, blocks } = action.payload;
        state.byContract[contractId] = blocks.map(b => b.id);
        blocks.forEach(block => {
          state.items[block.id] = block;
        });
      });
  }
});

export const { setEditingBlock, updateLocalBlockOrder } = blocksSlice.actions;

export const selectBlocksByContract = (state, contractId) => {
  const ids = state.blocks.byContract[contractId] || [];
  return ids.map(id => state.blocks.items[id]).filter(Boolean);
};
export const selectBlockById = (state, id) => state.blocks.items[id];
export const selectEditingBlockId = (state) => state.blocks.editingBlockId;

export default blocksSlice.reducer;
