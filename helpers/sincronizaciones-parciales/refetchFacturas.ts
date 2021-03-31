//API
import api from "../../api/comercialLaRocaApi";
//Actions
import { setFacturasSaldoPendiente } from "../../store/actions/cobranza";

export const refetchFacturas = (idSucursal: number, idRuta: number) => {
    return (dispatch) => {
        return api.Facturacion.listaFacturasSaldoPendiente(idSucursal, idRuta)
            .then((res) => {
                dispatch(setFacturasSaldoPendiente(res));
            });
    };
};
