import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const getOrderByTrackCode = async (trackCode: string) => {
  try {
    const q = query(collection(db, "repairOrders"), where("trackCode", "==", trackCode.trim()));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      customerName: data.customerName,
      brand: data.deviceBrand,
      model: data.deviceModel,
      imei: data.imei,
      problemDescription: data.problemDescription,
      status: data.status,
      lastUpdatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
      trackCode: data.trackCode,
    };
  } catch (error: any) {
    console.error('Error fetching order by track code:', error);

    // Handle specific Firebase permission errors
    if (error.code === 'permission-denied') {
      throw new Error('Access denied. Please check your Firestore security rules.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again later.');
    } else if (error.code === 'unauthenticated') {
      throw new Error('Authentication required. Please check your Firebase configuration.');
    }

    // Generic error for other cases
    throw new Error('Failed to fetch order. Please try again.');
  }
}; 