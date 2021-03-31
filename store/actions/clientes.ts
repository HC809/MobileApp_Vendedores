//Constants
import { CLIENTE } from "../../constants/Constants";
//Models
import { ICliente } from "../../models/Cliente/ICliente";

//CLIENTES
export const setClientes = (clientes: ICliente[]) => {
    return { type: CLIENTE, payload: clientes };
  };
  