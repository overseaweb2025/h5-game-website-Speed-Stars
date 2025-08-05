"use client";

// Client-side game cleanup functions for localStorage
export class ClientGameCleanup {
  
  /**
   * Delete all game-related data from localStorage for a specific game
   * @param gameName - The name/slug of the game to delete
   */
  static deleteGameData(gameName: string): string[] {
    if (typeof window === 'undefined') {
      console.warn('ClientGameCleanup can only run in browser environment');
      return [];
    }

    const deletedItems: string[] = [];

    try {
      // Delete from useGameHistory localStorage
      this.deleteFromGameHistory(gameName, deletedItems);
      
      // Delete from useGameDetails cache
      this.deleteFromGameDetailsCache(gameName, deletedItems);
      
      // Delete from useGamePageTimer localStorage
      this.deleteFromGameTimers(gameName, deletedItems);
      
      // Delete from useGamePlayTracker localStorage
      this.deleteFromGamePlayHistory(gameName, deletedItems);
      
      // Delete any other game-related localStorage keys
      this.deleteOtherGameKeys(gameName, deletedItems);

      console.log(`Client cleanup completed for ${gameName}. Deleted: ${deletedItems.join(', ')}`);
      
    } catch (error) {
      console.error(`Client cleanup failed for ${gameName}:`, error);
    }

    return deletedItems;
  }

  // Delete game from useGameHistory localStorage
  private static deleteFromGameHistory(gameName: string, deletedItems: string[]) {
    try {
      const STORAGE_KEY = 'game_browsing_history';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        const originalLength = history.length;
        const filteredHistory = history.filter((item: any) => item.slug !== gameName);
        
        if (filteredHistory.length < originalLength) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
          deletedItems.push('game_browsing_history');
          console.log(`Removed ${gameName} from game browsing history`);
        }
      }
    } catch (error) {
      console.error(`Failed to remove ${gameName} from game history:`, error);
    }
  }

  // Delete game from useGameDetails cache
  private static deleteFromGameDetailsCache(gameName: string, deletedItems: string[]) {
    try {
      const STORAGE_KEY = 'game_details_cache';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const cacheArray = JSON.parse(stored) as [string, any][];
        const originalLength = cacheArray.length;
        const filteredCache = cacheArray.filter(([slug]) => slug !== gameName);
        
        if (filteredCache.length < originalLength) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCache));
          deletedItems.push('game_details_cache');
          console.log(`Removed ${gameName} from game details cache`);
        }
      }
    } catch (error) {
      console.error(`Failed to remove ${gameName} from game details cache:`, error);
    }
  }

  // Delete game from useGamePageTimer localStorage
  private static deleteFromGameTimers(gameName: string, deletedItems: string[]) {
    try {
      const keys = Object.keys(localStorage);
      let removedCount = 0;
      
      keys.forEach(key => {
        if (key.includes(gameName) && (key.includes('timer') || key.includes('Timer'))) {
          localStorage.removeItem(key);
          removedCount++;
          console.log(`Removed timer key: ${key}`);
        }
      });
      
      if (removedCount > 0) {
        deletedItems.push(`game_timers (${removedCount} keys)`);
      }
    } catch (error) {
      console.error(`Failed to remove ${gameName} timer data:`, error);
    }
  }

  // Delete game from useGamePlayTracker localStorage
  private static deleteFromGamePlayHistory(gameName: string, deletedItems: string[]) {
    try {
      const STORAGE_KEY = 'game_play_history';
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const playHistory = JSON.parse(stored);
        const originalLength = playHistory.length;
        const filteredHistory = playHistory.filter((record: any) => 
          record.gameName !== gameName && record.gameId !== gameName
        );
        
        if (filteredHistory.length < originalLength) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
          deletedItems.push('game_play_history');
          console.log(`Removed ${gameName} from game play history`);
        }
      }
    } catch (error) {
      console.error(`Failed to remove ${gameName} from game play history:`, error);
    }
  }

  // Delete any other game-related localStorage keys
  private static deleteOtherGameKeys(gameName: string, deletedItems: string[]) {
    try {
      const keys = Object.keys(localStorage);
      let removedCount = 0;
      
      keys.forEach(key => {
        // Look for keys that contain the game name
        if (key.toLowerCase().includes(gameName.toLowerCase()) && 
            !deletedItems.some(item => key.includes(item.split(' ')[0]))) {
          localStorage.removeItem(key);
          removedCount++;
          console.log(`Removed other game key: ${key}`);
        }
      });
      
      if (removedCount > 0) {
        deletedItems.push(`other_game_keys (${removedCount} keys)`);
      }
    } catch (error) {
      console.error(`Failed to remove other ${gameName} keys:`, error);
    }
  }

  /**
   * Get all localStorage keys related to a specific game
   * @param gameName - The name/slug of the game
   * @returns Array of localStorage keys related to the game
   */
  static getGameRelatedKeys(gameName: string): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const keys = Object.keys(localStorage);
    return keys.filter(key => 
      key.toLowerCase().includes(gameName.toLowerCase()) ||
      (localStorage.getItem(key) && localStorage.getItem(key)!.includes(gameName))
    );
  }

  /**
   * Clear all game-related localStorage data (for all games)
   */
  static clearAllGameData(): string[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const deletedKeys: string[] = [];
    const keys = Object.keys(localStorage);
    
    const gameRelatedKeys = [
      'game_browsing_history',
      'game_details_cache', 
      'game_play_history',
      'gameHistory_',
      'gameDetails_',
      'gameTimer_',
      'gamePlay_'
    ];

    keys.forEach(key => {
      if (gameRelatedKeys.some(pattern => key.includes(pattern))) {
        localStorage.removeItem(key);
        deletedKeys.push(key);
      }
    });

    console.log(`Cleared all game data. Removed ${deletedKeys.length} keys:`, deletedKeys);
    return deletedKeys;
  }
}