import { StyleSheet, View, Text } from "react-native";
import { formatCurrency } from "../utils";

export default function Summary({ data }) {

    return (
        <View style={[styles.descriptionContainer]}>
            <View style={[styles.flexDirectionRow]}>
                <View style={[styles.labelColumn, styles.p15, styles.bdRight]}>
                    <Text>User</Text>
                </View>

                {Object.keys(data).map((key, index, array) => {
                    if (index === array.length - 1) {
                        return (
                            <View style={[styles.p15, styles.valueColumn]} key={index}>
                                <Text>{key}</Text>
                            </View>
                        )
                    } else {
                        return (
                            <View style={[styles.p15, styles.midColumn, styles.bdRight]} key={index}>
                                <Text>{key}</Text>
                            </View>
                        )
                    }
                })}
            </View>

            {/* mid row */}
            <View style={[styles.flexDirectionRow]}>
                <View
                    style={[
                        styles.labelColumn,
                        styles.p15,
                        styles.bdBottom,
                        styles.bdTop,
                        styles.bdRight,
                    ]}
                >
                    <Text>Vouchers</Text>
                </View>
                {
                    Object.keys(data).map((key, index, array) => {
                        if (index === array.length - 1) {
                            return (
                                <View style={[styles.p15, styles.valueColumn, styles.bdTop, styles.bdBottom]} key={index}>
                                    <Text>{data[key].vouchers.length}</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={[styles.p15, styles.midColumn, styles.bdRight, styles.bdTop, styles.bdBottom]} key={index}>
                                    <Text>{data[key].vouchers.length}</Text>
                                </View>
                            )
                        }
                    })
                }
            </View>

            {/* end row */}
            <View style={[styles.flexDirectionRow]}>
                <View style={[styles.labelColumn, styles.p15, styles.bdRight]}>
                    <Text>Amount</Text>
                </View>
                {
                    Object.keys(data).map((key, index, array) => {
                        if (index === array.length - 1) {
                            return (
                                <View style={[styles.p15, styles.valueColumn]} key={index}>
                                    <Text>{formatCurrency(data[key].amount)}</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View style={[styles.p15, styles.midColumn, styles.bdRight]} key={index}>
                                    <Text>{formatCurrency(data[key].amount)}</Text>
                                </View>
                            )
                        }
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    title: {
        fontSize: 16,
    },
    flexDirectionRow: {
        flexDirection: "row",
    },
    mv5: {
        marginVertical: 5,
    },
    mt20: {
        marginTop: 20,
    },
    cardDescription: {
        fontSize: 14,
        color: "#0869C9",
    },
    colon: {
        paddingHorizontal: 10,
    },
    pV20: {
        paddingVertical: 20,
    },
    labelColumn: {
        justifyContent: "center",
        alignItems: "flex-start",
        flex: 1
    },
    midColumn: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    valueColumn: {
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1
    },
    p15: {
        padding: 15,
    },
    pl10: {
        paddingLeft: 10,
    },
    descriptionContainer: {
        borderRadius: 10,
        borderColor: "#007ea7",
        borderWidth: 2,
        margin: 5
    },
    mb20: {
        marginBottom: 20,
    },
    mb40: {
        marginBottom: 40,
    },
    bdTop: {
        borderTopWidth: 2,
        borderTopColor: "#007ea7",
    },
    bdBottom: {
        borderBottomWidth: 2,
        borderBottomColor: "#007ea7",
    },
    bdRight: {
        borderRightColor: "#007ea7",
        borderRightWidth: 2,
    },
});
