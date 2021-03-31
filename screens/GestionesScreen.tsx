import React, { useState } from "react";
import {
  Layout,
  TopNavigation,
  Divider,
  Text,
  Modal,
  Button,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { StyleSheet, View, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

//Constants
import { STATE_PEDIDO_VACIO } from "../constants/Constants";
//Actions
import { setPedido } from "../store/actions/pedido";
//Models
import { IFacSaldoPendiente } from "../models/Factura/IFacSaldoPendiente";
import { IRegistroCai } from "../models/Fiscal";
import { IFactura } from "../models/Factura/IFactura";
import { ICliente } from "../models/Cliente/ICliente";
//Components
import { BackAction } from "../components/Common/BackAction";
import { SyncPartialSection } from "../components/Common/SyncParcialSection";
//Helpers
import { formatNumber, diffDias } from "../helpers/functions/functions";
//Store
import HeaderClienteCobranza from "../components/HeaderClienteCobranza";

const window = Dimensions.get("window");

const Gestiones = ({ navigation }) => {
  const dispatch = useDispatch();

  const cliente: ICliente = useSelector((state) => state.variables.cliente);
  const facturasSaldoPendiente: IFacSaldoPendiente[] = useSelector((state) =>
    state.cobranza.cobranza.filter(
      (x) =>
        x.idcliente === cliente.idcliente &&
        x.pendiente === true &&
        x.valorsaldofactura > 0
    )
  );
  const facturasDelDiaAlCreditoPendientes: IFactura[] = useSelector((state) =>
    state.factura.filter(
      (x) =>
        x.codigoTipoVenta === "CRED" &&
        x.idcliente === cliente.idcliente &&
        x.sinc === false
    )
  );
  const registroCaiFacturaEnUso: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_A
  );
  const registroCaiFacturaEnProceso: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_E
  );

  const [
    mostrarModalNumeradorFac,
    setMostrarModalNumeradorFac,
  ] = useState<boolean>(false);
  const [mostrarModalAlerta, setMostrarModalAlerta] = useState<boolean>(false);
  const [cobranzaMessage, setCobranzaMessage] = useState<string>("");

  const [mostrarModalImpresora, setMostrarModalImpresora] = useState<boolean>(
    false
  );

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
    facturasDelDiaAlCreditoPendientes.map(
      (x) => (totalSaldoPendiente = totalSaldoPendiente + x.total)
    );
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

  const fechaFacturaMasAntigua = (): Date => {
    let facturasOrdenadas = facturasSaldoPendiente.sort(function (a, b) {
      var da = new Date(a.fechavencimiento).getTime();
      var db = new Date(b.fechavencimiento).getTime();

      return da > db ? 1 : da < db ? -1 : 0;
    });

    return facturasOrdenadas[0].fechafactura;
  };

  const validarCobranza_y_numeradorFacturas = () => {
    if (
      registroCaiFacturaEnUso.numeroactual > registroCaiFacturaEnUso.rangofinal
    ) {
      if (
        !registroCaiFacturaEnProceso ||
        registroCaiFacturaEnProceso.numeroactual >
          registroCaiFacturaEnProceso.rangofinal
      ) {
        setMostrarModalNumeradorFac(true);
      } else {
        validarCobranza();
      }
    } else validarCobranza();
  };
  const validarCobranza = () => {
    if (facturasSaldoPendiente.length > 0) {
      let totalSaldoPendienteVencido = saldoPendienteVencido();

      if (totalSaldoPendienteVencido > 0) {
        let messageText = `El cliente tiene un saldo pendiente vencido de L. ${totalSaldoPendienteVencido}.\nRealice el cobro correspondiente para poder vender.`;

        setCobranzaMessage(messageText);
        setMostrarModalAlerta(true);
        return;
      } else {
        let clienteDiasCredito = cliente.diascredito;
        let fechaVencimientoMasAntigua = fechaFacturaMasAntigua();
        let diasFechaVencimientoFacAntigua = diffDias(
          fechaVencimientoMasAntigua
        );

        if (diasFechaVencimientoFacAntigua > clienteDiasCredito) {
          let messageText = `El cliente ha excedido sus días de crédito (${cliente.diascredito}).\nEl total de días desde la fecha de vencimiento de la última factura es de ${diasFechaVencimientoFacAntigua} días.`;

          setCobranzaMessage(messageText);
          setMostrarModalAlerta(true);
          return;
        } else {
          let totalSaldoPendiente = saldoPendiente();
          let clienteLimiteCredito = cliente.limitecredito;

          if (
            totalSaldoPendiente > 0 &&
            totalSaldoPendiente >= clienteLimiteCredito
          ) {
            let messageText = `El cliente tiene un crédito pediente de L. ${formatNumber(
              totalSaldoPendiente
            )} y su límite de crédito es de L. ${formatNumber(
              clienteLimiteCredito
            )}.`;
            setCobranzaMessage(messageText);
            setMostrarModalAlerta(true);
            return;
          } else {
            dispatch(setPedido(STATE_PEDIDO_VACIO));
            navigation.navigate("FacturacionScreen");
          }
        }
      }
    } else {
      dispatch(setPedido(STATE_PEDIDO_VACIO));
      navigation.navigate("FacturacionScreen");
    }
  };

  const modalConfigurarImpresora = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setMostrarModalImpresora(false);
        }}
        visible={mostrarModalImpresora}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Configurar Impresora</Text>
          <View
            style={{
              borderColor: "#ffc107",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            Impresora no conectada. Configure la impresora desde la pantalla de
            configuración o puede imprimir más tarde la factura desde la
            pantalla 'Vendido'.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              onPress={() => {
                setMostrarModalImpresora(false);
              }}
              size="medium"
              appearance="outline"
              style={styles.button}
            >
              Cancelar
            </Button>

            <Button
              status="warning"
              onPress={() => {
                setMostrarModalImpresora(false);
                dispatch(setPedido(STATE_PEDIDO_VACIO));
                navigation.navigate("FacturacionScreen");
              }}
              style={styles.button}
              size="medium"
            >
              Continuar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const modalAlertaNumerosFacturaNoDisponibles = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setMostrarModalNumeradorFac(false);
        }}
        visible={mostrarModalNumeradorFac}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Numerador Facturas</Text>
          <View
            style={{
              borderColor: "#ffc107",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            No tiene números disponibles para facturar. Solicite un nuevo rango
            de facturación.
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button
              status="basic"
              onPress={() => {
                setMostrarModalNumeradorFac(false);
              }}
              size="medium"
              appearance="outline"
            >
              Ok
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const modalAlertaCobranza = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setMostrarModalAlerta(false);
        }}
        visible={mostrarModalAlerta}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Cobranza</Text>
          <View
            style={{
              borderColor: "#ffc107",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            {cobranzaMessage}
          </Text>

          <View style={{ marginTop: 20 }}>
            <Button
              status="basic"
              onPress={() => {
                setMostrarModalAlerta(false);
              }}
              size="medium"
              appearance="outline"
            >
              Ok
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Gestiones Cliente"
        alignment="center"
        leftControl={<BackAction navigation={navigation} />}
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
        <Divider style={{ backgroundColor: "#5DDB6F" }} />
        <ScrollView>
          <SyncPartialSection
            style={styles.setting}
            hint="Vender"
            iconName='shopping-cart'
            onPress={validarCobranza_y_numeradorFacturas}
          />
          <SyncPartialSection
            style={styles.setting}
            hint="Lista de Facturas del Día"
            iconName='assignment'
            onPress={() => navigation.navigate("ListaFacturasClienteScreen")}
          />
          <SyncPartialSection
            style={styles.setting}
            hint="Cobranza"
            iconName='credit-card'
            onPress={() => navigation.navigate("CobranzaScreen")}
          />
        </ScrollView>
      </Layout>
      {mostrarModalAlerta && modalAlertaCobranza()}
      {mostrarModalNumeradorFac && modalAlertaNumerosFacturaNoDisponibles()}
      {mostrarModalImpresora && modalConfigurarImpresora()}
    </SafeAreaView>
  );
};

export default Gestiones;

const styles = StyleSheet.create({
  setting: {
    padding: 16,
  },
  clienteSetting: {
    padding: 5,
  },
  description: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    paddingHorizontal: 2,
    marginTop: 10,
  },
  button: {
    marginHorizontal: 2,
    width: "45%",
  },
});
