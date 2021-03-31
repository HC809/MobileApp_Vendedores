//API
import api from "../api/comercialLaRocaApi";
//Otros
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
//Actions
import { setClientes } from "../store/actions/clientes";

export const fetchClientes = (idagente: number) => {
    return (dispatch) => {
        return api.Cliente.lista(idagente)
            .then((res) => {
                dispatch(setClientes(res));
            })
            .catch((err) => {
                let message = (err !== undefined) ?
                    `${JSON.stringify(err.data)}, status: ${err.status}` :
                    'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
                dispatch(setFetchSyncError('Clientes:', message));
                dispatch(setVariables({ estado: 0 }));
            }).finally(() => { dispatch(contadorFetchInicio()) })
    };
};
