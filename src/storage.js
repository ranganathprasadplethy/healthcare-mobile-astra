import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// SecureStore on phones, localStorage in the browser
const web = Platform.OS === 'web';
export const getToken = async () => (web ? localStorage.getItem('token') : SecureStore.getItemAsync('token'));
export const setToken = async (t) => (web ? localStorage.setItem('token', t) : SecureStore.setItemAsync('token', t));
export const clearToken = async () => (web ? localStorage.removeItem('token') : SecureStore.deleteItemAsync('token'));
