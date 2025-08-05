"use client";

import { useState, useEffect } from 'react';
import { GlobalCacheCleanup } from '@/lib/services/GlobalCacheCleanup';

export default function GlobalCacheManager() {
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [clearResult, setClearResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<any>(null);

  // Load storage info on component mount
  useEffect(() => {
    loadStorageInfo();
    loadServerStatus();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await GlobalCacheCleanup.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const loadServerStatus = async () => {
    try {
      const response = await fetch('/api/websocket/delect', {
        method: 'GET'
      });
      const result = await response.json();
      setServerStatus(result);
    } catch (error) {
      console.error('Failed to load server status:', error);
    }
  };

  // Complete global cache cleanup (server + client)
  const handleCompleteGlobalCleanup = async () => {
    const confirmed = confirm(
      '⚠️ WARNING: This will clear ALL cache data including:\n\n' +
      '🔥 ALL localStorage data\n' +
      '🔥 ALL sessionStorage data\n' +
      '🔥 ALL cookies\n' +
      '🔥 ALL server cache\n' +
      '🔥 ALL game data\n' +
      '🔥 ALL user preferences\n\n' +
      'This action cannot be undone!\n\n' +
      'Do you want to continue?'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await GlobalCacheCleanup.completeGlobalCleanup({
        confirm: true
      });
      
      setClearResult(result);
      
      if (result.success) {
        alert(`🎉 Global cache cleared successfully!\n\nServer items: ${result.serverResult?.data?.totalItemsCleared || 0}\nClient items: ${result.clientResult.length}`);
        
        // Reload page after clearing cache
        if (confirm('Cache cleared! Would you like to reload the page to see changes?')) {
          window.location.reload();
        }
      } else {
        alert(`❌ Global cache clearing failed!\n\nCheck console for details.`);
      }
      
      // Refresh info
      await loadStorageInfo();
      await loadServerStatus();
      
    } catch (error) {
      console.error('Complete global cleanup failed:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Client-only cache cleanup
  const handleClientOnlyCleanup = async () => {
    const confirmed = confirm(
      '⚠️ This will clear ALL client-side data:\n\n' +
      '• localStorage\n' +
      '• sessionStorage\n' +
      '• cookies\n' +
      '• IndexedDB\n' +
      '• Cache API\n\n' +
      'Continue?'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const result = GlobalCacheCleanup.clearAllClientCache();
      setClearResult({ clientResult: result, success: true });
      
      alert(`🎉 Client cache cleared!\n\nCleared ${result.length} types of data.`);
      
      await loadStorageInfo();
      
    } catch (error) {
      console.error('Client cleanup failed:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Server-only cache cleanup
  const handleServerOnlyCleanup = async () => {
    const confirmed = confirm(
      '⚠️ This will clear ALL server-side cache:\n\n' +
      '• Game cache\n' +
      '• Blog cache\n' +
      '• User cache\n' +
      '• Website cache\n' +
      '• API cache\n\n' +
      'Continue?'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch('/api/websocket/delect?confirm=true', {
        method: 'DELETE'
      });
      
      const result = await response.json();
      setClearResult({ serverResult: result, success: result.success });
      
      if (result.success) {
        alert(`🎉 Server cache cleared!\n\nCleared ${result.data?.totalItemsCleared || 0} items.`);
      } else {
        alert(`❌ Server cache clearing failed!\n\n${result.error}`);
      }
      
      await loadServerStatus();
      
    } catch (error) {
      console.error('Server cleanup failed:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Selective cleanup
  const handleSelectiveCleanup = async () => {
    const cleanupTypes = {
      localStorage: confirm('Clear localStorage?'),
      sessionStorage: confirm('Clear sessionStorage?'),
      cookies: confirm('Clear cookies?'),
      indexedDB: confirm('Clear IndexedDB?'),
      cacheAPI: confirm('Clear Cache API?'),
    };

    const hasSelected = Object.values(cleanupTypes).some(Boolean);
    if (!hasSelected) {
      alert('No cleanup types selected.');
      return;
    }

    setLoading(true);
    try {
      const result = GlobalCacheCleanup.clearSpecificData(cleanupTypes);
      setClearResult({ clientResult: result, success: true });
      
      alert(`🎉 Selective cleanup completed!\n\nCleared: ${result.join(', ')}`);
      
      await loadStorageInfo();
      
    } catch (error) {
      console.error('Selective cleanup failed:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🧹 Global Cache Manager</h2>
      
      {/* Current Storage Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Client Storage Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-800 mb-3">📱 Client Storage Status</h3>
          {storageInfo ? (
            <div className="space-y-2 text-sm">
              <div>
                <strong>localStorage:</strong> {storageInfo.localStorage.keyCount} keys 
                ({Math.round(storageInfo.localStorage.estimatedSize / 1024)}KB)
              </div>
              <div>
                <strong>sessionStorage:</strong> {storageInfo.sessionStorage.keyCount} keys 
                ({Math.round(storageInfo.sessionStorage.estimatedSize / 1024)}KB)
              </div>
              <div>
                <strong>Cookies:</strong> {storageInfo.cookies.count} items 
                ({storageInfo.cookies.size} chars)
              </div>
              {storageInfo.quota && (
                <div>
                  <strong>Storage Quota:</strong> {Math.round((storageInfo.quota.usage || 0) / 1024 / 1024)}MB used 
                  / {Math.round((storageInfo.quota.quota || 0) / 1024 / 1024)}MB total
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Loading...</div>
          )}
        </div>

        {/* Server Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-3">🖥️ Server Cache Status</h3>
          {serverStatus ? (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Uptime:</strong> {Math.round(serverStatus.data?.serverUptime || 0)}s
              </div>
              <div>
                <strong>Memory:</strong> {Math.round((serverStatus.data?.memoryUsage?.heapUsed || 0) / 1024 / 1024)}MB
              </div>
              <div>
                <strong>Cache Status:</strong> 
                <div className="ml-4 mt-1">
                  {Object.entries(serverStatus.data?.cacheInfo || {}).map(([key, value]) => (
                    <div key={key}>• {key}: {value as string}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading...</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Complete Global Cleanup */}
          <button
            onClick={handleCompleteGlobalCleanup}
            disabled={loading}
            className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            🔥 Complete Global Cleanup
          </button>

          {/* Server Only */}
          <button
            onClick={handleServerOnlyCleanup}
            disabled={loading}
            className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            🖥️ Server Cache Only
          </button>

          {/* Client Only */}
          <button
            onClick={handleClientOnlyCleanup}
            disabled={loading}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            📱 Client Cache Only
          </button>

          {/* Selective Cleanup */}
          <button
            onClick={handleSelectiveCleanup}
            disabled={loading}
            className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            🎯 Selective Cleanup
          </button>
        </div>

        {/* Refresh Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={loadStorageInfo}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm"
          >
            🔄 Refresh Client Info
          </button>
          <button
            onClick={loadServerStatus}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 text-sm"
          >
            🔄 Refresh Server Info
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
            <span className="text-yellow-800">Processing cache cleanup...</span>
          </div>
        </div>
      )}

      {/* Results Display */}
      {clearResult && (
        <div className="space-y-4">
          {clearResult.serverResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">🖥️ Server Cleanup Result:</h3>
              <pre className="text-sm text-green-700 overflow-auto whitespace-pre-wrap">
                {JSON.stringify(clearResult.serverResult, null, 2)}
              </pre>
            </div>
          )}

          {clearResult.clientResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">📱 Client Cleanup Result:</h3>
              <div className="text-sm text-blue-700">
                Cleaned {clearResult.clientResult.length} types of data:
                <ul className="mt-2 space-y-1">
                  {clearResult.clientResult.map((item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warning Notice */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-medium text-red-800 mb-2">⚠️ Important Warning</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Global cleanup will remove ALL stored data and preferences</li>
          <li>• Users will need to log in again and reconfigure settings</li>
          <li>• Game progress and history will be lost</li>
          <li>• This action cannot be undone</li>
          <li>• Use with extreme caution in production environments</li>
        </ul>
      </div>
    </div>
  );
}