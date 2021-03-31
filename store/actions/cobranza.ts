import { SET_FACTURAS_SALDO_PENDIENTE, ADD_ABONO, UPDATE_FACTURAS_SALDO_PENDIENTE, LIMPIAR_COBRANZA, UPDATE_SYNC_ABONO, LIMPIAR_FAC_SALDO_PENDIENTE } from "../../constants/Constants"
import { IFacSaldoPendiente, } from "../../models/Factura/IFacSaldoPendiente"
import { IAbonoDetalleCXC, IAbonoHeaderCXC, IAbonoPostResult } from "../../models/Factura/IAbonoCXC"


export const setFacturasSaldoPendiente = (facturas: IFacSaldoPendiente[]) => {
    return {
        type: SET_FACTURAS_SALDO_PENDIENTE,
        payload: facturas
    }
}

export const actualizarFacturasPendiente = (detalleFacturas: IAbonoDetalleCXC[]) => {
    return {
        type: UPDATE_FACTURAS_SALDO_PENDIENTE,
        payload: detalleFacturas
    }
}

export const agregarAbono = (abono: IAbonoHeaderCXC) => {
    return {
        type: ADD_ABONO,
        payload: abono
    }
}

export const actualizarAbonoSync = (abonos: IAbonoPostResult[]) => {
    return {
        type: UPDATE_SYNC_ABONO,
        payload: abonos
    }
}

export const limpiarCobranza = () => {
    return {
        type: LIMPIAR_COBRANZA
    }
}

export const limpiarFacSaldoPendientes = () => {
    return {
        type: LIMPIAR_FAC_SALDO_PENDIENTE
    }
}