import { ToastAndroid } from 'react-native';
import dayjs from 'dayjs'

export function showToast(message) {
    ToastAndroid.show(message ?? '', ToastAndroid.SHORT);
}

export  const formatDate = (date) => dayjs(date).format("MMM / DD / YY")

export const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
