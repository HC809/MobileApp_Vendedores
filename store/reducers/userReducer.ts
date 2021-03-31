//Constants
import { USER_LOGIN, USER_LOGOUT } from '../../constants/Constants';

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN:
            return {
                ...state, ...action.payload
            }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export default userReducer; 