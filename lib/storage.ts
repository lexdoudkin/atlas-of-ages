export interface Exploration {
  id: string
  lat: number
  lng: number
  year: number
  era: string
  placeName: string
  imageData: string
  prompt: string
  timestamp: number
}

const DB_NAME = 'atlas-of-ages'
const STORE_NAME = 'explorations'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveExploration(data: Omit<Exploration, 'id' | 'timestamp'>): Promise<Exploration> {
  const db = await openDB()
  const exploration: Exploration = {
    ...data,
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add(exploration)
    tx.oncomplete = () => resolve(exploration)
    tx.onerror = () => reject(tx.error)
  })
}

export async function getExplorations(): Promise<Exploration[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).getAll()
    req.onsuccess = () => {
      const results = req.result as Exploration[]
      results.sort((a, b) => b.timestamp - a.timestamp)
      resolve(results)
    }
    req.onerror = () => reject(req.error)
  })
}
