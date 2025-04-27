
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDOCAbC123dEf456GhI789jKl01-MnO",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "animatichive.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "animatichive",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "animatichive.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:a1b2c3d4e5f6abcdef1234"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore (better user experience)
// This makes messaging work even with intermittent connectivity
import { enableIndexedDbPersistence } from "firebase/firestore";

try {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firebase persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The browser doesn't support IndexedDB
        console.warn('Firebase persistence failed: Browser not supported');
      }
    });
} catch (err) {
  console.error('Error enabling persistence:', err);
}

export default app;
