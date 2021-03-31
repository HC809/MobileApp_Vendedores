export interface IUsuario{
    user : string,
    roles : string[],
    info : InfoAgente
}

export interface InfoAgente{
    idagentes : number,
    codigoagentes : string,
    idsucursal : number,
    idtipoagente : number,
    idpuntoemision: number,
    cuentacontable : string,
    flagpos : boolean,
    pctgecomisventa : number,
    descripcioncorta : string,
    descripcionlarga : string,
    descTipoAgente : string,
    descSucursal : string,
    idruta: number,
    codigoruta: string,
    ruta: number,
    idbodega: number,
    bodega: string,
    tienenumeradorfactura: boolean,
    tienenumeradorrecibo: boolean
}