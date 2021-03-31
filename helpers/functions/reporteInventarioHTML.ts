//Models
import { IFacInfo } from "../../models/common";
import { IUsuario } from "../../models/Usuario/IUsuario";
import { IDATA } from "../../models/Producto/IDATA";
import { dateNormalFormat, hourFormat } from "./functions";

export const reporteInventarioHTML = (
  empresaInfo: IFacInfo,
  usuarioInfo: IUsuario,
  data: IDATA[]
): string => {
  const productosTable = (productos: IProducto[]) => {
    let table: string = "";
    productos.map((prod) => {
      table =
        table +
        `<tr style="text-align: center;">
                <td style="width: 75px;"><small>${prod.producto}</small></td>
                <td style="width: 40px;"><small>${prod.cantidadpedido.toString()}-${(
          prod.cantidadpedido - prod.cantidadstock
        ).toString()}-${prod.cantidadstock.toString()}</small></td>
                </tr>`;
    });

    return table;
  };

  let tableInventario: string = "";
  data.map((group) => {
    tableInventario =
      tableInventario +
      `
      <div style="text-align: center;">
        <small>${group.title}</small>
      </div>
      <hr/>

      <table style="width:100%">
      <tbody>
          <tr>
              <th style="width: 75px;"><small>Producto</small></th>
              <th style="width: 40px;"><small>II-Fact-IF</small></th>
          </tr>
      </tbody>
      <tbody>
      ${productosTable(group.data)}
      </tbody>
      </table>          <hr/>`
      ;
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
              </style>
          </head>
          <body>
          <h4 style="color: #5e9ca0; text-align: center;">
          <span style="color: #000000;">${empresaInfo.nombrelegalemp}</span>
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
                 ${tableInventario}      
          </body>
      </html>`;
};
