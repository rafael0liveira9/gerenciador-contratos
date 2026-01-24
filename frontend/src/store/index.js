import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import empresaReducer from './empresaSlice';
import clausulasReducer from './clausulasSlice';
import cabecalhosReducer from './cabecalhosSlice';
import rodapesReducer from './rodapesSlice';
import templatesReducer from './templatesSlice';
import contratosReducer from './contratosSlice';
import variaveisReducer from './variaveisSlice';
import blocosReducer from './blocosSlice';
import paginasReducer from './paginasSlice';
import bibliotecaReducer from './bibliotecaSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    empresa: empresaReducer,
    clausulas: clausulasReducer,
    cabecalhos: cabecalhosReducer,
    rodapes: rodapesReducer,
    templates: templatesReducer,
    contratos: contratosReducer,
    variaveis: variaveisReducer,
    blocos: blocosReducer,
    paginas: paginasReducer,
    biblioteca: bibliotecaReducer
  }
});

export default store;
