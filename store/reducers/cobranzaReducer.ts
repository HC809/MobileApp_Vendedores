import { SET_FACTURAS_SALDO_PENDIENTE, ADD_ABONO, UPDATE_FACTURAS_SALDO_PENDIENTE, LIMPIAR_COBRANZA, UPDATE_SYNC_ABONO, LIMPIAR_FAC_SALDO_PENDIENTE } from '../../constants/Constants';

const initialState = {
    cobranza: [],
    abonos: []
};

const cobranzaReducer = (state = initialState, action) => {
    switch (action.type) {

        case SET_FACTURAS_SALDO_PENDIENTE:
            return {
                ...state,
                cobranza: action.payload
            }

        case UPDATE_FACTURAS_SALDO_PENDIENTE:

            state.cobranza.map(facCobranza => {
                action.payload.map(facAct => {
                    if (facCobranza.numerofactura === facAct.numeroFactura) {
                        facCobranza.pendiente = facAct.pendiente;
                        facCobranza.valorsaldofactura = facCobranza.valorsaldofactura - facAct.valorAbono;
                    }
                })
            });

            return { ...state }

        case ADD_ABONO:
            state.abonos = [...state.abonos, action.payload]

            return { ...state }

        case UPDATE_SYNC_ABONO:

            state.abonos.map(abono => {
                action.payload.map(abonoAct => {
                    if (abono.numeroFactura === abonoAct.numeroFactura
                        && abono.idCliente === abonoAct.idCliente
                        && abono.formaPago === abonoAct.idFormaPago
                        && abono.valorAbono === abonoAct.valorAbono) {
                        abono.sinc = true;
                    }
                })
            });

            return { ...state }

        case LIMPIAR_COBRANZA:
            return initialState;

        case LIMPIAR_FAC_SALDO_PENDIENTE:
            state.cobranza = [];

            return { ...state }

        default:
            return state;
    }
};

export default cobranzaReducer;