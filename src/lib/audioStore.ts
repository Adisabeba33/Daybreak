/**
 * Binary audio (voice notes) can't live in the localStorage JSON blob, so we
 * keep the recordings in IndexedDB keyed by an id; the Task only stores that id
 * (voiceNoteId) + a duration. This module is the whole storage surface.
 */

const DB_NAME = "daybreak-audio";
const STORE = "audio";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("no-indexeddb"));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
      }),
  );
}

let counter = 0;
export async function saveAudio(blob: Blob): Promise<string> {
  counter += 1;
  const id = `aud_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 8)}`;
  await run("readwrite", (s) => s.put(blob, id));
  return id;
}

export async function getAudioBlob(id: string): Promise<Blob | null> {
  try {
    const blob = await run<Blob | undefined>("readonly", (s) => s.get(id));
    return blob ?? null;
  } catch {
    return null;
  }
}

export async function deleteAudio(id: string): Promise<void> {
  try {
    await run("readwrite", (s) => s.delete(id));
  } catch {
    // best-effort cleanup
  }
}
