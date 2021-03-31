import React, { useState } from 'react'
import { Text, Modal, Button } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { usePromiseTracker } from "react-promise-tracker";

import { BarIndicator, } from 'react-native-indicators';

const spinners = () => (
    <BarIndicator color='#21B000' size={100} />
);

interface printProps {
    area: string;
    setArea: (v: string) => any;
}

export const PrintIndicator = React.memo((props: any) => {

    const { promiseInProgress } = usePromiseTracker({ area: props.area });

    return (
        <View>
            {
                (promiseInProgress)
                    ? <Modal
                        backdropStyle={styles.backdrop}
                        onBackdropPress={() => { }}
                        visible={true} >
                        <View style={styles.content}>
                            <Text category='h5' style={{ color: "white", marginBottom: 15 }}>Imprimiendo..</Text>
                            {spinners()}
                        </View>
                        {/* <Button size='tiny' appearance='outline' onPress={() => setShowIndicator(false)}>Cancelar Impresión</Button> */}
                    </Modal >
                    : <></>
            }
        </View>
    )
})

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    }
});
