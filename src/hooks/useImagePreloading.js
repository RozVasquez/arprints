import { useState, useEffect } from 'react';
import { preloadAllImages, getCacheStats, isImagePreloaded } from '../services/imageCacheService';

export const useImagePreloading = () => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState({ loaded: 0, total: 0, percentage: 0 });
  const [stats, setStats] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Start preloading
  const startPreloading = async () => {
    if (isPreloading || hasStarted) return;
    
    setIsPreloading(true);
    setHasStarted(true);
    
    try {
      await preloadAllImages((progressData) => {
        setProgress(progressData);
      });
    } catch (error) {
      console.error('Error during preloading:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Check if an image is preloaded
  const checkImagePreloaded = (imageUrl) => {
    return isImagePreloaded(imageUrl);
  };

  // Get cache statistics
  const updateStats = () => {
    setStats(getCacheStats());
  };

  // Update stats periodically
  useEffect(() => {
    updateStats();
    
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-start preloading if not already started
  useEffect(() => {
    const currentStats = getCacheStats();
    if (currentStats.preloadedCount === 0 && !currentStats.isPreloading && !hasStarted) {
      startPreloading();
    }
  }, [hasStarted]);

  return {
    isPreloading,
    progress,
    stats,
    hasStarted,
    startPreloading,
    checkImagePreloaded,
    updateStats
  };
}; 