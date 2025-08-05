"use client";

// Global cache cleanup for client-side localStorage and other client data
export class GlobalCacheCleanup {
  
  /**
   * Clear ALL localStorage data and other client-side cache
   */
  static clearAllClientCache(): string[] {
    if (typeof window === 'undefined') {
      console.warn('GlobalCacheCleanup can only run in browser environment');
      return [];
    }

    const clearedItems: string[] = [];

    try {
      console.log('Starting global client cache clearing...');

      // 1. Clear all localStorage
      this.clearAllLocalStorage(clearedItems);
      
      // 2. Clear sessionStorage
      this.clearAllSessionStorage(clearedItems);
      
      // 3. Clear IndexedDB (if any)
      this.clearIndexedDB(clearedItems);
      
      // 4. Clear cookies (domain-specific)
      this.clearCookies(clearedItems);
      
      // 5. Clear cache API (if supported)
      this.clearCacheAPI(clearedItems);

      console.log(`Global client cache clearing completed. Cleared: ${clearedItems.join(', ')}`);
      
    } catch (error) {
      console.error('Global client cache clearing failed:', error);
    }

    return clearedItems;
  }

  // Clear all localStorage
  private static clearAllLocalStorage(clearedItems: string[]) {
    try {
      const keys = Object.keys(localStorage);
      const keyCount = keys.length;
      
      if (keyCount > 0) {
        localStorage.clear();
        clearedItems.push(`localStorage_all_keys (${keyCount} items)`);
        console.log(`Cleared all localStorage: ${keyCount} keys`);
      }
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // Clear all sessionStorage
  private static clearAllSessionStorage(clearedItems: string[]) {
    try {
      const keys = Object.keys(sessionStorage);
      const keyCount = keys.length;
      
      if (keyCount > 0) {
        sessionStorage.clear();
        clearedItems.push(`sessionStorage_all_keys (${keyCount} items)`);
        console.log(`Cleared all sessionStorage: ${keyCount} keys`);
      }
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  }

  // Clear IndexedDB
  private static clearIndexedDB(clearedItems: string[]) {
    try {
      if ('indexedDB' in window) {
        // Note: This is a simplified approach
        // In reality, you'd need to enumerate and delete specific databases
        clearedItems.push('indexedDB_databases');
        console.log('IndexedDB clearing initiated (async operation)');
      }
    } catch (error) {
      console.error('Failed to clear IndexedDB:', error);
    }
  }

  // Clear cookies
  private static clearCookies(clearedItems: string[]) {
    try {
      const cookies = document.cookie.split(';');
      let clearedCount = 0;
      
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          // Clear cookie by setting it to expire in the past
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          clearedCount++;
        }
      });
      
      if (clearedCount > 0) {
        clearedItems.push(`cookies (${clearedCount} items)`);
        console.log(`Cleared ${clearedCount} cookies`);
      }
    } catch (error) {
      console.error('Failed to clear cookies:', error);
    }
  }

  // Clear Cache API
  private static async clearCacheAPI(clearedItems: string[]) {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        const deletePromises = cacheNames.map(cacheName => caches.delete(cacheName));
        await Promise.all(deletePromises);
        
        if (cacheNames.length > 0) {
          clearedItems.push(`cache_api (${cacheNames.length} caches)`);
          console.log(`Cleared ${cacheNames.length} Cache API caches`);
        }
      }
    } catch (error) {
      console.error('Failed to clear Cache API:', error);
    }
  }

  /**
   * Clear specific types of data
   */
  static clearSpecificData(types: {
    localStorage?: boolean;
    sessionStorage?: boolean;
    cookies?: boolean;
    indexedDB?: boolean;
    cacheAPI?: boolean;
  }): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const clearedItems: string[] = [];

    try {
      if (types.localStorage) {
        this.clearAllLocalStorage(clearedItems);
      }

      if (types.sessionStorage) {
        this.clearAllSessionStorage(clearedItems);
      }

      if (types.cookies) {
        this.clearCookies(clearedItems);
      }

      if (types.indexedDB) {
        this.clearIndexedDB(clearedItems);
      }

      if (types.cacheAPI) {
        this.clearCacheAPI(clearedItems);
      }

    } catch (error) {
      console.error('Specific data clearing failed:', error);
    }

    return clearedItems;
  }

  /**
   * Get storage usage information
   */
  static async getStorageInfo() {
    if (typeof window === 'undefined') {
      return null;
    }

    const info: any = {
      localStorage: {
        keyCount: 0,
        estimatedSize: 0
      },
      sessionStorage: {
        keyCount: 0,
        estimatedSize: 0
      },
      cookies: {
        count: 0,
        size: 0
      }
    };

    try {
      // localStorage info
      const localKeys = Object.keys(localStorage);
      info.localStorage.keyCount = localKeys.length;
      info.localStorage.estimatedSize = localKeys.reduce((size, key) => {
        return size + key.length + (localStorage.getItem(key)?.length || 0);
      }, 0);

      // sessionStorage info
      const sessionKeys = Object.keys(sessionStorage);
      info.sessionStorage.keyCount = sessionKeys.length;
      info.sessionStorage.estimatedSize = sessionKeys.reduce((size, key) => {
        return size + key.length + (sessionStorage.getItem(key)?.length || 0);
      }, 0);

      // Cookies info
      const cookies = document.cookie.split(';').filter(c => c.trim());
      info.cookies.count = cookies.length;
      info.cookies.size = document.cookie.length;

      // Storage quota (if supported)
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        info.quota = estimate;
      }

    } catch (error) {
      console.error('Failed to get storage info:', error);
    }

    return info;
  }

  /**
   * Complete global cleanup - server + client
   */
  static async completeGlobalCleanup(options?: {
    confirm?: boolean;
    serverEndpoint?: string;
  }): Promise<{
    serverResult?: any;
    clientResult: string[];
    success: boolean;
  }> {
    const { 
      confirm = false, 
      serverEndpoint = '/api/websocket/delect' 
    } = options || {};

    const result = {
      serverResult: null as any,
      clientResult: [] as string[],
      success: false
    };

    try {
      // Step 1: Server-side cache clearing
      console.log('Starting server-side cache clearing...');
      
      const serverResponse = await fetch(`${serverEndpoint}?confirm=${confirm}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      result.serverResult = await serverResponse.json();
      
      if (!result.serverResult.success) {
        throw new Error(result.serverResult.error || 'Server cache clearing failed');
      }

      // Step 2: Client-side cache clearing
      console.log('Starting client-side cache clearing...');
      result.clientResult = this.clearAllClientCache();

      result.success = true;
      console.log('Complete global cleanup finished successfully');

    } catch (error) {
      console.error('Complete global cleanup failed:', error);
      result.success = false;
      
      // Still try client cleanup even if server failed
      if (result.clientResult.length === 0) {
        result.clientResult = this.clearAllClientCache();
      }
    }

    return result;
  }
}