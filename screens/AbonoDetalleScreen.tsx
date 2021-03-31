import React from 'react';
import { Layout, List, Divider, TopNavigation, Text, Card, TopNavigationAction, Icon, Modal, Button, OverflowMenu } from '@ui-kitten/components';
import { useSelector, useDispatch } from "react-redux";
import { View, ListRenderItemInfo, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//Models
import { IAbonoDetalleCXC, IAbonoHeaderCXC } from '../models/Factura/IAbonoCXC';
import { IFacInfo, ISelectOption } from '../models/common';
//Components
import { AbonoFacturaItem } from '../components/AbonoFacturaItem';
import { BackAction } from '../components/Common/BackAction';
//Helpers
import { dateFormat,  formatNumber } from '../helpers/functions/functions';
//Print
import { reciboHTML } from '../helpers/functions/reciboHTML';
import * as Print from "expo-print"

const MenuIcon = (style) => (
    <Icon {...style} name='more-vertical' />
);

const PrintIcon = (style) => (
    <Icon {...style} name='printer-outline' />
);

const DeleteIcon = (style) => (
    <Icon {...style} name='trash-outline' />
);

export const AbonoDetalleScreen = ({ route: { params: { idAbono } }, navigation }) => {

    const abono: IAbonoHeaderCXC = useSelector((state) => state.cobranza.abonos.find(x => x.idAbono === idAbono));
    const empresaInfo: IFacInfo = useSelector((state) => state.variables.facinfo);
    const FORMA_PAGO: ISelectOption[] = useSelector((state) => state.variables.formaPago);

    const [menuVisible, setMenuVisible] = React.useState(false);

    const menuData = [
        {
            title: 'Imprimir',
            icon: PrintIcon,
        },
        // {
        //     title: 'Eliminar',
        //     icon: DeleteIcon,
        // },
    ];

    const imprimirAbono = async () => {
        const html = reciboHTML(
            abono,
            empresaInfo,
            FORMA_PAGO.find((t) => t.id === abono.idFormaPago).text.replace(/ /g, "")
          );
      
          //Imprimir
          try {
            await Print.printAsync({ html });
          } catch (error) {
            alert("Error al imprimir. Reconecte la impresora e intentelo de nuevo.");
          }
    }

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const onMenuItemSelect = async (index) => {
        if (index === 0) {
            await imprimirAbono();
        } 
        // else {
        //     if (abono.sinc === true)
        //         alert("El abono ya esta sincronizado.");
        //     else
        //         alert("Anulado!");
        // }
        setMenuVisible(false);
    };

    const renderAbonoDetalleItem = (abono: ListRenderItemInfo<IAbonoDetalleCXC>): React.ReactElement => {
        return (
            <AbonoFacturaItem
                abono={abono.item}
            />
        );
    }

    // const renderRightControls = () => [
    //     <TopNavigationAction disabled={(abono.detalleCxc.length === 0)}
    //         onPress={() => { }}
    //         icon={(style) => <Icon {...style} name='cloud-upload-outline' fill='green' />} />
    // ];

    const renderMenuAction = () => (
        <OverflowMenu
            visible={menuVisible}
            data={menuData}
            onSelect={onMenuItemSelect}
            onBackdropPress={toggleMenu}>
            <TopNavigationAction
                icon={MenuIcon}
                onPress={toggleMenu}
            />
        </OverflowMenu>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigation
                title={`Abono #${abono.idAbono}`} alignment='center' subtitle='Detalle Abono'
                leftControl={<BackAction navigation={navigation} />}
                rightControls={renderMenuAction()}
            />
            <Divider style={{ backgroundColor: '#ffc107' }} />

            <Layout style={{ flex: 1 }}>

                <List
                    ListHeaderComponent={
                        <>
                            <Card>
                                <View>
                                    <Text style={{ textAlign: 'left', alignContent: 'center' }} appearance='hint'>
                                        Cliente: {abono.nombreCliente}
                                    </Text>
                                    <Text style={{ textAlign: 'left', alignContent: 'center' }} appearance='hint'>
                                        Código Cliente: {abono.codigoCliente}
                                    </Text>
                                    <Text style={{ textAlign: 'left', alignContent: 'center' }} appearance='hint'>
                                        Fecha: {dateFormat(abono.fechaAbono)}
                                    </Text>
                                    <Text style={{ textAlign: 'left', alignContent: 'center' }} appearance='hint'>
                                        Total Abono: L {formatNumber(abono.totalValorAbono)}
                                    </Text>
                                </View>
                            </Card>
                        </>
                    }
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    data={abono.detalleCxc}
                    renderItem={renderAbonoDetalleItem}
                    ListEmptyComponent={() =>
                        <View style={styles.content}>
                            <Text appearance='hint' category='s1'>No hay facturas en este abono.</Text>
                        </View>
                    }
                />
            </Layout>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginHorizontal: 5,
        width: '45%'
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 256,
        padding: 16,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
});