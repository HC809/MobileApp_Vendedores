//Actions
import { setProductos, setGrupo } from "../store/actions/productos";
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
//API
import api from "../api/comercialLaRocaApi";

export const fetchProductos = (idBodega: number) => {
  return (dispatch) => {
    return Promise.all([fetchLista(dispatch, idBodega), fetchGrupo(dispatch, idBodega)])
  };
};

const fetchLista = (dispatch, idBodega) => {
  return api.Producto.lista(idBodega)
    .then((res) => {
      dispatch(setProductos(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Inventario:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchGrupo = (dispatch, idBodega) => {
  return api.Producto.grupo(idBodega)
    .then((res) => {
      dispatch(setGrupo(res));
    })
    .catch((err) => {
      let message = (err !== undefined) ?
        `${JSON.stringify(err.data)}, status: ${err.status}` :
        'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
      dispatch(setFetchSyncError('Grupos de Productos:', message));
      dispatch(setVariables({ estado: 0 }));
    }).finally(() => { dispatch(contadorFetchInicio()) });
};
