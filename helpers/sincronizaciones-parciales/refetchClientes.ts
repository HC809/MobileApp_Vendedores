//API
import api from "../../api/comercialLaRocaApi";
//Actions
import { setClientes } from "../../store/actions/clientes";

export const refetchClientes = (idagente: number) => {
    return (dispatch) => {
        return api.Cliente.lista(idagente)
            .then((res) => {
                dispatch(setClientes(res));
            })
    };
};
