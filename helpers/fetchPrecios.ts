//API
import api from "../api/comercialLaRocaApi";
//Actions
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
import { setPrecioPorClientes, setPrecioPorNivelTipoVenta, setNivelPrecioPredeterminado } from "../store/actions/precios";

export const fetchPrecios = (idRuta: number, idsucursal: number) => {
  return (dispatch) => {
    return Promise.all([
      fetchPrecioPorClientes(dispatch, idRuta),
      fetchPrecioPorNivelTipoVenta(dispatch, idsucursal),
      fetchNivelPrecioPredeterminado(dispatch, idsucursal)
    ])
  };
};

const fetchPrecioPorClientes = (dispatch, idRuta: number) => {
  return api.Precio.listaPrecioCliente(idRuta)
    .then((res) => {
      dispatch(setPrecioPorClientes(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Lista Precios Clientes:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchPrecioPorNivelTipoVenta = (dispatch, idsucursal: number) => {
  return api.Precio.listaPrecioPorNivelTipoVenta(idsucursal)
    .then((res) => {
      dispatch(setPrecioPorNivelTipoVenta(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Lista Precios:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchNivelPrecioPredeterminado = (dispatch, idsucursal: number) => {
  return api.Precio.nivelPrecioPredeterminado(idsucursal)
    .then((res) => {
      dispatch(setNivelPrecioPredeterminado(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Nivel Precio Predeterminado:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

