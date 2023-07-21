import { View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { useDispatch } from 'react-redux';
import { setUsername } from '../store/slices/appSlice';

export default function App() {
  const dispatch = useDispatch();

  async function checkUsername() {
    const username = await SecureStore.getItemAsync('username');
    console.log('username', username);
    if (username) {
      dispatch(setUsername(username));
      router.replace('/camera');
    } else {
      router.replace('/user');
    }
  }

  useEffect(() => {
    checkUsername();
  }, []);
  return <View />
}