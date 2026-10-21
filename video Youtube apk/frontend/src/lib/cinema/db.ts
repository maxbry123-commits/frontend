import type { CinemaEvent, Clip, Project } from "./model";

const DB_NAME = "yaiwes-cinema";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("clips")) db.createObjectStore("clips", { keyPath: "clipId" });
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs");
      if (!db.objectStoreNames.contains("thumbs")) db.createObjectStore("thumbs");
      if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects", { keyPath: "key" });
      if (!db.objectStoreNames.contains("events")) db.createObjectStore("events", { keyPath: "eventId" });
      if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("No se pudo abrir la biblioteca local."));
  });
}

async function withStore<T>(
  name: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  const db = await openDb();
  try {
    const tx = db.transaction(name, mode);
    const done = transactionDone(tx);
    const store = tx.objectStore(name);
    const request = fn(store);
    try {
      const result = request ? await requestToPromise(request) : undefined;
      await done;
      return result;
    } catch (error) {
      await done.catch(() => undefined);
      throw error;
    }
  } finally {
    db.close();
  }
}

function requestToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Fallo de biblioteca local."));
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Transacción abortada."));
    tx.onabort = () => reject(tx.error ?? new Error("Transacción abortada."));
  });
}

export async function loadLibrary(): Promise<{
  clips: Clip[];
  projects: Project[];
  events: CinemaEvent[];
}> {
  const db = await openDb();
  try {
    const tx = db.transaction(["clips", "projects", "events"], "readonly");
    const done = transactionDone(tx);
    const clips = await requestToPromise(tx.objectStore("clips").getAll() as IDBRequest<Clip[]>);
    const projects = await requestToPromise(tx.objectStore("projects").getAll() as IDBRequest<Project[]>);
    const events = await requestToPromise(tx.objectStore("events").getAll() as IDBRequest<CinemaEvent[]>);
    await done;
    events.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return { clips, projects, events };
  } finally {
    db.close();
  }
}

export async function putClip(clip: Clip): Promise<void> {
  await withStore("clips", "readwrite", (store) => store.put(clip));
}

export async function putBlob(clipId: string, blob: Blob): Promise<void> {
  await withStore("blobs", "readwrite", (store) => store.put(blob, clipId));
}

export async function getBlob(clipId: string): Promise<Blob | null> {
  const blob = await withStore<Blob | undefined>("blobs", "readonly", (store) => store.get(clipId));
  return blob ?? null;
}

export async function putThumb(clipId: string, blob: Blob): Promise<void> {
  await withStore("thumbs", "readwrite", (store) => store.put(blob, clipId));
}

export async function getThumb(clipId: string): Promise<Blob | null> {
  const blob = await withStore<Blob | undefined>("thumbs", "readonly", (store) => store.get(clipId));
  return blob ?? null;
}

export async function putProject(project: Project): Promise<void> {
  await withStore("projects", "readwrite", (store) => store.put(project));
}

export async function putEvent(event: CinemaEvent): Promise<void> {
  await withStore("events", "readwrite", (store) => store.put(event));
}

export async function deleteClipStores(clipId: string): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(["clips", "blobs", "thumbs"], "readwrite");
    const done = transactionDone(tx);
    tx.objectStore("clips").delete(clipId);
    tx.objectStore("blobs").delete(clipId);
    tx.objectStore("thumbs").delete(clipId);
    await done;
  } finally {
    db.close();
  }
}

export async function clearLibrary(): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(["clips", "blobs", "thumbs", "projects", "events", "kv"], "readwrite");
    const done = transactionDone(tx);
    for (const name of ["clips", "blobs", "thumbs", "projects", "events", "kv"]) {
      tx.objectStore(name).clear();
    }
    await done;
  } finally {
    db.close();
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const value = await withStore<T | undefined>("kv", "readonly", (store) => store.get(key));
  return value ?? null;
}

export async function kvSet(key: string, value: unknown): Promise<void> {
  await withStore("kv", "readwrite", (store) => store.put(value, key));
}
