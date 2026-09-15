import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DatabaseActionRecord {
  id: string;
  type: 'POST' | 'EDIT' | 'DELETE';
  collectionName: string;
  documentId: string;
  summary: string;
  timestamp: string;
  status: 'saved' | 'pending' | 'failed';
  error?: string;
}

type ActionSubscriber = (action: DatabaseActionRecord) => void;
const actionSubscribers: Set<ActionSubscriber> = new Set();

export function subscribeToDatabaseActions(callback: ActionSubscriber): () => void {
  actionSubscribers.add(callback);
  return () => actionSubscribers.delete(callback);
}

function notifyAction(action: DatabaseActionRecord) {
  actionSubscribers.forEach((cb) => {
    try {
      cb(action);
    } catch (e) {
      console.error('Error notifying action subscriber', e);
    }
  });
}

/**
 * Capture a POST or EDIT into Firestore
 */
export async function saveDocument<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T,
  isEdit: boolean = false
): Promise<boolean> {
  const actionRecord: DatabaseActionRecord = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: isEdit ? 'EDIT' : 'POST',
    collectionName,
    documentId: docId,
    summary: `${isEdit ? 'Updated' : 'Created'} record in "${collectionName}" [${docId}]`,
    timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: 'pending',
  };

  notifyAction(actionRecord);

  try {
    const docRef = doc(db, collectionName, docId);
    // Use merge: true so partial updates or complete items are safely persisted
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    
    actionRecord.status = 'saved';
    notifyAction(actionRecord);
    return true;
  } catch (err: any) {
    console.error(`Firestore save error on ${collectionName}/${docId}:`, err);
    actionRecord.status = 'failed';
    actionRecord.error = err?.message || 'Database write error';
    notifyAction(actionRecord);
    return false;
  }
}

/**
 * Capture a DELETION in Firestore
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<boolean> {
  const actionRecord: DatabaseActionRecord = {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    type: 'DELETE',
    collectionName,
    documentId: docId,
    summary: `Deleted document from "${collectionName}" [${docId}]`,
    timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    status: 'pending',
  };

  notifyAction(actionRecord);

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    
    actionRecord.status = 'saved';
    notifyAction(actionRecord);
    return true;
  } catch (err: any) {
    console.error(`Firestore delete error on ${collectionName}/${docId}:`, err);
    actionRecord.status = 'failed';
    actionRecord.error = err?.message || 'Database delete error';
    notifyAction(actionRecord);
    return false;
  }
}

/**
 * Fetch all documents in a collection
 */
export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const items: T[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as unknown as T);
    });
    return items;
  } catch (err) {
    console.warn(`Could not fetch collection "${collectionName}":`, err);
    return [];
  }
}

/**
 * Listen in real time to a collection
 */
export function subscribeToCollection<T>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as unknown as T);
      });
      onUpdate(items);
    },
    (err) => {
      console.warn(`Snapshot listener error on "${collectionName}":`, err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch a single document (e.g. siteContent settings)
 */
export async function fetchSingleDoc<T>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  } catch (err) {
    console.warn(`Could not fetch doc "${collectionName}/${docId}":`, err);
    return null;
  }
}

/**
 * Seed initial data to cloud if collection is currently empty
 */
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialItems: T[]
): Promise<number> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return 0; // Already has cloud data, preserve existing records
    }

    const batch = writeBatch(db);
    let count = 0;
    for (const item of initialItems) {
      const docRef = doc(db, collectionName, item.id);
      batch.set(docRef, { ...item, seededAt: new Date().toISOString() });
      count++;
    }
    await batch.commit();
    return count;
  } catch (err) {
    console.warn(`Error seeding collection "${collectionName}":`, err);
    return 0;
  }
}
