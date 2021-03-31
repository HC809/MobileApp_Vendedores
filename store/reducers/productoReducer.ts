import { PRODUCTO, GRUPO_PRODUCTO, SET_STOCK_PRODUCTO, ROLLBACK_STOCK_PRODUCTO } from '../../constants/Constants';

const initialState = {
    items: [],
    grupo: []
}

const productoReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCTO:
            return {
                ...state, items: action.payload
            }
        case GRUPO_PRODUCTO:
            return {
                ...state, grupo: action.payload
            }
        case SET_STOCK_PRODUCTO:

            if (action.payload.detallePedido.length > 0) {

                action.payload.detallePedido.map(detalleProd => {
                    state.items.map(prod => {
                        (prod.idproducto === detalleProd.idproducto)
                            ? prod.cantidadstock = (prod.cantidadstock - detalleProd.cantidad)
                            : prod;
                    });
                });

                return { ...state }
            }
            else
                return state;

        case ROLLBACK_STOCK_PRODUCTO:

            if (action.payload.detallePedido.length > 0) {

                action.payload.detallePedido.map(detalleProd => {
                    state.items.map(prod => {
                        (prod.idproducto === detalleProd.idproducto)
                            ? prod.cantidadstock = (prod.cantidadstock + detalleProd.cantidad)
                            : prod;
                    });
                });

                return { ...state }
            }
            else
                return state;
        default:
            return state
    }
}

export default productoReducer;