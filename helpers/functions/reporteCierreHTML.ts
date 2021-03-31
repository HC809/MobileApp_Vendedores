//Models
import { IFacInfo } from "../../models/common";
import { IUsuario } from "../../models/Usuario/IUsuario";
import { dateNormalFormat, hourFormat } from "./functions";

export const reporteCierreHTML = (
  empresaInfo: IFacInfo,
  usuarioInfo: IUsuario,
  totalFacturadoContado: string,
  totalFacturadoCredito: string,
  totalAbonoEfectivo: string,
  totalAbonoTarjeta: string,
  totalAbonoCheque: string,
  total: string
): string => {
  return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                * {
                    line-height: 1 !important;
                }
              </style>
          </head>
          <body>
              <h4 style="color: #5e9ca0; text-align: center;">
                  <span style="color: #000000;">${
                    empresaInfo.nombrelegalemp
                  }</span>
              </h4>
              <div>
                  <div>&nbsp;</div>
              </div>
              <div>
                  <div>
                  <small>${dateNormalFormat(new Date())} ${hourFormat(
    new Date()
  )}</small>
                  </div>
              </div>
              <div>
                  <div>
                    <small>Ruta: ${usuarioInfo.info.descripcioncorta}</small>
                  </div>
                  <div>
                  <div>
                  <small>Vendedor: ${usuarioInfo.info.descripcionlarga}</small>
                </div>
                  </div>              
                  <hr/>
                  <div>
                          <div>
                              <div>
                                  <div style="text-align: left;">
                                      <small>FACTURAS</small>
                                  </div>
                              </div>
                              <div>
                                    <div style="text-align: rigth;">
                                      <small>Contado: ${totalFacturadoContado}</small>
                                    </div>
                                    <div style="text-align: rigth;">
                                      <small>Credito: ${totalFacturadoCredito}</small>
                                    </div>
                              </div>
                          </div>

                          <div>&nbsp;</div>
                          <div>
                              <div>
                                  <div style="text-align: left;">
                                      <small>COBRANZA</small>
                                  </div>
                              </div>
                              <div>
                                  <div style="text-align: rigth;">
                                      <small>Efectivo: ${totalAbonoEfectivo}</small>
                                      </div>
                                      <div style="text-align: rigth;">
                                      <small>Tarjeta: ${totalAbonoTarjeta}</small>
                                      </div>
                                      <div style="text-align: rigth;">
                                      <small>Cheque: ${totalAbonoCheque}</small>
                                  </div>
                              </div>
                          </div>
                  </div>
                  <hr/>
                  <div style="text-align: right;">
                          <div>
                              <div>Total: ${total}</div>
                          </div>                       
                  </div>              
              </div>
          </body>
      </html>`;
};
