import { IFactura, IFacturaSinDetalle } from "../../models/Factura/IFactura";
import { IFacturaPost } from "../../models/Factura/IFacturaPost";

export const facturaPost = (factura: IFactura, idagente: number) => {
    let facturaPost: IFacturaPost;

    const { detalle, ...rest } = factura;
    let encabezadoFactura: IFacturaSinDetalle = rest;
    let detalleFactura: IProductoFactura[] = detalle;

    facturaPost = { encabezadoFactura, detalleFactura, idagente };

    return facturaPost;
}