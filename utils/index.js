import Toast from 'react-native-root-toast';
import dayjs from 'dayjs'

export function showToast(message) {
    Toast.show(message, {
        duration: Toast.durations.SHORT
    })
}

export const formatDate = (date) => dayjs(date).format("MMM / DD / YY")

export const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
