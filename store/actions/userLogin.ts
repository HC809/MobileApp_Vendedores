//Constants
import { USER_LOGIN } from '../../constants/Constants';

//Models (intrfaces)
import { IUsuario } from '../../models/Usuario/IUsuario';

const userInit = (user: IUsuario) => {
    return {
        type: USER_LOGIN,
        payload: user
    }
};

export default userInit;

