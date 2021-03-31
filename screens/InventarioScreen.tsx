import { Card, Divider, Icon, Input, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { Dimensions, ListRenderItemInfo, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
//Components
import { DrawerAction } from '../components/Common/DrawerAction';
//Models
import { IUsuario } from '../models/Usuario/IUsuario';
import { IFacInfo, ISelectOption } from '../models/common';
import { IDATA } from '../models/Producto/IDATA';
//Print
import { reporteInventarioHTML } from "../helpers/functions/reporteInventarioHTML";
import * as Print from "expo-print";

const window = Dimensions.get('window');

export const InventarioScreen = ({ navigation }) => {

    const user: IUsuario = useSelector((state) => state.user);
    const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
    const productos: IProducto[] = useSelector((state) => state.bd.producto.items.sort(
        function (a, b) {
            if (a.producto > b.producto) return 1;
            if (a.producto < b.producto) return -1;

            return 0;
        }
    ));

    const grupos: ISelectOption[] = useSelector((state) => state.bd.producto.grupo.sort(
        function (a, b) {
            if (a.text > b.text) return 1;
            if (a.text < b.text) return -1;

            return 0;
        }
    ));

    const productosPorGrupo = (): IDATA[] => {
        let grupoData: IDATA[] = grupos.map(g => {
            let productosDelGrupo = productos.filter(p => p.idgrupo === g.id);
            if (productosDelGrupo.length > 0) {
                return {
                    title: g.text,
                    data: productosDelGrupo
                }
            }
        })

        return grupoData;
    }

    const [listaProductos, setlistaProductos] = useState<IDATA[]>(productosPorGrupo());
    const [searchText, setsearchText] = useState<string>('');

    useEffect(() => {
        setlistaProductos(productosPorGrupo());
    }, [productos]);

    const searchFilterFunction = (text: string) => {
        setsearchText(text);
        let grupoData: IDATA[] = grupos.map(g => {
            let productosDelGrupo =
                productos.filter(p => p.idgrupo === g.id && (`${p.codigoproducto.toUpperCase()}${p.producto.toUpperCase()}`).indexOf(text.toUpperCase()) > -1);
            if (productosDelGrupo.length > 0) {
                return {
                    title: g.text,
                    data: productosDelGrupo
                }
            }
        });

        setlistaProductos(grupoData.filter(n => n));
    }

    const SearchIcon = (style) => <Icon {...style} name='search' />;
    const BarraBusquedaProductos = () => (
        <View style={styles.bar}>
            <Input size='medium' autoCorrect={false} keyboardType="default" style={styles.barraItem} placeholder='Buscar' icon={SearchIcon} onChangeText={text => searchFilterFunction(text)} value={searchText} />
        </View>
    );

    const renderItem = (producto: ListRenderItemInfo<IProducto>) => (
        <Card
            style={styles.item}
            status='basic'
            onPress={() => { }}>
            <Text category='s1' style={{ color: 'green' }}>
                {producto.item.producto}
            </Text>
            <Divider />
            <Text category='s2'>
                {`Código: ${producto.item.codigoproducto}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Inventario Inicial: ${producto.item.cantidadpedido}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Facturado: ${producto.item.cantidadpedido - producto.item.cantidadstock}`}
            </Text>
            <Text category='s2' appearance='hint'>
                {`Inventario Final: ${producto.item.cantidadstock}`}
            </Text>
        </Card>
    );

    const imprimirInventario = async () => {
        const html = reporteInventarioHTML(
            empresaInfo,
           user,
           productosPorGrupo()
          );
      
          //Imprimir
          try {
            await Print.printAsync({ html });
          } catch (error) {
            alert("Error al imprimir. Reconecte la impresora e intentelo de nuevo.");
          }
    }

    const renderRightControls = () => [
        <TopNavigationAction
            onPress={() => imprimirInventario()}
            icon={(style) => <Icon {...style} name='printer-outline' fill='green' />} />
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title='Inventario' alignment='center' subtitle='Reporte del día'
                leftControl={<DrawerAction navigation={navigation} />}
                rightControls={renderRightControls()}
            />
            <Divider style={{ backgroundColor: '#5DDB6F' }} />
            {BarraBusquedaProductos()}
            <SectionList
                sections={listaProductos}
                keyExtractor={(index) => index.idproducto.toString()}
                renderItem={renderItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                ListEmptyComponent={() =>
                    <View style={styles.content}>
                        <View>
                            <Text style={{ textAlign: 'center' }} appearance='hint' category='s1'>No se encontraron productos o no hay inventario sincronizado (Inicie su día).</Text>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        textAlign: 'center',
        paddingTop: 10
    },
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    item: {
        margin: 4,
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