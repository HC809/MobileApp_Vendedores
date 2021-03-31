import React from 'react';
import { useSelector } from 'react-redux';
//Navigation
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//Components
import HomeDrawer from './HomeDrawer';
//Constants
import { THEME_LIGHT } from '../constants/Constants';
//Screens
import LoginScreen from '../screens/LoginScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
import InicioDiaScreen from '../screens/InicioDiaScreen';
import { CobradoScreen } from '../screens/CobradoScreen';
import { VendidoScreen } from '../screens/VendidoScreen';
import Clientes from '../screens/ClientesScreen';
import Gestiones from '../screens/GestionesScreen';
import { ListaProductosFacturarScreen } from '../screens/ListaProductosFacturarScreen';
import { ListaProductosClienteScreen } from '../screens/ListaProductosClienteScreen';
import { FacturacionResumenScreen } from '../screens/FacturacionResumenScreen';
import { ListaFacturasClienteScreen } from '../screens/ListaFacturasClienteScreen';
import { DetalleFacturaScreen } from '../screens/DetalleFacturaScreen';
import { CobranzaScreen } from '../screens/CobranzaScreen';
import { SincronizacionesParcialesScreen } from '../screens/SincronizacionesParciales';
import { AbonoDetalleScreen } from '../screens/AbonoDetalleScreen';
import { ReporteCierreScreen } from '../screens/ReporteCierreScreen';
import { FiscalScreen } from '../screens/FiscalScreen';
import { InventarioScreen } from '../screens/InventarioScreen';
import { AgregarProductoScreen } from '../screens/AgregarProductoScreen';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

//Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Login' component={LoginScreen} />
  </Stack.Navigator>
);

//Home Navigator
const HomeNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Home' component={PerfilScreen} />
  </Stack.Navigator>
);

//Cobrado Navigator
const VendidoNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Vendido' component={VendidoScreen} />
    <Stack.Screen name='c_fac_detalle' component={DetalleFacturaScreen} />
  </Stack.Navigator>
);

//Vendido Navigator
const CobradoNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Cobrado' component={CobradoScreen} />
    <Stack.Screen name='DetalleAbono' component={AbonoDetalleScreen} />
  </Stack.Navigator>
);

const ReporteCierreNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='ReporteCierre' component={ReporteCierreScreen} />
  </Stack.Navigator>
);

const ReporteInventarioNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='ReporteInventario' component={InventarioScreen} />
  </Stack.Navigator>
);

const BottomTabBarConfiguracion = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='General' icon={p => <Icon {...p} name="settings-outline" />} />
    <BottomNavigationTab title='Sincronización' icon={p => <Icon {...p} name="sync-outline" />} />
  </BottomNavigation>
);

const BottomConfiguracionTabNavigator = () => (
  <BottomTab.Navigator tabBar={props => <BottomTabBarConfiguracion {...props} />}>
    <BottomTab.Screen name='_Configuracion' component={ConfiguracionNavigator} />
    <BottomTab.Screen name='SincronizacionScreen' component={SincronizacionesParcialesScreen} />
  </BottomTab.Navigator>
);

const FiscalDiaNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Fiscal' component={FiscalScreen} />
  </Stack.Navigator>
);

//Configuracion Navigator
const ConfiguracionNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Configuracion' component={ConfiguracionScreen} />
  </Stack.Navigator>
);

//InicioDia Navigator
const InicioDiaNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='InicioDia' component={InicioDiaScreen} />
  </Stack.Navigator>
);

const BottomTabBarMiDia = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='Vendido' icon={p => <Icon {...p} name="credit-card-outline" />} />
    <BottomNavigationTab title='Cobrado' icon={p => <Icon {...p} name="credit-card-outline" />} />
    <BottomNavigationTab title='Reporte Cierre' icon={p => <Icon {...p} name="file-text-outline" />} />
    <BottomNavigationTab title='Inventario' icon={p => <Icon {...p} name="car-outline" />} />
  </BottomNavigation>
);

//MiDia Navigator
const MiDiaNavigator = () => (
  <BottomTab.Navigator tabBar={props => <BottomTabBarMiDia {...props} />}>
    <BottomTab.Screen name='_Vendido' component={VendidoNavigator} />
    <BottomTab.Screen name='_Cobrado' component={CobradoNavigator} />
    <BottomTab.Screen name='_ReporteCierrre' component={ReporteCierreNavigator} />
    <BottomTab.Screen name='_ReporteInventario' component={ReporteInventarioNavigator} />
  </BottomTab.Navigator>
);

const BottomTabBarFacturacion = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='Detalle' icon={p => <Icon {...p} name="list-outline" />} />
    <BottomNavigationTab title='Resumen' icon={p => <Icon {...p} name="file-text-outline" />} />
  </BottomNavigation>
);

const BottomFacturacion = () => (
  <BottomTab.Navigator initialRouteName="ListaProductosFacturarScreen" tabBar={props => <BottomTabBarFacturacion {...props} />}>
    <BottomTab.Screen name='ListaProductosFacturarScreen' component={ListaProductosFacturarScreen} />
    <BottomTab.Screen name='FacturacionResumenScreen' component={FacturacionResumenScreen} />
  </BottomTab.Navigator>
);

//Clientes Navigator
const ClientesNavigator = () => (
  <Stack.Navigator headerMode='none'>
    <Stack.Screen name='Clientes' component={Clientes} />
    <Stack.Screen name='c_Gestiones' component={Gestiones} />
    <Stack.Screen name='FacturacionScreen' component={BottomFacturacion} />
    <Stack.Screen name='ListaProductosClienteScreen' component={ListaProductosClienteScreen} />
    <Stack.Screen name='ListaFacturasClienteScreen' component={ListaFacturasClienteScreen} />
    <Stack.Screen name='AgregarProductoScreen' component={AgregarProductoScreen} />
    <Stack.Screen name='DetalleFacturaScreen' component={DetalleFacturaScreen} />
    <Stack.Screen name='CobranzaScreen' component={CobranzaScreen} />
  </Stack.Navigator>
);

const MyDrawerNavigator = ({ theme }): React.ReactElement => {
  return (
    <Drawer.Navigator
      screenOptions={{ gestureEnabled: true }}
      drawerStyle={theme !== THEME_LIGHT ? { backgroundColor: "rgb(34, 43, 69)" } : { backgroundColor: "white" }}
      drawerContent={props => <HomeDrawer {...props} />}
    >
      <Drawer.Screen name='Home' component={HomeNavigator} />
      <Drawer.Screen name='MiDia' component={MiDiaNavigator} />
      <Drawer.Screen name='Clientes' component={ClientesNavigator} />
      <Drawer.Screen name='IniciarDia' component={InicioDiaNavigator} />
      <Drawer.Screen name='Fiscal' component={FiscalDiaNavigator} />
      <Drawer.Screen name='Configuracion' component={BottomConfiguracionTabNavigator} />
    </Drawer.Navigator>
  )
};

const AppNavigator = () => {
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector((state) => state.user.user);

  return (
    <NavigationContainer>
      {user ? <MyDrawerNavigator theme={theme} /> : <AuthNavigator />}
    </NavigationContainer>
  )
};

export default AppNavigator;