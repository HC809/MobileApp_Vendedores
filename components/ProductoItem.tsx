import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, Card, Icon } from '@ui-kitten/components';
import { Badge } from 'react-native-paper';

export const ProductoItem = React.memo(({
    item,
    handleProdSeleccionado,
    tieneDescuentos
}: { item: IProducto, handleProdSeleccionado, tieneDescuentos: boolean }) => {

    return (
        <Card
            style={styles.item}
            status='basic'
            onPress={() => {
                handleProdSeleccionado(item)
            }}>

            <Text category='s1'>
                {`${item.producto}`}
            </Text>
            <Divider />
            <Text category='s2'>
                {`Código : ${item.codigoproducto}`}
            </Text>
            <View style={styles.footerContainer}>

                <View style={[styles.stock]}>
                    <Text appearance='hint' category='s2'>{`Stock: `}</Text>
                    <Badge size={22} style={{ backgroundColor: (item.cantidadstock > 0) ? '#21B000' : '#F40707' }} visible={true}>{item.cantidadstock}</Badge>
                </View>

                {(tieneDescuentos) &&
                    <Icon name='pricetags' fill="#F5B200" width={25} height={25} />
                }

            </View>
        </Card>
    )
})

const styles = StyleSheet.create({
    item: {
        marginVertical: 4,
    },
    stock: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: 'flex-end',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});
