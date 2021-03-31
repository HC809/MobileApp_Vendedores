import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Layout, Toggle, Text, Button, Modal, TopNavigation, TopNavigationAction, Icon, Divider, Input } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from "react-redux";
//Components
import { ConfigSettingSection } from '../components/Common/ConfigSettingSection';
//Actions
import { setVariables } from '../store/actions/general';
import { userLogout, changeTheme, cleanSyncInitData } from '../helpers/configuracion';
//Constants
import { THEME_DARK, THEME_LIGHT } from '../constants/Constants';
//Models
import { IFactura } from '../models/Factura/IFactura';
import { IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';

const window = Dimensions.get('window');

const ConfiguracionScreen = ({ navigation }) => {

  const dispatch = useDispatch();

  const theme: string = useSelector((state) => state.theme.theme);
  const userName: string = useSelector((state) => state.user.user);
  const facturas: IFactura[] = useSelector((state) => state.factura?.filter(x => x.sinc === false && x.anulado === 'N'));
  const abonos: IAbonoHeaderCXC[] = useSelector((state) => state.cobranza.abonos?.filter(x => x.sinc === false));

  const [visibleModalCerrarSesion, setVisibleModalCerrarSesion] = useState<boolean>(false);
  const [visibleModalFacPendientes, setVisibleModalFacPendientes] = useState<boolean>(false);
  const [visibleModalBorrarDatos, setVisibleModalBorrarDatos] = useState<boolean>(false);
  const [modoOscuro, setModoOscuro] = useState<boolean>(theme === THEME_DARK ? true : false);
  const [claveEliminarDatos, setClaveEliminarDatos] = useState<string>('');

  const handleBtnCerrarSesion = (fac_abonos_pendientes: boolean) => {
    dispatch(setVariables({ estado: 0 }));
    dispatch(userLogout(fac_abonos_pendientes))
  }

  const toggleModalCerrarSesion = (): void => {
    if (facturas.length > 0 || abonos.length > 0) {
      setVisibleModalFacPendientes(true);
      return;
    }

    setVisibleModalCerrarSesion(!visibleModalCerrarSesion);
  };

  const renderModalPreguntaCerrarSesion = () => (
    <Layout
      level='2'
      style={styles.modalContainer}>
      <Text category='h5'>Fin de Día</Text>
      <View style={{ borderColor: '#ffc107', borderWidth: 1, width: '100%', marginBottom: 10 }} />
      <Text category='s1' style={{ textAlign: 'center' }}>El cierre de sesión se realiza unicamente al finalizar su día. ¿Seguro que desea salir? </Text>

      <View style={styles.buttonContainer}>
        <Button
          status='basic'
          style={styles.button}
          onPress={toggleModalCerrarSesion}
          size="medium"
          appearance='outline'
        >Cancelar</Button>

        <Button
          status='warning'
          onPress={() => handleBtnCerrarSesion(false)}
          style={styles.button}
          size="medium"
        >Salir </Button>
      </View>
    </Layout>
  );

  const modalFacturasAbonosPendientes = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => { setVisibleModalFacPendientes(false) }}
        visible={visibleModalFacPendientes}>
        <Layout
          level='2'
          style={styles.modalContainer}>
          <Text category='h6'>Facturas o Abonos Pendientes</Text>
          <View style={{ borderColor: '#ffc107', borderWidth: 1, width: '100%', marginBottom: 10 }} />
          <Text category='s1' style={{ textAlign: 'center' }}>No puede salir, hay abonos o facturas pendientes de sincronizar.</Text>
          {/* <View style={styles.buttonContainer}> */}
          <Button
            status='basic'
            style={styles.singleButton}
            onPress={() => { setVisibleModalFacPendientes(false) }}
            size="medium"
            appearance='outline'
          >Ok</Button>

          {/* <Button
              status='warning'
              onPress={() => handleBtnCerrarSesion(true)}
              style={styles.button}
              size="medium"
            >Salir </Button> */}
          {/* </View> */}
        </Layout>
      </Modal>
    )
  }

  const eliminarDatos = () => {
    if (claveEliminarDatos === 'l@roc@*2020') {
      setClaveEliminarDatos('');
      dispatch(cleanSyncInitData());
      setVisibleModalBorrarDatos(false);
      alert("Los datos se eliminaron correctamnete. Puede sincronizar su inicio de día nuevamente.");
    }
    else {
      setClaveEliminarDatos('');
      setVisibleModalBorrarDatos(false);
      alert('Clave incorrecta. Esta accion solo la puede realizar un administrador.');
    }
  }

  const modalBorrarDatos = () => {
    return (
      <Modal
        backdropStyle={styles.redBackdrop}
        onBackdropPress={() => { }}
        visible={visibleModalBorrarDatos}>
        <Layout
          level='2'
          style={styles.modalContainer}>
          <Text category='h6'>Ingrese Clave</Text>
          <View style={{ borderColor: '#F40707', borderWidth: 1, width: '100%', marginBottom: 10 }} />

          <Input
            placeholder=''
            value={claveEliminarDatos}
            autoCapitalize='none'
            onChangeText={v => setClaveEliminarDatos(v)}
            size='medium'
            status='danger'
            secureTextEntry={true}
            maxLength={20}
            returnKeyType='done'
            autoCorrect={false}
            textStyle={{ textAlign: 'center', fontSize: 20 }}
          />

          <Text category='s1' style={{ textAlign: 'center' }}>
            Si hubieron facturas/abonos que no se pudieron sincronizar puede borrar los datos después de haberlos agregado manualmente en el sistema al final del día.
            ¿Seguro que desea borras todas las facturas y abonos?
            </Text>

          <View style={styles.buttonContainer}>
            <Button
              status='basic'
              style={styles.button}
              onPress={() => { setVisibleModalBorrarDatos(false) }}
              size="medium"
              appearance='outline'
            >Cancelar</Button>

            <Button
              status='danger'
              onPress={eliminarDatos}
              style={styles.button}
              size="medium"
            >Borrar </Button>
          </View>
        </Layout>
      </Modal>
    )
  }

  const toggleModoOscuro = (): void => {
    setModoOscuro(!modoOscuro);
    let tema = (theme === THEME_DARK) ? THEME_LIGHT : THEME_DARK;
    dispatch(changeTheme(tema));
  };

  const DrawerAction = () => (
    <TopNavigationAction
      icon={(props) => <Icon {...props} name='menu' />}
      onPress={navigation.toggleDrawer
      }
    />
  )

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={styles.container}>

        <TopNavigation
          title='Configuración' alignment='center' subtitle='General'
          leftControl={DrawerAction()}
        />
        <Divider style={{ backgroundColor: '#5DDB6F' }} />

        <ConfigSettingSection
          style={styles.setting}
          hint={"Usuario"}
          onPress={() => { navigation.navigate('Home') }}
        ><Text>{userName}</Text></ConfigSettingSection>

        <ConfigSettingSection
          style={[styles.setting]}
          hint='Modo Oscuro'
          onPress={toggleModoOscuro}>
          <Toggle
            checked={modoOscuro}
            onChange={toggleModoOscuro}
          />
        </ConfigSettingSection>

        <ConfigSettingSection
          style={styles.setting}
          hint='Impresora'
          onPress={() => navigation.navigate('DispositivosBTScreen')}
        />

        <ConfigSettingSection
          style={styles.setting}
          hint='Borrar Datos'
          onPress={() => setVisibleModalBorrarDatos(true)}
        />

        <ConfigSettingSection
          style={styles.setting}
          hint='Finalizar Día (Cerrar sesión)'
          onPress={toggleModalCerrarSesion}
        />

        <Modal
          backdropStyle={styles.backdrop}
          onBackdropPress={toggleModalCerrarSesion}
          visible={visibleModalCerrarSesion}>
          {renderModalPreguntaCerrarSesion()}
        </Modal>
      </Layout>

      {visibleModalFacPendientes && modalFacturasAbonosPendientes()}
      {visibleModalBorrarDatos && modalBorrarDatos()}
    </SafeAreaView>
  );
};

export default ConfiguracionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  setting: {
    padding: 16,
  },
  section: {
    paddingTop: 32,
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderRadius: 10,
    marginBottom: 200
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  redBackdrop: {
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10
  },
  button: {
    marginHorizontal: 5,
    width: '45%'
  },
  singleButton: {
    margin: 10
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});