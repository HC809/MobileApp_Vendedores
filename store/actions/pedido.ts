//Models
import { IPedido } from '../../models/Factura/IPedido';
import { IDescuentosPorEscala } from '../../models/Descuentos/IDescuentosPorEscala';
import { IDescuentosPorTipoPago } from '../../models/Descuentos/IDescuentosPorTipoPago';
//Constants
import {
  PEDIDO,
  AGREGAR_PEDIDO_PRODUCTO,
  SET_PEDIDO_PRODUCTOS,
  CALCULAR_TOTAL_PEDIDO,
  APLICAR_DESCUENTOS_POR_ESCALA,
  ROLLBACK_DESCUENTOS_POR_ESCALA,
  APLICAR_DESCUENTOS_POR_TIPO_PAGO,
  ROLLBACK_DESCUENTOS_TIPO_PAGO,
  ACTUALIZAR_PRODUCTO_PEDIDO,
  FINALIZAR_PEDIDO
} from '../../constants/Constants';
//Helpers
import { incrementarCantidadProducto, nuevoProductoParaPedido } from '../../helpers/functions/pedido';
import { setCanculandoPedido } from './loading';

export const setPedido = (pedido: IPedido) => {
  return { type: PEDIDO, payload: pedido }
}

export const setPedidoProductos = (pedido: IProductoFactura[]) => {
  return { type: SET_PEDIDO_PRODUCTOS, payload: pedido };
};

//Agregar pedido
export const agregarAPedido = (producto: IProductoFactura) => {
  return {
    type: AGREGAR_PEDIDO_PRODUCTO,
    payload: producto
  }
}

//Actualizar producto en  pedido
export const actualizarProductoEnPedido = (producto: IProductoFactura) => {
  return {
    type: ACTUALIZAR_PRODUCTO_PEDIDO,
    payload: producto
  }
}

//Calcular totales del pedido a facturar
export const calcularTotalPedido = () => {
  return { type: CALCULAR_TOTAL_PEDIDO }
}


//Aplicar descuentos por escala al pedido a facturar
export const setAplicarCalculoDescuentosPorEscala = (descuentos: IDescuentosPorEscala[]) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(setCanculandoPedido(true))
      dispatch({
        type: APLICAR_DESCUENTOS_POR_ESCALA,
        payload: descuentos
      });
      dispatch(setCanculandoPedido(false))
      resolve();
    });
  };
}

//Quitar descuentos por escala del pedido a facturar
export const rollbackCalculoDescuentosPorEscala = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: ROLLBACK_DESCUENTOS_POR_ESCALA
      });
      resolve();
    });
  };
}

//Aplicar descuentos por tipo de pago al pedido a facturar
export const setAplicarCalculoDescuentosTipoPago = (descuentos: IDescuentosPorTipoPago[]) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: APLICAR_DESCUENTOS_POR_TIPO_PAGO,
        payload: descuentos
      });
      resolve();
    });
  };
}

//Quitar descuentos por tipo de pago del pedido a facturar
export const rollbackCalculoDescuentosPorTipoPago = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: ROLLBACK_DESCUENTOS_TIPO_PAGO
      });
      resolve();
    });
  };
}

export const finalizarPedido = () => {
  return (dispatch) => {
      dispatch({
        type: FINALIZAR_PEDIDO
      });
  };
}

//Calcular pedido completo (AgregarProductoScreen)
export const setCalcularPedidoCompleto = (
  productoPedido: IProductoFactura,
  producto: IProducto,
  precio: number,
  cantidad: number,
  aplicarDesPorcentaje: boolean,
  aplicarDesPorTipoPago: boolean,
  descuentosPorTipoPago: IDescuentosPorTipoPago[],
  descuentosPorEscala: IDescuentosPorEscala[]
) => {
  return (dispatch) => {
    if (productoPedido) {
      let productoActualizado = incrementarCantidadProducto(productoPedido, cantidad);
      dispatch(actualizarProductoEnPedido(productoActualizado));
    }
    else {
      let nuevoProducto = nuevoProductoParaPedido(producto, precio, cantidad);
      dispatch(agregarAPedido(nuevoProducto));
    }

    if (aplicarDesPorcentaje)
      dispatch(setAplicarCalculoDescuentosPorEscala(descuentosPorEscala));

    if (aplicarDesPorTipoPago)
      dispatch(setAplicarCalculoDescuentosTipoPago(descuentosPorTipoPago));

    dispatch(calcularTotalPedido());
  }
}