export interface IDescuentosPorEscala {
    idpromocion: number
    promocion: string;
    codigotipopromocion: string;
    tipopromocion: string;
    fechainicio: Date;
    fechafinal: Date
    idfactura: number
    idproducto: number
    rangoinicial: number,
    rangofinal: number,
    monto: number
}