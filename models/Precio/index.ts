export interface IListaPrecioCliente {
    idcliente: number,
    idgrupo: number,
    idnivelprecio: number,
    nivelprecio: string
}

export interface IPrecioPorNivelTipoVenta {
    idproducto: number,
    precio: number,
    idnivelprecio: number,
    idtipoventa: number,
    codigotipoventa: string,
    nivelprecio: string,
    tipoventa: string
}
