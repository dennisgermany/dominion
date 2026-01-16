const DB_NAME = 'dominion-images'
const DB_VERSION = 1
const STORE_NAME = 'images'

let dbPromise = null

/**
 * Initialize IndexedDB database
 */
function initDB() {
  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })

  return dbPromise
}

/**
 * Store an image blob in IndexedDB by card ID
 * @param {string} cardId - The card ID
 * @param {Blob} blob - The image blob to store
 * @returns {Promise<void>}
 */
export async function storeImage(cardId, blob) {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(blob, cardId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to store image'))
    })
  } catch (error) {
    console.error('Error storing image:', error)
    throw error
  }
}

/**
 * Retrieve an image blob from IndexedDB by card ID
 * @param {string} cardId - The card ID
 * @returns {Promise<Blob|null>} The image blob or null if not found
 */
export async function getImage(cardId) {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(cardId)

      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => {
        reject(new Error('Failed to retrieve image'))
      }
    })
  } catch (error) {
    console.error('Error retrieving image:', error)
    return null
  }
}

/**
 * Get an object URL for an image from IndexedDB, or null if not found
 * @param {string} cardId - The card ID
 * @returns {Promise<string|null>} The object URL or null if not found
 */
export async function getImageURL(cardId) {
  const blob = await getImage(cardId)
  if (blob) {
    return URL.createObjectURL(blob)
  }
  return null
}

/**
 * Check if an image exists in IndexedDB
 * @param {string} cardId - The card ID
 * @returns {Promise<boolean>}
 */
export async function hasImage(cardId) {
  const blob = await getImage(cardId)
  return blob !== null
}

/**
 * Clear all stored images from IndexedDB
 * @returns {Promise<void>}
 */
export async function clearAllImages() {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear images'))
    })
  } catch (error) {
    console.error('Error clearing images:', error)
    throw error
  }
}

/**
 * Get count of stored images
 * @returns {Promise<number>}
 */
export async function getImageCount() {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.count()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(new Error('Failed to count images'))
    })
  } catch (error) {
    console.error('Error counting images:', error)
    return 0
  }
}
