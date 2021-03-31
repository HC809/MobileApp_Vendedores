import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Calendar,
  Text,
  TopNavigation,
  Divider,
  Icon,
  Modal,
} from "@ui-kitten/components";
import { Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar, Colors } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
//Helpers
import { fetchClientes } from "../helpers/fetchClientes";
import { fetchProductos } from "../helpers/fetchProductos";
import { fetchGeneral } from "../helpers/fetchGeneral";
import { fetchFiscal } from "../helpers/fetchFiscal";
import { fetchPrecios } from "../helpers/fetchPrecios";
import { fetchDescuentos } from "../helpers/fetchDescuentos";
import { fetchFacturas } from "../helpers/fetchFacturas";
//Actions
import { setVariables, cleanFetchErrors } from "../store/actions/general";
import {
  LimpiarDatos,
  LimpiarDatosSinFacturasYAbonos,
} from "../helpers/configuracion";
//Componentes
import { DrawerAction } from "../components/Common/DrawerAction";
import { ErrorModal } from "../components/Common/ErrorModal";
import { SuccesModal } from "../components/Common/SuccesModal";
import { WarningModal } from "../components/Common/WarningModal";
//Models
import { InfoAgente } from "../models/Usuario/IUsuario";
import { IErroresFetch } from "../models/Variables/erroresFetch";
import { IFactura } from "../models/Factura/IFactura";
import { IAbonoHeaderCXC } from "../models/Factura/IAbonoCXC";

const window = Dimensions.get("window");

const InicioDiaScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const agenteInfo: InfoAgente = useSelector((state) => state.user.info);
  const estado: number = useSelector((state) => state.variables.estado);
  const erroresSincronizacion: IErroresFetch[] = useSelector(
    (state) => state.variables.fetchErrors
  );
  const contadorFetchInicio: number = useSelector(
    (state) => state.variables.CONT_FETCH_INICIO
  );

  //Success Modal
  const [visibleSuccessModal, setVisibleSuccessModal] = useState<boolean>(
    false
  );

  //Error Modal
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [visibleErrorModal, setVisibleErrorModal] = useState<boolean>(false);

  const [date, setDate] = useState(new Date());
  const [
    porcentajeSincronizacion,
    setporcentajeSincronizacion,
  ] = useState<number>(1);
  const [visibleModalSincDia, setvisibleModalSincDia] = useState(false);
  const [finishFetch, setFinishFetch] = useState<boolean>(false);

  //Error conexion modal
  const [
    visibleModalErrorConexion,
    setVisibleModalErrorConexion,
  ] = useState<boolean>(false);

  //Si hay abonos o fac pendientes del dia anterior no eliminarlos
  const facturas: IFactura[] = useSelector((state) =>
    state.factura?.filter((x) => x.sinc === false)
  );
  const abonos: IAbonoHeaderCXC[] = useSelector((state) =>
    state.cobranza.abonos?.filter((x) => x.sinc === false)
  );

  const ModalErrorConexion = () => {
    return (
      <WarningModal
        title="Error de Conexión"
        text="Verifique que tenga conexión a internet e intente de nuevo."
        visibleModal={visibleModalErrorConexion}
        setVisibleModal={setVisibleModalErrorConexion}
      />
    );
  };

  //Valida que la sync haya finalizado con o sin errores y luego muestra un modal de success/error
  useEffect(() => {
    if (erroresSincronizacion.length > 0 && finishFetch) {
      setErrorMessage(erroresSincronizacion[0]?.messageError);
      setVisibleErrorModal(true);
      setFinishFetch(false);
      dispatch(cleanFetchErrors());
    } else if (finishFetch) {
      setErrorMessage("");
      setVisibleSuccessModal(true);
      setFinishFetch(false);
      dispatch(cleanFetchErrors());
    }
  }, [erroresSincronizacion, finishFetch]);

  //Sync inicial
  const sincronizacionInicioDia = async () => {
    if (facturas.length > 0 || abonos.length > 0)
      LimpiarDatosSinFacturasYAbonos(dispatch);
    else LimpiarDatos(dispatch);

    setvisibleModalSincDia(true);

    dispatch(setVariables({ estado: -1 }));
    dispatch(setVariables({ CONT_FETCH_INICIO: 0 }));

    const fetchPromises = [
      dispatch(fetchClientes(agenteInfo.idagentes)),
      dispatch(fetchProductos(agenteInfo.idbodega)),
      dispatch(fetchGeneral(agenteInfo.idsucursal)),
      dispatch(fetchPrecios(agenteInfo.idruta, agenteInfo.idsucursal)),
      dispatch(fetchFiscal(agenteInfo.idagentes)),
      dispatch(fetchDescuentos(agenteInfo.idbodega)),
      dispatch(fetchFacturas(agenteInfo.idsucursal, agenteInfo.idruta)),
    ];

    Promise.all(fetchPromises).then(() => setFinishFetch(true));
  };

  //Muestra el porcentaje del progressbar segun el contadorFetchInicio
  useEffect(() => {
    let porcentajeSync = contadorFetchInicio / 18;
    setporcentajeSincronizacion(porcentajeSync);

    if (porcentajeSync === 1) {
      setvisibleModalSincDia(false);
      if (estado != 0) {
        dispatch(setVariables({ estado: 1 }));
      }
      dispatch(setVariables({ CONT_FETCH_INICIO: 0 }));
    }
  }, [contadorFetchInicio]);

  //Modal sync inicial progress bar
  const ModalSincDia = () => (
    <Modal backdropStyle={styles.backdrop} visible={visibleModalSincDia}>
      <Layout level="1" style={styles.modalContainer}>
        <Text>Sincronizando...</Text>
      </Layout>
      <ProgressBar
        style={{ height: 18 }}
        progress={porcentajeSincronizacion}
        color={Colors.greenA700}
      />
    </Modal>
  );

  //Modal success
  const successSyncModal = () => {
    return (
      <SuccesModal
        visibleModal={visibleSuccessModal}
        setVisibleModal={setVisibleSuccessModal}
        title="Finalizado"
        text="Sincronización inicial realizada correctamente."
      />
    );
  };

  //Modal error
  const errorSyncModal = () => {
    return (
      <ErrorModal
        visibleModal={visibleErrorModal}
        setVisibleModal={setVisibleErrorModal}
        title="Error"
        text={errorMessage}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Acciones"
        alignment="center"
        subtitle="Inicio de Día"
        leftControl={<DrawerAction navigation={navigation} />}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />
      <Layout style={{ flex: 1, alignItems: "center" }}>
        <Text category="s2"> Día de hoy: {date.toLocaleDateString()} </Text>

        <Calendar date={date} onSelect={() => {}} />

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Button
            style={styles.button}
            status="primary"
            size="large"
            icon={(style) => <Icon {...style} name="download-outline" />}
            onPress={() => {
              sincronizacionInicioDia();
            }}
            disabled={!!estado}
          >
            Sincronización Inicial
          </Button>
        </View>
        {ModalSincDia()}
        {visibleSuccessModal && successSyncModal()}
        {visibleErrorModal && errorSyncModal()}
      </Layout>
      {visibleModalErrorConexion && ModalErrorConexion()}
    </SafeAreaView>
  );
};

export default InicioDiaScreen;

const styles = StyleSheet.create({
  button: {
    margin: 2,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderTopStartRadius: 10,
    borderTopRightRadius: 10,
  },
});
