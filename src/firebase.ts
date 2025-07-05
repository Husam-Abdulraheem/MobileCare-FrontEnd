// Firebase initialization file
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, db, analytics, auth };

// Firestore helpers for RepairOrders (must be after db is defined)
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const orderRef = doc(db, "repairOrders", orderId);
  await updateDoc(orderRef, { status });
}

// Delete order
export async function deleteOrder(orderId: string) {
  const orderRef = doc(db, "repairOrders", orderId);
  await deleteDoc(orderRef);
}
