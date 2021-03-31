import React from 'react';
import { Text, Card, Divider } from '@ui-kitten/components';
import { IFactura } from '../models/Factura/IFactura';
import { View, StyleSheet } from 'react-native';
import { formatNumber, dateFormat } from '../helpers/functions/functions';

interface IProps {
    navigation: any
    factura: IFactura,
}

export const FacToSyncItem = React.memo(({ factura, navigation }: IProps): React.ReactElement => {
    return (
        <Card
            style={styles.item}
            status='basic'
            onPress={() => {
                navigation.navigate('c_fac_detalle', { idfactura: factura.numerofactura, idcliente: factura.idcliente });
            }}>
            <View style={styles.headerContainer}>
                <Text category='s1' style={{ color: 'green' }}>
                    {`L. ${formatNumber(factura.total)}`}
                </Text>
                <Text category='s2'>
                    {`${factura.faccorrelativo.replace(/ /g, '')}`}
                </Text>
            </View>
            <Divider />
            <Text category='s2' appearance='hint'>
                {`Cliente : ${factura.nombrecliente}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Fecha : ${dateFormat(factura.fechacreacion)}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Tipo Venta : ${factura.codigoTipoVenta === "CTADO" ? 'Contado' : 'Crédito'}`}
            </Text>

            <View style={styles.footerContainer}>
                {(factura.sinc === true)
                    ? (
                        <View style={styles.footerContainer}>
                            <View style={[styles.anulada]}>
                                <Text category="c1" status='success'>Sincronizada</Text>
                            </View>
                        </View>
                    )
                    : (
                        <View style={styles.footerContainer}>
                            <View style={[styles.anulada]}>
                                <Text category="c1" status='warning'>Pendiente</Text>
                            </View>
                        </View>
                    )
                }
                {(factura.anulado === "S") &&
                    <View style={[styles.anulada]}>
                        <Text category="c1" status='danger'>Anulada</Text>
                    </View>
                }

            </View>
        </Card>
    )
})

const styles = StyleSheet.create({
    item: {
        marginVertical: 4,
    },
    anulada: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row"
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconContainer: {
        margin: -15
    }
});