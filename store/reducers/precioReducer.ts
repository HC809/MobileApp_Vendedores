import { PRECIO_NIVEL_TIPOVENTA, PRECIO_CLIENTE, NIVEL_PRECIO_PREDETERMINADO } from '../../constants/Constants';

const initialState = {
    cliente: [],
    items: [],
    nivelPredeterminado: 0
};

const precioReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRECIO_CLIENTE:
            return {
                ...state, cliente: action.payload
            }
        case PRECIO_NIVEL_TIPOVENTA:
            return {
                ...state, items: action.payload
            }
        case NIVEL_PRECIO_PREDETERMINADO:
            return {
                ...state, nivelPredeterminado: action.payload
            }
        default:
            return state
    }
}

export default precioReducer;