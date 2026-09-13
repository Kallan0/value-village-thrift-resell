// frontend/app/config/firebase.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || "",
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Apple Auth Provider
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

export { app, auth };
