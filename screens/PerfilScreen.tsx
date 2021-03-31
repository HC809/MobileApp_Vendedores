import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Layout,
  StyleService,
  useStyleSheet,
  Avatar,
  TopNavigation,
  Divider,
} from "@ui-kitten/components";
import { connect } from "react-redux";
//Models
import { IUsuario } from "../models/Usuario/IUsuario";
//Actions
import { setVariables } from "../store/actions/general";
//Components
import { ProfileSetting } from "../components/Common/ProfileSetting";
import { DrawerAction } from "../components/Common/DrawerAction";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface IProps {
  navigation: any;
  user: IUsuario;
  estado: number;
  setVariables: (payload: any) => any;
}

const index = ({
  navigation,
  user,
  estado,
  setVariables,
}: IProps): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  //por si se cancela la sincronizacion y queda en el aire se devuelve a sus estados
  useEffect(() => {
    if (estado === -1) {
      setVariables({ estado: 0 });
    }
    if (estado === -2) {
      setVariables({ estado: 1 });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title="Inicio"
        alignment="center"
        subtitle="Perfil Agente"
        leftControl={<DrawerAction navigation={navigation} />}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={styles.photoSection} level="1">
        <Avatar
          size="medium"
          shape="round"
          source={require("../assets/LaRocaLogo.png")}
        />
        <View style={styles.nameSection}>
          <ProfileSetting
            style={styles.setting}
            value={user.info.descripcioncorta}
          />
          <ProfileSetting
            style={styles.setting}
            value={user.info.descripcionlarga}
          />
        </View>
      </Layout>
      <ScrollView>
        <ProfileSetting
          style={styles.setting}
          hint="Usuario"
          value={user.user}
        />
        <ProfileSetting
          style={styles.setting}
          hint="Código Agente"
          value={user.info.codigoagentes}
        />
        <ProfileSetting
          style={styles.setting}
          hint="Tipo Agente"
          value={user.info.descTipoAgente}
        />
        <ProfileSetting
          style={styles.setting}
          hint="POS"
          value={user.info.flagpos ? "Sí" : "No"}
        />
        <ProfileSetting
          style={[styles.setting, styles.emailSetting]}
          hint="Sucursal"
          value={user.info.descSucursal}
        />
        <ProfileSetting
          style={[styles.setting]}
          hint="Código Ruta"
          value={user.info.codigoruta}
        />
        <ProfileSetting
          style={[styles.setting]}
          hint="Ruta"
          value={user.info.ruta.toString()}
        />
        <ProfileSetting
          style={[styles.setting]}
          hint="Bodega"
          value={user.info.bodega}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  estado: state.variables.estado,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setVariables: (payload: any) => {
      return dispatch(setVariables(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  photoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  photo: {
    aspectRatio: 1.0,
    height: 76,
  },
  photoButton: {
    aspectRatio: 1.0,
    height: 32,
    borderRadius: 16,
  },
  nameSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  description: {
    padding: 24,
    backgroundColor: "background-basic-color-1",
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  setting: {
    padding: 16,
  },
  emailSetting: {
    marginTop: 24,
  },
});
