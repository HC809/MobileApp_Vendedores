import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Divider, Text } from '@ui-kitten/components';
import { Icon } from 'react-native-elements';

interface SectionProps extends TouchableOpacityProps {
    hint: string;
    iconName: string;
    children?: React.ReactNode;
}

export const SyncPartialSection = (props: SectionProps): React.ReactElement<TouchableOpacityProps> => {

    const { style, hint, children, iconName, ...touchableOpacityProps } = props;

    return (
        <React.Fragment>
            <TouchableOpacity
                activeOpacity={0.6}
                {...touchableOpacityProps}
                style={[styles.container, style]}>
                <Icon name={iconName} type='material' color='#21B000' size={25} />
                <Text
                    style={{ marginHorizontal: 10 }}
                    category='s1'>
                    {hint}
                </Text>
                {children}
            </TouchableOpacity>
            <Divider />
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});