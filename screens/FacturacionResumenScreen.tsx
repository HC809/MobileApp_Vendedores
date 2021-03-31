import React, { useState, useEffect } from "react";
import { Dimensions, View } from "react-native";
import {
  Button,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  TopNavigation,
  Modal,
  Select,
  Toggle,
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
//Models
import { IUsuario } from "../models/Usuario/IUsuario";
import { IFacInfo, ISelectOption } from "../models/common";
import { IRegistroCai, IInfoMain } from "../models/Fiscal";
import { ICliente } from "../models/Cliente/ICliente";
import { IFactura } from "../models/Factura/IFactura";
import { IPedido } from "../models/Factura/IPedido";
import { IDescuentosPorEscala } from "../models/Descuentos/IDescuentosPorEscala";
import { IDescuentosPorTipoPago } from "../models/Descuentos/IDescuentosPorTipoPago";
import { ITipoVenta } from "../models/General/general";
import { IFacSaldoPendiente } from "../models/Factura/IFacSaldoPendiente";
//Actions
import { setVariables } from "../store/actions/general";
import {
  updateRegistroCaiA,
  updateRegistroCaiE,
} from "../store/actions/fiscal";
import { addFactura } from "../store/actions/factura";
import { setStockProducto } from "../store/actions/productos";
import {
  setAplicarCalculoDescuentosPorEscala,
  calcularTotalPedido,
  rollbackCalculoDescuentosPorEscala,
  setAplicarCalculoDescuentosTipoPago,
  rollbackCalculoDescuentosPorTipoPago,
  finalizarPedido,
} from "../store/actions/pedido";
//Helpers
import {
  formatLeadingZeros,
  formatNumber,
} from "../helpers/functions/functions";
//Components
import { FacturaDatos } from "../components/FacturaDatos";
import { PrintIndicator } from "../components/Common/PrintIndicator";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Print from "expo-print";
import { facturaHTML } from "../helpers/functions/facturaHTML";
import { facturaCopiaHTML } from "../helpers/functions/facturaCopiaHTML";

const window = Dimensions.get("window");

export const FacturacionResumenScreen = ({
  navigation,
}): React.ReactElement => {
  const dispatch = useDispatch();

  const user: IUsuario = useSelector((state) => state.user);
  const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
  const REGISTRO_CAI_A: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_A
  );
  const REGISTRO_CAI_E: IRegistroCai = useSelector(
    (state) => state.fiscal.REGISTRO_CAI_E
  );
  const FISC_INFO_MAIN: IInfoMain = useSelector(
    (state) => state.fiscal.INFO_MAIN
  );
  const cliente: ICliente = useSelector((state) => state.variables.cliente);
  const TIPOS_VENTA: ITipoVenta[] = useSelector(
    (state) => state.variables.tipoVenta
  );
  const FORMA_PAGO: ISelectOption[] = useSelector(
    (state) => state.variables.formaPago
  );
  const pedido: IPedido = useSelector((state) => state.pedido);
  const descuentosPorEscala: IDescuentosPorEscala[] = useSelector(
    (state) => state.bd.descuentos.descuentosPorEscala
  );
  const descuentosTipoPago: IDescuentosPorTipoPago[] = useSelector(
    (state) => state.bd.descuentos.descuentosPorTipoPago
  );
  const facturasSaldoPendiente: IFacSaldoPendiente[] = useSelector((state) =>
    state.cobranza.cobranza.filter(
      (x) => x.idcliente === cliente.idcliente && x.pendiente === true
    )
  );
  const facturasAlCreditoCliente: IFactura[] = useSelector((state) =>
    state.factura.filter(
      (x) =>
        x.codigoTipoVenta === "CRED" &&
        x.idcliente === cliente.idcliente &&
        x.sinc === false
    )
  );

  const [modalConfirmacion, setmodalConfirmacion] = useState(false);
  const [selectedOptionFormaPago, setselectedOptionFormaPago] = useState(
    FORMA_PAGO.find((f) => f.text === "Efectivo")
  );
  const [registroCai, setregistroCai] = useState<IRegistroCai>(null);
  const [registroCaiMain, setregistroCaiMain] = useState(null);

  const ultimaFactura: number = useSelector(
    (state) => state.variables.ultimaFactura
  );

  //Descuentos por escala
  const [aplicarDescuentosPorEscala, setAplicarDescuentosPorEscala] = useState(
    false
  );
  //Descuentos por tipo pago
  const [
    aplicarDescuentosPorTipoPago,
    setAplicarDescuentosPorTipoPago,
  ] = useState(false);

  //Pregunta Modal Cancelar
  const [
    visibleModalPreguntaCancelar,
    setVisibleModalPreguntaCancelar,
  ] = useState(false);

  //Copia Factura
  const [copiaFactura, setCopiaFactura] = useState<IFactura>();

  //Desmarcar Toggles de descuentos si el pedido queda en 0 productos
  useEffect(() => {
    if (pedido.detalle.length === 0 && aplicarDescuentosPorEscala) {
      setAplicarDescuentosPorEscala(false);
    }
    if (pedido.detalle.length === 0 && aplicarDescuentosPorTipoPago) {
      setAplicarDescuentosPorTipoPago(false);
    }
  }, [pedido.detalle]);

  //Aplicar/quitar descuentos por escala
  const toggleDescuentoPorEscala = (isChecked: boolean) => {
    if (pedido.detalle.length > 0) {
      setAplicarDescuentosPorEscala(isChecked);

      if (isChecked) {
        dispatch(setAplicarCalculoDescuentosPorEscala(descuentosPorEscala));
      } else {
        dispatch(rollbackCalculoDescuentosPorEscala());
      }

      dispatch(calcularTotalPedido());
    } else {
      alert("No hay productos en pedido.");
    }
  };

  //Aplicar/quitar descuentos por tipo de pago
  const toggleDescuentoPorTipoPago = (isChecked: boolean) => {
    if (pedido.detalle.length > 0) {
      setAplicarDescuentosPorTipoPago(isChecked);

      if (isChecked) {
        let codigoTipoVentaEnPedido = TIPOS_VENTA.find(
          (x) => x.codigo === pedido.codigoTipoVenta
        )?.codigo;
        dispatch(
          setAplicarCalculoDescuentosTipoPago(
            descuentosTipoPago.filter(
              (x) => x.codigotipoventa === codigoTipoVentaEnPedido
            )
          )
        );
      } else {
        dispatch(rollbackCalculoDescuentosPorTipoPago());
      }

      dispatch(calcularTotalPedido());
    } else {
      alert("No hay productos en pedido.");
    }
  };

  //Valida quie registro CAI para facturas se va utilizar
  useEffect(() => {
    if (REGISTRO_CAI_A.numeroactual > REGISTRO_CAI_A.rangofinal) {
      if (
        !REGISTRO_CAI_E ||
        REGISTRO_CAI_E.numeroactual > REGISTRO_CAI_E.rangofinal
      ) {
        alert("No tiene número de facturas disponibles");
        setregistroCai(null);
      } else {
        setregistroCai(REGISTRO_CAI_E);
        setregistroCaiMain(false);
      }
    } else {
      setregistroCai(REGISTRO_CAI_A);
      setregistroCaiMain(true);
    }
  }, []);

  const styles = useStyleSheet(themedStyles);

  function fechaVencimientoFactura(fechaCreacion: Date) {
    const fechaVencimiento = new Date(fechaCreacion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + cliente.diascredito);

    return fechaVencimiento;
  }

  //Imprimir Factura
  const imprimirFactura = async () => {
    let factura: IFactura = null;

    if (ultimaFactura === registroCai?.numeroactual) {
      alert("No se puede replicar la factura.");
    } else {
      if (pedido.detalle.length > 0 && registroCai) {
        factura = {
          ...pedido,
          idcliente: cliente.idcliente,
          nombrecliente: cliente.nombrecliente,
          rtncliente: cliente.rtncliente,
          codigocliente: cliente.codigocliente,
          fechacreacion: new Date(),
          numerofactura: registroCai.numeroactual,
          idformapago: selectedOptionFormaPago.id,
          idregistrocai: registroCai.idregistrocai,
          sinc: false,
          anulado: "N",
          faccorrelativo:
            FISC_INFO_MAIN.codigoestablecimiento +
            " - " +
            FISC_INFO_MAIN.codigopuntoemision +
            " - " +
            FISC_INFO_MAIN.codigotipodocumento +
            " - " +
            (registroCai
              ? formatLeadingZeros(registroCai.numeroactual, 8)
              : "000000000"),
          idbodega: user.info.idbodega,
          idsucursal: user.info.idsucursal,
          codigoPuntoEmision: FISC_INFO_MAIN.codigopuntoemision,
        };

        //Agregar factura
        dispatch(addFactura(factura));
        dispatch(setVariables({ ultimaFactura: registroCai.numeroactual }));
        //Reducir cantidad en stock de los productos a facturar
        dispatch(
          setStockProducto({
            detallePedido: pedido.detalle,
          })
        );

        switch (registroCaiMain) {
          case null:
            alert("No tiene número de facturas disponibles");
            break;
          case true:
            dispatch(
              updateRegistroCaiA({
                ...registroCai,
                numeroactual: registroCai.numeroactual + 1,
              })
            );
            break;
          case false:
            dispatch(
              updateRegistroCaiE({
                ...registroCai,
                numeroactual: registroCai.numeroactual + 1,
              })
            );
            break;
          default:
            break;
        }

        //Obtener HTML
        const html = facturaHTML(
          factura,
          user,
          empresaInfo,
          registroCai,
          fechaVencimientoFactura(factura.fechacreacion),
          TIPOS_VENTA.find(
            (t) => t.codigo === factura.codigoTipoVenta
          ).text.replace(/ /g, "")
        );

        //Imprimir
        try {
          await Print.printAsync({ html });
          setCopiaFactura(factura);
          dispatch(finalizarPedido());
        } catch (error) {
          alert(
            "Error al imprimir. Reconecte la impresora e intentelo desde la pantalla MI DIA."
          );
        }
      }
    }
  };

  const imprimirCopiaFactura = async () => {
    const html = facturaCopiaHTML(
      copiaFactura,
      user,
      empresaInfo,
      registroCai,
      fechaVencimientoFactura(copiaFactura.fechacreacion),
      TIPOS_VENTA.find(
        (t) => t.codigo === copiaFactura.codigoTipoVenta
      ).text.replace(/ /g, "")
    );

    //Imprimir
    try {
      await Print.printAsync({ html });
    } catch (error) {
      alert(
        "Error al imprimir. Reconecte la impresora e intentelo desde la pantalla MI DIA."
      );
    }
  };

  const ModalConfirmacion = () => {
    let detalle = pedido.detalle.length;
    return (
      <Modal
        backdropStyle={styles.backdrop}
        onBackdropPress={() => {
          setmodalConfirmacion(false);
        }}
        visible={modalConfirmacion}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">{detalle > 0 ? "Facturar" : "Salir"}</Text>
          <View
            style={{
              borderColor: "#5DDB6F",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            {detalle > 0
              ? "¿Desea proceder a facturar el pedido?"
              : "Pedido no contiene productos ¿Seguro desea salir?"}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setmodalConfirmacion(false);
              }}
              size="small"
              appearance="outline"
            >
              Cancelar
            </Button>
            <Button
              status={detalle > 0 ? "primary" : "warning"}
              onPress={() => {
                if (detalle > 0) {
                  setmodalConfirmacion(false);
                  imprimirFactura();
                } else navigation.pop();
              }}
              style={styles.button}
              size="small"
            >
              {detalle > 0 ? "Facturar" : "Salir"}
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const limiteCreditoDisponible = (): number => {
    let totalSaldoPendiente: number = 0;
    facturasSaldoPendiente.map(
      (x) => (totalSaldoPendiente = totalSaldoPendiente + x.valorsaldofactura)
    );
    let totalFacAlCreditoPendientes: number = 0;
    facturasAlCreditoCliente.map(
      (x) =>
        (totalFacAlCreditoPendientes = totalFacAlCreditoPendientes + x.total)
    );

    return (
      cliente.limitecredito -
      totalSaldoPendiente -
      totalFacAlCreditoPendientes -
      pedido.total
    );
  };

  const ModalPreguntCancelacion = () => {
    return (
      <Modal
        backdropStyle={styles.redBackdrop}
        onBackdropPress={() => {
          setVisibleModalPreguntaCancelar(false);
        }}
        visible={visibleModalPreguntaCancelar}
      >
        <Layout level="2" style={styles.modalContainer}>
          <Text category="h5">Cancelar Factura</Text>
          <View
            style={{
              borderColor: "#F40707",
              borderWidth: 1,
              width: "100%",
              marginBottom: 10,
            }}
          />
          <Text category="s1" style={{ textAlign: "center" }}>
            ¿Seguro que desea cancelar la factura?
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              status="basic"
              style={styles.button}
              onPress={() => {
                setVisibleModalPreguntaCancelar(false);
              }}
              size="small"
              appearance="outline"
            >
              No
            </Button>

            <Button
              status="danger"
              onPress={() => navigation.pop()}
              style={styles.button}
              size="small"
            >
              Si
            </Button>
          </View>
        </Layout>
      </Modal>
    );
  };

  const renderRightControls = () => [
    <TopNavigationAction
      onPress={() => setVisibleModalPreguntaCancelar(true)}
      disabled={pedido.finalizado}
      icon={(style) => <Icon {...style} name="trash-2-outline" fill={pedido.finalizado ? "gray" : "red"} />}
    />,
  ];

  return (
    <SafeAreaView style={styles.container}>
      <PrintIndicator area="l-print" />
      <TopNavigation
        title="Facturación"
        alignment="center"
        subtitle="Resumen"
        rightControls={renderRightControls()}
      />
      <ScrollView>
        <FacturaDatos
          correlativoFactura={
            FISC_INFO_MAIN.codigoestablecimiento +
            " - " +
            FISC_INFO_MAIN.codigopuntoemision +
            " - " +
            FISC_INFO_MAIN.codigotipodocumento +
            " - " +
            (registroCai
              ? formatLeadingZeros(registroCai.numeroactual, 8)
              : "000000000")
          }
          cai={registroCai ? registroCai.codigocai : " - "}
          subtotal={pedido.subtotal}
          totalDescuento={pedido.descuento}
          totalImpuesto={pedido.impuesto}
          total={pedido.total}
          tipoVenta={
            TIPOS_VENTA.find((t) => t.codigo === pedido.codigoTipoVenta).text
          }
          importeExento={pedido.importeExento}
          importeGravado15={pedido.importeGravado15}
          importeGravado18={pedido.importeGravado18}
        />

        {pedido.codigoTipoVenta === "CTADO" && (
          <View style={styles.bar}>
            <Text style={{ width: "40%" }}>Tipo de Pago</Text>
            <Select
              placeholder={"Forma de pago"}
              data={FORMA_PAGO}
              selectedOption={selectedOptionFormaPago}
              onSelect={(op: ISelectOption) => {
                setselectedOptionFormaPago(op);
              }}
              style={{ width: "60%" }}
              disabled={pedido.finalizado}
            />
          </View>
        )}

        <View style={styles.bar}>
          <Text category="s1">Aplicar Descuentos</Text>
        </View>
        <View style={styles.toggleDescuentos}>
          <Toggle
            text="Por Escala"
            checked={aplicarDescuentosPorEscala}
            onChange={toggleDescuentoPorEscala}
            disabled={pedido.finalizado}
          />
          <Toggle
            text="Por Tipo Pago"
            checked={aplicarDescuentosPorTipoPago}
            onChange={toggleDescuentoPorTipoPago}
            disabled={pedido.finalizado}
          />
        </View>

        {pedido.finalizado ? (
          <View style={styles.buttonContainer}>
            <Button
              status="success"
              style={styles.button}
              onPress={imprimirCopiaFactura}
              size="small"
              appearance="outline"
            >
              Imprimir Copia
            </Button>

            <Button
              status="basic"
              onPress={() => navigation.pop()}
              style={styles.button}
              size="small"
              appearance="outline"
            >
              Salir
            </Button>
          </View>
        ) : pedido.codigoTipoVenta === "CRED" ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            {limiteCreditoDisponible() > 0 ? (
              <View>
                <View style={styles.bar}>
                  <Text category="s1">{"Crédito disponible de "}</Text>
                  <Text
                    category="s1"
                    style={{ fontWeight: "bold" }}
                    status="primary"
                  >{`L. ${formatNumber(limiteCreditoDisponible())}`}</Text>
                </View>
                <Button
                  status={pedido.detalle.length > 0 ? "primary" : "warning"}
                  onPress={() => setmodalConfirmacion(true)}
                  style={{ marginHorizontal: 50, marginVertical: 20 }}
                >
                  {pedido.detalle.length > 0 ? "Facturar" : "Salir"}
                </Button>
              </View>
            ) : (
              <View>
                <View style={styles.bar}>
                  <Text category="s1">{"Excedio límite de crédito por "}</Text>
                  <Text
                    category="s1"
                    style={{ fontWeight: "bold" }}
                    status="danger"
                  >{`L. ${formatNumber(limiteCreditoDisponible())}`}</Text>
                </View>
                {pedido.detalle.length === 0 && (
                  <Button
                    status="warning"
                    onPress={() => setmodalConfirmacion(true)}
                    style={{ marginHorizontal: 50, marginVertical: 20 }}
                  >
                    {"Salir"}
                  </Button>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Button
              status={pedido.detalle.length > 0 ? "primary" : "warning"}
              onPress={() => setmodalConfirmacion(true)}
              style={{ marginHorizontal: 50, marginVertical: 20 }}
            >
              {pedido.detalle.length > 0 ? "Facturar" : "Salir"}
            </Button>
          </View>
        )}
      </ScrollView>

      {visibleModalPreguntaCancelar && ModalPreguntCancelacion()}
      {ModalConfirmacion()}
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: "background-basic-color-2",
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  redBackdrop: {
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 256,
    padding: 15,
    minWidth: window.width - 70,
    borderRadius: 10,
  },
  bar: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 15,
    marginHorizontal: 30,
  },
  toggleDescuentos: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 15,
    marginTop: 10,
  },
  button: {
    marginHorizontal: 5,
    width: "45%",
  },
  content: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
