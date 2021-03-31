import React from 'react';
import { View } from 'react-native';
import { StyleService } from '@ui-kitten/components';
//Components
import { ProfileSetting } from './Common/ProfileSetting';
//Helpers
import { formatNumber } from '../helpers/functions/functions';

export const FacturaDatos = React.memo(({
    correlativoFactura,
    cai,
    subtotal,
    totalDescuento,
    totalImpuesto,
    total,
    tipoVenta,
    importeExento,
    importeGravado15,
    importeGravado18,
}: IFacturaDatos) => {
    return (
        <>
            < View style={{ borderColor: '#5DDB6F', borderWidth: 0.7, width: '100%' }} />
            <ProfileSetting
                style={styles.setting}
                hint='Correlativo Fac'
                value={correlativoFactura}
            />
            <ProfileSetting
                style={styles.setting}
                hint='CAI'
                value={cai}
            />
            <View style={{ borderColor: '#5DDB6F', borderWidth: 0.7, width: '100%' }} />
            <ProfileSetting
                style={[styles.setting]}
                hint='Subtotal'
                value={formatNumber(subtotal)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Descuento'
                value={formatNumber(totalDescuento)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Exento'
                value={formatNumber(importeExento)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Exonerado'
                value={formatNumber(0)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Gravado del 15%'
                value={formatNumber(importeGravado15)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Gravado del 18%'
                value={formatNumber(importeGravado18)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Impuesto'
                value={formatNumber(totalImpuesto)}
            />
            <ProfileSetting
                style={styles.setting}
                hint='Total Monto'
                value={formatNumber(total)}
            />
            <View style={{ borderColor: '#5DDB6F', borderWidth: 0.7, width: '100%' }} />
            <ProfileSetting
                style={styles.setting}
                hint='Tipo Venta'
                value={tipoVenta}
            />
            <View style={{ borderColor: '#5DDB6F', borderWidth: 0.7, width: '100%' }} />
        </>
    )
})

const styles = StyleService.create({
    setting: {
        padding: 10,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: 'background-basic-color-3',
    }
});