//Models
import { IFactura } from "../../models/Factura/IFactura"
//Constants
import { ADD_FACTURA, SET_FACTURA, ANULAR_FACTURA, UPDATE_FACTURA } from "../../constants/Constants"

export const addFactura = (fac: IFactura) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ADD_FACTURA,
                payload: fac
            });
            resolve();
        });
    };
};

export const anularFactura = (numerofactura: number) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: ANULAR_FACTURA,
                payload: numerofactura
            });
            resolve();
        });
    };
}

export const setFactura = (fac: IFactura[]) => {
    return {
        type: SET_FACTURA,
        payload: fac
    }
}

export const updateFactura = (correlativo: string, sync: boolean) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: UPDATE_FACTURA,
                payload: {
                    correlativo: correlativo,
                    sync: sync
                }
            });
            resolve();
        });
    };
}






