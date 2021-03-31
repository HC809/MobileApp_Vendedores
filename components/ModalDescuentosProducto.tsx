import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Modal, Layout, Text, Button } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
//Models
import { IDescuentosPorEscala } from '../models/Descuentos/IDescuentosPorEscala';
import { IDescuentosPorTipoPago } from '../models/Descuentos/IDescuentosPorTipoPago';
import { dateFormatPromocion } from '../helpers/functions/functions';

const window = Dimensions.get('window');

interface IProps {
    nombreProducto: string;
    setModalVisible: (v: boolean) => any;
    prodDescPorEscala: IDescuentosPorEscala[],
    prodDescPorTipoPago: IDescuentosPorTipoPago[]
}

export const ModalDescuentosProducto = React.memo(({ nombreProducto, setModalVisible, prodDescPorEscala, prodDescPorTipoPago }: IProps) => {

    let descuentosPorPorcentaje = prodDescPorEscala.filter(x => x.codigotipopromocion === 'DESC_PORC').reverse();

    return (
        <Modal
            onBackdropPress={() => { }}
            backdropStyle={styles.backdrop}
            visible={true}>
            <Layout style={styles.modalContainer}>
                <Text category='h6' style={{ fontWeight: 'bold', textAlign: 'center' }}>{nombreProducto}</Text>
                <View style={{ borderColor: '#5DDB6F', borderWidth: 1, width: '100%' }} />

                {(prodDescPorTipoPago.length > 0) &&
                    <View style={styles.descuentoSection}>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 13 }}>Descuentos Por Tipo de Pago</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }} status='basic' category='s1'>{prodDescPorTipoPago[0].promocion}</Text>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 12 }} appearance='hint'>
                            {dateFormatPromocion(prodDescPorTipoPago[0].fechainicio, prodDescPorTipoPago[0].fechafinal)}
                        </Text>
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header>
                                <DataTable.Title><Text>Tipo Pago</Text></DataTable.Title>
                                <DataTable.Title numeric><Text>Descuento</Text></DataTable.Title>
                            </DataTable.Header>
                            {
                                prodDescPorTipoPago.map((x, i) => (
                                    <DataTable.Row style={{ marginVertical: -5 }} key={i}>
                                        <DataTable.Cell>
                                            <Text>
                                            {(x.codigotipoventa === 'CTADO' ? 'Contado' : ((x.codigotipoventa === 'CRED') ? 'Credito' : x.codigotipoventa))}
                                            </Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric><Text>{`${x.monto}%`}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                ))
                            }
                        </DataTable>
                    </View>
                }

                {(descuentosPorPorcentaje.length > 0) &&
                    <View style={styles.descuentoSection}>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 13 }}>Descuentos Por Escala</Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }} status='basic' category='s1'>{descuentosPorPorcentaje[0].promocion}</Text>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 12 }} appearance='hint'>
                            {dateFormatPromocion(descuentosPorPorcentaje[0].fechainicio, descuentosPorPorcentaje[0].fechafinal)}
                        </Text>
                        <DataTable style={styles.dataTable}>
                            <DataTable.Header>
                                <DataTable.Title><Text>Rango Unidades</Text></DataTable.Title>
                                <DataTable.Title numeric><Text>Descuento</Text></DataTable.Title>
                            </DataTable.Header>
                            {
                                descuentosPorPorcentaje.map(x => (
                                    <DataTable.Row style={{ marginVertical: -5 }} key={x.monto}>
                                        <DataTable.Cell><Text>{`${x.rangoinicial} - ${x.rangofinal}`}</Text></DataTable.Cell>
                                        <DataTable.Cell numeric><Text>{`${x.monto}%`}</Text></DataTable.Cell>
                                    </DataTable.Row>
                                ))
                            }
                        </DataTable>
                    </View>
                }

                <View style={styles.buttonContainer}>
                    <Button
                        status={'basic'}
                        onPress={() => setModalVisible(false)}
                        size="medium"
                    > Cerrar</Button>
                </View>

            </Layout>
        </Modal>
    )
})

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        borderRadius: 5,
        width: "50%",
        minWidth: window.width - 80,
        padding: 10
    },
    dataTable: {
        textAlign: 'center',
        alignContent: 'center'
    },
    descuentoSection: {
        marginTop: 2,
        marginHorizontal: 15,
        paddingBottom: 5
    },
    buttonContainer: {
        padding: 1
    }
});
