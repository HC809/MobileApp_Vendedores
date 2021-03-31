import { ADD_FACTURA, SET_FACTURA, ANULAR_FACTURA, UPDATE_FACTURA } from "../../constants/Constants";

const initialState = [];

const facturaReducer = (state = initialState, action) => {
  switch (action.type) {

    case ADD_FACTURA:
      return [...state, action.payload]

    case SET_FACTURA:
      return [...action.payload]

    case ANULAR_FACTURA:

      state.map(fac => {
        if (fac.numerofactura === action.payload) fac.anulado = 'S';
      });

      return [...state];

    case UPDATE_FACTURA:

      state.map(fac => {
        if (fac.faccorrelativo === action.payload.correlativo) fac.sinc = action.payload.sync;
      });

      return [...state];

    default:
      return state;
  }
};

export default facturaReducer;
