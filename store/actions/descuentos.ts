//Constants
import { DESCUENTOS_POR_ESCALA, DESCUENTOS_POR_TIPO_PAGO } from "../../constants/Constants";
//Models
import { IDescuentosPorEscala } from "../../models/Descuentos/IDescuentosPorEscala";
import { IDescuentosPorTipoPago } from "../../models/Descuentos/IDescuentosPorTipoPago";

export const setDescuentosPorEscala = (descuentos: IDescuentosPorEscala[]) => {
    return {
        type: DESCUENTOS_POR_ESCALA,
        payload: descuentos
    }
}

export const setDescuentosPorTipoPago = (descuentos: IDescuentosPorTipoPago[]) => {
    return {
        type: DESCUENTOS_POR_TIPO_PAGO,
        payload: descuentos
    }
}