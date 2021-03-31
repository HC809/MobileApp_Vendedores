import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import {
  Avatar,
  Divider,
  Drawer,
  DrawerElement,
  DrawerHeaderElement,
  DrawerHeaderFooter,
  DrawerHeaderFooterElement,
  Layout,
  MenuItemType,
  Text,
} from '@ui-kitten/components';
import { connect } from 'react-redux';

interface miMenuitem extends MenuItemType {
  auth: number
}

const DATA: miMenuitem[] = [
  { title: 'Perfil', auth: 0 },
  { title: 'Mi Día', auth: 0 },
  { title: 'Clientes', auth: 0 },
  { title: 'Iniciar Día', auth: 1 },
  { title: 'Inf. Fiscal', auth: 1 },
  { title: 'Configuración', auth: 0 },
];


const HomeDrawer = ({ navigation, estado }): DrawerElement => {

  const noAutorizado = () => {
    alert('Para atender clientes debe de iniciar su día.');
    navigation.navigate('IniciarDia');
  }

  const onItemSelect = (index: number): void => {
    switch (index) {
      case 0: {
        navigation.toggleDrawer();
        navigation.navigate('Home');
        return;
      }
      case 1: {
        navigation.toggleDrawer();
        navigation.navigate('MiDia');
        return;
      }
      case 2: {
        navigation.toggleDrawer();
        if (!estado) {
          noAutorizado();
          return
        }
        navigation.navigate('Clientes');
        return;
      }
      case 3: {
        navigation.toggleDrawer();
        navigation.navigate('IniciarDia');
        return;
      }
      case 4: {
        navigation.toggleDrawer();
        if (!estado) {
          alert('Para ver la información fiscal debe de iniciar su día.');
          navigation.navigate('IniciarDia');
          return
        }
        navigation.navigate('Fiscal');
        return;
      }
      case 5: {
        navigation.toggleDrawer();
        navigation.navigate('Configuracion');
        return;
      }
    }
  };

  const renderHeader = (): DrawerHeaderElement => (
    <Layout
      style={styles.header}
      level='2'>
      <View style={styles.profileContainer}>
        <Avatar
          size='small'
          source={require('../assets/LaRocaLogo.png')}
        />
        <Text
          style={styles.profileName}
          category='h6'>
          Comercial La Roca
        </Text>
      </View>
    </Layout>
  );

  const renderFooter = (): DrawerHeaderFooterElement => (
    <React.Fragment>
      <Divider style={{ backgroundColor: '#5DDB6F' }} />
      <DrawerHeaderFooter
        disabled={true}
        description={`SIAD v.LION 1.0.6`}
      />
    </React.Fragment>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        style={styles.safeArea}
      >
        <Drawer
          header={renderHeader}
          footer={renderFooter}
          data={DATA}
          onSelect={onItemSelect}
        />
      </Layout>
    </SafeAreaView>
  );
};

const mapThemeStateToProps = state => ({ estado: (state.variables.estado || 0) })
export default connect(mapThemeStateToProps, null)(HomeDrawer);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 16,
  },
});