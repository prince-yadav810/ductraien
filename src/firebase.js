// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByvqiNmj2guAtLkLPC87fZiQZVJVhkDW8",
    authDomain: "neet2026-f3801.firebaseapp.com",
    projectId: "neet2026-f3801",
    storageBucket: "neet2026-f3801.firebasestorage.app",
    messagingSenderId: "96173622712",
    appId: "1:96173622712:web:08d4d93cd2f26ff625fb4d",
    measurementId: "G-SL9C2ZM59S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence enabled in one tab only');
    } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support offline persistence');
    }
});
