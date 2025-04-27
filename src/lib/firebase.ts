
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyA1YGFbDHDuSQVXFsRO-XD7Usir9dULoEU",
  authDomain: "testing-dba79.firebaseapp.com",
  projectId: "testing-dba79",
  storageBucket: "testing-dba79.firebasestorage.app",
  messagingSenderId: "808371260131",
  appId: "1:808371260131:web:a59f409f532e617cba13d6"
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
