import { collection, query, where, getDoc, setDoc, getDocs, deleteDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from '../firebaseConfig';

const COLLECTION_NAME = 'royal-express' // production
// const COLLECTION_NAME = 'dev-db' // development

const collectionRef = collection(db, COLLECTION_NAME);

export const addVoucher = async (voucher) => {
    const date = (voucher.date).setHours(0, 0, 0, 0);
    const timestamp = Timestamp.fromDate(new Date(date));
    voucher.date = timestamp;
    const voucherDocRef = doc(collectionRef, voucher.code);
    const voucherDoc = await getDoc(voucherDocRef);

    if (voucherDoc.exists()) {
        console.log('Already exists.')
        throw new Error(`Voucher with code ${voucher.code} already exists.`);
    } else {
        await setDoc(voucherDocRef, voucher);
        console.log(`Voucher with ID ${voucher.code} added.`);
    }
}

export const fetchVouchers = async (filters) => {
    console.log('filters',filters)
    const { code, username, amount, date } = JSON.parse(filters);

    let q = collectionRef;

    if (code) {
        q = query(q, where('code', '==', code));
    }

    if (username) {
        q = query(q, where('username', '==', username));
    }

    if (amount) {
        q = query(q, where('amount', '>=', amount.min), where('amount', '<=', amount.max));
    }

    if (date) {
        console.log(date)
        const startTimestamp = Timestamp.fromDate(new Date(date));
        const endDate = new Date(new Date(date).setHours(23, 59, 59, 999));
        const endTimestamp = Timestamp.fromDate(endDate);
        q = query(collectionRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));
    }

    const querySnapshot = await getDocs(q);
    const result = [];
    querySnapshot.forEach((doc) => {
        result.push(doc.data());
    });
    console.log('Fetched vouchers.');
    return result;
}

export const deleteVoucher = async (code) => {
    await deleteDoc(doc(collectionRef, code));
    console.log(`Voucher with ID ${code} deleted.`)
}

export const deleteVouchersByDate = async (date) => {
    const q = query(collectionRef, where("date", ">=", date.startOfDay()), where("date", "<", date.endOfDay()));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log(`Voucher with ID ${doc.code} deleted.`);
    });
}

export const updateAmount = async (code, newAmount) => {
    const voucherDocRef = doc(collectionRef, code);
    await updateDoc(voucherDocRef, { amount: newAmount });
    console.log("Voucher amount updated successfully.");
}