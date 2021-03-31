export interface IRegistroCai {
  numeroactual: number;
  fechainicioemision: Date;
  fechalimiteemision: Date;
  rangoinicial: number;
  rangofinal: number;
  idregistrocai: number;
  idcai: number;
  codigocai: string;
}

export interface IParamRegistroCai {
  idestablecimiento: number;
  idpuntoemision: number;
  idtipodocumento: number;
}

export interface IInfoMain {
  idruta: number;
  idpuntoemision: number;
  puntoemision: string;
  codigopuntoemision: string;
  idestablecimiento: number;
  establecimiento: string;
  codigoestablecimiento: string;
  idtipodocumento: number;
  codigotipodocumento: string;
  idtipodocumentorecibo: number;
  codigotipodocumentorecibo: string;
  idagentes: number;
}

export interface Param_Put_Registrocai{
  idregistrocai : number;
  numeroactual : number;
}
