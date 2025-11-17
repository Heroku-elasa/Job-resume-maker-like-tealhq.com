
import { Lawyer, JobApplication } from '../types';

const DB_NAME = 'DadgarAIAppDB';
const DB_VERSION = 2; // Incremented version for schema change
const LAWYER_STORE_NAME = 'lawyers';
const JOB_APP_STORE_NAME = 'job_applications';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
      reject('Error opening IndexedDB.');
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(LAWYER_STORE_NAME)) {
        dbInstance.createObjectStore(LAWYER_STORE_NAME, { keyPath: 'website' });
      }
      if (!dbInstance.objectStoreNames.contains(JOB_APP_STORE_NAME)) {
        dbInstance.createObjectStore(JOB_APP_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// --- Lawyer Functions ---

export const addLawyers = (lawyers: Lawyer[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(LAWYER_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(LAWYER_STORE_NAME);
    transaction.onerror = () => reject('Error adding lawyers.');
    transaction.oncomplete = () => resolve();
    lawyers.forEach(lawyer => store.put(lawyer));
  });
};

export const getAllLawyers = (): Promise<Lawyer[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const request = db.transaction(LAWYER_STORE_NAME, 'readonly').objectStore(LAWYER_STORE_NAME).getAll();
    request.onerror = () => reject('Error fetching all lawyers.');
    request.onsuccess = () => resolve(request.result);
  });
};

export const clearAllLawyers = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject('DB not initialized.');
        const request = db.transaction(LAWYER_STORE_NAME, 'readwrite').objectStore(LAWYER_STORE_NAME).clear();
        request.onerror = () => reject('Error clearing lawyers.');
        request.onsuccess = () => resolve();
    });
};

// --- Job Application Functions ---

export const addApplication = (application: JobApplication): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(JOB_APP_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(JOB_APP_STORE_NAME);
    transaction.onerror = () => reject('Error adding application.');
    transaction.oncomplete = () => resolve();
    store.add(application);
  });
};

export const getAllApplications = (): Promise<JobApplication[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const request = db.transaction(JOB_APP_STORE_NAME, 'readonly').objectStore(JOB_APP_STORE_NAME).getAll();
    request.onerror = () => reject('Error fetching all applications.');
    request.onsuccess = () => resolve(request.result.sort((a,b) => (b.appliedDate || 0) - (a.appliedDate || 0)));
  });
};

export const updateApplication = (application: JobApplication): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized.');
    const transaction = db.transaction(JOB_APP_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(JOB_APP_STORE_NAME);
    transaction.onerror = () => reject('Error updating application.');
    transaction.oncomplete = () => resolve();
    store.put(application);
  });
};
