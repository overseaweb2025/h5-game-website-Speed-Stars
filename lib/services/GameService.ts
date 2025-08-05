// Game Service - Similar to Spring Boot Service layer
export class GameService {
  
  /**
   * Delete game and all related data
   * @param gameName - The name/slug of the game to delete
   * @param options - Additional deletion options
   */
  static async deleteGame(gameName: string, options?: {
    deleteFiles?: boolean;
    deleteHistory?: boolean;
    deleteCache?: boolean;
    deleteRelatedData?: boolean;
  }) {
    const {
      deleteFiles = true,
      deleteHistory = true, 
      deleteCache = true,
      deleteRelatedData = true
    } = options || {};

    const deletedItems: string[] = [];

    try {
      console.log(`Starting game deletion service for: ${gameName}`);

      // 1. Delete game basic data
      if (deleteRelatedData) {
        await this.deleteGameBasicData(gameName);
        deletedItems.push('game_basic_data');
      }

      // 2. Delete game files
      if (deleteFiles) {
        await this.deleteGameFiles(gameName);
        deletedItems.push('game_files');
      }

      // 3. Delete game history
      if (deleteHistory) {
        await this.deleteGameHistory(gameName);
        deletedItems.push('game_history');
      }

      // 4. Delete cache data
      if (deleteCache) {
        await this.deleteGameCache(gameName);
        deletedItems.push('game_cache');
      }

      // 5. Delete related data
      if (deleteRelatedData) {
        await this.deleteRelatedData(gameName);
        deletedItems.push('related_data');
      }

      console.log(`Game ${gameName} deletion completed. Deleted: ${deletedItems.join(', ')}`);

      return {
        success: true,
        gameName,
        deletedItems,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Game deletion service failed for ${gameName}:`, error);
      throw new Error(`Failed to delete game ${gameName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get game information
   * @param gameName - The name/slug of the game
   */
  static async getGame(gameName: string) {
    try {
      console.log(`Getting game information for: ${gameName}`);
      
      // Simulate getting game data
      const gameData = {
        name: gameName,
        slug: gameName,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      return {
        success: true,
        data: gameData
      };
    } catch (error) {
      console.error(`Failed to get game ${gameName}:`, error);
      throw new Error(`Failed to get game ${gameName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update game data
   * @param gameName - The name/slug of the game
   * @param updateData - Data to update
   */
  static async updateGame(gameName: string, updateData: any) {
    try {
      console.log(`Updating game: ${gameName}`, updateData);
      
      // Simulate game update
      const updatedGame = {
        name: gameName,
        ...updateData,
        lastModified: new Date().toISOString()
      };

      return {
        success: true,
        data: updatedGame,
        message: `Game ${gameName} updated successfully`
      };
    } catch (error) {
      console.error(`Failed to update game ${gameName}:`, error);
      throw new Error(`Failed to update game ${gameName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private static async deleteGameBasicData(gameName: string) {
    console.log(`Deleting basic data for game: ${gameName}`);
    // Delete from useGameData - Remove game from global game list
    this.deleteFromGameData(gameName);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private static async deleteGameFiles(gameName: string) {
    console.log(`Deleting files for game: ${gameName}`);
    // Simulate file system deletion
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private static async deleteGameHistory(gameName: string) {
    console.log(`Deleting history for game: ${gameName}`);
    // Delete from useGameHistory - Remove from browsing history
    this.deleteFromGameHistory(gameName);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private static async deleteGameCache(gameName: string) {
    console.log(`Deleting cache for game: ${gameName}`);
    // Delete from useGameDetails - Remove cached game details
    this.deleteFromGameDetailsCache(gameName);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private static async deleteRelatedData(gameName: string) {
    console.log(`Deleting related data for game: ${gameName}`);
    // Delete from useGamePageTimer and useGamePlayTracker
    this.deleteFromGameTimers(gameName);
    this.deleteFromGamePlayHistory(gameName);
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Note: These methods simulate the deletion operations
  // The actual client-side cleanup needs to be handled by ClientGameCleanup
  
  // Delete game from useGameData global state and localStorage
  private static deleteFromGameData(gameName: string) {
    console.log(`Removing ${gameName} from global game data (server-side simulation)`);
    // Server-side: This would typically involve database operations
    // Client-side cleanup is handled separately via ClientGameCleanup
  }

  // Delete game from useGameHistory localStorage
  private static deleteFromGameHistory(gameName: string) {
    console.log(`Removing ${gameName} from game browsing history (server-side simulation)`);
    // Actual localStorage cleanup happens on client-side via ClientGameCleanup
  }

  // Delete game from useGameDetails cache
  private static deleteFromGameDetailsCache(gameName: string) {
    console.log(`Removing ${gameName} from game details cache (server-side simulation)`);
    // Actual localStorage cleanup happens on client-side via ClientGameCleanup
  }

  // Delete game from useGamePageTimer localStorage
  private static deleteFromGameTimers(gameName: string) {
    console.log(`Removing ${gameName} timer data (server-side simulation)`);
    // Actual localStorage cleanup happens on client-side via ClientGameCleanup
  }

  // Delete game from useGamePlayTracker localStorage
  private static deleteFromGamePlayHistory(gameName: string) {
    console.log(`Removing ${gameName} from game play history (server-side simulation)`);
    // Actual localStorage cleanup happens on client-side via ClientGameCleanup
  }
}

// Response helper similar to Spring Boot ResponseEntity
export class GameResponse {
  static success<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message: message || 'Operation successful',
      timestamp: new Date().toISOString()
    };
  }

  static error(message: string, details?: any) {
    return {
      success: false,
      error: message,
      details,
      timestamp: new Date().toISOString()
    };
  }

  static notFound(resource: string) {
    return {
      success: false,
      error: `${resource} not found`,
      timestamp: new Date().toISOString()
    };
  }

  static badRequest(message: string) {
    return {
      success: false,
      error: `Bad request: ${message}`,
      timestamp: new Date().toISOString()
    };
  }
}