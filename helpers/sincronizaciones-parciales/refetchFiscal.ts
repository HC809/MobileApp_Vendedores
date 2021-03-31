
//Models
import { IInfoMain, IParamRegistroCai, } from "../../models/Fiscal";
//API
import api from "../../api/comercialLaRocaApi";
//Actions
import { setInfoMain, setRegistroCaiA, setRegistroCaiE } from "../../store/actions/fiscal";

export const refetchFiscal = (idagente: number) => {
    return (dispatch) => {
        return Promise.all([
            fetchInfo(dispatch, idagente)
        ])
    };
};

const fetchInfo = (dispatch, idagente: number) => {
    return api.Fiscal.info(idagente)
        .then((res: IInfoMain) => {
            dispatch(setInfoMain(res));

            let params: IParamRegistroCai = {
                idestablecimiento: res.idestablecimiento,
                idpuntoemision: res.idpuntoemision,
                idtipodocumento: res.idtipodocumento,
            };

            api.Fiscal.registroCaiActivo(params)
                .then((res) => {
                    dispatch(setRegistroCaiA(res));
                })

            api.Fiscal.registroCaiProceso(params)
                .then((res) => {
                    dispatch(setRegistroCaiE(res));
                })
        })
};
