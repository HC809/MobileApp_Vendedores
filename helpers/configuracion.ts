import { CHANGE_THEME, USER_LOGOUT, STATE_PEDIDO_VACIO } from '../constants/Constants';

//Actions
import { setClientes } from '../store/actions/clientes';
import { setProductos, setGrupo } from '../store/actions/productos';
import { variablesReset, cleanFetchErrors } from '../store/actions/general';
import { fiscalReset } from '../store/actions/fiscal';
import { setPrecioPorClientes, setPrecioPorNivelTipoVenta, setNivelPrecioPredeterminado } from '../store/actions/precios';
import { setPedido } from '../store/actions/pedido';
import { setDescuentosPorEscala } from '../store/actions/descuentos';
import { limpiarCobranza, limpiarFacSaldoPendientes } from '../store/actions/cobranza';
import { setFactura } from '../store/actions/factura';

export const changeTheme = (theme: string) => {
    return { type: CHANGE_THEME, payload: theme }
}

export const logout = () => {
    return { type: USER_LOGOUT }
}

export const userLogout = (fac_abonos_pendientes: boolean) => {
    return (dispatch) => {
        dispatch(logout());
        LimpiarDatos(dispatch);
        //LimpiarDatosCerrarSesion(dispatch, fac_abonos_pendientes);
    }
}

export const cleanSyncInitData = () => {
    return (dispatch) => {
        LimpiarDatos(dispatch);
    }
}

export const LimpiarDatosCerrarSesion = (dispatch, fac_abonos_pendientes: boolean) => {
    fac_abonos_pendientes ? LimpiarDatosSinFacturasYAbonos(dispatch) : LimpiarDatos(dispatch);
    dispatch(cleanFetchErrors());
}

//Limpiar todo el store
//No hay facturas ni abonos pendientes de sync
export const LimpiarDatos = (dispatch) => {
    dispatch(setPedido(STATE_PEDIDO_VACIO))
    dispatch(setClientes([]))
    dispatch(setProductos([]))
    dispatch(setGrupo([]))
    dispatch(setPrecioPorClientes([]))
    dispatch(setPrecioPorNivelTipoVenta([]))
    dispatch(setNivelPrecioPredeterminado(null))
    dispatch(setDescuentosPorEscala([]))
    dispatch(variablesReset())
    dispatch(fiscalReset())
    dispatch(limpiarCobranza())
    dispatch(setFactura([]));
}

//***NO SE USA**
//Limpiar todo el store menos las facturas y abonos
//Posiblemnete hubieron errores en la sync y no se pueden borrar
export const LimpiarDatosSinFacturasYAbonos = (dispatch) => {
    dispatch(setPedido(STATE_PEDIDO_VACIO))
    dispatch(setClientes([]))
    dispatch(setProductos([]))
    dispatch(setGrupo([]))
    dispatch(setPrecioPorClientes([]))
    dispatch(setPrecioPorNivelTipoVenta([]))
    dispatch(setNivelPrecioPredeterminado(null))
    dispatch(setDescuentosPorEscala([]))
    dispatch(variablesReset())
    dispatch(fiscalReset())
    dispatch(limpiarFacSaldoPendientes())
}