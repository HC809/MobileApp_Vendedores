import React, { useEffect, useState } from "react";
import {
  Button,
  Layout,
  TopNavigation,
  Divider,
  StyleService,
  useStyleSheet,
  Text,
  Icon,
  TopNavigationAction,
  Modal,
  Select,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackHandler, FlatList, ListRenderItemInfo, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
//Constants
import { STATE_PEDIDO_VACIO } from "../constants/Constants";
//Models
import { IPedido } from "../models/Factura/IPedido";
import { IDescuentosPorEscala } from "../models/Descuentos/IDescuentosPorEscala";
import { IDescuentosPorTipoPago } from "../models/Descuentos/IDescuentosPorTipoPago";
import { ISelectOption } from "../models/common";
import { ICliente } from "../models/Cliente/ICliente";
//Actions
import {
  setPedidoProductos,
  calcularTotalPedido,
  setPedido,
  setAplicarCalculoDescuentosPorEscala,
  setAplicarCalculoDescuentosTipoPago,
} from "../store/actions/pedido";
//Components
import { ProductoCartItem } from "../components/ProductoCartItem";

export const ListaProductosFacturarScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tiposVenta = useSelector((state) => state.variables.tipoVenta);
  const pedido: IPedido = useSelector((state) => state.pedido);
  const descuentosPorEscala: IDescuentosPorEscala[] = useSelector(
    (state) => state.bd.descuentos.descuentosPorEscala
  );
  const descuentosPorTipoPago: IDescuentosPorTipoPago[] = useSelector(
    (state) => state.bd.descuentos.descuentosPorTipoPago
  );
  const clienteSeleccionado: ICliente = useSelector(
    (state) => state.variables.cliente
  );

  const [selectedTipoVenta, setSelectedTipoVenta] = useState(tiposVenta[0]);

  //Muestra el modal al entrar y se oculta cuando presione el boton confirmar (selecion de tipo de venta)
  const [showModalTipoVenta, setShowModalTipoVenta] = useState(true);

  useEffect(() => {
    ModalTipoVenta();
  }, [showModalTipoVenta]);

  //Modal Tipo de Venta
  const ModalTipoVenta = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {}}
        visible={showModalTipoVenta}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Tipo de Venta</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Select
            data={
              clienteSeleccionado.diascredito === 0 ||
              clienteSeleccionado.limitecredito === 0
                ? tiposVenta.filter((x) => x.codigo !== "CRED")
                : tiposVenta
            }
            selectedOption={selectedTipoVenta}
            onSelect={(op: ISelectOption) => {
              setSelectedTipoVenta(op);
            }}
            size="medium"
            style={{ minWidth: 270 }}
          />
          <Text style={{ marginBottom: 5 }}></Text>
          {(clienteSeleccionado.diascredito === 0 ||
            clienteSeleccionado.limitecredito === 0) && (
            <Text status="basic" style={{ textAlign: "center" }}>
              El cliete no tiene días de crédito o límite de crédito disponible.
            </Text>
          )}
          <View style={styles.buttonContainer}>
            <Button
              status={"danger"}
              onPress={() => {
                navigation.pop();
              }}
              size="medium"
            >
              Cancelar
            </Button>
            <Button
              status={"primary"}
              onPress={() => {
                dispatch(
                  setPedido({
                    ...STATE_PEDIDO_VACIO,
                    idtipoventa: selectedTipoVenta.id,
                    codigoTipoVenta: selectedTipoVenta.codigo,
                  })
                );
                setShowModalTipoVenta(false);
              }}
              size="medium"
            >
              Confirmar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const styles = useStyleSheet(themedStyle);

  //Deshabilitar boton atras (para no salirse del pedido)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  //Se quito un producto del pedido
  const onItemRemove = (index: number): void => {
    pedido.detalle.splice(index, 1);
    actualizarDetallePedido();
  };

  //Se incremento/decremento la cantidad del producto en ProductoCartItem
  const onItemChange = (product: IProductoFactura, index: number): void => {
    pedido.detalle[index] = product;
    actualizarDetallePedido();
  };

  //Actualizar detalle del y totales del pedido
  const actualizarDetallePedido = () => {
    dispatch(setPedidoProductos([...pedido.detalle]));

    if (pedido.aplicarDesPorTipoPago) {
      dispatch(
        setAplicarCalculoDescuentosTipoPago(
          descuentosPorTipoPago.filter(
            (d) => d.codigotipoventa === pedido.codigoTipoVenta
          )
        )
      );
    }

    if (pedido.aplicarDesPorcentaje) {
      dispatch(setAplicarCalculoDescuentosPorEscala(descuentosPorEscala));
    }

    dispatch(calcularTotalPedido());
  };

  const renderProductItem = (
    info: ListRenderItemInfo<IProductoFactura>
  ): React.ReactElement => (
    <ProductoCartItem
      style={styles.item}
      index={info.index}
      product={info.item}
      onProductChange={onItemChange}
      onRemove={onItemRemove}
      finalizado={pedido.finalizado}
    />
  );

  const renderRightControls = () => [
    <TopNavigationAction
      onPress={() => navigation.push("ListaProductosClienteScreen")}
      icon={(style) => (
        <Icon
          {...style}
          name="plus-circle-outline"
          fill={pedido.finalizado ? "gray" : "green"}
        />
      )}
      disabled={pedido.finalizado}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Facturar"
        alignment="center"
        subtitle="Lista de Productos"
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={{ flex: 1 }} level="2">
        <FlatList
          data={pedido.detalle}
          renderItem={renderProductItem}
          ListEmptyComponent={() => (
            <View>
              <Text appearance="hint" style={{ textAlign: "center" }}>
                No se han agregado productos
              </Text>
            </View>
          )}
        />
        {ModalTipoVenta()}
      </Layout>
    </SafeAreaView>
  );
};

const themedStyle = StyleService.create({
  container: {
    flex: 1,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "background-basic-color-3",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 0.5,
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
});
