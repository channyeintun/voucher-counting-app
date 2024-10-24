import { Slot } from "expo-router";
import { Provider } from 'react-redux';
import { StyleSheet, View } from "react-native";
import { store } from "../store";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants";

export default function Layout() {

    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            marginTop: insets.top,
            backgroundColor: colors.mainBackgroundColor
        },
    });

    return (
        <RootSiblingParent>
            <Provider store={store}>
                <View style={styles.container}>
                    <StatusBar />
                    <Slot />
                </View>
            </Provider>
        </RootSiblingParent>
    );
}