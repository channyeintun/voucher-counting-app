import { useEffect, useState } from "react"
import {
    StyleSheet,
    ScrollView,
    TextInput,
    View,
    Text,
    Pressable,
    Image
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useSelector, useDispatch } from "react-redux"
import { FontAwesome5 } from "@expo/vector-icons"
import { router } from "expo-router"
import * as FileSystem from "expo-file-system";
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { formatDate, showToast } from "../utils"
import { FieldSet } from "./FieldSet"
import { Button } from "./Button"
import { uploadImage } from "../store/apis/cloudinaryApi";
import { useAddVoucherMutation } from "../store/apis/firestoreApi";
import { colors } from "../constants"
import { setQRData as setQR, setImageLink } from '../store/slices/appSlice';

export default function Form() {
    const dispatch = useDispatch();
    const { qrData, username, imageLink } = useSelector(state => state.app);
    const [image, setImage] = useState(imageLink);
    const [loading, setLoading] = useState(false);

    const [createVoucher, { isLoading, error, isSuccess }] = useAddVoucherMutation();

    const [date, setDate] = useState(new Date())
    const [dateShow, setDateShow] = useState(false)
    const onDateChange = (e, date) => {
        setDateShow(false);
        setDate(date);
    }

    const [voucherCode, setVoucherCode] = useState(qrData);
    const [amount, setAmount] = useState(null);

    const onSave = async ({
        image,
        amount,
        date,
        username,
        voucherCode
    }) => {
        console.log('save')
        setLoading(true);
        if (!isNaN(+amount) && date && username && voucherCode && image) {
            const manipResult = await manipulateAsync(
                image,
                [{ resize: { width: 500 } }],
                { compress: 0.75, format: SaveFormat.JPEG }
            );
            const binaryData = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: FileSystem.EncodingType.Base64 });
            const { secure_url } = await uploadImage(binaryData);
            await createVoucher({
                code: voucherCode,
                username,
                amount: +amount,
                date,
                imageUri: secure_url,
            });
            console.log('created voucher')
        } else {
            showToast('Please fill all fields.');
        }
        setLoading(false);
    };

    useEffect(() => {
        isSuccess && router.replace('/camera');
        if (error) {
            showToast(error);
        }
    }, [isSuccess, error]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.75,
        });

        console.log(result);

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            dispatch(setImageLink(uri));
            const barcodeResult = await BarCodeScanner.scanFromURLAsync(uri, [BarCodeScanner.Constants.BarCodeType.qr]);
            if (barcodeResult.length > 0) {
                const qrResult = barcodeResult[0];
                setVoucherCode(qrResult?.data);
            } else {
                dispatch(setQR(null));
                setVoucherCode(null);
                showToast('No QR code was found.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading || isLoading}
                textContent="Saving..."
                textStyle={styles.spinnerTextStyle} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={styles.formWrapper}>
                <FieldSet
                    label="Date:"
                    containerStyle={[styles.fieldSet, styles.textArea]}
                >
                    <Pressable onPress={() => setDateShow(true)}>
                        <View style={styles.datePickerButton}>
                            <FontAwesome5 name="calendar" size={20} color="#A0AEC0" />
                            <Text style={styles.date}>{formatDate(date)}</Text>
                        </View>
                    </Pressable>
                    {dateShow && (
                        <DateTimePicker
                            key="date"
                            onChange={onDateChange}
                            mode="date"
                            display="default"
                            value={date}
                        />
                    )}
                </FieldSet>

                <FieldSet
                    label="Voucher Code:"
                    containerStyle={[styles.fieldSet, styles.textArea]}
                >
                    <TextInput
                        style={styles.secondaryTextColor}
                        onChangeText={(value) => setVoucherCode(value)}
                        value={voucherCode}
                    />
                </FieldSet>

                <FieldSet label="Username:" containerStyle={styles.fieldSet}>
                    <Text>{username}</Text>
                </FieldSet>

                <FieldSet
                    label="Amount:"
                    containerStyle={[styles.fieldSet, styles.textArea]}
                >
                    <TextInput
                        keyboardType="numeric"
                        onChangeText={(value) => setAmount(value)}
                        value={amount}
                    />
                </FieldSet>

                {image && <FieldSet
                    label="Image:"
                    containerStyle={[styles.fieldSet]}>
                    <Pressable onPress={pickImage}>
                        <Image
                            style={styles.image}
                            source={{ uri: image }}
                            contentFit="contain" />
                    </Pressable>
                </FieldSet>}


                <View style={[styles.flexDirectionRow, styles.spaceBetween]}>
                    <Button
                        onPress={() => { router.replace("/camera"); }}
                        text="Cancel"
                        width={140}
                        height={50}
                        textStyle={styles.saveButton}
                    />
                    <Button
                        primary
                        disabled={loading || isLoading}
                        onPress={() => {
                            onSave({
                                image,
                                amount,
                                date,
                                username,
                                voucherCode
                            })
                        }}
                        text="Save"
                        width={140}
                        height={50}
                        textStyle={styles.saveButton}
                    />
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBackgroundColor,
    },
    formWrapper: {
        width: "100%",
        paddingHorizontal: 20,
        paddingTop: 25,
    },
    fieldSet: {
        marginBottom: 30,
    },
    saveButton: {
        color: "#000",
        fontSize: 16,
    },
    textArea: {
        minHeight: 50,
    },
    flexDirectionRow: {
        flexDirection: "row",
        marginBottom: 20,
        padding: 5,
    },
    text: {
        fontSize: 14,
        marginLeft: 10,
    },
    marginRigth40: {
        marginRight: 40,
    },
    datePickerButton: {
        width: 145,
        flexDirection: "row",
        paddingLeft: 15,
        alignItems: "center",
        elevation: 9,
        shadowColor: "rgba(0, 0, 0, 0.6)",
        paddingVertical: 15,
        borderRadius: 8,
        backgroundColor: colors.secondaryBackgroundColor,
    },
    spaceBetween: {
        justifyContent: "space-between",
    },
    date: {
        fontSize: 14,
        color: "#082932",
        marginLeft: 10,
    },
    label: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    image: {
        width: 200,
        height: 200
    },
    spinnerTextStyle: {
        color: '#fff',
    },
    secondaryTextColor: {
        color: colors.secondaryTextColor
    }
})
