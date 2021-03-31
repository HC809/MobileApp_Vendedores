export interface IFacSaldoPendiente {
    idcliente: number;
    numerofactura: number;
    fechafactura: Date;
    fechavencimiento: Date;
    valortotalfactura: number;
    valorsaldofactura: number;
    idtipodocumento: number;
    serie: number;
    pendiente: boolean;
}
