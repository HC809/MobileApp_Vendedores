import React from 'react';
import { Divider, Text } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
//Helpers
import { formatNumber } from '../helpers/functions/functions';

interface saldosProps {
    clienteNombre: string,
    clienteCodigo: string,
    limiteCredito: number,
    saldoPendiente: number,
    saldoPendienteVencido: number,
    creditoDisponible: number,
    diasCreditoCliente: number
}

export const HeaderClienteCobranza = React.memo(({
    clienteNombre,
    clienteCodigo,
    limiteCredito,
    saldoPendiente,
    saldoPendienteVencido,
    creditoDisponible,
    diasCreditoCliente
}: saldosProps) => {

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Cliente
                </Text>
                <Text style={styles.descriptionRight} appearance='hint'>
                    {clienteNombre}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Código
                </Text>
                <Text style={styles.descriptionRight} appearance='hint'>
                    {clienteCodigo}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Límite de Crédito
                </Text>
                <Text style={styles.descriptionRight} appearance='hint'>
                    {formatNumber(limiteCredito)}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Saldo Pendiente
                </Text>
                <Text style={styles.descriptionRight} status='warning'>
                    {formatNumber(saldoPendiente)}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Saldo Pendiente Vencido
                </Text>
                <Text style={styles.descriptionRight} status='danger'>
                    {formatNumber(saldoPendienteVencido)}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Crédito Disponible
                </Text>
                <Text style={styles.descriptionRight} status='primary'>
                    {formatNumber(creditoDisponible)}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.descriptionLeft} appearance='hint'>
                    Días de Crédito:
                </Text>
                <Text style={styles.descriptionRight} appearance='hint'>
                    {diasCreditoCliente.toString()}
                </Text>
            </View>
            <Divider style={{ backgroundColor: '#5DDB6F' }} />
        </>
    )
})

export default HeaderClienteCobranza;

const styles = StyleSheet.create({
    descriptionLeft: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'left'
    },
    descriptionRight: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'right'
    },
})