import React from 'react';
import { Text, Card, Divider } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { formatNumber } from '../helpers/functions/functions';
import { IAbonoDetalleCXC } from '../models/Factura/IAbonoCXC';

export const AbonoFacturaItem = React.memo(({ abono }: { abono: IAbonoDetalleCXC }): React.ReactElement => {
    return (
        <Card
            style={styles.item}
            status='basic'
            onPress={() => { }}>
            <View style={styles.headerContainer}>
                <Text category='s1' style={{ color: 'green' }}>
                    {`L. ${formatNumber(abono.valorAbono)}`}
                </Text>
            </View>
            <Divider />
            <View style={styles.footerContainer}>
                <Text category='s2' appearance='hint'>
                    {`Doc N° FAC: ${abono.numeroFactura}`}
                </Text>
                <Text category='s2' appearance='hint' style={{ fontStyle: 'italic' }}>
                    {`${abono.pendiente ? "Saldo Pendiente" : ""}`}
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