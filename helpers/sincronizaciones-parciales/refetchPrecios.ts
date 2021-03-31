//API
import api from "../../api/comercialLaRocaApi";
//Actions
import { setPrecioPorClientes, setPrecioPorNivelTipoVenta, setNivelPrecioPredeterminado } from "../../store/actions/precios";

export const refetchPrecios = (idRuta: number, idsucursal: number) => {
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
};

const fetchPrecioPorNivelTipoVenta = (dispatch, idsucursal: number) => {
  return api.Precio.listaPrecioPorNivelTipoVenta(idsucursal)
    .then((res) => {
      dispatch(setPrecioPorNivelTipoVenta(res));
    })
};

const fetchNivelPrecioPredeterminado = (dispatch, idsucursal: number) => {
  return api.Precio.nivelPrecioPredeterminado(idsucursal)
    .then((res) => {
      dispatch(setNivelPrecioPredeterminado(res));
    })
};

