interface IProducto{
    idproducto: number,
    codigoproducto: string,
    producto: string,
    precio: number,
    descuento: number,
    idgrupo: number,
    grupo?: string,
    idtipoproducto: number,
    porcentajeimpuesto?: number,
    idimpuesto : number,
    cantidadstock: number,
    cantidadpedido: number
}

