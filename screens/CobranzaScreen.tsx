import React, { useState } from "react";
import { View, StyleSheet, ListRenderItemInfo, Dimensions } from "react-native";
import {
  Text,
  TopNavigation,
  Divider,
  Layout,
  List,
  TopNavigationAction,
  Icon,
  Button,
  Modal,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
//Components
import { BackAction } from "../components/Common/BackAction";
import { FacturaSaldoPendiente } from "../components/FacturaSaldoPendiente";
import HeaderClienteCobranza from "../components/HeaderClienteCobranza";
import { ModalAgregarAbono } from "../components/ModalAgregarAbono";
import { CustomSnackBar } from "../components/Common/CustomSnackBar";
import { PrintIndicator } from "../components/Common/PrintIndicator";
//Models
import { IFacSaldoPendiente } from "../models/Factura/IFacSaldoPendiente";
import { IAbonoHeaderCXC } from "../models/Factura/IAbonoCXC";
import { IRegistroCai } from "../models/Fiscal";
import { IFacInfo, ISelectOption } from "../models/common";
import { ICliente } from "../models/Cliente/ICliente";
import { IFactura } from "../models/Factura/IFactura";
//Helpers
import { diffDias, formatNumber } from "../helpers/functions/functions";
import {
  actualizarFacturasPendiente,
  agregarAbono,
} from "../store/actions/cobranza";
//Actions
import { updateRegistroCaiRecibo } from "../store/actions/fiscal";
//Print
import { reciboHTML } from "../helpers/functions/reciboHTML";
import * as Print from "expo-print";

const window = Dimensions.get("window");

export const CobranzaScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
  const cliente: ICliente = useSelector((state) => state.variables.cliente);
  const registroCaiRecibo: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_R
  );
  const facturasSaldoPendiente: IFacSaldoPendiente[] = useSelector((state) =>
    state.cobranza.cobranza.filter(
      (x) => x.idcliente === cliente.idcliente && x.pendiente === true
    )
  );
  const facturasDelDiaAlCreditoPendientes: IFactura[] = useSelector((state) =>
    state.factura.filter(
      (x) =>
        x.idtipoventa === 2 &&
        x.idcliente === cliente.idcliente &&
        x.sinc === false
    )
  );
  const FORMA_PAGO: ISelectOption[] = useSelector(
    (state) => state.variables.formaPago
  );

  const [
    modalAgregarAbonoVisible,
    setModalAgregarAbonoVisible,
  ] = useState<boolean>(false);
  const [visibleSnackBar, setVisibleSnackBar] = useState<boolean>(false);

  const [visibleModalReimprimir, setVisibleModalReimprimirr] = useState(false);
  const [abonoReimprimir, setAbonoReimprimir] = useState<IAbonoHeaderCXC>(null);

  const renderFacItem = (
    factura: ListRenderItemInfo<IFacSaldoPendiente>
  ): React.ReactElement => {
    return <FacturaSaldoPendiente factura={factura.item} />;
  };

  const limiteCreditoDisponible = (): number => {
    let totalSaldoPendiente: number = 0;
    facturasSaldoPendiente.map(
      (x) => (totalSaldoPendiente = totalSaldoPendiente + x.valorsaldofactura)
    );
    let totalFacAlCreditoPendientes: number = 0;
    facturasDelDiaAlCreditoPendientes.map(
      (x) =>
        (totalFacAlCreditoPendientes = totalFacAlCreditoPendientes + x.total)
    );

    let creditoDisponible =
      cliente.limitecredito - totalSaldoPendiente - totalFacAlCreditoPendientes;

    return creditoDisponible > 0 ? creditoDisponible : 0;
  };

  const saldoPendiente = (): number => {
    let totalSaldoPendiente: number = 0;
    facturasSaldoPendiente.map(
      (x) => (totalSaldoPendiente = totalSaldoPendiente + x.valorsaldofactura)
    );

    return totalSaldoPendiente;
  };

  const saldoPendienteVencido = (): number => {
    let totalSaldoPendienteVencido: number = 0;
    facturasSaldoPendiente
      .filter((x) => diffDias(x.fechavencimiento) > 0)
      .map(
        (x) =>
          (totalSaldoPendienteVencido =
            totalSaldoPendienteVencido + x.valorsaldofactura)
      );

    return totalSaldoPendienteVencido;
  };

  const modalAgregarAbono = () => {
    if (registroCaiRecibo.numeroactual > registroCaiRecibo.rangofinal)
      return alert(
        "No tiene números de recibo disponibles. Actualice el rango de numeración para recibos."
      );
    else {
      return (
        <ModalAgregarAbono
          cerrarModal={setModalAgregarAbonoVisible}
          agregarAbonosActualizarFacturas={
            agregarAbonosyActualizarFacturasPendientes
          }
        />
      );
    }
  };

  const imprimirAbono = async (abono: IAbonoHeaderCXC) => {
    const html = reciboHTML(
      abono,
      empresaInfo,
      FORMA_PAGO.find((t) => t.id === abono.idFormaPago).text.replace(/ /g, "")
    );

    //Imprimir
    try {
      await Print.printAsync({ html });
    } catch (error) {
      alert("Error al imprimir. Reconecte la impresora e intentelo de nuevo.");
    }
  };

  const agregarAbonosyActualizarFacturasPendientes = async (
    abono: IAbonoHeaderCXC
  ) => {
    abono.saldoPendiente = saldoPendiente() - abono.totalValorAbono;
    imprimirAbono(abono)
      .then((c) => {
        setAbonoReimprimir(abono);
        setVisibleModalReimprimirr(true);
      })
      .catch((error) => {
        alert(
          "Error al imprimir el recibo. Puede imprimir el recibo desde la pantalla 'Cobrado'."
        );
      });

    dispatch(agregarAbono(abono));
    dispatch(actualizarFacturasPendiente(abono.detalleCxc));

    //actualizar numerador
    if (abono.idAbono === registroCaiRecibo.numeroactual)
      dispatch(updateRegistroCaiRecibo(abono.idAbono + 1));

    if (abono.idAbono > registroCaiRecibo.numeroactual)
      dispatch(updateRegistroCaiRecibo(abono.idAbono));

    setModalAgregarAbonoVisible(false);
    setVisibleSnackBar(true);
  };

  const ModalReimprimir = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {}}
        visible={visibleModalReimprimir}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Reimprimir Recibo</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            ¿Desea volver a imprimir el recibo?
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setVisibleModalReimprimirr(false);
              }}
              size="small"
              appearance="outline"
            >
              Calcelar
            </Button>
            <Button
              status="primary"
              onPress={async () => {
                imprimirAbono(abonoReimprimir)
                  .then((c) => {
                    setVisibleModalReimprimirr(true);
                  })
                  .catch((error) => {
                    alert(
                      "Error al imprimir el recibo. Puede imprimir el recibo desde la pantalla 'Cobrado'."
                    );
                  });
              }}
              style={styles.button}
              size="small"
            >
              Imprimir
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const renderRightControls = () => [
    <TopNavigationAction
      disabled={facturasSaldoPendiente.length === 0}
      onPress={() => {
        if (registroCaiRecibo) {
          if (
            registroCaiRecibo.numeroactual === 0 ||
            registroCaiRecibo.numeroactual > registroCaiRecibo.rangofinal
          )
            alert("No tiene números dispobinles para recibos.");
          else setModalAgregarAbonoVisible(true);
        } else {
          alert(
            "El punto de emisión no tiene configurado un numerador para recibos. Por la tanto no podrá cobrar."
          );
        }
      }}
      icon={(style) => (
        <Icon
          {...style}
          name="plus-circle-outline"
          fill={facturasSaldoPendiente.length === 0 ? "gray" : "green"}
        />
      )}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PrintIndicator area="l-print" />
      <TopNavigation
        title="Cobranza"
        alignment="center"
        subtitle="Lista de facturas con saldo pendiente"
        leftControl={<BackAction navigation={navigation} />}
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={{ flex: 1 }}>
        <HeaderClienteCobranza
          clienteNombre={cliente.nombrecliente}
          clienteCodigo={cliente.codigocliente}
          limiteCredito={cliente.limitecredito}
          saldoPendiente={saldoPendiente()}
          saldoPendienteVencido={saldoPendienteVencido()}
          creditoDisponible={limiteCreditoDisponible()}
          diasCreditoCliente={cliente.diascredito}
        />
        <List
          ListHeaderComponent={
            <>
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#D7D7D7",
                }}
              >
                <Layout level="2">
                  <Text
                    style={{ color: "#B30000", textAlign: "center" }}
                    category="h5"
                  >
                    L. {formatNumber(saldoPendiente())}
                  </Text>
                </Layout>
              </View>
            </>
          }
          data={facturasSaldoPendiente.sort(function (a, b) {
            var da = new Date(a.fechavencimiento).getTime();
            var db = new Date(b.fechavencimiento).getTime();

            return da < db ? 1 : da > db ? -1 : 0;
          })}
          renderItem={renderFacItem}
          ListEmptyComponent={() => (
            <View style={styles.content}>
              <Text appearance="hint" category="s1">
                No tiene facturas con saldo pendiente.
              </Text>
            </View>
          )}
        />
      </Layout>
      {modalAgregarAbonoVisible && modalAgregarAbono()}
      <CustomSnackBar
        textSnackBar="Abono agregado correctamente."
        visibleSnackBar={visibleSnackBar}
        setVisibleSnackBar={setVisibleSnackBar}
      />
      {visibleModalReimprimir && ModalReimprimir()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 15,
    marginTop: 10,
  },
  button: {
    marginHorizontal: 5,
    width: "45%",
  },
});
