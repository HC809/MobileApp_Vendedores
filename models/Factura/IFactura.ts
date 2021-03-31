import { IPedido, IPedidoSinDetalle } from "./IPedido";

interface IFacturaMain {
    idcliente: number;//
    nombrecliente: string;//
    codigocliente: string;//
    rtncliente: string;//
    fechacreacion: Date;//
    numerofactura: number;//
    idregistrocai: number;//
    faccorrelativo: string;//
    sinc: boolean;
    anulado: string;//
    idsucursal: number;//
    idbodega: number;//

    codigoPuntoEmision: string;
}

export interface IFactura extends IPedido, IFacturaMain {
}

export interface IFacturaSinDetalle extends IPedidoSinDetalle, IFacturaMain {
}

