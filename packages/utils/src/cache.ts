export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;
  private keyOrder: K[];

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
    this.keyOrder = [];
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // 更新访问顺序
    this.keyOrder = this.keyOrder.filter(k => k !== key);
    this.keyOrder.push(key);

    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      // 更新现有键的值和顺序
      this.cache.set(key, value);
      this.keyOrder = this.keyOrder.filter(k => k !== key);
      this.keyOrder.push(key);
    } else {
      // 检查容量，如果超出则删除最久未使用的项
      if (this.keyOrder.length >= this.capacity) {
        const leastUsedKey = this.keyOrder.shift();
        if (leastUsedKey !== undefined) {
          this.cache.delete(leastUsedKey);
        }
      }
      // 添加新项
      this.cache.set(key, value);
      this.keyOrder.push(key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.keyOrder = [];
  }

  delete(key: K): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.keyOrder = this.keyOrder.filter(k => k !== key);
    }
    return deleted;
  }
} 