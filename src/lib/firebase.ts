import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';

// Helper to get config from environment or localStorage
const getConfigValue = (key: string): string | undefined => {
  // Try to get from environment first
  const envValue = process.env[`NEXT_PUBLIC_FIREBASE_${key}`];
  if (envValue) return envValue;
  
  // If not in environment, try localStorage (used in development)
  if (typeof window !== 'undefined') {
    const localValue = localStorage.getItem(`NEXT_PUBLIC_FIREBASE_${key}`);
    if (localValue) return localValue;
  }
  
  return undefined;
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: getConfigValue('API_KEY'),
  authDomain: getConfigValue('AUTH_DOMAIN'),
  projectId: getConfigValue('PROJECT_ID'),
  storageBucket: getConfigValue('STORAGE_BUCKET'),
  messagingSenderId: getConfigValue('MESSAGING_SENDER_ID'),
  appId: getConfigValue('APP_ID'),
  measurementId: getConfigValue('MEASUREMENT_ID')
};

// Initialize Firebase only if config is available
let db: Firestore | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (firebaseConfig.apiKey) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

export { db, auth, googleProvider }; 