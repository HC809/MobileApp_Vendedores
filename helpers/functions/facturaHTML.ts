//Models
import { IFacInfo } from "../../models/common";
import { IFactura } from "../../models/Factura/IFactura";
import { IRegistroCai } from "../../models/Fiscal";
import { IUsuario } from "../../models/Usuario/IUsuario";
import { dateNormalFormat, hourFormat, formatNumber } from "./functions";
import { NumeroALetras } from "./valorLetras";

export const facturaHTML = (
  factura: IFactura,
  userInfo: IUsuario,
  empresaInfo: IFacInfo,
  cai: IRegistroCai,
  fechaVencimiento: Date,
  tipoVenta: string
): string => {
  let tableBodyProductosDetalle: string = "";
  factura.detalle.map((det) => {
    tableBodyProductosDetalle =
      tableBodyProductosDetalle +
      `
      <tr style="text-align: center;">
      <td style="width: 5px;"><small>${det.cantidad}</small></td>
      <td style="width: 80px;"><small>${det.producto}</small></td>
      <td style="width: 15px;"><small>${formatNumber(
        det.total / det.cantidad
      )}</small></td>
      <td style="width: 15px;"><small>${formatNumber(det.total)}</small></td>
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
                    page-break-after: avoid;
                    page-break-before: avoid;
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
                      <small>CAI: ${cai.codigocai}</small>
                  </div>
              </div>
              <div>
                  <div>
                      <small>Fecha Emisión: ${dateNormalFormat(
                        factura.fechacreacion
                      )} ${hourFormat(factura.fechacreacion)}</small>
                  </div>
                  <div>
                      <div>
                          ${
                            factura.codigoTipoVenta === "CRED"
                              ? `
                          <div>
                              <small>Fecha Vencimiento: ${dateNormalFormat(
                                fechaVencimiento
                              )}</small>
                          </div>
                          `
                              : ""
                          }
                      </div>
                  </div>
                  <div>
                      <small>No. Factura: ${factura.faccorrelativo.replace(
                        / /g,
                        ""
                      )}</small>
                  </div>
                  <div>
                      <small>Tipo Venta: ${tipoVenta}</small>
                  </div>
                  <div>
                      <small>Cliente: ${factura.nombrecliente}</small>
                      <div>
                          <div>
                              <div>
                                  <small>Código Cliente: ${
                                    factura.codigocliente
                                  }</small>
                              </div>
                          </div>
                      </div>
                      <div>
                          <small>RTN Cliente: ${factura.rtncliente}</small>
                      </div>
                      <div>
                          <small>Ruta: ${userInfo.info.descripcioncorta}</small>
                      </div>
                      <div>
                          <small>Vendedor: ${
                            userInfo.info.descripcionlarga
                          }</small>
                      </div>
                      <div>
                          <div>
                              <div>
                                  <small>No. Orden de compra exenta:</small>
                              </div>
                          </div>
                      </div>
                      <div>
                          <div>
                              <div>
                                  <small>No. Constancia de Reg. de exonerados:</small>
                              </div>
                          </div>
                      </div>
                      <div>
                          <div>
                              <div>
                                  <small>No.&nbsp;Registro&nbsp;de&nbsp;la&nbsp;SAG:</small>
                              </div>
                          </div>
                      </div>
                  </div>
                  <hr/>
                  <table style="width:100%">
                      <tbody>
                          <tr>
                              <th style="width: 5px;">Und</th>
                              <th style="width: 80px;">Prod</th>
                              <th style="width: 15px;">Precio</th>
                              <th style="width: 15px;">Total</th>
                          </tr>
                      </tbody>
                      <tbody>
                          ${tableBodyProductosDetalle}
                      </tbody>
                  </table>
                  <div>
                      <div>&nbsp;</div>
                      <div style="text-align: right;">
                          <div>
                              <div>Total&nbsp;Descuento: L ${formatNumber(
                                factura.descuento
                              )}</div>
                          </div>
                          <div>
                              <div>Importe&nbsp;Exento: L ${formatNumber(
                                factura.importeExento
                              )}</div>
                          </div>
                          <div>
                              <div>Importe&nbsp;Exonerado: L ${formatNumber(
                                0
                              )}</div>
                          </div>
                          <div>
                              <div>Importe&nbsp;Gravado&nbsp;15%: L ${formatNumber(
                                factura.importeGravado15
                              )}</div>
                          </div>
                          <div>
                              <div>Importe&nbsp;Gravado&nbsp;18%: L ${formatNumber(
                                factura.importeGravado18
                              )}</div>
                          </div>
                          <div>
                              <div>Total&nbsp;Impuesto: L ${formatNumber(
                                factura.impuesto
                              )}</div>
                          </div>
                          <div>
                              <div>Total: L ${formatNumber(factura.total)}</div>
                              <div>&nbsp;</div>
                              <div>
                                  <div style="text-align: center;">
                                      <small>* ${NumeroALetras(
                                        factura.total
                                      )} *</small>
                                  </div>
                              </div>
                              <div>&nbsp;</div>
                          </div>
                      </div>
                  </div>
                  <div style="text-align: right;">
                      <div style="text-align: center;">
                          <div>
                              <div>Fecha Limite Emision: ${dateNormalFormat(
                                cai.fechalimiteemision
                              )}</div>
                          </div>
                          <div>
                              <div>Rango&nbsp;Autorizado: ${
                                cai.rangoinicial
                              } - ${cai.rangofinal}</div>
                          </div>
                          <div>
                              <div>Original: Contado, Copia 1: Credito</div>
                          </div>
                      </div>
                  </div>
                  <div>
                      <div style="text-align: center;">
                          <div>
                              <div>Copia&nbsp;2:&nbsp;Obligado&nbsp;Tributario&nbsp;Emisor</div>
                          </div>
                      </div>
                  </div>
                  <div>&nbsp;</div>
                  <div style="text-align: center;">Original
                  </div>
                  <div style="page-break-after: auto;">
                      ${
                        factura.codigoTipoVenta === "CRED"
                          ? `
                      <div>&nbsp;</div>
                      <div>&nbsp;</div>
                      <div style="text-align: center;">
                          ________________________________
                      </div>
                      `
                          : ""
                      }
                  </div>
              </div>
          </body>
      </html>`;
};
