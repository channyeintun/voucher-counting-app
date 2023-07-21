import { View } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from "expo-secure-store";
import { useDispatch } from 'react-redux';
import { setUsername } from '../store/slices/appSlice';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const dispatch = useDispatch();

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [permissionM, requestPermissionM] = MediaLibrary.usePermissions();

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

  useEffect(() => {
    (async () => {
      if (permission && permissionM) {
        if (!permission.granted) {
          await requestPermission();
        }
        if (!permissionM.granted) {
          requestPermissionM();
        }
      }
    })();
  }, [permission, permissionM])

  return <View />
}