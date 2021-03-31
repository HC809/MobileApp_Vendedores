import { Layout } from '@ui-kitten/components';
import React, { memo } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Dimensions } from 'react-native';

const window = Dimensions.get('window');

const Background = ({ children }) => (

    <KeyboardAvoidingView keyboardVerticalOffset={56} >
        <Layout style={styles.container}>
            {children}
        </Layout>
    </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: window.height - 250
    },
});

export default memo(Background);