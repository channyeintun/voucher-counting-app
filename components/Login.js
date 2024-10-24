import { View, StyleSheet, TextInput, Text, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setAuth, setUsername as setUser } from "../store/slices/appSlice";
import { Button } from "./Button";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FieldSet } from "./FieldSet";
import { signInAnonymously } from "firebase/auth/react-native";
import { auth } from "../firebaseConfig";
import { showToast } from "../utils";
import { colors } from "../constants";
import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function Login() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.app.username);
    console.log('User is', user)
    const [username, setUserName] = useState(user);
    const [loading, setLoading] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [permissionM, requestPermissionM] = MediaLibrary.usePermissions();

    useEffect(() => {
        if (user) {
            setUserName(user);
        }
    }, [user])

    useEffect(() => {
        (async () => {
            if (permission) {
                if (!permission.granted) {
                    await requestPermission();
                }
            }
            if (permissionM) {
                if (!permissionM.granted) {
                    requestPermissionM();
                }
            }
        })();
    }, [permission, permissionM])

    const submit = async () => {
        setLoading(true);
        try {
            if (username) {
                const loginUser = await signInAnonymously(auth);
                console.log('loginUser', loginUser);
                dispatch(setUser(username));
                await SecureStore.setItemAsync('username', username);
                if (loginUser) {
                    dispatch(setAuth(!!loginUser));
                    router.replace('/camera');
                }
            }
            setLoading(false);
        } catch (error) {
            console.error(error.message);
            showToast(error.message);
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={{
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 600,
                fontStyle: 'italic',
                color: colors.primaryTextColor
            }}>Deli Vouchers</Text>
            <FieldSet label="Username">
                <TextInput placeholder="Username" onChangeText={(value) => {
                    setUserName(value);
                }} value={username} />
            </FieldSet>
            <Button
                disabled={loading}
                primary
                onPress={submit}
                text="Login"
                icon={loading ? <ActivityIndicator color="white" /> : null} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        rowGap: 20,
        paddingHorizontal: 20
    }
});