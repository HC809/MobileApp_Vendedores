import React from "react";
import {
  Card,
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import { BackAction } from "../components/Common/BackAction";
//Helpers
import { formatNumber } from "../helpers/functions/functions";
//Models
import { IFactura } from "../models/Factura/IFactura";
import { IAbonoHeaderCXC } from "../models/Factura/IAbonoCXC";
import { IUsuario } from "../models/Usuario/IUsuario";
import { IFacInfo } from "../models/common";
//Print
import { reporteCierreHTML } from "../helpers/functions/reporteCierreHTML";
import * as Print from "expo-print";

export const ReporteCierreScreen = ({ navigation }) => {
  const user: IUsuario = useSelector((state) => state.user);
  const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
  const facturas: IFactura[] = useSelector((state) =>
    state.factura.filter((c) => c.anulado === "N")
  );
  const abonos: IAbonoHeaderCXC[] = useSelector(
    (state) => state.cobranza.abonos
  );

  const calcularTotalFacturasCredito = (): string => {
    let totalCredito: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CRED")
      .map((x) => (totalCredito = totalCredito + x.total));

    return `L ${formatNumber(totalCredito)}`;
  };

  const calcularTotalFacturasContado = (): string => {
    let totalContado: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CTADO")
      .map((x) => (totalContado = totalContado + x.total));

    return `L ${formatNumber(totalContado)}`;
  };

  const calcularTotalAbonosEfectivo = (): string => {
    let totalEfectivo: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 1)
      .map((x) => (totalEfectivo = totalEfectivo + x.totalValorAbono));

    return `L ${formatNumber(totalEfectivo)}`;
  };

  const calcularTotalAbonosTarjeta = (): string => {
    let totalTarjeta: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 2)
      .map((x) => (totalTarjeta = totalTarjeta + x.totalValorAbono));

    return `L ${formatNumber(totalTarjeta)}`;
  };

  const calcularTotalAbonosCheque = (): string => {
    let calcularTotalCheque: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 3)
      .map(
        (x) => (calcularTotalCheque = calcularTotalCheque + x.totalValorAbono)
      );

    return `L ${formatNumber(calcularTotalCheque)}`;
  };

  const calcularTotalAbonos = (): string => {
    let total: number = 0;
    abonos.map((x) => (total = total + x.totalValorAbono));

    return `L ${formatNumber(total)}`;
  };

  const calculoTotal = (): string => {
    let totalAbonos: number = 0;
    abonos.map((x) => (totalAbonos = totalAbonos + x.totalValorAbono));

    let totalFacturasContado: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CTADO")
      .map((x) => (totalFacturasContado = totalFacturasContado + x.total));

    return `L ${formatNumber(totalAbonos + totalFacturasContado)}`;
  };

  const validarTotal = (): number => {
    let totalAbonos: number = 0;
    abonos.map((x) => (totalAbonos = totalAbonos + x.totalValorAbono));

    let totalFacturasContado: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CTADO")
      .map((x) => (totalFacturasContado = totalFacturasContado + x.total));

    return totalAbonos + totalFacturasContado;
  };

  const imprimirReporteCierre = async () => {
    const html = reporteCierreHTML(
      empresaInfo,
      user,
      calcularTotalFacturasContado(),
      calcularTotalFacturasCredito(),
      calcularTotalAbonosEfectivo(),
      calcularTotalAbonosTarjeta(),
      calcularTotalAbonosCheque(),
      calculoTotal()
    );

    //Imprimir
    try {
      await Print.printAsync({ html });
    } catch (error) {
      alert("Error al imprimir. Reconecte la impresora e intentelo de nuevo.");
    }
  };

  const renderRightControls = () => [
    <TopNavigationAction
      disabled={validarTotal() === 0}
      onPress={() => imprimirReporteCierre()}
      icon={(style) => (
        <Icon
          {...style}
          name="printer-outline"
          fill={validarTotal() === 0 ? "gray" : "green"}
        />
      )}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Reporte Liquidación"
        alignment="center"
        subtitle="Cierre del día"
        leftControl={<BackAction navigation={navigation} />}
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />

      <Layout style={{ flex: 1, justifyContent: "center" }}>
        <Card style={{ margin: 20 }}>
          <View>
            <Text
              status="primary"
              category="h2"
              style={{ fontWeight: "bold", textAlign: "center" }}
            >
              TOTAL
            </Text>
            <Text
              style={{
                textAlign: "center",
                alignContent: "center",
                fontWeight: "bold",
                paddingVertical: 10,
              }}
              category="h1"
            >
              {calculoTotal()}
            </Text>
          </View>
          <Divider style={{ backgroundColor: "#127906" }} />
          <View style={{ paddingVertical: 5 }}>
            <Text status="primary" category="h5" style={styles.cardTitle}>
              FACTURAS
            </Text>
            <Text
              style={{
                textAlign: "center",
                alignContent: "center",
                paddingVertical: 10,
              }}
              category="h3"
            >
              {calcularTotalFacturasContado()}
            </Text>
            <View style={styles.montos}>
              <View>
                <Text
                  style={{ textAlign: "center" }}
                  status="primary"
                  category="s2"
                >
                  Contado
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  status="basic"
                  category="s1"
                >
                  {calcularTotalFacturasContado()}
                </Text>
              </View>
              <View>
                <Text
                  style={{ textAlign: "center" }}
                  appearance="hint"
                  category="s2"
                >
                  Crédito
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  appearance="hint"
                  category="s1"
                >
                  {calcularTotalFacturasCredito()}
                </Text>
              </View>
            </View>
          </View>
          <Divider style={{ backgroundColor: "#127906" }} />
          <View style={{ paddingVertical: 5 }}>
            <Text status="primary" category="h5" style={styles.cardTitle}>
              COBRANZA
            </Text>
            <Text
              style={{
                textAlign: "center",
                alignContent: "center",
                paddingVertical: 10,
              }}
              category="h3"
            >
              {calcularTotalAbonos()}
            </Text>
            <View style={styles.montos}>
              <View>
                <Text
                  style={{ textAlign: "center" }}
                  status="primary"
                  category="s2"
                >
                  Efectivo
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  status="basic"
                  category="s1"
                >
                  {calcularTotalAbonosEfectivo()}
                </Text>
              </View>
              <View>
                <Text
                  style={{ textAlign: "center" }}
                  status="primary"
                  category="s2"
                >
                  Tarjeta
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  status="basic"
                  category="s1"
                >
                  {calcularTotalAbonosTarjeta()}
                </Text>
              </View>
              <View>
                <Text
                  style={{ textAlign: "center" }}
                  status="primary"
                  category="s2"
                >
                  Cheque
                </Text>
                <Text
                  style={{ textAlign: "center" }}
                  status="basic"
                  category="s1"
                >
                  {calcularTotalAbonosCheque()}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    //fontWeight: 'bold',
    textAlign: "center",
  },
  montos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
