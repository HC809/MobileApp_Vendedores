import React from 'react';
import { TopNavigationAction, Icon } from "@ui-kitten/components";

export const DrawerAction = ({ navigation }) => (
    <TopNavigationAction
        icon={(props) => <Icon {...props} name='menu' />}
        onPress={navigation.toggleDrawer}
    />
)
