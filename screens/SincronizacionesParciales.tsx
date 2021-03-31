import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, TopNavigation, Divider, Text } from '@ui-kitten/components';
import { SyncPartialSection } from '../components/Common/SyncParcialSection';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trackPromise } from 'react-promise-tracker';
import { useSelector, useDispatch } from "react-redux";
//Helpers Fetch
import { refetchClientes } from '../helpers/sincronizaciones-parciales/refetchClientes';
import { refetchProductos } from '../helpers/sincronizaciones-parciales/refetchProductos';
import { refetchPrecios } from '../helpers/sincronizaciones-parciales/refetchPrecios';
import { refetchDescuentos } from '../helpers/sincronizaciones-parciales/refetchDescuentos';
import { refetchGeneral } from '../helpers/sincronizaciones-parciales/refetchGeneral';
import { refetchFiscal } from '../helpers/sincronizaciones-parciales/refetchFiscal';
//Components
import { DrawerAction } from '../components/Common/DrawerAction';
import { ModalResincronizar } from '../components/ModalResincronizar';
import { SyncIndicator } from '../components/Common/SyncIndicator';
import { SuccesModal } from '../components/Common/SuccesModal';
import { ErrorModal } from '../components/Common/ErrorModal';
//Models
import { InfoAgente } from '../models/Usuario/IUsuario';
import { IFactura } from '../models/Factura/IFactura';
import { IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';

export const SincronizacionesParcialesScreen = ({ navigation }) => {

  const dispatch = useDispatch();
  const estado = useSelector(state => state.variables.estado);
  const agenteInfo: InfoAgente = useSelector(state => state.user.info);
  const facturas: IFactura[] = useSelector(state => state.factura?.filter(x => x.sinc === false && x.anulado === 'N'));
  const abonos: IAbonoHeaderCXC[] = useSelector(state => state.cobranza.abonos?.filter(x => x.sinc === false));

  //Modals
  const [visibleModalSincClientes, setVisibleModalSincClientes] = useState<boolean>(false);
  const [visibleModalSincProductos, setVisibleModalSincProductos] = useState<boolean>(false);
  const [visibleModalSincPrecio, setVisibleModalSincPrecio] = useState<boolean>(false);
  const [visibleModalSincDescuentos, setVisibleModalSincDescuentos] = useState<boolean>(false);
  const [visibleModalSincFiscal, setVisibleModalSincFiscal] = useState<boolean>(false);
  const [visibleModalSincGeneral, setVisibleModalSincGeneral] = useState<boolean>(false);

  //General Modal
  const [pregunta, setPregunta] = useState('');
  const [idSyncRefetch, setIdSyncRefetch] = useState('');
  const [visibleModalPregunta, setVisibleModalPregunta] = useState<boolean>(false);

  //Success Modal
  const [visibleSuccessModal, setVisibleSuccessModal] = useState<boolean>(false);
  //Error Modal
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [visibleErrorModal, setVisibleErrorModal] = useState<boolean>(false);

  useEffect(() => {
    if (visibleModalPregunta && visibleModalSincClientes) setVisibleModalSincClientes(false);
    if (visibleModalPregunta && visibleModalSincProductos) setVisibleModalSincProductos(false);
    if (visibleModalPregunta && visibleModalSincPrecio) setVisibleModalSincPrecio(false);
    if (visibleModalPregunta && visibleModalSincDescuentos) setVisibleModalSincDescuentos(false);
    if (visibleModalPregunta && visibleModalSincFiscal) setVisibleModalSincFiscal(false);
    if (visibleModalPregunta && visibleModalSincGeneral) setVisibleModalSincGeneral(false);
  }, [visibleModalPregunta])

  //Modal Sync Clientes
  useEffect(() => {
    if (visibleModalSincClientes) {
      setPregunta('Desea sincronizar clientes nuevamente?');
      setIdSyncRefetch('CLIENTES');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincClientes]);

  //Modal Sync Productos
  useEffect(() => {
    if (visibleModalSincProductos) {
      setPregunta('Desea sincronizar productos nuevamente?');
      setIdSyncRefetch('PRODUCTOS');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincProductos]);

  //Modal Sync Precios
  useEffect(() => {
    if (visibleModalSincPrecio) {
      setPregunta('Desea sincronizar precios nuevamente?');
      setIdSyncRefetch('PRECIOS');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincPrecio]);

  //Modal Sync Descuentos
  useEffect(() => {
    if (visibleModalSincDescuentos) {
      setPregunta('Desea sincronizar descuentos nuevamente?');
      setIdSyncRefetch('DESCUENTOS');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincDescuentos]);

  //Modal Sync Fiscal
  useEffect(() => {
    if (visibleModalSincFiscal) {
      setPregunta('Desea sincronizar la información fiscal nuevamente?');
      setIdSyncRefetch('FISCAL');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincFiscal]);

  //Modal Sync General
  useEffect(() => {
    if (visibleModalSincGeneral) {
      setPregunta('Desea sincronizar la información general nuevamente?');
      setIdSyncRefetch('GENERAL');
      setVisibleModalPregunta(true);
    }
  }, [visibleModalSincGeneral]);

  const modalPreguntaResincronizacion = () => {
    return (
      <ModalResincronizar
        pregunta={pregunta}
        isVisible={visibleModalPregunta}
        setIsVisible={setVisibleModalPregunta}
        syncRefetch={syncRefetch}
      />
    )
  }

  const successSyncModal = () => {
    return (
      <SuccesModal
        visibleModal={visibleSuccessModal}
        setVisibleModal={setVisibleSuccessModal}
        title="Finalizado"
        text="Sincronización realizada correctamente."
      />
    )
  }

  const errorSyncModal = () => {
    return (
      <ErrorModal
        visibleModal={visibleErrorModal}
        setVisibleModal={setVisibleErrorModal}
        title="Error"
        text={errorMessage}
      />
    )
  }

  const showErrorModal = (error) => {
    setErrorMessage(JSON.stringify(error.data) + ` Estado : ${error.status}`);
    setVisibleErrorModal(true);
  }

  const limpiarVariables = () => {
    setPregunta('');
    setIdSyncRefetch('');
    setErrorMessage('');
  }

  const syncRefetch = () => {
    setVisibleModalPregunta(false);

    switch (idSyncRefetch) {
      case 'CLIENTES':
        trackPromise(
          dispatch(refetchClientes(agenteInfo.idagentes)), 'l-cc'
        ).then(() => {
          setVisibleSuccessModal(true);
        }).catch((error) => {
          showErrorModal(error);
        }).finally(() => {
          limpiarVariables();
        });

        return;

      case 'PRODUCTOS':
        if (facturas.length > 0 || abonos.length > 0) {
          alert("Tiene facturas o abonos pendientes de sincronizar.");
        }
        else {
          trackPromise(
            dispatch(refetchProductos(agenteInfo.idbodega)), 'l-cc'
          ).then(() => {
            setVisibleSuccessModal(true);
          }).catch((error) => {
            showErrorModal(error);
          }).finally(() => {
            limpiarVariables();
          });
        }

        return;

      case 'PRECIOS':
        trackPromise(
          dispatch(refetchPrecios(agenteInfo.idbodega, agenteInfo.idsucursal)), 'l-cc'
        ).then(() => {
          setVisibleSuccessModal(true);
        }).catch((error) => {
          showErrorModal(error);
        }).finally(() => {
          limpiarVariables();
        });

        return;

      case 'DESCUENTOS':
        trackPromise(
          dispatch(refetchDescuentos(agenteInfo.idbodega)), 'l-cc'
        ).then(() => {
          setVisibleSuccessModal(true);
        }).catch((error) => {
          showErrorModal(error);
        }).finally(() => {
          limpiarVariables();
        });

        return;

      case 'FISCAL':
        if (facturas.length > 0 || abonos.length > 0) {
          alert("Tiene facturas o abonos pendientes de sincronizar.");
        }
        else {
          trackPromise(
            dispatch(refetchFiscal(agenteInfo.idagentes)), 'l-cc'
          ).then(() => {
            setVisibleSuccessModal(true);
          }).catch((error) => {
            showErrorModal(error);
          }).finally(() => {
            limpiarVariables();
          });
        }

        return;

      case 'GENERAL':
        trackPromise(
          dispatch(refetchGeneral(agenteInfo.idsucursal)), 'l-cc'
        ).then(() => {
          setVisibleSuccessModal(true);
        }).catch((error) => {
          showErrorModal(error);
        }).finally(() => {
          limpiarVariables();
        });

      default:
        limpiarVariables();
        return;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SyncIndicator area="l-cc" />
      <Layout style={styles.container}>

        <TopNavigation
          title='Sincronización Parcial' alignment='center' subtitle='Seleccionar'
          leftControl={<DrawerAction navigation={navigation} />}
        />

        <Divider style={{ backgroundColor: '#5DDB6F' }} />

        {(!estado)
          ? (
            <View style={styles.content}>
              <Text category='s1'>Inicio de día necesario.</Text>
            </View>
          )
          : (
            <View>
              <SyncPartialSection
                style={styles.setting}
                hint='Clientes'
                iconName='people-outline'
                onPress={() => setVisibleModalSincClientes(true)}
              />
              <SyncPartialSection
                style={styles.setting}
                hint='Inventario / Productos'
                iconName='storage'
                onPress={() => setVisibleModalSincProductos(true)}
              />
              <SyncPartialSection
                style={styles.setting}
                hint='Precios y Grupos'
                iconName='credit-card'
                onPress={() => setVisibleModalSincPrecio(true)}
              />
              <SyncPartialSection
                style={styles.setting}
                hint='Descuentos Escala / Tipo Venta'
                iconName='local-offer'
                onPress={() => setVisibleModalSincDescuentos(true)}
              />
              <SyncPartialSection
                style={styles.setting}
                hint='Información Fiscal'
                iconName='receipt'
                onPress={() => setVisibleModalSincFiscal(true)}
              />
              <SyncPartialSection
                style={styles.setting}
                hint='Información General'
                iconName='info'
                onPress={() => setVisibleModalSincGeneral(true)}
              />
            </View>
          )
        }

        {visibleModalPregunta && modalPreguntaResincronizacion()}
        {visibleSuccessModal && successSyncModal()}
        {visibleErrorModal && errorSyncModal()}
      </Layout>
    </SafeAreaView>
  );
};

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});