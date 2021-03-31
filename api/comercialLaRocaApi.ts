import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
//Models
import { IUsuarioLogin } from '../models/Usuario/IUsuarioLogin';
import { ISelectOption, IFacInfo } from '../models/common';
import { IListaPrecioCliente, IPrecioPorNivelTipoVenta } from '../models/Precio';
import { IParamRegistroCai, IRegistroCai, IInfoMain } from '../models/Fiscal';
import { IFacturaPost } from '../models/Factura/IFacturaPost';
import { ICliente } from '../models/Cliente/ICliente';
import { IDescuentosPorEscala } from '../models/Descuentos/IDescuentosPorEscala';
import { IDescuentosPorTipoPago } from '../models/Descuentos/IDescuentosPorTipoPago';
import { ITipoVenta } from '../models/General/general';
import { IFacturaPostResult } from '../models/Factura/IFacturaPostResult';
import { IFacSaldoPendiente } from '../models/Factura/IFacSaldoPendiente';
import { IAbonoPostResult, IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';

//URL AP
axios.defaults.baseURL = 'https://comerciallaroca-apimovil.azurewebsites.net/api';
//axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.request.use(
    async function (config) {
        let token = await AsyncStorage.getItem("token");
        if (token != null) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (err) {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(undefined, error => {
    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
}

//USUARIO (AGENTE)
const Usuario = {
    login: (usuario: string, password: string): Promise<any> => requests.get(`/auth/login/${usuario}/${password}`),
}

//CLIENTE
const Cliente = {
    //Lista de Clientes por Ruta del Agente
    lista: (idagente: number): Promise<ICliente[]> => requests.get(`ClnClientes/${idagente}`),
}

//PRODUCTO
const Producto = {
    //Lista de Productos en existencia por Bodega
    lista: (idBodega: number): Promise<IProducto[]> => requests.get(`Inventario/productosexistencia/${idBodega}`),
    //Lista de Grupos de Productos en existencia por Bodega
    grupo: (idBodega: number): Promise<ISelectOption[]> => requests.get(`Inventario/gruposexistencia/${idBodega}`)
}

//PRECIOS
const Precio = {
    //Lista de precios de productos por nivel y tipo de venta
    listaPrecioPorNivelTipoVenta: (idsucursal: number): Promise<IPrecioPorNivelTipoVenta[]> => requests.get(`Precio/ListaPrecioPorNivelTipoVenta/${idsucursal}`),
    //Lista de niveles asignados a los clientes por grupo de productos
    listaPrecioCliente: (idRuta: number): Promise<IListaPrecioCliente[]> => requests.get(`Precio/ListaNivelesPrecioClientes/${idRuta}`),
    //Nivel de precio predeterminado
    nivelPrecioPredeterminado: (idsucursal: number): Promise<ISelectOption> => requests.get(`Precio/NivelPrecioPredeterminado/${idsucursal}`),
}

//DESCUENTOS/PROMOCIONES
const Descuentos = {
    //Descuentos por Escala (Bonificaciones, Monto Fijo, Porcentaje)
    descuentosPorEscala: (idBodega: number): Promise<IDescuentosPorEscala[]> => requests.get(`Descuentos/GetDescuentosPorEscala/${idBodega}`),
    descuentosPorTipoPago: (idBodega: number): Promise<IDescuentosPorTipoPago[]> => requests.get(`Descuentos/GetDescuentosPorTipoVenta/${idBodega}`),
}

//GENERAL
const General = {
    //Informacion para Factura
    facinfo: (): Promise<IFacInfo> => requests.get(`General/FacInfo`),
    //Dias de atencion
    dias: (): Promise<ISelectOption[]> => requests.get(`General/Dias`),
    //Tipos de Venta
    tiposDeVenta: (idsucursal: number): Promise<ITipoVenta[]> => requests.get(`General/TipoVenta/${idsucursal}`),
    //Minutos autorizados para poder anular una factura
    minutosAnulacionFactura: (): Promise<number> => requests.get('Facturacion/MinutosAnulacionFactura'),
}

//FACTURACION
const Facturacion = {
    //Formas de Pago
    listaFormaPago: (): Promise<ISelectOption[]> => requests.get(`Facturacion/FormaPago`),
    //Guardar Facturas
    guardarfacturas: (body: IFacturaPost[]): Promise<IFacturaPostResult[]> => requests.post(`Facturacion/GuardarFacturas`, body),
    //Guardar Facturas
    guardarAbonos: (body: IAbonoHeaderCXC[]): Promise<IAbonoPostResult[]> => requests.post(`Facturacion/GuardarAbonos`, body),
    //Facturas con Saldo Pendiente (cobranza)
    listaFacturasSaldoPendiente: (idSucursal: number, idRuta: number): Promise<IFacSaldoPendiente[]> => requests.get(`Facturacion/FacturasSaldoPendiente/${idSucursal}/${idRuta}`),
}

//INF FISCAL
const Fiscal = {
    registroCaiActivo: (body: IParamRegistroCai): Promise<IRegistroCai> => requests.post(`Fiscal/getregistrocai/activo`, body),
    registroCaiProceso: (body: IParamRegistroCai): Promise<IRegistroCai> => requests.post(`Fiscal/getregistrocai/enpreparacion`, body),
    info: (idagente: number): Promise<IInfoMain> => requests.get(`Fiscal/info/${idagente}`),
    //actualizarNumerador: (body: Param_Put_Registrocai[]): Promise<any> => requests.put(`Fiscal/registroCai`, body),
}

export default {
    Usuario,
    Cliente,
    Producto,
    General,
    Facturacion,
    Precio,
    Fiscal,
    Descuentos
}