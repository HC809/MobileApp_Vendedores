import React from 'react';
import { Text, Card, Divider } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { formatNumber, dateFormat } from '../helpers/functions/functions';
import { IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';

interface IProps {
    navigation: any
    abono: IAbonoHeaderCXC,
}

export const AbonoItem = React.memo(({ abono, navigation }: IProps): React.ReactElement => {
    return (
        <Card
            style={styles.item}
            status='basic'
            onPress={() => {
                navigation.navigate('DetalleAbono', { idAbono: abono.idAbono });
            }}>
            <View style={styles.headerContainer}>
                <Text category='s1' style={{ color: 'green' }}>
                    {`L. ${formatNumber(abono.totalValorAbono)}`}
                </Text>
                <Text category='s2'>
                    {`N° ${abono.idAbono}`}
                </Text>
            </View>
            <Divider />
            <Text category='s2' appearance='hint'>
                {`Cliente : ${abono.nombreCliente}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Código Cliente : ${abono.codigoCliente}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Fecha : ${dateFormat(abono.fechaAbono)}`}
            </Text>

            <View style={styles.footerContainer}>
                {(abono.sinc === true)
                    ? (
                        <View style={[styles.anulada]}>
                            <Text category="c1" status='success'>Sincronizado</Text>
                        </View>

                    )
                    : (
                        <View style={[styles.anulada]}>
                            <Text category="c1" status='warning'>Pendiente</Text>
                        </View>
                    )
                }
                <Text category="c1" style={{ fontStyle: 'italic' }} status='primary'>
                    {abono.idFormaPago === 1 ? 'Efectivo' : (abono.idFormaPago === 2 ? 'Tarjeta' : 'Cheque')}
                </Text>
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