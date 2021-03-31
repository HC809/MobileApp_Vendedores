import React from "react";
import {
  Divider,
  StyleService,
  Text,
  TopNavigation,
  useStyleSheet,
} from "@ui-kitten/components";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
//Components
import { DrawerAction } from "../components/Common/DrawerAction";
//Models
import { IInfoMain, IRegistroCai } from "../models/Fiscal";
//Components
import { ProfileSetting } from "../components/Common/ProfileSetting";
//Helpers
import { dateFormat } from "../helpers/functions/functions";

export const FiscalScreen = ({ navigation }) => {
  const styles = useStyleSheet(themedStyles);

  const infFiscal: IInfoMain = useSelector((state) => state.fiscal.INFO_MAIN);
  const registroCaiFacturasActivo: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_A
  );
  const registroCaiFacturasEnProceso: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_E
  );
  const registroCaiRecibos: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_R
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title="Información Fiscal"
        alignment="center"
        subtitle="Facturas / Recibos"
        leftControl={<DrawerAction navigation={navigation} />}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <ScrollView>
        <ProfileSetting
          style={styles.setting}
          hint="Sucursal"
          value={infFiscal?.establecimiento}
        />
        <ProfileSetting
          style={styles.setting}
          hint="Punto de Emisión"
          value={infFiscal?.puntoemision}
        />
        <ProfileSetting
          style={styles.setting}
          hint="Código Punto Emisión"
          value={infFiscal?.codigopuntoemision}
        />
        <Divider style={{ backgroundColor: "#5DDB6F" }} />

        <Text
          status="basic"
          category="s1"
          style={{ textAlign: "center", marginVertical: 10 }}
        >
          Registro CAI Facturas (En Uso)
        </Text>
        <Divider style={{ backgroundColor: "#5DDB6F" }} />
        {registroCaiFacturasActivo ? (
          <View>
            <ProfileSetting
              style={styles.settingSpace}
              hint="CAI"
              value={registroCaiFacturasActivo?.codigocai}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Inicio Emisión"
              value={dateFormat(registroCaiFacturasActivo?.fechainicioemision)}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Limite Emisión"
              value={dateFormat(registroCaiFacturasActivo?.fechalimiteemision)}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Inicio"
              value={registroCaiFacturasActivo?.rangoinicial.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Final"
              value={registroCaiFacturasActivo?.rangofinal.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Actual"
              value={(registroCaiFacturasActivo?.numeroactual - 1 ===
              registroCaiFacturasActivo?.rangoinicial
                ? 0
                : registroCaiFacturasActivo?.numeroactual - 1
              ).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Siguiente"
              value={(registroCaiFacturasActivo?.numeroactual).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Números Disponibles"
              value={(
                registroCaiFacturasActivo?.rangofinal -
                registroCaiFacturasActivo?.numeroactual +
                1
              ).toString()}
            />
            <Divider style={{ backgroundColor: "#5DDB6F" }} />
          </View>
        ) : (
          <ProfileSetting
            style={styles.settingSpace}
            hint="No tiene asignado"
            value=""
          />
        )}

        <Text
          status="basic"
          category="s1"
          style={{ textAlign: "center", marginVertical: 10 }}
        >
          Registro CAI Facturas (En Espera)
        </Text>
        <Divider style={{ backgroundColor: "#5DDB6F" }} />
        {registroCaiFacturasEnProceso ? (
          <View>
            <ProfileSetting
              style={styles.settingSpace}
              hint="CAI"
              value={registroCaiFacturasEnProceso?.codigocai}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Inicio Emisión"
              value={dateFormat(
                registroCaiFacturasEnProceso?.fechainicioemision
              )}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Limite Emisión"
              value={dateFormat(
                registroCaiFacturasEnProceso?.fechalimiteemision
              )}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Inicio"
              value={registroCaiFacturasEnProceso?.rangoinicial.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Final"
              value={registroCaiFacturasEnProceso?.rangofinal.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Actual"
              value={(registroCaiFacturasEnProceso?.numeroactual - 1 ===
                registroCaiFacturasEnProceso?.rangoinicial
                ? 0
                : registroCaiFacturasEnProceso?.numeroactual - 1
              ).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Siguiente"
              value={(registroCaiFacturasEnProceso?.numeroactual).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Números Disponibles"
              value={(
                registroCaiFacturasEnProceso?.rangofinal -
                registroCaiFacturasEnProceso?.numeroactual +
                1
              ).toString()}
            />
          </View>
        ) : (
          <ProfileSetting
            style={styles.settingSpace}
            hint="No tiene asignado"
            value=""
          />
        )}
        <Divider style={{ backgroundColor: "#5DDB6F" }} />
        <Text
          status="basic"
          category="s1"
          style={{ textAlign: "center", marginVertical: 10 }}
        >
          Registro CAI Recibos
        </Text>
        <Divider style={{ backgroundColor: "#5DDB6F" }} />
        {registroCaiRecibos ? (
          <View>
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Inicio Emisión"
              value={dateFormat(registroCaiRecibos?.fechainicioemision)}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Fecha Limite Emisión"
              value={dateFormat(registroCaiRecibos?.fechalimiteemision)}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Inicio"
              value={registroCaiRecibos?.rangoinicial.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Rango Final"
              value={registroCaiRecibos?.rangofinal.toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Actual"
              value={(registroCaiRecibos?.numeroactual - 1 ===
                registroCaiRecibos?.rangoinicial
                ? 0
                : registroCaiRecibos?.numeroactual - 1
              ).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Número Siguiente"
              value={(registroCaiRecibos?.numeroactual).toString()}
            />
            <ProfileSetting
              style={styles.settingSpace}
              hint="Números Disponibles"
              value={(
                registroCaiRecibos?.rangofinal -
                registroCaiRecibos?.numeroactual +
                1
              ).toString()}
            />
          </View>
        ) : (
          <ProfileSetting
            style={styles.settingSpace}
            hint="No tiene asignado"
            value=""
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  setting: {
    padding: 8,
  },
  settingSpace: {
    padding: 6,
  },
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
});
