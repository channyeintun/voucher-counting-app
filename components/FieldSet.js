import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants';

export function FieldSet({ children, label, labelStyle = {}, borderColor = colors.primaryBackgroundColor, containerStyle = {} }) {
    return (
        <View style={[styles.container, { borderColor: borderColor }, containerStyle]}>
            <View style={styles.labelView}>
                <Text style={[styles.label, labelStyle]}> {label + ' '} </Text>
            </View>
            <View style={{ paddingVertical: 10 }}>
                <View style={styles.mainTextView}>{children}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1.1,
        borderRadius: 6,
        marginTop: 10,
    },
    labelView: {
        backgroundColor: colors.mainBackgroundColor,
        position: 'absolute',
        top: -(18 / 2) - 2,
        left: 20,
    },
    label: {
        elevation: 1000,
        color: colors.secondaryTextColor,
        fontSize: 16,
    },
    mainTextView: {
        paddingHorizontal: 14,
        margin: 0,
        zIndex: 2,
        paddingVertical: 0,
    }
});