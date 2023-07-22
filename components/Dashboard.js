import { useState } from "react";
import { FlatList, View, StyleSheet, Text, Switch, Modal, Pressable, Alert } from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { useEffect } from "react";
import dayjs from "dayjs";
import { Skeleton } from '@rneui/themed';
import { colors } from "../constants";
import { useDeleteVoucherMutation, firestoreApi } from "../store/apis/firestoreApi";
import { formatCurrency, showToast } from "../utils";
import { Button } from "./Button";
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import Summary from "./Summary";
import { useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";

export default function DashboardScreen() {

    const today = dayjs().startOf('day').valueOf();
    const yesterday = dayjs().subtract(1, 'day').startOf('day').valueOf();
    const username = useSelector(state => state.app.username);
    const [dateFilter, setDateFilter] = useState(today);
    const serializedFilters = JSON.stringify({ date: dateFilter });
    const [fetchVouchers, result] = firestoreApi.endpoints.fetchVouchers.useLazyQuery();
    const [selectedVoucher, selectVoucher] = useState(null);
    const [refreshing, setRefresh] = useState(false);
    const [deleteVoucher, deleteResult] = useDeleteVoucherMutation();
    const [isEnabled, setEnabled] = useState(false);
    const [withCurrentUser, setWithCurrentUser] = useState(true);
    const [selectedIndex, selectIndex] = useState(null);

    const toggleSwitch = () => {
        if (isEnabled) {
            setDateFilter(today);
            console.log('set today')
        } else {
            setDateFilter(yesterday);
            console.log('set yesterday')
        }
        setEnabled(previousState => !previousState);
    }

    useEffect(() => {
        fetchVouchers(serializedFilters);
    }, [isEnabled])

    useEffect(() => {
        (async () => {
            if (refreshing) {
                await fetchVouchers(serializedFilters);
                setRefresh(false);
            }
        })();

    }, [refreshing])

    useEffect(() => {
        if (result && result.isError) {
            showToast(result.error);
        }
    }, [result])

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

    const filterByUsername = (name, eqORneq) => {
        return eqORneq ? name === username : name !== username;
    }

    const listData = result?.data?.filter(it => filterByUsername(it.username, withCurrentUser));

    const imageUrls = listData?.map(it => ({ url: it.imageUri })) ?? [];

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
                            enablePreload
                            useNativeDriver
                            loadingRender={() => (
                                <Skeleton
                                    animation="pulse"
                                    width='100%'
                                    height='100%' />
                            )
                            }
                            onChange={(index) => {
                                const item = listData[index];
                                selectVoucher(item);
                            }}
                            pageAnimateTime={300}
                            index={selectedIndex}
                            style={styles.image}
                            imageUrls={imageUrls} />
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
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', margin: 5, flexDirection: 'row' }}>
                    <Switch
                        style={{ width: 50, marginRight: 10 }}
                        trackColor={{ false: colors.accentColor, true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : colors.secondaryBackgroundColor}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={{ fontSize: 20 }}>{isEnabled ? 'Yesterday' : 'Today '}</Text>
                    <Pressable
                        style={{ marginStart: 'auto', marginEnd: 10 }}
                        onPress={() => setWithCurrentUser(prev => !prev)}>
                        <Text style={{ fontSize: 20, color: '#000', opacity: withCurrentUser ? 1 : 0.5 }}>{username}</Text>
                    </Pressable>
                </View>
                <FlatList
                    refreshing={refreshing}
                    onRefresh={() => setRefresh(true)}
                    data={result.data.filter(it => filterByUsername(it.username, withCurrentUser))}
                    renderItem={({ item, index }) => {
                        const date = new Timestamp(+item.date.seconds, +item.date.nanoseconds).toDate();
                        return (
                            <Pressable onPress={() => {
                                selectIndex(index);
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
                                            <Text style={styles.text}>Date: {dayjs(date).format("DD / MM / YY")}</Text>
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
            }}>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <Text style={{ color: colors.primaryTextColor }}>{isEnabled ? 'မနေ့ကမရှိပါ' : 'ဒီနေ့မရှိပါ'}</Text>
            </View>)}
            <Pressable
                onPress={() => {
                    router.replace("/camera");
                }}
                style={styles.floatingActionButton}>
                <MaterialIcons name="add-a-photo" size={50} color="#015CE6" />
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