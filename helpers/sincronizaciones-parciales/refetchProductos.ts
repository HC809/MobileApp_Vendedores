//Actions
import { setProductos, setGrupo } from "../../store/actions/productos";
//API
import api from "../../api/comercialLaRocaApi";

export const refetchProductos = (idBodega: number) => {
    return (dispatch) => {
        return Promise.all([
            fetchLista(dispatch, idBodega),
            fetchGrupo(dispatch, idBodega)
        ])
    };
};

const fetchLista = (dispatch, idBodega) => {
    return api.Producto.lista(idBodega)
        .then((res) => {
            dispatch(setProductos(res));
        })
};

const fetchGrupo = (dispatch, idBodega) => {
    return api.Producto.grupo(idBodega)
        .then((res) => {
            dispatch(setGrupo(res));
        })
};
