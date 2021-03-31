//Models
import { IFacInfo } from "../../models/common";
import { IAbonoHeaderCXC } from "../../models/Factura/IAbonoCXC";
import { dateNormalFormat, hourFormat, formatNumber } from "./functions";
import { NumeroALetras } from "./valorLetras";

export const reciboHTML = (
  abono: IAbonoHeaderCXC,
  empresaInfo: IFacInfo,
  formaPago: string
): string => {
  let tableBodyAbonoDetalle: string = "";
  abono.detalleCxc.map((fac) => {
    tableBodyAbonoDetalle =
      tableBodyAbonoDetalle +
      `
      <tr style="text-align: center;">
      <td style="width: 65px;"><small>FAC ${fac.numeroFactura}</small></td>
      <td style="width: 50px;"><small>${formatNumber(
        fac.valorAbono
      )}</small></td>
      </tr>`;
  });

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
                <div style="text-align: center;">
                    <div>
                        <small>
                            <strong>${empresaInfo.direccionemp}</strong>
                        </small>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div>
                        <small>
                            <strong>${empresaInfo.correoemp}</strong>
                        </small>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div>
                        <small>
                            <strong>${empresaInfo.rtmemp}</strong>
                        </small>
                    </div>
                </div>
                <div style="text-align: center;">
                    <div>
                        <small>
                            <strong>${empresaInfo.telefonoemp}</strong>
                        </small>
                    </div>
                </div>
              </div>
              <div>
                  <div>&nbsp;</div>
              </div>
              <div>
                  <div>
                      RECIBO DE PAGO
                  </div>
              </div>
              <div>
                  <div>
                    <small>No. ${abono.idAbono}</small>
                  </div>
                  <div>
                      <small>${dateNormalFormat(abono.fechaAbono)} ${hourFormat(
    abono.fechaAbono
  )}</small>
                  </div>              
                  <div>
                      <small>Por L  ${formatNumber(
                        abono.totalValorAbono
                      )}</small>
                  </div>
                  <div>
                      <small>Forma Pago: ${formaPago}</small>
                  </div>
                  <div>
                      <small>Cliente: ${abono.nombreCliente}</small>
                      <div>
                          <small>RTN Cliente: ${abono.rtnCliente}</small>
                      </div>                     
                  </div>
                  <hr/>
                  <table style="width:100%">
                      <tbody>
                          <tr>
                              <th style="width: 65px;"><small>Doc. No</small></th>
                              <th style="width: 50px;"><small>Monto</small></th>
                          </tr>
                      </tbody>
                      <tbody>
                          ${tableBodyAbonoDetalle}
                      </tbody>
                  </table>
                  <div>
                      <div>&nbsp;</div>
                          <div>
                              <div>
                                  <div style="text-align: center;">
                                      <small>* ${NumeroALetras(
                                        abono.totalValorAbono
                                      )} *</small>
                                  </div>
                              </div>
                              <div>&nbsp;</div>
                          </div>
                  </div>
                  <div style="text-align: right;">
                          <div>
                              <div>Saldo Pendiente: L ${formatNumber(
                                abono.saldoPendiente
                              )}</div>
                          </div>                       
                  </div>              
              </div>
          </body>
      </html>`;
};
