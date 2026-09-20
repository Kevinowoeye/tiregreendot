/**
 * Resilient Cross-Browser Storage Wrapper
 * Prevents Chrome, Firefox, Safari, and iframe SecurityErrors when
 * third-party storage, incognito mode, or partitioned cookies are active.
 */

class MemoryStorage {
  private data: Record<string, string> = {};

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.data, key) ? this.data[key] : null;
  }

  setItem(key: string, value: string): void {
    this.data[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.data[key];
  }

  clear(): void {
    this.data = {};
  }
}

const fallbackLocalStorage = new MemoryStorage();
const fallbackSessionStorage = new MemoryStorage();

function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storage = window[type];
    if (!storage) return false;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = isStorageAvailable('localStorage');
const hasSessionStorage = isStorageAvailable('sessionStorage');

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (hasLocalStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.warn('localStorage.getItem blocked, using memory fallback:', e);
      }
    }
    return fallbackLocalStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn('localStorage.setItem blocked, using memory fallback:', e);
      }
    }
    fallbackLocalStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn('localStorage.removeItem blocked, using memory fallback:', e);
      }
    }
    fallbackLocalStorage.removeItem(key);
  },

  clear(): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.clear();
        return;
      } catch (e) {
        console.warn('localStorage.clear blocked, using memory fallback:', e);
      }
    }
    fallbackLocalStorage.clear();
  },
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (hasSessionStorage) {
      try {
        return window.sessionStorage.getItem(key);
      } catch (e) {
        console.warn('sessionStorage.getItem blocked, using memory fallback:', e);
      }
    }
    return fallbackSessionStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.setItem(key, value);
        return;
      } catch (e) {
        console.warn('sessionStorage.setItem blocked, using memory fallback:', e);
      }
    }
    fallbackSessionStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.removeItem(key);
        return;
      } catch (e) {
        console.warn('sessionStorage.removeItem blocked, using memory fallback:', e);
      }
    }
    fallbackSessionStorage.removeItem(key);
  },

  clear(): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.clear();
        return;
      } catch (e) {
        console.warn('sessionStorage.clear blocked, using memory fallback:', e);
      }
    }
    fallbackSessionStorage.clear();
  },
};
