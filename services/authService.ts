import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInAnonymously,
} from "firebase/auth";
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { auth } from "./firebase";

// ⚠️ IMPORTANTE: Este DEBE ser el Web Client ID de tu proyecto Firebase.
// Encuéntralo en: Firebase Console → Authentication → Sign-in method → Google → Web client ID
// Tu Firebase project usa messagingSenderId "253041264602", así que el webClientId
// debe empezar con "253041264602-..." (NO "663856121853-...")
//
// También puedes encontrarlo en Google Cloud Console → APIs & Services → Credentials
// → busca el OAuth client de tipo "Web application" asociado a tu proyecto Firebase.
GoogleSignin.configure({
  webClientId:
    "253041264602-rn6ndjck66ujkagf203r3necobsas3qc.apps.googleusercontent.com",
  offlineAccess: true,
});

/**
 * Inicia sesión con Google usando el SDK nativo y luego autentica con Firebase.
 */
export const signInWithGoogle = async () => {
  // Verifica que Google Play Services esté disponible (Android)
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  // Muestra el diálogo nativo de Google Sign-In
  const signInResult = await GoogleSignin.signIn();

  console.log("📋 Google signIn result type:", signInResult?.type);

  // Si el usuario canceló
  if (signInResult?.type === "cancelled") {
    const cancelError: any = new Error("Sign in cancelled");
    cancelError.code = "SIGN_IN_CANCELLED";
    throw cancelError;
  }

  // Obtiene el idToken del resultado
  const idToken = signInResult?.data?.idToken;

  console.log("🔑 idToken obtenido:", idToken ? "SÍ" : "NO (null)");

  if (!idToken) {
    throw new Error(
      "No se obtuvo el ID token de Google. " +
      "Verifica que el webClientId en authService.ts sea el Web Client ID correcto de Firebase. " +
      "Búscalo en: Firebase Console → Authentication → Sign-in method → Google"
    );
  }

  // Crea la credencial de Firebase con el idToken
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  console.log("✅ Firebase sign in exitoso:", result.user.email);
  return result.user;
};

export const signInAsGuest = async () => {
  console.log("👤 Iniciando sesión como invitado...");
  const result = await signInAnonymously(auth);
  console.log("✅ Firebase sign in invitado exitoso:", result.user.uid);
  return result.user;
};

export const signOutUser = async () => {
  // Cierra sesión en Google también para permitir elegir otra cuenta
  try {
    await GoogleSignin.revokeAccess();
  } catch {
    // Si falla revocar, al menos intenta sign out
  }
  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignorar errores de Google signOut
  }
  await firebaseSignOut(auth);
};

export const subscribeToAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};

export { isErrorWithCode, statusCodes };
