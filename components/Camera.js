import { AutoFocus, Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useCallback, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import {
    MaterialIcons,
    Entypo,
    FontAwesome,
} from '@expo/vector-icons';
import ConfirmPhoto from './ConfirmPhoto';
import { setQRData as setQR, setImageLink } from '../store/slices/appSlice';
import { Button } from './Button';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../constants';

export default function CameraScreen() {
    const dispatch = useDispatch();
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [permissionM, requestPermissionM] = MediaLibrary.usePermissions();
    const [cameraInstance, setCameraInstance] = useState(null);
    const cameraRef = useCallback((ref) => {
        setCameraInstance(ref);
    }, [])

    const [QRData, setQRData] = useState(null);
    const [imageUri, setImageUri] = useState("");

    const { width, height } = Dimensions.get('window');
    const previewHeight = width * (16 / 9);
    const imagePadding = (height - previewHeight) / 2;

    if (!permission || !permissionM) return null;

    if (!permission.granted || !permissionM.granted) {
        return (
            <View style={[styles.container, styles.mainBackgroundColor, styles.padding5]}>
                <Text style={{ marginTop: 'auto', marginBottom: 'auto', textAlign: 'center' }}>
                    Please grant permissions
                </Text>
                <Button onPress={() => {
                    requestPermission();
                    requestPermissionM();
                }} text="Grant Permission" />
            </View>
        )
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.5,
        });

        console.log(result);

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            const barcodeResult = await BarCodeScanner.scanFromURLAsync(uri, [BarCodeScanner.Constants.BarCodeType.qr]);
            if (barcodeResult.length > 0) {
                const qrResult = barcodeResult[0];
                setQRData(qrResult?.data);
            } else {
                setQRData(null);
            }
        }
    };

    const onSave = async () => {
        dispatch(setQR(QRData));
        setQRData(null);

        dispatch(setImageLink(imageUri));
        setImageUri("");

        router.replace('/form');
    }

    async function onTakePicture() {
        console.log('takePicture')
        try {
            if (cameraInstance) {
                const result = await cameraInstance.takePictureAsync({ 
                    skipProcessing: true,
                    quality: 0.5,
                });
                console.log(result, typeof result)
                console.log(result.uri)
                if (result && result.uri) {
                    console.log(result.uri)
                    const localUri = result.uri;
                    const filename = localUri.substring(localUri.lastIndexOf('/') + 1);
                    const remoteUri = FileSystem.documentDirectory + filename;

                    // Save the photo to a temporary directory
                    await FileSystem.moveAsync({
                        from: localUri,
                        to: remoteUri,
                    });

                    setImageUri(remoteUri);

                    MediaLibrary.saveToLibraryAsync(remoteUri);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <View style={styles.container}>
            {imageUri ? (
                <ConfirmPhoto
                    onSave={onSave}
                    imageUri={imageUri} />
            ) : (
                <Camera
                    ratio="16:9"
                    style={[styles.cameraPreview, { marginTop: imagePadding, marginBottom: imagePadding }]}
                    type={CameraType.back}
                    ref={cameraRef}
                    focusDepth={0}
                    barCodeScannerSettings={{
                        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                    }}
                    onBarCodeScanned={(data) => {
                        if (data?.data) {
                            setQRData(data.data);
                        }
                    }}
                    autoFocus={AutoFocus.on}>

                    {QRData && <View style={styles.qrPosition}>
                        <Text style={styles.text}>{QRData}</Text>
                    </View>}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            <Entypo name="image" size={35} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onTakePicture}>
                            <MaterialIcons name="camera" size={90} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            router.replace('/dashboard')
                        }}>
                            <FontAwesome name="dashboard" size={35} color="white" />
                        </TouchableOpacity>
                    </View>
                </Camera>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    cameraPreview: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 'auto',
        marginBottom: 20,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center'
    },
    border: {
        borderWidth: 1.1,
        borderRadius: 6,
        borderColor: '#718096'
    },
    qrPosition: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        marginTop: 20,
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#44CF6C'
    },
    mainBackgroundColor: {
        backgroundColor: colors.mainBackgroundColor
    },
    padding5:{
        padding:20
    }
});
