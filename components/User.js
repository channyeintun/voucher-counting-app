import { View, StyleSheet, TextInput } from "react-native";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setUsername as setUser } from "../store/slices/appSlice";
import { Button } from "./Button";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { FieldSet } from "./FieldSet";

export default function User() {
    const dispatch = useDispatch();

    const [username, setUserName] = useState('');

    return (
        <View style={styles.container}>
            <FieldSet label="Username">
                <TextInput placeholder="Username" onChangeText={(value) => {
                    setUserName(value);
                }} value={username} />
            </FieldSet>
            <Button
                primary
                onPress={async () => {
                    dispatch(setUser(username));
                    await SecureStore.setItemAsync('username', username);
                    router.replace('/camera');
                }}
                text="Save" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        rowGap: 20,
        paddingHorizontal:20
    }
});