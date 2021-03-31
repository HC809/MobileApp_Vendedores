
//Models
import { IInfoMain, IParamRegistroCai, } from "../models/Fiscal";
//API
import api from "../api/comercialLaRocaApi";
//Actions
import { setVariables, contadorFetchInicio, setFetchSyncError } from "../store/actions/general";
import { setInfoMain, setRegistroCaiA, setRegistroCaiE, setRegistroCaiRecibo } from "../store/actions/fiscal";

export const fetchFiscal = (idagente: number) => {
    return (dispatch) => {
        return Promise.all([fetchInfo(dispatch, idagente)])
    };
};

const fetchInfo = (dispatch, idagente: number) => {
    return api.Fiscal.info(idagente)
        .then((res: IInfoMain) => {
            dispatch(setInfoMain(res));

            let paramsRegistroCaiFactura: IParamRegistroCai = {
                idestablecimiento: res.idestablecimiento,
                idpuntoemision: res.idpuntoemision,
                idtipodocumento: res.idtipodocumento,
            };

            let paramsRegistroCaiRecibo: IParamRegistroCai = {
                idestablecimiento: res.idestablecimiento,
                idpuntoemision: res.idpuntoemision,
                idtipodocumento: res.idtipodocumentorecibo,
            };

            return Promise.all([
                fetchRegistroCaiActivo(dispatch, paramsRegistroCaiFactura),
                fetchRegistroCaiEnProceso(dispatch, paramsRegistroCaiFactura),
                fetchRegistroCaiRecibo(dispatch, paramsRegistroCaiRecibo)
            ]);
        })
        .catch((err) => {
            let message = (err !== undefined) ?
                `${JSON.stringify(err.data)}, status: ${err.status}` :
                'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
            dispatch(setFetchSyncError('Inf. Fiscal: ', message));
            dispatch(setVariables({ estado: 0 }));
            dispatch(contadorFetchInicio());
            dispatch(contadorFetchInicio());
            dispatch(contadorFetchInicio());
        }).finally(() => { dispatch(contadorFetchInicio()) });
};

const fetchRegistroCaiActivo = (dispatch, params: IParamRegistroCai) => {
    return api.Fiscal.registroCaiActivo(params)
        .then((res) => {
            dispatch(setRegistroCaiA(res));
        })
        .catch((err) => {
            let message = (err !== undefined) ?
                `${JSON.stringify(err.data)}, status: ${err.status}` :
                'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
            dispatch(setFetchSyncError('Fiscal (Registro CAI Facturas En Uso):', message));
            dispatch(setVariables({ estado: 0 }));
        }).finally(() => { dispatch(contadorFetchInicio()) });
}

const fetchRegistroCaiEnProceso = (dispatch, params: IParamRegistroCai) => {
    return api.Fiscal.registroCaiProceso(params)
        .then((res) => {
            dispatch(setRegistroCaiE(res));
        })
        .catch((err) => {
            let message = (err !== undefined) ?
                `${JSON.stringify(err.data)}, status: ${err.status}` :
                'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
            dispatch(setFetchSyncError('Fiscal (Registro CAI Facturas en Espera):', message));
            dispatch(setVariables({ estado: 0 }));
        }).finally(() => { dispatch(contadorFetchInicio()) });
}

const fetchRegistroCaiRecibo = (dispatch, params: IParamRegistroCai) => {
    return api.Fiscal.registroCaiActivo(params)
        .then((res) => {
            dispatch(setRegistroCaiRecibo(res));
        })
        .catch((err) => {
            let message = (err !== undefined) ?
                `${JSON.stringify(err.data)}, status: ${err.status}` :
                'Posible error de conexión. Verifique su conexión a intenet o comuníquese con un administrador para verificar la conexión del API.';
            dispatch(setFetchSyncError('Fiscal (Registro CAI Recibos):', message));
            dispatch(setVariables({ estado: 0 }));
        }).finally(() => { dispatch(contadorFetchInicio()) });
}
