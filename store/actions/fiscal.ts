//Models
import { IInfoMain, IRegistroCai } from "../../models/Fiscal";
//Constants
import { INFO_MAIN, REGISTRO_CAI_A, REGISTRO_CAI_E, FISCAL_RESET, REGISTRO_CAI_R, UREGISTRO_CAI_R } from "../../constants/Constants";

export function fiscalReset() {
    return { type: FISCAL_RESET };
}

export function setInfoMain(info: IInfoMain) {
    return { type: INFO_MAIN, payload: info };
}

export function setRegistroCaiA(reg: IRegistroCai) {
    return { type: REGISTRO_CAI_A, payload: reg };
}

export function updateRegistroCaiA(reg: IRegistroCai) {
    return { type: REGISTRO_CAI_A, payload: reg };
}

export function setRegistroCaiE(reg: IRegistroCai) {
    return { type: REGISTRO_CAI_E, payload: reg };
}

export function updateRegistroCaiE(reg: IRegistroCai) {
    return { type: REGISTRO_CAI_E, payload: reg };
}

export function setRegistroCaiRecibo(reg: IRegistroCai) {
    return { type: REGISTRO_CAI_R, payload: reg };
}

export function updateRegistroCaiRecibo(numeoRecibo: number) {
    return { type: UREGISTRO_CAI_R, payload: numeoRecibo };
}