import { getFirestore } from "firebase/firestore";
// @ts-ignore – React Native persistence import
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "./firebaseConfig";

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
