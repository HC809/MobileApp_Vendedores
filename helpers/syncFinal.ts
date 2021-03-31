//Models
import { IFacturaPost } from "../models/Factura/IFacturaPost";
import { IFacturaPostResult } from "../models/Factura/IFacturaPostResult";
//API
import api from "../api/comercialLaRocaApi";

export const SincronizarFacturas = (facturasPost: IFacturaPost[]) => {
  return api.Facturacion.guardarfacturas(facturasPost).then((results: IFacturaPostResult[]) => {
    return results;
  });
};








