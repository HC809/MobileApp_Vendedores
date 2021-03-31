//Models
import { IListaPrecioCliente, IPrecioPorNivelTipoVenta } from "../../models/Precio";
import { ISelectOption } from "../../models/common";
//Constants
import { PRECIO_CLIENTE, PRECIO_NIVEL_TIPOVENTA, NIVEL_PRECIO_PREDETERMINADO } from "../../constants/Constants";

export const setPrecioPorClientes = (clientes: IListaPrecioCliente[]) => {
  return { type: PRECIO_CLIENTE, payload: clientes };
};

export const setPrecioPorNivelTipoVenta = (payload: IPrecioPorNivelTipoVenta[]) => {
  return { type: PRECIO_NIVEL_TIPOVENTA, payload };
};

export const setNivelPrecioPredeterminado = (payload: ISelectOption) => {
  return { type: NIVEL_PRECIO_PREDETERMINADO, payload };
};