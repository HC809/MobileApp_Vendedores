import { IFacturaSinDetalle } from "./IFactura";
import { Param_Put_Registrocai } from "../Fiscal";

export interface IFacturaPost{
    idagente : number;
    encabezadoFactura : IFacturaSinDetalle;
    detalleFactura : IProductoFactura[];
}