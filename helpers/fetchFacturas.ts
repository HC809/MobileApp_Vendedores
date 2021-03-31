//API
import api from "../api/comercialLaRocaApi";
//Actions
import { setFacturasSaldoPendiente } from "../store/actions/cobranza";
import { contadorFetchInicio, setFetchSyncError, setVariables } from "../store/actions/general";

export const fetchFacturas = (idSucursal: number, idRuta: number) => {
    return (dispatch) => {
        return api.Facturacion.listaFacturasSaldoPendiente(idSucursal, idRuta)
            .then((res) => {
                dispatch(setFacturasSaldoPendiente(res));
            })
            .catch((err) => {
                let message = (err !== undefined) ?
                    `${JSON.stringify(err.data)}, status: ${err.status}` :
                    'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
                dispatch(setFetchSyncError('Cobranza: ', message));
                dispatch(setVariables({ estado: 0 }));
            }).finally(() => { dispatch(contadorFetchInicio()) })
    };
};
