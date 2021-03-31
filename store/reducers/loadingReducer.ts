import { CALCULANDO_PEDIDO, FACTURANDO } from '../../constants/Constants';

const initialState = {
    calculandoPedido: false,
    facturando: false,
    seleccionandoCliente: false
}

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case CALCULANDO_PEDIDO:
            return {
                ...state, calculandoPedido: action.payload
            }
        case FACTURANDO:
            return {
                ...state, facturando: action.payload
            }
            
        default:
            return state
    }
}

export default loadingReducer; 