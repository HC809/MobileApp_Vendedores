import React, { useEffect, useState } from "react";
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
//Models
import { IFactura } from "../models/Factura/IFactura";
import { IFacturaPost } from "../models/Factura/IFacturaPost";
import { IFacturaPostResult } from "../models/Factura/IFacturaPostResult";
//Components
import { DrawerAction } from "../components/Common/DrawerAction";
import { FacToSyncItem } from "../components/FacToSyncItem";
import { SuccesModal } from "../components/Common/SuccesModal";
import { ErrorModal } from "../components/Common/ErrorModal";
import { SyncIndicator } from "../components/Common/SyncIndicator";
import { WarningModal } from "../components/Common/WarningModal";
//Helpers
import { formatNumber } from "../helpers/functions/functions";
import { facturaPost } from "../helpers/functions/facturacion";
import { SincronizarFacturas } from "../helpers/syncFinal";
import { refetchProductos } from "../helpers/sincronizaciones-parciales/refetchProductos";
//Actions
import { updateFactura } from "../store/actions/factura";

const window = Dimensions.get("window");

export const VendidoScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const idagente = useSelector((state) => state.user.info.idagentes);
  const idBodega = useSelector((state) => state.user.info.idbodega);
  const facturas: IFactura[] = useSelector((state) => state.factura);
  const [erroresFacturas, setErroresFacturas] = useState<IFacturaPostResult[]>(
    []
  );

  const [postFacturasFinish, setPostFacturasFinish] = useState(false);

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

  const handleBtnFinDeDia = async () => {
    setVisibleModalPreguntaSincronizar(false);

    setErroresFacturas([]);
    setVisibleModalPreguntaSincronizar(false);

    let facturasPostList: IFacturaPost[] = facturas
      .filter((x) => x.sinc === false)
      .map((fac: IFactura) => {
        return facturaPost(fac, idagente);
      });

    trackPromise(
      SincronizarFacturas(facturasPostList)
        .then((results) => {
          let facturasConErrores = results.filter((r) => r.itSaved === false);
          let facturasGuardadas = results.filter((r) => r.itSaved === true);

          if (facturasConErrores?.length > 0) {
            setErroresFacturas(facturasConErrores);
          }

          if (facturasGuardadas?.length > 0) {
            facturasGuardadas.map((r) =>
              dispatch(updateFactura(r.correlativo, true))
            );
            dispatch(refetchProductos(idBodega));
          }

          setPostFacturasFinish(true);
        })
        .catch((error) => {
          error?.data !== undefined &&
            alert(
              `Error al sincronizar facturas. Compuebe su conexión a internet. ${JSON.stringify(
                error.data
              )}`
            );
        }),
      "l-cc"
    );
  };

  useEffect(() => {
    if (postFacturasFinish && erroresFacturas.length > 0) {
      let correlativosFacturas = erroresFacturas.map((x) => x.correlativo);
      setErrorMessage(
        `Error al sincronizar ${correlativosFacturas.length} factura(s). (${
          erroresFacturas[0].errorMessage
        } ${erroresFacturas[0].correlativo.replace(/ /g, "")})`
      );
      setVisibleErrorModal(true);
      setPostFacturasFinish(false);
    } else if (postFacturasFinish) {
      setVisibleSuccessModal(true);
      setPostFacturasFinish(false);
    }
  }, [postFacturasFinish, erroresFacturas]);

  //Modal success
  const successSyncModal = () => {
    return (
      <SuccesModal
        visibleModal={visibleSuccessModal}
        setVisibleModal={setVisibleSuccessModal}
        title="Finalizado"
        text="Sincronización de facturas realizada correctamente."
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
          <Text category="h5">Sincronizar Facturas</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            ¿Seguro que desea sincronizar las facturas pendientes?
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
              onPress={() => handleBtnFinDeDia()}
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

  const renderFacItem = (
    factura: ListRenderItemInfo<IFactura>
  ): React.ReactElement => {
    return <FacToSyncItem factura={factura.item} navigation={navigation} />;
  };

  const calcularTotalCredito = (): number => {
    let totalCredito: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CRED" && f.anulado === "N")
      .map((x) => (totalCredito = totalCredito + x.total));

    return totalCredito;
  };

  const calcularTotalContado = (): number => {
    let totalContado: number = 0;
    facturas
      .filter((f) => f.codigoTipoVenta === "CTADO" && f.anulado === "N")
      .map((x) => (totalContado = totalContado + x.total));

    return totalContado;
  };

  const calcularTotalFacturas = (): number => {
    let total: number = 0;
    facturas
      .filter((c) => c.anulado === "N")
      .map((x) => (total = total + x.total));

    return total;
  };

  const renderRightControls = () => [
    <TopNavigationAction
      disabled={facturas.filter((c) => c.sinc === false).length === 0}
      onPress={() => setVisibleModalPreguntaSincronizar(true)}
      icon={(style) => (
        <Icon
          {...style}
          name="cloud-upload-outline"
          fill={
            facturas.filter((c) => c.sinc === false).length === 0
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
        title="Vendido"
        alignment="center"
        subtitle="Facturas del día"
        leftControl={<DrawerAction navigation={navigation} />}
        rightControls={renderRightControls()}
      />
      <Divider style={{ backgroundColor: "#5DDB6F" }} />

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
                  {`Total Facturas: ${
                    facturas.filter((f) => f.anulado === "N").length
                  }`}
                </Text>
                <View style={styles.montos}>
                  <Text
                    style={{
                      color: "green",
                      textAlign: "center",
                      alignContent: "center",
                    }}
                    category="h5"
                  >
                    L. {formatNumber(calcularTotalFacturas()).toString()}
                  </Text>
                  <View>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s1"
                    >
                      Contado
                    </Text>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s1"
                    >
                      L. {formatNumber(calcularTotalContado()).toString()}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s1"
                    >
                      Crédito
                    </Text>
                    <Text
                      style={{ textAlign: "center" }}
                      appearance="hint"
                      status="basic"
                      category="s1"
                    >
                      L. {formatNumber(calcularTotalCredito()).toString()}
                    </Text>
                  </View>
                </View>
              </Card>
            </>
          }
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={facturas}
          renderItem={renderFacItem}
          ListEmptyComponent={() => (
            <View style={styles.content}>
              <Text appearance="hint" category="s1">
                No hay facturas en este día.
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
