import React from "react";
import { Divider, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
//Models
import { ICliente } from "../models/Cliente/ICliente";

export const HeaderCliente = React.memo(() => {
  const cliente: ICliente = useSelector((state) => state.variables.cliente);

  return (
    <>
      <Text style={styles.description} appearance="hint">
        {`Cliente : ${cliente.nombrecliente}`}
        {"\n"}
        {"\n"}
        {`Código : ${cliente.codigocliente}`}
      </Text>
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
    </>
  );
});

export default HeaderCliente;

const styles = StyleSheet.create({
  setting: {
    padding: 16,
  },
  description: {
    padding: 18,
  },
});
