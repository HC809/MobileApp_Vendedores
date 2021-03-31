export interface IPedidoSinDetalle {
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    idtipoventa: number;
    codigoTipoVenta: string;
    idformapago: number;
    aplicarDesPorcentaje: boolean;
    aplicarDesPorTipoPago: boolean;
    importeExento: number;
    importeGravado15: number;
    importeGravado18: number;
    totalImporte: number;
    finalizado: boolean
}

export interface IPedido extends IPedidoSinDetalle {
    detalle: IProductoFactura[];
}

