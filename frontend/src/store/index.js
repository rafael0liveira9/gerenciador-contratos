import { configureStore } from '@reduxjs/toolkit';
import empresaReducer from './empresaSlice';
import clausulasReducer from './clausulasSlice';
import cabecalhosReducer from './cabecalhosSlice';
import rodapesReducer from './rodapesSlice';
import templatesReducer from './templatesSlice';
import contratosReducer from './contratosSlice';
import variaveisReducer from './variaveisSlice';
import blocosReducer from './blocosSlice';

export const store = configureStore({
  reducer: {
    empresa: empresaReducer,
    clausulas: clausulasReducer,
    cabecalhos: cabecalhosReducer,
    rodapes: rodapesReducer,
    templates: templatesReducer,
    contratos: contratosReducer,
    variaveis: variaveisReducer,
    blocos: blocosReducer
  }
});

export default store;
