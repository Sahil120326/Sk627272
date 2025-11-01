import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'PredictionModelDB';
const STORE_NAME = 'ModelStore';
const VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = () => {
  if (dbPromise) {
    return dbPromise;
  }
  dbPromise = openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
  return dbPromise;
};

export const setModelData = async (data: any): Promise<void> => {
  const db = await initDB();
  await db.put(STORE_NAME, data, 'prediction-model');
};

export const getModelData = async (): Promise<any | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, 'prediction-model');
};
