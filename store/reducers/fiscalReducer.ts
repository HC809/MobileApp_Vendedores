import {
  INFO_MAIN,
  REGISTRO_CAI_A,
  REGISTRO_CAI_E,
  UREGISTRO_CAI_A,
  UREGISTRO_CAI_E,
  FISCAL_RESET,
  REGISTRO_CAI_R,
  UREGISTRO_CAI_R
} from "../../constants/Constants";

const fiscalReducer = (state: any = {}, action) => {
  switch (action.type) {
    case INFO_MAIN:
      return {
        ...state,
        INFO_MAIN: action.payload,
      };

    case REGISTRO_CAI_A:
      return {
        ...state,
        REGISTRO_CAI_A: action.payload,
      };

    case UREGISTRO_CAI_A:
      return {
        ...state,
        REGISTRO_CAI_A: { ...state.REGISTRO_CAI_A, ...action.payload },
      };

    case REGISTRO_CAI_E:
      return {
        ...state,
        REGISTRO_CAI_E: action.payload,
      };

    case UREGISTRO_CAI_E:
      return {
        ...state,
        REGISTRO_CAI_E: action.payload,
      };

    case REGISTRO_CAI_R:
      return {
        ...state,
        REGISTRO_CAI_R: action.payload,
      };

    case UREGISTRO_CAI_R:
      state.REGISTRO_CAI_R.numeroactual = action.payload;
      return { ...state };

    case FISCAL_RESET:
      return {}
    default:
      return state;
  }
};

export default fiscalReducer;