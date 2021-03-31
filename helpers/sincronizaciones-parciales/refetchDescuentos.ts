//API
import api from "../../api/comercialLaRocaApi";
import { setDescuentosPorEscala, setDescuentosPorTipoPago } from "../../store/actions/descuentos";

export const refetchDescuentos = (idBodega: number) => {
    return (dispatch) => {
        return Promise.all([
            fetchDescuentosPorEscala(dispatch, idBodega),
            fetchDescuentosPorTipoPago(dispatch, idBodega)
        ])
    };
}

const fetchDescuentosPorEscala = (dispatch, idBodega: number) => {
    return api.Descuentos.descuentosPorEscala(idBodega)
        .then((res) => {
            dispatch(setDescuentosPorEscala(res));
        })
}


const fetchDescuentosPorTipoPago = (dispatch, idBodega: number) => {
    return api.Descuentos.descuentosPorTipoPago(idBodega)
        .then((res) => {
            dispatch(setDescuentosPorTipoPago(res));
        })
}
