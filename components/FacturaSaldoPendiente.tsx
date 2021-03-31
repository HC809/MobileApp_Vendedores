import React from 'react';
import { ListItem, Text } from '@ui-kitten/components';
import { IFacSaldoPendiente } from '../models/Factura/IFacSaldoPendiente';
import { StyleSheet, View } from 'react-native';
import { formatNumber, dateFormat } from '../helpers/functions/functions';

export const FacturaSaldoPendiente = React.memo(({ factura }: { factura: IFacSaldoPendiente }) => {

    const renderItemAccessory = () => (
        <View>
            <Text category='s1'>
                Vence: {dateFormat(factura.fechavencimiento)}
            </Text>
            <Text category='s2' appearance='hint' style={{ textAlign: 'right' }}>
                {`${factura.numerofactura} (${dateFormat(factura.fechafactura)})`}
            </Text>
        </View>

    );

    return (
        <ListItem
            style={styles.container}
            title={`L. ${formatNumber(factura.valorsaldofactura)}`}
            titleStyle={{ fontSize: 15 }}
            description={`L. ${formatNumber(factura.valortotalfactura)}`}
            accessory={renderItemAccessory}
        />
    )
})

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7',
    },
});

