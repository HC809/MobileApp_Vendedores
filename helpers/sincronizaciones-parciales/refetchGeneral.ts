//Actions
import { setVariables } from "../../store/actions/general";
//API
import api from "../../api/comercialLaRocaApi";

export const refetchGeneral = (idsucursal: number) => {
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
};

const fetchTipoVenta = (dispatch, idsucursal) => {
  return api.General.tiposDeVenta(idsucursal)
    .then((res) => {
      dispatch(setVariables({ tipoVenta: res }));
    })
};

const fetchFormaPago = (dispatch) => {
  return api.Facturacion.listaFormaPago()
    .then((res) => {
      dispatch(setVariables({ formaPago: res }));
    })
}

const fetchDias = (dispatch) => {
  return api.General.dias()
    .then((res) => {
      dispatch(setVariables({ dias: res }));
    })
}

const fetchMinAnulacionFactura = (dispatch) => {
  return api.General.minutosAnulacionFactura()
    .then((res) => {
      dispatch(setVariables({ minutosAnulacionFactura: res }));
    })
}