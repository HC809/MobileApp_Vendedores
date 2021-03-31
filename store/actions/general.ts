//Constants
import { VARIABLES, VARIABLES_RESET, CONT_FETCH_INICIO, SET_FETCH_ERROR, CLEAN_FETCH_ERRORS } from "../../constants/Constants";

export const setVariables = (payload: any) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({ type: VARIABLES, payload });
      resolve();
    });
  };
};

export const variablesReset = () => {
  return { type: VARIABLES_RESET }
}

export const contadorFetchInicio = () => {
  return { type: CONT_FETCH_INICIO };
};


//Guardar errores en la sincronizacion inicial
export const setFetchSyncError = (fetchError: string, messageError: string) => {
  return {
    type: SET_FETCH_ERROR,
    payload: {
      fetchError: fetchError,
      messageError: messageError
    }
  };
};

//Limpiar errores de la sincronizacion inicial
export const cleanFetchErrors = () => {
  return { type: CLEAN_FETCH_ERRORS };
};

