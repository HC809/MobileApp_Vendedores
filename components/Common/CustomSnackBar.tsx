import React, { useState, useEffect } from 'react';
import { Snackbar } from 'react-native-paper';

export const CustomSnackBar = ({ textSnackBar, visibleSnackBar, setVisibleSnackBar }) => {

    useEffect(() => {
        onDismissSnackBar();
    }, [textSnackBar])

    const onDismissSnackBar = () => {
        setTimeout(() => {
            setVisibleSnackBar(false);
        }, 2000);
    };

    return (
        <Snackbar
            style={{ backgroundColor: 'green' }}
            visible={visibleSnackBar}
            onDismiss={onDismissSnackBar}
        >
            {textSnackBar}
        </Snackbar>
    )
}
