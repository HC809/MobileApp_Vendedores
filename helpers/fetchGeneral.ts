//Actions
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
//API
import api from "../api/comercialLaRocaApi";

export const fetchGeneral = (idsucursal: number) => {
  return (dispatch) => {
    return Promise.all([
      fetchFacInfo(dispatch),
      fetchTipoVenta(dispatch, idsucursal),
      fetchFormaPago(dispatch),
      fetchDias(dispatch),
      fetchMinAnulacionFactura(dispatch)
    ])
  };
};

const fetchFacInfo = (dispatch) => {
  return api.General.facinfo()
    .then((res) => {
      dispatch(setVariables({ facinfo: res }));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('General (Inf. Factura):', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchTipoVenta = (dispatch, idsucursal) => {
  return api.General.tiposDeVenta(idsucursal)
    .then((res) => {
      dispatch(setVariables({ tipoVenta: res }));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('General (Tipos de Venta):', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchFormaPago = (dispatch) => {
  return api.Facturacion.listaFormaPago()
    .then((res) => {
      dispatch(setVariables({ formaPago: res }));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('General (Tipos de Pago):', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
}

const fetchDias = (dispatch) => {
  return api.General.dias()
    .then((res) => {
      dispatch(setVariables({ dias: res }));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('General (Días de Atención):', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
}

const fetchMinAnulacionFactura = (dispatch) => {
  return api.General.minutosAnulacionFactura()
    .then((res) => {
      dispatch(setVariables({ minutosAnulacionFactura: res }));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('General (Min. Anulación factura):', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
}