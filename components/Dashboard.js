import { useCallback, useState } from "react";
import { FlatList, View, StyleSheet, Text, Image, Modal, Pressable, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { useEffect } from "react";
import dayjs from "dayjs";

import { colors } from "../constants";
import { useFetchVouchersQuery, useDeleteVoucherMutation } from "../store/apis/firestoreApi";
import { formatCurrency, showToast } from "../utils";
import { Button } from "./Button";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import Summary from "./Summary";
import { useSelector } from "react-redux";

export default function DashboardScreen() {

    const username = useSelector(state => state.app.username);
    const serializedFilters = JSON.stringify({ date: ((new Date()).setHours(0, 0, 0, 0)).valueOf() });
    const result = useFetchVouchersQuery(serializedFilters);
    const [selectedVoucher, selectVoucher] = useState(null);
    const [refreshing, setRefresh] = useState(false);
    const [deleteVoucher, deleteResult] = useDeleteVoucherMutation();

    useEffect(() => {
        if (result.isError) {
            showToast(result.error);
        }

        (async () => {
            if (result && refreshing) {
                await result.refetch();
                setRefresh(false);
            }
        })();

    }, [result, refreshing])

    useEffect(() => {

        if (deleteResult.isSuccess) {
            showToast('Deleted');
        }
        if (deleteResult.isError) {
            showToast(deleteResult.error);
        }

    }, [deleteResult])

    const groupByUser = (ac, value) => {
        const { username, code, amount } = value;
        ac[username] = ac[username] ?? {};
        const obj = ac[username];
        obj.amount = obj.amount ?? 0;
        obj.amount += amount;
        obj.vouchers = obj.vouchers ?? [];
        obj.vouchers.push(code);
        return ac;
    }

    const group = result?.data?.reduce(groupByUser, {});

    return (
        <View style={styles.container}>
            <Spinner
                visible={result.isLoading || deleteResult.isLoading}
                textContent={result.isLoading ? "Loading..." : "Deleting..."}
                textStyle={styles.spinnerTextStyle} />
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedVoucher}
                onRequestClose={() => {
                    selectVoucher(null);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ImageViewer
                            style={styles.image}
                            imageUrls={[{ url: selectedVoucher?.imageUri }]}
                            renderIndicator={() => null} />
                        <View style={styles.positionStack}>
                            <Button
                                onPress={() => {
                                    Alert.alert(
                                        'ဖျက်ဖို့သေချာပြီလား ?',
                                        'Gallery ထဲကပုံပဲကျန်မယ်',
                                        [
                                            {
                                                text: 'Yes',
                                                onPress: () => {
                                                    deleteVoucher(selectedVoucher);
                                                    selectVoucher(null);
                                                },
                                            },
                                            {
                                                text: 'No',
                                                onPress: () => console.log('No Pressed'),
                                            },
                                        ],
                                        { cancelable: false }
                                    );
                                }}
                                danger
                                icon={<MaterialIcons name="delete" size={24} color="red" />} />
                        </View>
                    </View>
                </View>
            </Modal>
            {(result && result.data && result.data.length > 0) ? <>
                {group && Object.keys(group).length > 0 && <Summary data={group} />}
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => setRefresh(true)}
                    data={result.data.filter(it => it.username === username)}
                    renderItem={({ item }) => {
                        return (
                            <Pressable onPress={() => {
                                selectVoucher(item);
                            }}>
                                <View style={styles.card}>
                                    <View style={styles.imageIcon}>
                                        <Text>{item.code.slice(0, 3)}</Text>
                                    </View>
                                    <View>
                                        <View>
                                            <Text style={styles.text}>Code: {item.code}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>User: {item.username}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>Amount: {formatCurrency(item.amount)}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.text}>Date: {dayjs(item.date).format("DD / MM / YY")}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        )
                    }}
                />
            </> : (!result.isLoading && <View style={{
                flex: 1,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}><Text style={{ color: colors.primaryTextColor }}>ဘာမှမရှိတော့ဘူး</Text></View>)}
            <Pressable
                onPress={() => {
                    router.replace("/camera");
                }}
                style={styles.floatingActionButton}>
                <MaterialIcons name="add-a-photo" size={50} color="#007ea7" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10
    },
    card: {
        flex: 1,
        minHeight: 100,
        backgroundColor: "#95b8d1",
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginHorizontal: 5,
        marginBottom: 10,
        gap: 5,
        shadowColor: colors.primaryBackgroundColor,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
        padding: 5
    },
    text: {
        color: colors.primaryTextColor,
        fontSize: 20
    },
    spinnerTextStyle: {
        color: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        flex: 1,
        width: '100%',
        borderRadius: 6,
        alignItems: "center",
        shadowColor: colors.primaryBackgroundColor,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
        position: 'relative',
        zIndex: 1,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: colors.primaryTextColor
    },
    image: {
        width: '100%',
        aspectRatio: 1
    },
    floatingActionButton: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 40,
        bottom: 40,
    },
    imageIcon: {
        width: 100,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#809bce'
    },
    positionStack: {
        position: 'absolute',
        top: 10,
        justifyContent: 'center',
        flex: 1,
        zIndex: 10
    }
})