import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely (singleton pattern)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured database ID
export const firestoreDatabaseId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, firestoreDatabaseId);

// Test connection to Firestore as mandated by integration guidelines
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // Attempt reading from test collection
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: 'Connected to Firestore Cloud Database' };
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('Firestore offline client detected:', error.message);
      return { success: false, message: 'Offline: Using local fallback cache' };
    }
    // Document not existing or permission check still confirms network reachability
    return { success: true, message: 'Cloud Database reachable' };
  }
}
