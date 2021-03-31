import { DESCUENTOS_POR_ESCALA, DESCUENTOS_POR_TIPO_PAGO } from "../../constants/Constants";

const initialState = {
    descuentosPorEscala: [],
    descuentosPorTipoPago: []
};

const descuentosReducer = (state = initialState, action) => {
    switch (action.type) {

        case DESCUENTOS_POR_ESCALA:
            return {
                ...state,
                descuentosPorEscala: action.payload,
            }

            case DESCUENTOS_POR_TIPO_PAGO:
                return {
                    ...state,
                    descuentosPorTipoPago: action.payload,
                }

        default:
            return state;
    }
};

export default descuentosReducer;