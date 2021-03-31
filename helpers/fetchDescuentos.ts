
//API
import api from "../api/comercialLaRocaApi";
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
import { setDescuentosPorEscala, setDescuentosPorTipoPago } from "../store/actions/descuentos";

export const fetchDescuentos = (idBodega: number) => {
  return (dispatch) => {
    return Promise.all([
      fetchDescuentosPorEscala(dispatch, idBodega),
      fetchDescuentosPorTipoPago(dispatch, idBodega)
    ]);
  };
}

const fetchDescuentosPorEscala = (dispatch, idBodega: number) => {
  return api.Descuentos.descuentosPorEscala(idBodega)
    .then((res) => {
      dispatch(setDescuentosPorEscala(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Descuentos por Escala:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
}


const fetchDescuentosPorTipoPago = (dispatch, idBodega: number) => {
  return api.Descuentos.descuentosPorTipoPago(idBodega)
    .then((res) => {
      dispatch(setDescuentosPorTipoPago(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Descuentos Tipo Venta', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
}
