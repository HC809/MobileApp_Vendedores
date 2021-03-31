import {combineReducers} from 'redux';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

//Reducers
import themeReducer from './themeReducer';
import userReducer from './userReducer';
import clienteReducer from './clienteReducer';
import productoReducer from './productoReducer';
import pedidoReducer from './pedidoReducer';
import facturaReducer from './facturaReducer';
import variablesReducer from './variablesReducer';
import precioReducer from './precioReducer';
import fiscalReducer from './fiscalReducer';
import descuentosReducer from './descuentosReducer';
import cobranzaReducer from './cobranzaReducer';
import loadingReducer from './loadingReducer';

import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'user',
    blacklist: ['pedido'],
    storage: AsyncStorage
  }

const bd = combineReducers({
  cliente : clienteReducer,
  producto : productoReducer,
  precio : precioReducer,
  descuentos : descuentosReducer
})

const rootReducer = combineReducers({
    theme: themeReducer,
    user : userReducer,
    bd : bd,
    pedido : pedidoReducer,
    cobranza: cobranzaReducer,
    factura : facturaReducer,
    variables : variablesReducer,
    fiscal : fiscalReducer,
    loading: loadingReducer,
})


export default persistReducer(persistConfig, rootReducer)