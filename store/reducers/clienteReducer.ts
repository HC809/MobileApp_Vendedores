import { CLIENTE  } from '../../constants/Constants';

const initialState =  {
    items: [],
}

const clienteReducer = (state = initialState, action) => {
    switch(action.type) {
        case CLIENTE:
            return {
                ...state, items : action.payload
            }
        default:
            return state
    }
}

export default clienteReducer;