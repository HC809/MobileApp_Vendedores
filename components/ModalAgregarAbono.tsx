import React, { useState, useEffect } from 'react';
import { Modal, Layout, Button, Text, Input, Select } from '@ui-kitten/components';
import { StyleSheet, Dimensions, View } from 'react-native';
import { useSelector } from "react-redux";
//Models
import { ISelectOption } from '../models/common';
import { IFacSaldoPendiente } from '../models/Factura/IFacSaldoPendiente';
import { IAbonoDetalleCXC, IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';
import { ICliente } from '../models/Cliente/ICliente';
import { InfoAgente } from '../models/Usuario/IUsuario';
import { IInfoMain } from '../models/Fiscal';
//Helpers
import { currentDate, formatNumber } from '../helpers/functions/functions';

const window = Dimensions.get('window');

interface IProps {
    cerrarModal: (val: boolean) => any;
    agregarAbonosActualizarFacturas: (abonos: IAbonoHeaderCXC) => any;
}

export const ModalAgregarAbono = React.memo(({ cerrarModal, agregarAbonosActualizarFacturas }: IProps) => {

    const usuario: string = useSelector(state => state.user.user);
    const agenteInfo: InfoAgente = useSelector(state => state.user.info);
    const fiscalInfo: IInfoMain = useSelector(state => state.fiscal.INFO_MAIN);
    const cliente: ICliente = useSelector(state => state.variables.cliente);
    const facturasSaldoPendiente: IFacSaldoPendiente[] = useSelector(state => state.cobranza.cobranza.filter(x => x.idcliente === cliente.idcliente && x.pendiente === true));
    const idRecibo: number = useSelector(state => state.fiscal.REGISTRO_CAI_R.numeroactual);
    const formasPago: ISelectOption[] = useSelector(state => state.variables.formaPago);
    const [selectedOptionFormaPago, setselectedOptionFormaPago] = useState<ISelectOption>(formasPago[1]);

    const [monto, setMonto] = useState(0);
    const [montoInputValue, setMontoInputValue] = useState('');

    useEffect(() => {
        let montoNumber = parseFloat(montoInputValue);
        montoNumber ? setMonto(montoNumber) : setMonto(0);
    }, [montoInputValue]);

    const handleSetMonto = (monto: string) => {
        setMontoInputValue(monto.replace(/^0+/, ''))
    }

    const calcularTotalFacturas = () => {
        let total: number = 0;
        facturasSaldoPendiente.map(x => total = total + x.valorsaldofactura);

        return total;
    }

    const agregarAbono = () => {
        if (monto > calcularTotalFacturas()) {
            alert('El monto es mayor al total credito pendiente.');
            return;
        }

        let facturasOrdenadas = facturasSaldoPendiente.sort(function (a, b) {
            var da = new Date(a.fechavencimiento).getTime();
            var db = new Date(b.fechavencimiento).getTime();

            return da > db ? 1 : da < db ? -1 : 0
        })

        let montoParaFacturas = monto;
        let fechaAbono = new Date();

        let detalleFacturasAbonos: IAbonoDetalleCXC[] = facturasOrdenadas.map(fac => {
            if (montoParaFacturas <= 0) return;

            if (montoParaFacturas >= fac.valorsaldofactura) {
                montoParaFacturas = parseFloat((montoParaFacturas - fac.valorsaldofactura).toFixed(2));

                return {
                    numeroFactura: fac.numerofactura,
                    valorAbono: fac.valorsaldofactura,
                    fechaAbono: fechaAbono,
                    idTipoDocumento: fiscalInfo.idtipodocumento,
                    idTipoDocumentoAbono: fiscalInfo.idtipodocumentorecibo,
                    serie: fac.serie,
                    pendiente: false
                };
            }
            else {
                let montoAbono = montoParaFacturas;
                montoParaFacturas = 0;

                return {
                    numeroFactura: fac.numerofactura,
                    valorAbono: montoAbono,
                    fechaAbono: fechaAbono,
                    idTipoDocumento: fiscalInfo.idtipodocumento,
                    idTipoDocumentoAbono: fiscalInfo.idtipodocumentorecibo,
                    serie: fac.serie,
                    pendiente: true
                };
            }
        });

        let abono: IAbonoHeaderCXC = {
            idAbono: idRecibo,
            idSucursal: agenteInfo.idsucursal,
            idEstablecimiento: fiscalInfo.idestablecimiento,
            idCliente: cliente.idcliente,
            nombreCliente: cliente.nombrecliente,
            codigoCliente: cliente.codigocliente,
            rtnCliente: cliente.rtncliente,
            idAgentes: agenteInfo.idagentes,
            idFormaPago: selectedOptionFormaPago.id,
            codigoPuntoEmision: fiscalInfo.codigopuntoemision,
            idPuntoEmision: fiscalInfo.idpuntoemision,
            fechaAbono: fechaAbono,
            totalValorAbono: monto,
            usuario: usuario,
            numeroChkTrj: "1",
            numeroAutorizacion: "1",
            detalleCxc: detalleFacturasAbonos.filter(n => n),
            sinc: false,
            saldoPendiente: 0
        }

        agregarAbonosActualizarFacturas(abono);
    };

    return (
        <Modal backdropStyle={styles.backdrop} visible={true} onBackdropPress={() => { }}>
            <Layout style={styles.modalContainer}>
                <Text category='h6' style={{ fontWeight: 'bold', textAlign: 'center' }}>Agregar Abono</Text>
                <View style={{ borderColor: '#5DDB6F', borderWidth: 1, width: '100%' }} />
                <View style={{ alignItems: 'center', marginVertical: 15 }}>
                    <Text>Total Saldo Pendiente</Text>
                    <Text category='h6' status='danger'>L. {formatNumber(calcularTotalFacturas())}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text category='h6' style={{ marginBottom: 5 }}>Forma de pago</Text>
                    <Select
                        placeholder={'Forma de pago'}
                        data={formasPago}
                        selectedOption={selectedOptionFormaPago}
                        onSelect={(op: ISelectOption) => { setselectedOptionFormaPago(op) }}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text category='h6' style={{ marginBottom: 5 }}>Monto</Text>
                    <Input
                        placeholder='0'
                        value={montoInputValue}
                        keyboardType='number-pad'
                        onChangeText={v => handleSetMonto(v)}
                        size='medium'
                        maxLength={8}
                        autoCorrect={false}
                        textStyle={{ textAlign: 'right', fontSize: 20 }}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        style={styles.button}
                        status={'basic'}
                        onPress={() => cerrarModal(false)}
                        size="medium"
                    > Cancelar</Button>
                    <Button
                        disabled={monto === 0}
                        style={styles.button}
                        size='medium'
                        onPress={() => agregarAbono()}>
                        Agregar</Button>
                </View>
            </Layout>
        </Modal>
    )
})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        borderRadius: 5,
        width: "50%",
        alignContent: 'center',
        minWidth: window.width - 80,
        padding: 20,
        marginBottom: 180
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginTop: 20
    },
    button: {
        marginHorizontal: 5,
        width: '45%'
    },
});
