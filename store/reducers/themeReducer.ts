import { CHANGE_THEME, THEME_LIGHT, THEME_DARK } from '../../constants/Constants';

const initialState =  {
    theme: THEME_LIGHT,
}

const themeReducer = (state = initialState, action) => {
    switch(action.type) {
        case CHANGE_THEME:
            return {
                ...state, theme : action.payload
            }
        default:
            return state
    }
}

export default themeReducer;