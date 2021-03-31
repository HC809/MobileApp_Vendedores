export interface IAbonoHeaderCXC {
    idAbono: number;
    idSucursal: number;
    idEstablecimiento: number;
    idCliente: number;
    codigoCliente: string;
    nombreCliente: string;
    rtnCliente: string;
    idAgentes: number;
    idFormaPago: number;
    codigoPuntoEmision: string;
    idPuntoEmision: number;
    fechaAbono: Date;
    totalValorAbono: number;
    usuario: string;
    numeroChkTrj: string;
    numeroAutorizacion: string;
    detalleCxc: IAbonoDetalleCXC[],

    sinc: boolean;
    saldoPendiente: number;
}

export interface IAbonoDetalleCXC {
    numeroFactura: number;
    fechaAbono: Date;
    valorAbono: number;
    idTipoDocumento: number;//Factura
    idTipoDocumentoAbono: number;
    serie: number;
    pendiente: boolean;
}

export interface IAbonoPostResult {
    idAbono: number,
    idCliente: number;
    //idFormaPago: number;
    //numeroFactura: string;
    valorAbono: number;
    itSaved: boolean;
    errorMessage: string;
}