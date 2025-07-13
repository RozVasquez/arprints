import React, { useState, useEffect } from 'react';
import { useImagePreloading } from '../hooks/useImagePreloading';
import { getMemoryUsage } from '../services/imageCacheService';
import LoadingSpinner from './ui/LoadingSpinner';

function ImagePreloadProgress() {
  const { isPreloading, progress, stats } = useImagePreloading();
  const [showProgress, setShowProgress] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState(null);

  // Show progress when preloading starts
  useEffect(() => {
    if (isPreloading) {
      setShowProgress(true);
    } else if (progress.total > 0) {
      // Hide progress after a delay when complete
      setTimeout(() => {
        setShowProgress(false);
      }, 3000);
    }
  }, [isPreloading, progress.total]);

  // Update memory usage periodically
  useEffect(() => {
    const updateMemoryUsage = () => {
      const usage = getMemoryUsage();
      setMemoryUsage(usage);
    };

    updateMemoryUsage();
    const interval = setInterval(updateMemoryUsage, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!showProgress && !isPreloading) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isPreloading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          )}
          <span className="text-sm font-medium text-gray-700">
            {isPreloading ? 'Optimizing Images' : 'Images Ready'}
          </span>
        </div>
        {stats && (
          <span className="text-xs text-gray-500">
            {stats.preloadedCount} cached
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {isPreloading && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{progress.phase === 'preview' ? 'Preview' : 'Full Quality'}</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {progress.loaded} / {progress.total} images
            {progress.batch && ` • Batch ${progress.batch}/${progress.totalBatches}`}
          </div>
        </div>
      )}

      {/* Performance Stats */}
      {memoryUsage && (
        <div className="border-t pt-3 mt-3">
          <div className="text-xs text-gray-600 mb-2">Performance Stats</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Memory:</span>
              <div className="font-medium">{memoryUsage.formattedSize}</div>
            </div>
            <div>
              <span className="text-gray-500">Images:</span>
              <div className="font-medium">{memoryUsage.imageCount}</div>
            </div>
            {stats && (
              <>
                <div>
                  <span className="text-gray-500">Previews:</span>
                  <div className="font-medium">{stats.previewCount || 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Pending:</span>
                  <div className="font-medium">{stats.pendingCount}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Message */}
      {!isPreloading && progress.total > 0 && (
        <div className="border-t pt-3 mt-3">
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">All images optimized and cached!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagePreloadProgress; 