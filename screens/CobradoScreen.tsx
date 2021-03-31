import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Layout,
  List,
  Divider,
  TopNavigation,
  Text,
  Card,
  TopNavigationAction,
  Icon,
  Modal,
  Button,
} from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { View, ListRenderItemInfo, StyleSheet, Dimensions } from "react-native";
import { trackPromise } from "react-promise-tracker";
//Components
import { DrawerAction } from "../components/Common/DrawerAction";
import { AbonoItem } from "../components/AbonoItem";
import { ErrorModal } from "../components/Common/ErrorModal";
import { SuccesModal } from "../components/Common/SuccesModal";
import { SyncIndicator } from "../components/Common/SyncIndicator";
import { WarningModal } from "../components/Common/WarningModal";
//Models
import { IAbonoHeaderCXC, IAbonoPostResult } from "../models/Factura/IAbonoCXC";
import { InfoAgente } from "../models/Usuario/IUsuario";
//Helpers
import { formatNumber } from "../helpers/functions/functions";
import { SincronizarAbonos } from "../helpers/SyncAbonos";
import { refetchFacturas } from "../helpers/sincronizaciones-parciales/refetchFacturas";
//Actions
import { actualizarAbonoSync } from "../store/actions/cobranza";

const window = Dimensions.get("window");

export const CobradoScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const agenteInfo: InfoAgente = useSelector((state) => state.user.info);
  const abonos: IAbonoHeaderCXC[] = useSelector(
    (state) => state.cobranza.abonos
  );

  const [postAbonosFinish, setPostAbonosFinish] = useState(false);
  const [erroresSyncAbonos, setErroresSyncAbonos] = useState<
    IAbonoPostResult[]
  >([]);

  //Success Modal
  const [visibleSuccessModal, setVisibleSuccessModal] = useState<boolean>(
    false
  );

  //Error Modal
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [visibleErrorModal, setVisibleErrorModal] = useState<boolean>(false);

  //Pregunta Modal
  const [
    visibleModalPreguntaSincronizar,
    setVisibleModalPreguntaSincronizar,
  ] = useState(false);

  const [
    visibleModalErrorConexion,
    setVisibleModalErrorConexion,
  ] = useState<boolean>(false);

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

  const calcularTotalEfectivo = (): number => {
    let totalEfectivo: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 1)
      .map((x) => (totalEfectivo = totalEfectivo + x.totalValorAbono));

    return totalEfectivo;
  };

  const calcularTotalTarjeta = (): number => {
    let totalTarjeta: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 2)
      .map((x) => (totalTarjeta = totalTarjeta + x.totalValorAbono));

    return totalTarjeta;
  };

  const calcularTotalCheque = (): number => {
    let calcularTotalCheque: number = 0;
    abonos
      .filter((a) => a.idFormaPago === 3)
      .map(
        (x) => (calcularTotalCheque = calcularTotalCheque + x.totalValorAbono)
      );

    return calcularTotalCheque;
  };

  const calcularTotalAbonos = () => {
    let total: number = 0;
    abonos.map((x) => (total = total + x.totalValorAbono));

    return total;
  };

  const handleSincronizarAbonos = async () => {
    setVisibleModalPreguntaSincronizar(false);
    setErroresSyncAbonos([]);
    setVisibleModalPreguntaSincronizar(false);

    trackPromise(
      SincronizarAbonos(abonos.filter((a) => a.sinc === false))
        .then((results) => {
          let abonosConErrores = results.filter((r) => r.itSaved === false);
          let abonosGuardados = results.filter((r) => r.itSaved === true);

          if (abonosConErrores?.length > 0) {
            setErroresSyncAbonos(abonosConErrores);
          }

          if (abonosGuardados?.length > 0) {
            dispatch(actualizarAbonoSync(results));
            dispatch(refetchFacturas(agenteInfo.idsucursal, agenteInfo.idruta));
          }

          setPostAbonosFinish(true);
        })
        .catch((error) => {
          error?.data !== undefined &&
            alert(
              `Error al sincronizar abonos. Compuebe su conexión a internet. ${JSON.stringify(
                error.data
              )}`
            );
        }),
      "l-cc"
    ).catch((error) => {
      error?.data !== undefined &&
        alert(
          `Error al sincronizar abonos. Compuebe su conexión a internet. ${JSON.stringify(
            error.data
          )}`
        );
    });
  };

  useEffect(() => {
    if (postAbonosFinish && erroresSyncAbonos.length > 0) {
      let idAbonos = erroresSyncAbonos.map((x) => `Abono. #${x.idAbono}`);
      setErrorMessage(
        `Error al sincronizar ${idAbonos.length} abono(s). (${erroresSyncAbonos[0].errorMessage} Abono #${erroresSyncAbonos[0].idAbono})`
      );
      setVisibleErrorModal(true);
      setPostAbonosFinish(false);
    } else if (postAbonosFinish) {
      setVisibleSuccessModal(true);
      setPostAbonosFinish(false);
    }
  }, [postAbonosFinish, erroresSyncAbonos]);

  const ModalPreguntaSyncFacturas = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setVisibleModalPreguntaSincronizar(false);
        }}
        visible={visibleModalPreguntaSincronizar}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Sincronizar Abonos</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            ¿Seguro que desea sincronizar los abonos pendientes?
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setVisibleModalPreguntaSincronizar(false);
              }}
              size="medium"
              appearance="outline"
            >
              Cancelar
            </Button>

            <Button
              status="primary"
              onPress={() => handleSincronizarAbonos()}
              style={styles.button}
              size="medium"
            >
              Sincronizar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  //Modal success
  const successSyncModal = () => {
    return (
      <SuccesModal
        visibleModal={visibleSuccessModal}
        setVisibleModal={setVisibleSuccessModal}
        title="Finalizado"
        text="Sincronización de abonos realizada correctamente."
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

  const renderAbonoItem = (
    abono: ListRenderItemInfo<IAbonoHeaderCXC>
  ): React.ReactElement => {
    return <AbonoItem abono={abono.item} navigation={navigation} />;
  };

  const renderRightControls = () => [
    <TopNavigationAction
      disabled={abonos.filter((c) => c.sinc === false).length === 0}
      onPress={() => setVisibleModalPreguntaSincronizar(true)}
      icon={(style) => (
        <Icon
          {...style}
          name="cloud-upload-outline"
          fill={
            abonos.filter((c) => c.sinc === false).length === 0
              ? "gray"
              : "green"
          }
        />
      )}
    />,
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SyncIndicator area="l-cc" />
      <TopNavigation
        title="Cobrado"
        alignment="center"
        subtitle="Abonos del día"
        leftControl={<DrawerAction navigation={navigation} />}
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#ffc107" }} />

      <Layout style={{ flex: 1 }}>
        <List
          ListHeaderComponent={
            <>
              <Card>
                <Text
                  category="h6"
                  appearance="hint"
                  style={{ textAlign: "center", paddingBottom: 10 }}
                >
                  {`Total Abonos: ${abonos.length}`}
                </Text>
                <View style={styles.montos}>
                  <Text
                    style={{
                      color: "green",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    category="h6"
                  >
                    L. {formatNumber(calcularTotalAbonos()).toString()}
                  </Text>
                  <View>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      Efectivo
                    </Text>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      L. {formatNumber(calcularTotalEfectivo()).toString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      Tarjeta
                    </Text>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      L. {formatNumber(calcularTotalTarjeta()).toString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      Cheque
                    </Text>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s2"
                    >
                      L. {formatNumber(calcularTotalCheque()).toString()}
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={abonos}
          renderItem={renderAbonoItem}
          ListEmptyComponent={() => (
            <View style={styles.content}>
              <Text appearance="hint" category="s1">
                No hay abonos en este día.
              </Text>
            </View>
          )}
        />
      </Layout>
      {visibleSuccessModal && successSyncModal()}
      {visibleErrorModal && errorSyncModal()}
      {visibleModalPreguntaSincronizar && ModalPreguntaSyncFacturas()}
      {visibleModalErrorConexion && ModalErrorConexion()}
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  montos: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 2,
    marginTop: 10,
  },
  button: {
    marginHorizontal: 2,
    width: "45%",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});
