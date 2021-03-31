//Constants
import {
  PEDIDO,
  AGREGAR_PEDIDO_PRODUCTO,
  STATE_PEDIDO_VACIO,
  SET_PEDIDO_PRODUCTOS,
  CALCULAR_TOTAL_PEDIDO,
  APLICAR_DESCUENTOS_POR_ESCALA,
  ROLLBACK_DESCUENTOS_POR_ESCALA,
  APLICAR_DESCUENTOS_POR_TIPO_PAGO,
  ROLLBACK_DESCUENTOS_TIPO_PAGO,
  ACTUALIZAR_PRODUCTO_PEDIDO,
  FINALIZAR_PEDIDO
} from "../../constants/Constants";
//Helpers
import { ToNumber } from "../../helpers/functions/functions";

const initialState = STATE_PEDIDO_VACIO;

const pedidoReducer = (state = initialState, action) => {
  const paction = action.payload;
  switch (action.type) {
    case PEDIDO:
      return {
        ...state,
        ...paction,
      };

      case FINALIZAR_PEDIDO:
      return {
        ...state,
        finalizado: true,
      };

    case SET_PEDIDO_PRODUCTOS:
      if (paction?.length === 0) {
        state.aplicarDesPorTipoPago = false;
        state.aplicarDesPorcentaje = false;
      }

      return {
        ...state,
        detalle: paction,
      };

    case CALCULAR_TOTAL_PEDIDO:
      let totales = {
        subtotal: 0.0,
        descuento: 0.0,
        impuesto: 0.0,
        total: 0.0,
      };

      state.detalle.map((x: IProductoFactura) => {
        totales.subtotal += x.subtotal;
        totales.descuento += x.totalDescuento;
        totales.impuesto += x.totalImpuesto;
        totales.total += x.subtotal - x.totalDescuento + x.totalImpuesto;
      });

      //Importe Exento (total productos que impuesto es 0)
      let totalImporteExento = 0;
      state.detalle
        .filter((x) => x.porcentajeimpuesto === 0)
        .map((x: IProductoFactura) => {
          totalImporteExento = totalImporteExento + x.subtotal;
        });

      //Importe Gravado 15%
      let totalImporteGravado15 = 0;
      state.detalle
        .filter((x) => x.porcentajeimpuesto === 15)
        .map((x: IProductoFactura) => {
          totalImporteGravado15 =
            totalImporteGravado15 + (x.subtotal - x.totalDescuento);
        });

      //Importe Gravado 18%
      let totalImporteGravado18 = 0;
      state.detalle
        .filter((x) => x.porcentajeimpuesto === 18)
        .map((x: IProductoFactura) => {
          totalImporteGravado18 =
            totalImporteGravado18 + (x.subtotal - x.totalDescuento);
        });

      return {
        ...state,
        subtotal: totales.subtotal,
        descuento: totales.descuento,
        impuesto: totales.impuesto,
        total: totales.total,
        importeExento: totalImporteExento,
        importeGravado15: totalImporteGravado15,
        importeGravado18: totalImporteGravado18,
      };

    case AGREGAR_PEDIDO_PRODUCTO: {
      state.detalle = [...state.detalle, paction];

      return { ...state };
    }

    //Actualizar producto en pedido
    case ACTUALIZAR_PRODUCTO_PEDIDO: {
      let productoEnPedidoIndex = state.detalle.findIndex(
        (x) => paction.idproducto === x.idproducto
      );
      state.detalle[productoEnPedidoIndex] = paction;

      return { ...state };
    }

    //Aplicar Descuentos por Escala
    case APLICAR_DESCUENTOS_POR_ESCALA: {
      let arrayDescuentosPorEscala = action.payload;

      if (arrayDescuentosPorEscala.length > 0) {
        let idListProductosEnPedido = state.detalle.map((x) => {
          return x.idproducto;
        });

        let descuentosProductosEnPedido = arrayDescuentosPorEscala.filter(
          ({ idproducto }) => idListProductosEnPedido.includes(idproducto)
        );

        let descuentoPorProducto = state.detalle.map((x) => {
          let descuentoRegistro = descuentosProductosEnPedido.find(
            (d) =>
              x.idproducto === d.idproducto &&
              x.cantidad >= d.rangoinicial &&
              x.cantidad <= d.rangofinal
          );

          return {
            idproducto: x.idproducto,
            porcentajeDescuentoTipoPago: x.descuentoPorTipoPago || 0,
            porcentajeDescuentoEscala: descuentoRegistro
              ? descuentoRegistro.monto
              : 0,
          };
        });

        descuentoPorProducto.map((descProd) => {
          state.detalle.map((prod) => {
            if (
              prod.idproducto === descProd.idproducto &&
              descProd.porcentajeDescuentoEscala != 0
            ) {
              //Aplicar Descuentos
              let descuentoPorEscala = descProd.porcentajeDescuentoEscala / 100;
              prod.descuentoPorEscala = (descuentoPorEscala);
              let totalPorcentajeDescuentoAplicar =
                descuentoPorEscala + descProd.porcentajeDescuentoTipoPago;
              let totalMontoDescuento =
                prod.subtotal * totalPorcentajeDescuentoAplicar;
              prod.totalDescuento = (totalMontoDescuento);
              //Aplicar Impuesto
              let impuestoAplicar = prod.porcentajeimpuesto / 100;
              let totalMontoImpuesto =
                (prod.subtotal - totalMontoDescuento) * impuestoAplicar;
              prod.totalImpuesto = (totalMontoImpuesto);
              //Total
              prod.total = (
                prod.subtotal - totalMontoDescuento + totalMontoImpuesto
              );
            }
          });
        });

        return { ...state, aplicarDesPorcentaje: true };
      } else return state;
    }

    //Quitar descuentos por escala
    case ROLLBACK_DESCUENTOS_POR_ESCALA:
      state.detalle.map((prod) => {
        prod.descuentoPorEscala = 0;
        let totalDescuento = prod.subtotal * prod.descuentoPorTipoPago;
        prod.totalDescuento = ToNumber(totalDescuento);
        let totalImpuesto =
          (prod.subtotal - totalDescuento) * (prod.porcentajeimpuesto / 100);
        prod.totalImpuesto = ToNumber(totalImpuesto);
        prod.total = ToNumber(prod.subtotal - totalDescuento + totalImpuesto);
      });

      return { ...state, aplicarDesPorcentaje: false };

    //Aplicar Descuentos por Tipo de Pago
    case APLICAR_DESCUENTOS_POR_TIPO_PAGO: {
      let arrayDescuentosPorTipoVenta = action.payload;

      if (arrayDescuentosPorTipoVenta.length > 0) {
        let idListProductosEnPedido = state.detalle.map((x) => {
          return x.idproducto;
        });

        let descuentosProductosEnPedido = arrayDescuentosPorTipoVenta.filter(
          ({ idproducto }) => idListProductosEnPedido.includes(idproducto)
        );

        let descuentoPorProducto = state.detalle.map((x) => {
          let descuentoRegistro = descuentosProductosEnPedido.find(
            (d) => x.idproducto === d.idproducto
          );

          return {
            idproducto: x.idproducto,
            porcentajeDescuentoEscala: x.descuentoPorEscala || 0,
            porcentajeDescuentoTipoVenta: descuentoRegistro
              ? descuentoRegistro.monto
              : 0,
          };
        });

        descuentoPorProducto.map((descProd) => {
          state.detalle.map((prod) => {
            if (
              prod.idproducto === descProd.idproducto &&
              descProd.porcentajeDescuentoTipoVenta != 0
            ) {
              //Aplicar Descuentos
              let descuentoPorTipoVenta =
                descProd.porcentajeDescuentoTipoVenta / 100;
              prod.descuentoPorTipoPago = (descuentoPorTipoVenta);
              let totalPorcentajeDescuentoAplicar =
                descuentoPorTipoVenta + descProd.porcentajeDescuentoEscala;
              let totalMontoDescuento =
                prod.subtotal * totalPorcentajeDescuentoAplicar;
              prod.totalDescuento = (totalMontoDescuento);
              //Aplicar Impuesto
              let impuestoAplicar = prod.porcentajeimpuesto / 100;
              let totalMontoImpuesto =
                (prod.subtotal - totalMontoDescuento) * impuestoAplicar;
              prod.totalImpuesto = (totalMontoImpuesto);
              //Total
              prod.total = (
                prod.subtotal - totalMontoDescuento + totalMontoImpuesto
              );
            }
          });
        });

        return { ...state, aplicarDesPorTipoPago: true };
      } else return state;
    }

    //Quitar descuentos por tipo de pago
    case ROLLBACK_DESCUENTOS_TIPO_PAGO:
      state.detalle.map((prod) => {
        prod.descuentoPorTipoPago = 0;
        let totalDescuento = prod.subtotal * prod.descuentoPorEscala;
        prod.totalDescuento = ToNumber(totalDescuento);
        let totalImpuesto =
          (prod.subtotal - totalDescuento) * (prod.porcentajeimpuesto / 100);
        prod.totalImpuesto = ToNumber(totalImpuesto);
        prod.total = ToNumber(prod.subtotal - totalDescuento + totalImpuesto);
      });

      return { ...state, aplicarDesPorTipoPago: false };

    default:
      return state;
  }
};

export default pedidoReducer;
