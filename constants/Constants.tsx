import { IPedido } from "../models/Factura/IPedido";

//#region user
export const USER_LOGIN = "USER_LOGIN"
export const USER_LOGOUT = "USER_LOGOUT"
//#endregion

//#region temas 
export const CHANGE_THEME = "CHANGE_THEME";
export const THEME_LIGHT = "LIGHT";
export const THEME_DARK = "DARK";
//#endregion

//#region bd
export const CLIENTE = "CLIENTES";
export const PRODUCTO = "PRODUCTOS";
export const GRUPO_PRODUCTO = "GRUPO_PRODUCTO";
export const PRECIO_CLIENTE = "PRECIO_CLIENTE";
export const PRECIO_NIVEL_TIPOVENTA = "PRECIO_NIVEL_TIPOVENTA";
export const NIVEL_PRECIO_PREDETERMINADO = "NIVEL_PRECIO_PREDETERMINADO";
export const DESCUENTOS_POR_ESCALA = "DESCUENTOS_POR_ESCALA";
export const DESCUENTOS_POR_TIPO_PAGO = "DESCUENTOS_POR_TIPO_PAGO";
//#endregion

//#region pedido 
export const PEDIDO = "PEDIDO";
export const AGREGAR_PEDIDO_PRODUCTO = "AGREGAR_PEDIDO_PRODUCTO";
export const ACTUALIZAR_PRODUCTO_PEDIDO = "ACTUALIZAR_PRODUCTO_PEDIDO";
export const SET_PEDIDO_PRODUCTOS = "SET_PEDIDO_PRODUCTOS";
export const STATE_PEDIDO_VACIO: IPedido = {
    subtotal: 0.00,
    descuento: 0.00,
    impuesto: 0.00,
    total: 0.00,
    idtipoventa: 0,
    codigoTipoVenta: "",
    idformapago: 0,
    detalle: [],
    aplicarDesPorcentaje: false,
    aplicarDesPorTipoPago: false,
    importeExento: 0,
    importeGravado15: 0,
    importeGravado18: 0,
    totalImporte: 0,
    finalizado: false
}
export const CALCULAR_TOTAL_PEDIDO = "CALCULAR_TOTAL_PEDIDO";
export const SET_STOCK_PRODUCTO = "SET_STOCK_PRODUCTO";
export const ROLLBACK_STOCK_PRODUCTO = "ROLLBACK_STOCK_PRODUCTO";
export const APLICAR_DESCUENTOS_POR_ESCALA = "APLICAR_DESCUENTOS_POR_ESCALA";
export const ROLLBACK_DESCUENTOS_POR_ESCALA = "ROLLBACK_DESCUENTOS_POR_ESCALA";
export const APLICAR_DESCUENTOS_POR_TIPO_PAGO = "APLICAR_DESCUENTOS_POR_TIPO_PAGO";
export const ROLLBACK_DESCUENTOS_TIPO_PAGO = "ROLLBACK_DESCUENTOS_TIPO_PAGO";
export const FINALIZAR_PEDIDO = "FINALIZAR_PEDIDO"
//#endregion

//#region facturas
export const ADD_FACTURA = "ADD_FACTURA";
export const SET_FACTURA = "SET_FACTURA";
export const SET_DET_FACTURA = "SET_DET_FACTURA";
export const ANULAR_FACTURA = "ANULAR_FACTURA";
export const UPDATE_FACTURA = "UPDATE_FACTURA";
//#endregion

//#region cobranza
export const SET_FACTURAS_SALDO_PENDIENTE = "SET_FACTURAS_SALDO_PENDIENTE";
export const UPDATE_FACTURAS_SALDO_PENDIENTE = "UPDATE_FACTURAS_SALDO_PENDIENTE";
export const ADD_ABONO = "ADD_ABONO";
export const UPDATE_SYNC_ABONO = "UPDATE_SYNC_ABONO";
export const LIMPIAR_COBRANZA = "LIMPIAR_COBRANZA";
export const LIMPIAR_FAC_SALDO_PENDIENTE = "LIMPIAR_FAC_SALDO_PENDIENTE";
//#endregion

//#region variables 
export const VARIABLES = "VARIABLES";
export const VARIABLES_RESET = "VARIABLES_RESET";
export const CONT_FETCH_INICIO = "CONT_FETCH_INICIO";
export const SET_FETCH_ERROR = "SET_FETCH_ERROR";
export const CLEAN_FETCH_ERRORS = "CLEAN_FETCH_ERRORS";
export const VARIABLES_INITIAL = { ultimaFactura: 0, estado: 0, CONT_FETCH_INICIO: 0, fetchErrors: [] };
//#endregion

//#region variables
export const INFO_MAIN = "INFO_MAIN";
export const REGISTRO_CAI_A = "REGISTRO_CAI_A";
export const REGISTRO_CAI_E = "REGISTRO_CAI_E";
export const UREGISTRO_CAI_A = "UREGISTRO_CAI_A";
export const UREGISTRO_CAI_E = "UREGISTRO_CAI_E";
export const REGISTRO_CAI_R = "REGISTRO_CAI_R";
export const UREGISTRO_CAI_R = "UREGISTRO_CAI_R";
export const FISCAL_RESET = "FISCAL_RESET"
//#endregion

//#region impresora
export const SET_ESTADO_IMPRESORA = "SET_ESTADO_IMPRESORA";
//#endregion

//#loading
export const CALCULANDO_PEDIDO = "CALCULANDO_PEDIDO";
export const FACTURANDO = "FACTURANDO";
export const SELECCIONANDO_CLIENTE = "SELECCIONANDO_CLIENTE";
//#endloading