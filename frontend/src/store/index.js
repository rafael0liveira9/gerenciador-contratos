import { configureStore } from '@reduxjs/toolkit';
import clausesReducer from './clausesSlice';
import contractsReducer from './contractsSlice';
import blocksReducer from './blocksSlice';

export const store = configureStore({
  reducer: {
    clauses: clausesReducer,
    contracts: contractsReducer,
    blocks: blocksReducer
  }
});

export default store;
