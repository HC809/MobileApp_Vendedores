import React from 'react';
import { Modal, Layout, Button, Text, Icon } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';

export const ErrorModal = ({ visibleModal, setVisibleModal, title, text }) => {
    return (
        <Modal
            backdropStyle={styles.backdrop}
            onBackdropPress={() => { setVisibleModal(false) }}
            visible={visibleModal}>
            <Layout
                level='2'
                style={styles.modalContainer}>
                <View style={styles.row}>
                    <Icon name='close-circle-outline' fill="#F40707" width={32} height={32} />
                    <Text style={{ marginHorizontal: 10 }} category='h5'>{title}</Text>
                </View>
                <View style={{ borderColor: '#F40707', borderWidth: 1, width: '100%', marginBottom: 10 }} />
                <Text category='s1' style={{textAlign:'center'}}>{text}</Text>
                <Button
                    status='danger'
                    style={{ marginTop: 5 }}
                    onPress={() => { setVisibleModal(false) }}
                    size="medium"
                    appearance='outline'
                >OK</Button>
            </Layout>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 256,
        padding: 15,
        borderRadius: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10
    },
    row: {
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row',
        padding: 4
    }
});
