"use client";

import { useState } from 'react';
import { ClientGameCleanup } from '@/lib/services/ClientGameCleanup';

export default function GameDeletionDemo() {
  const [gameSlug, setGameSlug] = useState('speed-stars');
  const [deleteResult, setDeleteResult] = useState<{
    serverResult?: any;
    clientResult?: string[];
  }>({});
  const [loading, setLoading] = useState(false);

  // Call server-side deletion API
  const handleServerDeletion = async (gameName: string) => {
    try {
      const response = await fetch(`/api/websocket/game/${gameName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Server deletion failed:', error);
      throw error;
    }
  };

  // Handle complete game deletion (server + client)
  const handleCompleteGameDeletion = async () => {
    if (!gameSlug.trim()) {
      alert('Please enter a game slug');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Server-side deletion
      console.log(`Starting server-side deletion for: ${gameSlug}`);
      const serverResult = await handleServerDeletion(gameSlug);
      
      // Step 2: Client-side localStorage cleanup
      console.log(`Starting client-side cleanup for: ${gameSlug}`);
      const clientResult = ClientGameCleanup.deleteGameData(gameSlug);
      
      setDeleteResult({
        serverResult,
        clientResult
      });

      alert(`Game "${gameSlug}" deleted successfully!\nServer: ${serverResult.success}\nClient items cleaned: ${clientResult.length}`);
      
    } catch (error) {
      console.error('Game deletion failed:', error);
      alert(`Game deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle client-side cleanup only
  const handleClientCleanupOnly = () => {
    if (!gameSlug.trim()) {
      alert('Please enter a game slug');
      return;
    }

    try {
      const clientResult = ClientGameCleanup.deleteGameData(gameSlug);
      setDeleteResult({ clientResult });
      alert(`Client cleanup completed for "${gameSlug}"!\nCleaned items: ${clientResult.length}`);
    } catch (error) {
      console.error('Client cleanup failed:', error);
      alert(`Client cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Get game-related localStorage keys
  const handleShowGameKeys = () => {
    if (!gameSlug.trim()) {
      alert('Please enter a game slug');
      return;
    }

    const keys = ClientGameCleanup.getGameRelatedKeys(gameSlug);
    alert(`Found ${keys.length} localStorage keys for "${gameSlug}":\n${keys.join('\n')}`);
  };

  // Clear all game data
  const handleClearAllGameData = () => {
    if (confirm('Are you sure you want to clear ALL game data from localStorage?')) {
      const deletedKeys = ClientGameCleanup.clearAllGameData();
      alert(`Cleared all game data!\nRemoved ${deletedKeys.length} localStorage keys.`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Game Deletion Demo</h2>
      
      <div className="space-y-4">
        {/* Game Slug Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Game Slug:
          </label>
          <input
            type="text"
            value={gameSlug}
            onChange={(e) => setGameSlug(e.target.value)}
            placeholder="Enter game slug (e.g., speed-stars)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCompleteGameDeletion}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Complete Game Deletion (Server + Client)'}
          </button>

          <button
            onClick={handleClientCleanupOnly}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700"
          >
            Client Cleanup Only (localStorage)
          </button>

          <button
            onClick={handleShowGameKeys}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Show Game-Related Keys
          </button>

          <button
            onClick={handleClearAllGameData}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
          >
            Clear All Game Data
          </button>
        </div>

        {/* Results Display */}
        {deleteResult.serverResult && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">Server Deletion Result:</h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(deleteResult.serverResult, null, 2)}
            </pre>
          </div>
        )}

        {deleteResult.clientResult && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Client Cleanup Result:</h3>
            <p className="text-sm text-blue-700">
              Cleaned {deleteResult.clientResult.length} items:
            </p>
            <ul className="text-sm text-blue-600 mt-1">
              {deleteResult.clientResult.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="font-medium text-gray-800 mb-2">What Gets Deleted:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>useGameHistory:</strong> Game browsing history from localStorage</li>
          <li>• <strong>useGameDetails:</strong> Cached game details from localStorage</li>
          <li>• <strong>useGamePageTimer:</strong> Timer-related localStorage keys</li>
          <li>• <strong>useGamePlayTracker:</strong> Game play history records</li>
          <li>• <strong>Other:</strong> Any other localStorage keys containing the game name</li>
        </ul>
      </div>
    </div>
  );
}