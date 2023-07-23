import { View } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from 'react-redux';
import { setUsername } from '../store/slices/appSlice';
import { auth } from '../firebaseConfig';
import { setAuth } from '../store/slices/appSlice';

export default function App() {
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.app.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkUsername();
    setMounted(true);
    auth.onAuthStateChanged((user) => {
      dispatch(setAuth(!!user));
    })
  }, [])

  async function checkUsername() {
    const username = await SecureStore.getItemAsync('username');
    dispatch(setUsername(username ?? ''));
    console.log('username', username)
  }

  useEffect(() => {
    if (mounted) {
      if (authenticated) {
        router.replace('/camera');
      }
      router.replace('/login');
    }
  }, [authenticated, mounted])

  return <View />
}