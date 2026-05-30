import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC03tbgzBGHp8gsE3SvSLwJKEMEpHg8XK4",
  authDomain: "k-realtor.firebaseapp.com",
  projectId: "k-realtor",
  storageBucket: "k-realtor.firebasestorage.app",
  messagingSenderId: "319285320167",
  appId: "1:319285320167:web:749f584c64ad7b84c78542",
  measurementId: "G-WGR3L5CJK6"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Helper to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    // Fallback for local development or if popup is blocked/unconfigured
    throw error;
  }
};

// Helper to sign out
export const logout = () => signOut(auth);
