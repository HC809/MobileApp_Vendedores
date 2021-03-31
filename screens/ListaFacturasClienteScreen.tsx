import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  Divider,
  Layout,
  TopNavigation,
  Text,
  List,
  Card,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
//Models
import { IFactura } from "../models/Factura/IFactura";
//Helpers
import { formatNumber } from "../helpers/functions/functions";
//Components
import { BackAction } from "../components/Common/BackAction";
import HeaderCliente from "../components/HeaderCliente";
//Store
import { ICliente } from "../models/Cliente/ICliente";

export const ListaFacturasClienteScreen = ({ navigation }) => {
  const facturas: IFactura[] = useSelector((state) => state.factura);
  const cliente: ICliente = useSelector((state) => state.variables.cliente);

  const [listaFacturasCliente, setListaFacturasCliente] = useState(
    facturas.filter((x) => x.idcliente === cliente.idcliente)
  );

  useEffect(() => {
    setListaFacturasCliente(
      facturas.filter((x) => x.idcliente === cliente.idcliente)
    );
  }, [cliente]);

  const renderItem = ({ item, index }: { item: IFactura; index: number }) => {
    return (
      <Card
        style={styles.item}
        status="basic"
        onPress={() => {
          navigation.navigate("c_fac_detalle", {
            idfactura: item.numerofactura,
          });
        }}
      >
        <Text category="s2">
          {`${item.numerofactura} - Total : ${formatNumber(item.total)}  `}
          <Text style={{ fontStyle: "italic" }}>
            {`${item.anulado === "S" ? "(Anulada)" : ""}`}
          </Text>
        </Text>

        <Divider />

        <Text appearance="hint" category="c1">
          {`Correlativo : ${item.faccorrelativo}`}
          <Text style={{ fontStyle: "italic" }}>
            {`${item.sinc ? "(Sincronizada)" : ""}`}
          </Text>
        </Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Facturas"
        alignment="center"
        subtitle="Lista de Facturas"
        leftControl={<BackAction navigation={navigation} />}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={{ flex: 1 }}>
        <HeaderCliente />
        <List
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={listaFacturasCliente}
          renderItem={renderItem}
          keyExtractor={(_, i) => i + "c"}
          keyboardShouldPersistTaps={"handled"}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
