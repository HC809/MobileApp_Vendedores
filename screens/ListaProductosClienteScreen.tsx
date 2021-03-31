import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import { Divider, Layout, TopNavigation, Icon, Text, Input, TopNavigationAction } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
//Models
import { ISelectOption } from '../models/common';
import { IPrecioPorNivelTipoVenta } from '../models/Precio';
import { IPedido } from '../models/Factura/IPedido';
import { IDescuentosPorEscala } from '../models/Descuentos/IDescuentosPorEscala';
import { IDescuentosPorTipoPago } from '../models/Descuentos/IDescuentosPorTipoPago';
//Components
import { BackAction } from '../components/Common/BackAction';
import { ProductoItem } from '../components/ProductoItem';

const window = Dimensions.get('window');

export const ListaProductosClienteScreen = ({ navigation }) => {

    const productos: IProducto[] = useSelector((state) => state.bd.producto.items);
    const precios: IPrecioPorNivelTipoVenta[] = useSelector((state) => state.bd.precio.items);
    const nivelPrecioPredeterminado: ISelectOption = useSelector((state) => state.bd.precio.nivelPredeterminado);
    const codigotipoventa : string = useSelector((state) => state.pedido.codigoTipoVenta);
    const tipoventa: string = useSelector((state) => state.variables.tipoVenta.find(x => x.codigo === state.pedido.codigoTipoVenta)?.text);
    const pedido: IPedido = useSelector((state) => state.pedido);
    const descuentosPorEscala: IDescuentosPorEscala[] = useSelector((state) => state.bd.descuentos.descuentosPorEscala);
    const descuentosPorTipoPago: IDescuentosPorTipoPago[] = useSelector((state) => state.bd.descuentos.descuentosPorTipoPago);

    const [listaProductos, setlistaProductos] = useState(productos);
    const [searchText, setsearchText] = useState('');

    const SearchIcon = (style) => <Icon {...style} name='search' />;

    const searchFilterFunction = (text) => {
        setsearchText(text);
        let newData =
            productos.filter(item => {
                let itemData = `${item.codigoproducto.toUpperCase()}${item.producto.toUpperCase()}`;
                let textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

        setlistaProductos(newData);
    }

    const Barra = () => (
        <View style={styles.bar}>
            <Input size='medium' autoCorrect={false} keyboardType="default" style={styles.barraItem} placeholder='Buscar' icon={SearchIcon} onChangeText={text => searchFilterFunction(text)} value={searchText} />
        </View>
    );

    //Selecciona Producto (validar unidades disponibles antes de abrir el modal)
    const handleProdSeleccionado = (productoAgregar: IProducto) => {

        let cantidadEnPedido = 0;
        let precio = 0;

        //Validar que hayan unidades en stock
        if (productoAgregar.cantidadstock < 1) {
            alert(`No hay unidades disponibles para agregar.`);
            return;
        }
        //Validar si tiene unidades en pedido(s)
        let productoEnPedido = pedido.detalle.find(prod => prod.idproducto == productoAgregar.idproducto);
        if (productoEnPedido) {
            //Validar si quedan unidades disponibles
            if (productoEnPedido.cantidad >= productoAgregar.cantidadstock) {
                alert(`No hay unidades disponibles para agregar. Tiene (${productoEnPedido.cantidad}) unidad(es) en pedido.`);
                return;
            }
            else
                cantidadEnPedido = Number(productoEnPedido.cantidad);
        }
        //Validar que el producto tenga configurado un precio para el nivel predeterminado y el tipo de venta
        let precioNivelPredeterminado =
            precios.find(x => x.idproducto === productoAgregar.idproducto && x.codigotipoventa === codigotipoventa && x.idnivelprecio === nivelPrecioPredeterminado.id);
        if (precioNivelPredeterminado) {
            precio = precioNivelPredeterminado.precio;
        }
        else {
            alert(`Precio de producto no asignado para nivel predeterminado (${nivelPrecioPredeterminado.text}) y tipo de venta : ${tipoventa}`)
            return;
        }

        navigation.navigate('AgregarProductoScreen', {
            codigoTipoVenta: pedido.codigoTipoVenta,
            idProducto: productoAgregar.idproducto,
            precio: precio,
            productoEnPedido: productoEnPedido,
            aplicarDesPorcentaje: pedido.aplicarDesPorcentaje,
            aplicarDesPorTipoPago: pedido.aplicarDesPorTipoPago
        });
    }

    const renderItem = ({ item }: { item: IProducto }) => {
        let descuentosEscala = descuentosPorEscala.find(x => x.idproducto === item.idproducto);
        let descuentosTipoPago = descuentosPorTipoPago.find(x => x.idproducto === item.idproducto);

        return <ProductoItem
            item={item}
            handleProdSeleccionado={handleProdSeleccionado}
            tieneDescuentos={(descuentosEscala || descuentosTipoPago) ? true : false} />
    };

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <TopNavigation title='Productos' alignment='center' subtitle='Seleccionar'
                leftControl={<TopNavigationAction
                    onPress={() => navigation.navigate('FacturacionScreen')}
                    icon={(style) => <Icon {...style} name='arrow-back-outline' fill='green' />} />}
            />
            <Divider style={{ backgroundColor: '#5DDB6F' }} />
            <Layout style={{ flex: 1 }}>
                {Barra()}
                <FlatList
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    data={listaProductos}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item.idproducto.toString()}
                    initialNumToRender={8}
                    keyboardShouldPersistTaps={'handled'}
                    ListEmptyComponent={() =>
                        <View>
                            <Text appearance='hint' style={{ textAlign: 'center' }}>No hay productos disponibles.</Text>
                        </View>
                    }
                />
            </Layout>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    bar: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    barraItem: {
        width: window.width - 20,
        maxWidth: window.width - 20,
        marginBottom: 10
    }
});