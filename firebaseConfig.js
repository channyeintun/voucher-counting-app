import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    initializeAuth,
    getReactNativePersistence
} from 'firebase/auth/react-native';

const config = {
    apiKey: "AIzaSyCC3rqRKAYGzHsjfwrK4q9rn6L75VNm-tk",
    authDomain: "point-of-sale-system-8d1f0.firebaseapp.com",
    projectId: "point-of-sale-system-8d1f0",
    storageBucket: "point-of-sale-system-8d1f0.appspot.com",
    messagingSenderId: "884923363625",
    appId: "1:884923363625:web:1bc29603401b7557d88738"
};

const app = initializeApp(config);

const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// initialize auth
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export {
    db,
    auth
};