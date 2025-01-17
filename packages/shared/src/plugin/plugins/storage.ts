import { IPlugin, PluginContext } from '../core'

type StorageType = 'local' | 'session' | 'indexedDB'
type StorageValue = string | number | boolean | object | null

interface StorageOptions {
  type?: StorageType
  expireIn?: number // 过期时间（毫秒）
}

interface StorageItem {
  value: StorageValue
  timestamp: number
  expireIn?: number
}

export class StoragePlugin implements IPlugin {
  name = 'storage'
  version = '1.0.0'
  private defaultType: StorageType = 'local'
  private dbName = 'elemeStorage'
  private dbVersion = 1
  private storeName = 'keyValueStore'
  private db: IDBDatabase | null = null

  async install(context: PluginContext) {
    // 初始化 IndexedDB
    await this.initIndexedDB()

    // 注册存储相关钩子
    context.registerHook('beforeStorage', this.beforeStorage.bind(this))
    context.registerHook('afterStorage', this.afterStorage.bind(this))
    context.registerHook('beforeRetrieval', this.beforeRetrieval.bind(this))
    context.registerHook('afterRetrieval', this.afterRetrieval.bind(this))

    // 注册存储方法
    context.registerHook('setItem', this.setItem.bind(this))
    context.registerHook('getItem', this.getItem.bind(this))
    context.registerHook('removeItem', this.removeItem.bind(this))
    context.registerHook('clear', this.clear.bind(this))

    // 监听存储相关事件
    context.events.on('storageChanged', this.onStorageChanged.bind(this))
    context.events.on('storageError', this.onStorageError.bind(this))
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  private async beforeStorage(key: string, value: StorageValue, options?: StorageOptions) {
    console.log(`Preparing to store: ${key}`)
    return { key, value, options }
  }

  private async afterStorage(key: string, value: StorageValue) {
    console.log(`Successfully stored: ${key}`)
    return true
  }

  private async beforeRetrieval(key: string) {
    console.log(`Preparing to retrieve: ${key}`)
    return key
  }

  private async afterRetrieval(key: string, value: StorageValue) {
    console.log(`Successfully retrieved: ${key}`)
    return value
  }

  private async setItem(key: string, value: StorageValue, options: StorageOptions = {}) {
    const { type = this.defaultType } = options
    const item: StorageItem = {
      value,
      timestamp: Date.now(),
      expireIn: options.expireIn
    }

    switch (type) {
      case 'local':
        localStorage.setItem(key, JSON.stringify(item))
        break
      case 'session':
        sessionStorage.setItem(key, JSON.stringify(item))
        break
      case 'indexedDB':
        await this.setIndexedDBItem(key, item)
        break
    }
  }

  private async getItem(key: string, type: StorageType = this.defaultType): Promise<StorageValue> {
    let item: StorageItem | null = null

    switch (type) {
      case 'local':
        const localData = localStorage.getItem(key)
        item = localData ? JSON.parse(localData) : null
        break
      case 'session':
        const sessionData = sessionStorage.getItem(key)
        item = sessionData ? JSON.parse(sessionData) : null
        break
      case 'indexedDB':
        item = await this.getIndexedDBItem(key)
        break
    }

    if (!item) return null

    // 检查是否过期
    if (item.expireIn && Date.now() - item.timestamp > item.expireIn) {
      await this.removeItem(key, type)
      return null
    }

    return item.value
  }

  private async removeItem(key: string, type: StorageType = this.defaultType) {
    switch (type) {
      case 'local':
        localStorage.removeItem(key)
        break
      case 'session':
        sessionStorage.removeItem(key)
        break
      case 'indexedDB':
        await this.removeIndexedDBItem(key)
        break
    }
  }

  private async clear(type: StorageType = this.defaultType) {
    switch (type) {
      case 'local':
        localStorage.clear()
        break
      case 'session':
        sessionStorage.clear()
        break
      case 'indexedDB':
        await this.clearIndexedDB()
        break
    }
  }

  private async setIndexedDBItem(key: string, item: StorageItem): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(item, key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  private async getIndexedDBItem(key: string): Promise<StorageItem | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  private async removeIndexedDBItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  private async clearIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  private onStorageChanged(key: string, newValue: StorageValue, oldValue: StorageValue) {
    console.log(`Storage changed - Key: ${key}`, { oldValue, newValue })
  }

  private onStorageError(error: Error) {
    console.error('Storage error:', error)
  }
} 