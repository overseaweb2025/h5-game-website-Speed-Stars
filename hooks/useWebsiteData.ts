"use client";

import { useState, useEffect } from 'react';
import { website } from '@/app/api/types/Get/website';
import { getWebsite } from '@/app/api/website';

interface CachedWebsiteData {
  data: website;
  timestamp: number;
}

const CACHE_KEY = 'websiteData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useWebsiteData() {
  const [websiteData, setWebsiteData] = useState<website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = (): website | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedWebsiteData = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is expired (older than 24 hours)
      if (now - cachedData.timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error('Error reading cached website data:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedData = (data: website) => {
    try {
      const cacheData: CachedWebsiteData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching website data:', error);
    }
  };

  const fetchWebsiteData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      const cachedData = getCachedData();
      if (cachedData) {
        setWebsiteData(cachedData);
        setLoading(false);
        return;
      }

      // If no valid cache, fetch from API
      const response = await getWebsite();
      const data = response.data.data;
      
      setWebsiteData(data);
      setCachedData(data);
    } catch (err) {
      console.error('Failed to fetch website data:', err);
      setError('Failed to fetch website data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteData();
  }, []);

  const refreshData = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchWebsiteData();
  };

  return {
    websiteData,
    loading,
    error,
    refreshData
  };
}