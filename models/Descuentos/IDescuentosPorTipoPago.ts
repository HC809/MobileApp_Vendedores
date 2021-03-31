export interface IDescuentosPorTipoPago {
    idpromocion: number
    promocion: string;
    codigotipopromocion: string;
    tipopromocion: string;
    fechainicio: Date;
    fechafinal: Date
    idfactura: number
    idproducto: number
    idtipoventa: number,
    codigotipoventa: string,
    monto: number
}