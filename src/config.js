import Constants from 'expo-constants';

// In dev, the Expo dev server host is your computer's LAN IP, so the phone can reach the backend on it.
// To use a different backend, set EXPO_PUBLIC_API_URL in .env (e.g. https://my-api.onrender.com/api)
const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host || 'localhost'}:5000/api`;
