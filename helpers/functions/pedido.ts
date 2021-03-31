import { ToNumber } from "./functions";

//Calcular subtotal
export const getSubtotal = (precio: number, cantidad: number) =>
  precio * cantidad;

//Calcular total impuesto
export const getTotalImpuesto = () => {};

//Incrementar la cantidad de un producto en pedido (Modal agregar producto / Producto cart item)
export const incrementarCantidadProducto = (
  producto: IProductoFactura,
  cantidad: number
) => {
  let nuevaCantidad = producto.cantidad + cantidad;

  let productoActualizado: IProductoFactura = {
    ...producto,
    cantidad: nuevaCantidad,
    subtotal: ToNumber(nuevaCantidad * producto.precio),
    totalDescuento: 0,
    totalImpuesto: ToNumber(
      (producto.porcentajeimpuesto / 100) * (nuevaCantidad * producto.precio)
    ),
    total: ToNumber(
      nuevaCantidad * producto.precio +
        (producto.porcentajeimpuesto / 100) *
          (nuevaCantidad * producto.precio) +
        producto.descuento * nuevaCantidad
    ),
  };

  return productoActualizado;
};

//Decrementar la cantidad de un producto en pedido (Producto cart item)
export const decrementarCantidadProducto = (
  producto: IProductoFactura,
  cantidad: number
) => {
  let nuevaCantidad = producto.cantidad - cantidad;

  let productoActualizado: IProductoFactura = {
    ...producto,
    cantidad: nuevaCantidad,
    subtotal: ToNumber(nuevaCantidad * producto.precio),
    totalDescuento: 0,
    totalImpuesto: ToNumber(
      (producto.porcentajeimpuesto / 100) * (nuevaCantidad * producto.precio)
    ),
    total: ToNumber(
      nuevaCantidad * producto.precio +
        (producto.porcentajeimpuesto / 100) *
          (nuevaCantidad * producto.precio) +
        producto.descuento * nuevaCantidad
    ),
  };

  return productoActualizado;
};

//Crear producto para agregar a pedido (Modal agregar producto)
export const nuevoProductoParaPedido = (
  producto: IProducto,
  precio: number,
  cantidad: number
) => {
  let nuevoProductoPedido: IProductoFactura = {
    idproducto: producto.idproducto,
    codigoproducto: producto.codigoproducto,
    producto: producto.producto,
    idgrupo: producto.idgrupo,
    idtipoproducto: producto.idtipoproducto,
    precio: precio,
    porcentajeimpuesto: producto.porcentajeimpuesto,
    impuesto: ToNumber((producto.porcentajeimpuesto / 100) * precio),
    descuento: ToNumber(producto.descuento),
    cantidad,
    idimpuesto: producto.idimpuesto,
    cantidadpedido: producto.cantidadpedido,
    cantidadstock: producto.cantidadstock,
    subtotal: ToNumber(precio * cantidad),
    totalDescuento: 0,
    totalImpuesto:
      ToNumber((cantidad * precio) * (producto.porcentajeimpuesto / 100)),
    total: ToNumber(
      precio * cantidad +
        (producto.porcentajeimpuesto / 100) * (cantidad * precio)
    ),
    descuentoPorEscala: 0,
    descuentoPorTipoPago: 0,
  };

  return nuevoProductoPedido;
};
