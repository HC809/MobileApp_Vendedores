//Constants
import { PRODUCTO, GRUPO_PRODUCTO, SET_STOCK_PRODUCTO, ROLLBACK_STOCK_PRODUCTO } from "../../constants/Constants";
//Models
import { ISelectOption } from "../../models/common";

export const setProductos = (productos: IProducto[]) => {
    return {
        type: PRODUCTO,
        payload: productos
    };
};

export const setGrupo = (payload: ISelectOption[]) => {
    return {
        type: GRUPO_PRODUCTO,
        payload
    };
};

//Facturar pedido (reducir cantidad en stock de los productos)
export const setStockProducto = (payload) => {
    return {
        type: SET_STOCK_PRODUCTO,
        payload
    };
}

//Anular factura (aumentar cantidad en stock de los productos)
export const rollbackStockProducto = (payload) => {
    return {
        type: ROLLBACK_STOCK_PRODUCTO,
        payload
    };
}

