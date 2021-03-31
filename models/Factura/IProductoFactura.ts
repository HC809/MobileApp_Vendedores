interface IProductoFactura extends IProducto {
    cantidad: number,//
    impuesto: number,//
    subtotal: number,
    totalImpuesto: number,//
    totalDescuento: number,//
    total: number,
    descuentoPorEscala: number,
    descuentoPorTipoPago: number
}