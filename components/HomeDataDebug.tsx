"use client"

import { useHomeGameData } from '@/hooks/useHomeGameData'

export default function HomeDataDebug() {
  const { 
    homeData, 
    loading, 
    error, 
    gameUrl, 
    pageTitle, 
    seoData,
    refreshData,
    clearCache,
    lastFetched 
  } = useHomeGameData()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Home Data Debug</h3>
      
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Error: {error || 'None'}</div>
        <div>Last Fetched: {lastFetched ? new Date(lastFetched).toLocaleTimeString() : 'Never'}</div>
        <div>Game URL: {gameUrl ? '✅' : '❌'}</div>
        <div>Page Title: {pageTitle || 'Not set'}</div>
        <div>SEO Data: {seoData ? '✅' : '❌'}</div>
        <div>Raw Data: {homeData ? '✅' : '❌'}</div>
      </div>

      <div className="mt-2 space-x-2">
        <button 
          onClick={refreshData}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Refresh
        </button>
        <button 
          onClick={clearCache}
          className="bg-red-500 px-2 py-1 rounded text-xs"
        >
          Clear Cache
        </button>
      </div>

      {gameUrl && (
        <div className="mt-2 text-green-400">
          Game URL: {gameUrl.substring(0, 50)}...
        </div>
      )}
    </div>
  )
}