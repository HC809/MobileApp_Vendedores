import { useFocusEffect } from "@react-navigation/native";
import {
  Button,
  Divider,
  Icon,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { UIActivityIndicator } from "react-native-indicators";
//Helpers
import { formatNumber } from "../helpers/functions/functions";
//Models
import { IDescuentosPorEscala } from "../models/Descuentos/IDescuentosPorEscala";
import { IDescuentosPorTipoPago } from "../models/Descuentos/IDescuentosPorTipoPago";
//Components
import { ModalDescuentosProducto } from "../components/ModalDescuentosProducto";
//Actions
import { setCalcularPedidoCompleto } from "../store/actions/pedido";
import { setCanculandoPedido } from "../store/actions/loading";
//Icons
import { MinusIcon, PlusIcon } from "../assets/Icons/CartItemIcons";

const window = Dimensions.get("window");

export const AgregarProductoScreen = ({
  route: {
    params: {
      codigoTipoVenta,
      idProducto,
      precio,
      productoEnPedido,
      aplicarDesPorcentaje,
      aplicarDesPorTipoPago,
    },
  },
  navigation,
}) => {
  const dispatch = useDispatch();

  const producto: IProducto = useSelector((state) =>
    state.bd.producto.items.find((p) => p.idproducto === idProducto)
  );
  const descuentosPorEscala: IDescuentosPorEscala[] = useSelector(
    (state) => state.bd.descuentos.descuentosPorEscala
  );
  const descuentosPorTipoPago: IDescuentosPorTipoPago[] = useSelector((state) =>
    state.bd.descuentos.descuentosPorTipoPago.filter(
      (d) => d.codigotipoventa === codigoTipoVenta
    )
  );
  const calculandoPedido: boolean = useSelector(
    (state) => state.loading.calculandoPedido
  );

  const [cantidad, setcantidad] = useState<number>(1);
  const [cantidadInputValue, setcantidadInputValue] = useState<string>("1");

  const [visibleModalDescuentos, setVisibleModalDescuentos] = useState<boolean>(
    false
  );

  const handleSetCantidad = (cantidad: string) => {
    setcantidadInputValue(cantidad.replace(/[^0-9]/g, ""));
    let valCantidad = parseInt(cantidad);
    if (!isNaN(valCantidad)) {
      if (productoEnPedido?.cantidad > 0) {
        let cantidadDisponible =
          producto.cantidadstock - productoEnPedido.cantidad;
        if (valCantidad <= cantidadDisponible) {
          setcantidadInputValue(valCantidad.toString());
          setcantidad(valCantidad);
        } else {
          alert(
            `Tiene (${productoEnPedido.cantidad}) unidad(es) en pedido. Cantidad disponible (${cantidadDisponible})`
          );
          setcantidadInputValue(cantidadDisponible.toString());
          setcantidad(Number(cantidadDisponible));
        }
      } else {
        if (valCantidad <= producto.cantidadstock) {
          setcantidadInputValue(valCantidad.toString());
          setcantidad(valCantidad);
        } else {
          alert(
            `No puede ingresar una cantidad mayor a la disponible en stock (${producto.cantidadstock}).`
          );
          setcantidadInputValue(producto.cantidadstock.toString());
          setcantidad(Number(producto.cantidadstock));
        }
      }
    } else {
      setcantidadInputValue("");
      setcantidad(0);
    }
  };

  useEffect(() => {
    if (calculandoPedido) {
      dispatch(
        setCalcularPedidoCompleto(
          productoEnPedido,
          producto,
          precio,
          cantidad,
          aplicarDesPorcentaje,
          aplicarDesPorTipoPago,
          descuentosPorTipoPago,
          descuentosPorEscala
        )
      );

      dispatch(setCanculandoPedido(false));

      navigation.pop();
    }
  }, [calculandoPedido]);

  const getDescuentosPorTipoPago = (): IDescuentosPorTipoPago[] =>
    descuentosPorTipoPago.filter((x) => x.idproducto === producto.idproducto);
  const getDescuentosPorEscala = (): IDescuentosPorEscala[] =>
    descuentosPorEscala.filter((x) => x.idproducto === producto.idproducto);

  //Modal Mostar Descuentos Del Producto Seleccionado
  const ModalDescuentosProductoSeleccionado = () => {
    return (
      <ModalDescuentosProducto
        nombreProducto={producto.producto}
        prodDescPorEscala={getDescuentosPorEscala()}
        prodDescPorTipoPago={getDescuentosPorTipoPago()}
        setModalVisible={setVisibleModalDescuentos}
      />
    );
  };

  //Deshabilitar boton atras (para no salirse del pedido)
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const renderRightControls = () => [
    <TopNavigationAction
      disabled={
        getDescuentosPorEscala().length === 0 &&
        getDescuentosPorTipoPago().length === 0
      }
      onPress={() => setVisibleModalDescuentos(true)}
      icon={(style) => (
        <Icon
          {...style}
          name="pricetags"
          fill={
            getDescuentosPorEscala().length === 0 &&
            getDescuentosPorTipoPago().length === 0
              ? "gray"
              : "#F5B200"
          }
        />
      )}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Agregar Producto"
        alignment="center"
        subtitle={`Código Producto ${producto.codigoproducto}`}
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={{ flex: 1 }}>
        <Text
          category="h6"
          style={{ fontWeight: "bold", textAlign: "center", marginTop: 5 }}
        >
          {producto.producto}
        </Text>

        <View style={{ alignItems: "center", marginTop: 5 }}>
          <Text category="s1">Ingrese Cantidad</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button
              style={styles.amountButton}
              size="small"
              icon={MinusIcon}
              onPress={() =>
                handleSetCantidad(
                  parseInt(cantidadInputValue) > 1
                    ? (parseInt(cantidadInputValue) - 1).toString()
                    : "0"
                )
              }
              disabled={cantidad <= 1}
            />
            <Input
              style={{
                marginHorizontal: 10,
                width: window.width - 170,
                marginTop: 5,
              }}
              placeholder="0"
              value={cantidadInputValue}
              keyboardType="number-pad"
              onChangeText={(v) => handleSetCantidad(v)}
              size="medium"
              maxLength={8}
              autoCorrect={false}
              textStyle={{ textAlign: "center", fontSize: 20 }}
            />
            <Button
              style={styles.amountButton}
              size="small"
              icon={PlusIcon}
              onPress={() =>
                handleSetCantidad((parseInt(cantidadInputValue) + 1).toString())
              }
              disabled={false}
            />
          </View>
        </View>

        <DataTable style={styles.dataTable}>
          <DataTable.Row>
            <DataTable.Cell>
              <Text>Precio</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text>L. {formatNumber(precio)}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text>Impuesto</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text>{`${producto.porcentajeimpuesto.toFixed()}%`}</Text>
            </DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>
              <Text>Subtotal</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text>L. {formatNumber(precio * cantidad)}</Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        {calculandoPedido ? (
          <View style={styles.content}>
            <UIActivityIndicator color="#21B000" size={50} />
            <Text category="s1" style={{ paddingTop: 30 }}>
              Agregando...
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              status={"basic"}
              onPress={() => navigation.pop()}
              size="medium"
            >
              {" "}
              Cancelar
            </Button>
            <Button
              disabled={cantidad < 1 || calculandoPedido}
              style={styles.button}
              size="medium"
              onPress={async () => {
                dispatch(setCanculandoPedido(true));
              }}
            >
              Agregar
            </Button>
          </View>
        )}
      </Layout>
      {visibleModalDescuentos && ModalDescuentosProductoSeleccionado()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  button: {
    marginHorizontal: 5,
    width: "45%",
  },
  dataTable: {
    textAlign: "center",
    alignContent: "center",
    marginBottom: 10,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 25,
  },
  amountButton: {
    borderRadius: 5,
  },
});
