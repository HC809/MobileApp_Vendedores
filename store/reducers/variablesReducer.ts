import {
  VARIABLES,
  VARIABLES_RESET,
  VARIABLES_INITIAL,
  CONT_FETCH_INICIO,
  SET_FETCH_ERROR,
  CLEAN_FETCH_ERRORS
} from "../../constants/Constants";

const variablesReducer = (state = VARIABLES_INITIAL, action) => {
  switch (action.type) {
    case VARIABLES:
      return {
        ...state,
        ...action.payload,
      };

    case VARIABLES_RESET:
      state.estado = 0;
      state.ultimaFactura = 0;
      state.CONT_FETCH_INICIO = 0

      return { ...state };

    case CONT_FETCH_INICIO:
      return {
        ...state,
        CONT_FETCH_INICIO: state.CONT_FETCH_INICIO + 1,
      };

    case SET_FETCH_ERROR:
      state.fetchErrors = [...state.fetchErrors, action.payload]
      return {
        ...state
      };

    case CLEAN_FETCH_ERRORS:
      state.fetchErrors = []
      return {
        ...state
      };

    default:
      return state;
  }
};

export default variablesReducer;
