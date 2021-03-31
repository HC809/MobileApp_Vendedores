//Models
import { IAbonoHeaderCXC, IAbonoPostResult } from "../models/Factura/IAbonoCXC";
//API
import api from "../api/comercialLaRocaApi";

export const SincronizarAbonos = (abonos: IAbonoHeaderCXC[]) => {
    return api.Facturacion.guardarAbonos(abonos).then((results: IAbonoPostResult[]) => {
        return results;
    });
};








