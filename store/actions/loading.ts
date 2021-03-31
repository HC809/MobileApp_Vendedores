//Constants
import { CALCULANDO_PEDIDO } from "../../constants/Constants";

//Calculando Pedido
export const setCanculandoPedido = (calculando: boolean) => {
    return { type: CALCULANDO_PEDIDO, payload: calculando }
}

