import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Modal, Button, Layout, Text, Icon } from '@ui-kitten/components';

const window = Dimensions.get('window');

export const ModalResincronizar = ({ pregunta, isVisible, setIsVisible, syncRefetch }) => {
    return (
        <Modal
            backdropStyle={styles.backdrop}
            onBackdropPress={() => { }}
            visible={isVisible}>
            <Layout
                level='1'
                style={styles.modalContainer}>

                <View style={styles.row}>
                <Icon name='sync-outline' fill="#21B000" width={32} height={32} />
                    <Text style={{ marginHorizontal: 10 }} category='h6'>{pregunta}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        status={'basic'}
                        onPress={() => setIsVisible(false)}
                        style={styles.button}
                        size="small"
                    > Cerrar</Button>
                    <Button
                        onPress={() => syncRefetch()}
                        style={styles.button}
                        size='small'
                    >Sincronizar</Button>
                </View>
            </Layout>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 256,
        padding: 15,
        minWidth: window.width - 70,
        borderRadius: 10
    },
    row: {
        flex: 1,
        alignSelf: 'center',
        alignContent: 'stretch',
        flexDirection: 'row',
        padding: 2,
        marginHorizontal: 25
    },
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginVertical: 10
    },
    button: {
        marginHorizontal: 5,
        width: '45%'
    }
});

