import { StyleSheet, View, Text } from "react-native";
import { Image } from 'expo-image';
import { Button } from "./Button";
import { router } from "expo-router";

export default function ConfirmPhoto({ imageUri, onSave }) {

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={imageUri}
                contentFit="contain"
            />
            <View style={styles.buttonContainer}>
                <Button
                    onPress={() => { router.replace("/camera"); }}
                    text="Cancel" />
                <Button
                    primary
                    height={52}
                    onPress={onSave} text="Select" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        flexDirection: "column"
    },
    buttonContainer: {
        marginTop: 'auto',
        width: '100%',
        flexDirection: "row",
        rowGap: 10,
        justifyContent: "space-around",
        marginTop:10,
    },
    image: {
        flex: 1,
        width: '100%',
        marginTop:'auto'
    }
});