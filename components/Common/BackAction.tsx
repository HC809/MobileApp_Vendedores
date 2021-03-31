import React from 'react';
import { TopNavigationAction, Icon } from "@ui-kitten/components"

interface IProps {
    navigation: any,
}
export const BackAction = ({navigation} :IProps) => (
    <TopNavigationAction icon={(props) => <Icon {...props} name='arrow-back' />} onPress={
        () => {
            try { navigation.goBack() } catch{ }
        }} />
);