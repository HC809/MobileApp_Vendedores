import React, { useState, useEffect } from "react";
import { View, ListRenderItemInfo } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  Button,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Modal,
  Icon,
  OverflowMenu,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
//Models
import { IFactura } from "../models/Factura/IFactura";
import { IRegistroCai } from "../models/Fiscal";
import { IFacInfo, ISelectOption } from "../models/common";
import { ITipoVenta } from "../models/General/general";
//Components
import { FacturaDatos } from "../components/FacturaDatos";
import { ProductoFacDetalleItem } from "../components/ProductoFacDetalleItem";
import { BackAction } from "../components/Common/BackAction";
import { ProfileSetting } from "../components/Common/ProfileSetting";
//Actions
import { anularFactura } from "../store/actions/factura";
import { rollbackStockProducto } from "../store/actions/productos";
//Helpers
import {
  diffMinutes,
  getUtcDate,
} from "../helpers/functions/functions";
import { IUsuario } from "../models/Usuario/IUsuario";
import { ICliente } from "../models/Cliente/ICliente";
import { facturaHTML } from "../helpers/functions/facturaHTML";
import { facturaCopiaHTML } from "../helpers/functions/facturaCopiaHTML";
import * as Print from "expo-print";

const MenuIcon = (style) => <Icon {...style} name="more-vertical" />;

const PrintIcon = (style) => <Icon {...style} name="printer-outline" />;

const DeleteIcon = (style) => <Icon {...style} name="trash-outline" />;

interface IProps {
  route: any;
  navigation: any;
}

export const DetalleFacturaScreen = ({
  route: {
    params: { idfactura, idcliente },
  },
  navigation,
}: IProps): React.ReactElement => {
  const dispatch = useDispatch();

  const user: IUsuario = useSelector((state) => state.user);
  const REGISTRO_CAI_A: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_A
  );
  const FACTURA: IFactura[] = useSelector((state) => state.factura);
  const cliente: ICliente = useSelector((state) =>
    state.bd.cliente.items.find((x) => x.idcliente === idcliente)
  );
  const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
  const TIPO_VENTA: ITipoVenta[] = useSelector(
    (state) => state.variables.tipoVenta
  );
  const FORMA_PAGO: ISelectOption[] = useSelector(
    (state) => state.variables.formaPago
  );
  const REGISTROS_CAI: IRegistroCai[] = useSelector((state) => [
    state.fiscal.REGISTRO_CAI_A,
    state.fiscal.REGISTRO_CAI_E,
  ]);
  const MinAnulacionFactura: number = useSelector(
    (state) => state.variables.minutosAnulacionFactura
  );
  const TIPOS_VENTA: ITipoVenta[] = useSelector(
    (state) => state.variables.tipoVenta
  );

  const [factura, setfactura] = useState<IFactura>(
    FACTURA.find((x) => x.numerofactura === idfactura)
  );

  const [registroCai, setregistroCai] = useState<IRegistroCai>(null);
  const [visibleModalAnularFac, setvisibleModalAnularFac] = useState<boolean>(
    false
  );
  const [
    visibleModalPlazoTerminado,
    setVisibleModalPlazoTerminado,
  ] = useState<boolean>(false);
  const [
    visibleModalUltimaFactura,
    setVisibleModalUltimaFactura,
  ] = useState<boolean>(false);
  const [
    visibleModalImprimir,
    setVisibleModalPlazoImprimir,
  ] = useState<boolean>(false);

  const [menuVisible, setMenuVisible] = React.useState(false);

  const menuData = [
    {
      title: "Imprimir",
      icon: PrintIcon,
    },
    {
      title: "Anular",
      icon: DeleteIcon,
    },
  ];

  useEffect(() => {
    setfactura(FACTURA.find((x) => x.numerofactura === idfactura));
  }, [idfactura]);

  useEffect(() => {
    if (factura) {
      setregistroCai(
        REGISTROS_CAI.find((x) => x.idregistrocai == factura.idregistrocai)
      );
    }
  }, [factura]);

  //Validar Anulacion de Factura
  const validarAnulacionFactura = () => {
    let numeroUltimaFactura = FACTURA[FACTURA.length - 1].numerofactura;
    if (factura.numerofactura !== numeroUltimaFactura) {
      setVisibleModalUltimaFactura(true);
    } else {
      let minutosFacturado = diffMinutes(getUtcDate(factura.fechacreacion));
      if (minutosFacturado < MinAnulacionFactura && factura.sinc != true)
        setvisibleModalAnularFac(true);
      else setVisibleModalPlazoTerminado(true);
    }
  };

  const ModalUltimaFactura = () => {
    return (
      <Modal
        backdropStyle={styles.backdropNormal}
        onBackdropPress={() => {
          setVisibleModalUltimaFactura(false);
        }}
        visible={visibleModalUltimaFactura}
      >
        <Layout level="2" style={styles.modalContainer}>
          <View style={styles.row}>
            <Icon
              name="alert-circle-outline"
              fill="#ffc107"
              width={32}
              height={32}
            />
            <Text
              style={{ marginHorizontal: 10 }}
              category="h5"
            >{`Factura ${factura.numerofactura}`}</Text>
          </View>
          <View
            style={{
              borderColor: "#ffc107",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            {`Solamente puede anular la ultima factura creada (${
              FACTURA[FACTURA.length - 1].numerofactura
            }).`}
          </Text>
          <Button
            status="warning"
            style={{ marginTop: 5 }}
            onPress={() => {
              setVisibleModalUltimaFactura(false);
            }}
            size="medium"
            appearance="outline"
          >
            OK
          </Button>
        </Layout>
      </Modal>
    );
  };

  const ModalPlazoFinalizado = () => {
    return (
      <Modal
        backdropStyle={styles.backdropNormal}
        onBackdropPress={() => {
          setVisibleModalPlazoTerminado(false);
        }}
        visible={visibleModalPlazoTerminado}
      >
        <Layout level="2" style={styles.modalContainer}>
          <View style={styles.row}>
            <Icon
              name="alert-circle-outline"
              fill="#ffc107"
              width={32}
              height={32}
            />
            <Text style={{ marginHorizontal: 10 }} category="h5">
              Plazo Finalizado
            </Text>
          </View>
          <View
            style={{
              borderColor: "#ffc107",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            {`No se puede anular la factura. El plazo es de ${MinAnulacionFactura} minutos despues de facturado y han transcurrido ${diffMinutes(
              getUtcDate(factura.fechacreacion)
            )} minutos o la factura ya esta sincronizada.`}
          </Text>
          <Button
            status="warning"
            style={{ marginTop: 5 }}
            onPress={() => {
              setVisibleModalPlazoTerminado(false);
            }}
            size="medium"
            appearance="outline"
          >
            OK
          </Button>
        </Layout>
      </Modal>
    );
  };

  //Modal Anular Factura
  const ModalAnularFac = () => {
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setvisibleModalAnularFac(false);
        }}
        visible={visibleModalAnularFac}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Anular Factura</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1">
            ¿Seguro que desea anular la factura? Este proceso no puede ser
            revertido y el número será consumido.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="danger"
              onPress={() => {
                dispatch(anularFactura(factura.numerofactura));
                //Revertir la cantidad en stock de los productos en la factura a anular
                dispatch(
                  rollbackStockProducto({
                    detallePedido: factura.numerofactura ? factura.detalle : [],
                  })
                );

                navigation.pop(2);
              }}
              style={{ marginTop: 5 }}
              size="medium"
            >
              Anular
            </Button>

            <Button
              status="basic"
              style={{ marginTop: 5 }}
              onPress={() => {
                setvisibleModalAnularFac(false);
              }}
              size="medium"
              appearance="outline"
            >
              Cancelar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const styles = useStyleSheet(themedStyles);

  if (factura == null) {
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title="Facturación"
        alignment="center"
        subtitle="Cargando.."
        leftControl={<BackAction navigation={navigation} />}
      />
    </SafeAreaView>;
  }

  //Renderizar productos de la factura
  const renderProductoFacItem = (
    info: ListRenderItemInfo<IProductoFactura>
  ) => {
    return (
      <ProductoFacDetalleItem
        key={info.item.idproducto}
        style={styles.item}
        index={info.index}
        product={info.item}
      />
    );
  };

  //Separador productos en Flatlist
  const renderSeparatorView = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CEDCCE",
        }}
      />
    );
  };

  function fechaVencimientoFactura(fechaCreacion: Date) {
    let fechaVencimiento = new Date((fechaCreacion));
    fechaVencimiento.setDate(fechaVencimiento.getDate() + cliente.diascredito);

    return fechaVencimiento;
  }


  const imprimirFacturaCopia = async () => {
    const html = facturaCopiaHTML(
      factura,
      user,
      empresaInfo,
      REGISTRO_CAI_A,
      fechaVencimientoFactura(factura.fechacreacion),
      TIPOS_VENTA.find(
        (t) => t.codigo === factura.codigoTipoVenta
      ).text.replace(/ /g, "")
    );

    //Imprimir
    try {
      await Print.printAsync({ html });
    } catch (error) {
      alert(
        "Error al imprimir. Reconecte la impresora e intentelo de nuevo."
      );
    }
  };

  const imprimirFacturaOriginal = async () => {
    const html = facturaHTML(
      factura,
      user,
      empresaInfo,
      REGISTRO_CAI_A,
      fechaVencimientoFactura(factura.fechacreacion),
      TIPOS_VENTA.find(
        (t) => t.codigo === factura.codigoTipoVenta
      ).text.replace(/ /g, "")
    );

    //Imprimir
    try {
      await Print.printAsync({ html });
    } catch (error) {
      alert(
        "Error al imprimir. Reconecte la impresora e intentelo de nuevo."
      );
    }
  };

  const ModalPreguntTipoFactura = () => {
    return (
      <Modal
        backdropStyle={styles.backdropNormal}
        onBackdropPress={() => {
          setVisibleModalPlazoImprimir(false);
        }}
        visible={visibleModalImprimir}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Tipo Factura</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            Seleccione el tipo de factura que desea imprimir.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="primary"
              style={styles.button}
              onPress={async () => {
                await imprimirFacturaOriginal();
                setVisibleModalPlazoImprimir(false);
              }}
              size="small"
              appearance="outline"
            >
              Original
            </Button>

            <Button
              status="warning"
              onPress={async () => {
                await imprimirFacturaCopia();
                setVisibleModalPlazoImprimir(false);
              }}
              style={styles.button}
              size="small"
              appearance="outline"
            >
              Copia
            </Button>
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setVisibleModalPlazoImprimir(false);
              }}
              size="small"
              appearance="outline"
            >
              Cancelar
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onMenuItemSelect = (index) => {
    if (index === 1) {
      validarAnulacionFactura();
    } else {
      setVisibleModalPlazoImprimir(true);
    }
    setMenuVisible(false);
  };

  const renderMenuAction = () =>
    factura.anulado === "N" ? (
      <OverflowMenu
        visible={menuVisible}
        data={menuData}
        onSelect={onMenuItemSelect}
        onBackdropPress={toggleMenu}
      >
        <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
      </OverflowMenu>
    ) : (
      <Text category="danger">Anulada</Text>
    );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigation
        title="Factura"
        alignment="center"
        subtitle="Detalle"
        rightControls={renderMenuAction()}
        leftControl={<BackAction navigation={navigation} />}
      />

      <FlatList
        ListHeaderComponent={
          <>
            {ModalAnularFac()}
            {ModalPlazoFinalizado()}

            <FacturaDatos
              correlativoFactura={factura.faccorrelativo}
              cai={registroCai ? registroCai.codigocai : " - "}
              subtotal={factura.subtotal}
              totalDescuento={factura.descuento}
              totalImpuesto={factura.impuesto}
              total={factura.total}
              tipoVenta={
                TIPO_VENTA.find((x) => x.codigo == factura.codigoTipoVenta)
                  ?.text
              }
              importeExento={factura.importeExento}
              importeGravado15={factura.importeGravado15}
              importeGravado18={factura.importeGravado18}
            />
            <ProfileSetting
              style={[styles.setting]}
              hint="Forma Pago"
              value={FORMA_PAGO.find((x) => x.id == factura.idformapago)?.text}
            />
            <View
              style={{
                borderColor: "#5DDB6F",
                borderWidth: 0.7,
                width: "100%",
              }}
            />
          </>
        }
        keyExtractor={(index) => index.idproducto.toString()}
        data={factura.detalle}
        renderItem={renderProductoFacItem}
        ItemSeparatorComponent={renderSeparatorView}
      />
      {visibleModalImprimir && ModalPreguntTipoFactura()}
      {visibleModalUltimaFactura && ModalUltimaFactura()}
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  setting: {
    padding: 10,
  },
  backdrop: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  backdropNormal: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: "background-basic-color-3",
  },
  row: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    padding: 4,
  },
  button: {
    marginHorizontal: 5,
    width: "45%",
  },
});
