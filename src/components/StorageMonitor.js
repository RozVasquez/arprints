import React, { useState, useEffect } from 'react';

// Access the global variables from BlobImage.js
// These are declared outside of components so they're accessible globally
let getStorageInfo = () => {
  if (typeof window !== 'undefined') {
    // Try to access the global variables from BlobImage
    const totalStorageUsed = window.totalStorageUsed || 0;
    const imageCount = window.imageStorageMap ? window.imageStorageMap.size : 0;
    return { totalStorageUsed, imageCount };
  }
  return { totalStorageUsed: 0, imageCount: 0 };
};

function StorageMonitor() {
  const [storageInfo, setStorageInfo] = useState({ totalStorageUsed: 0, imageCount: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Update storage info every second
    const intervalId = setInterval(() => {
      setStorageInfo(getStorageInfo());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-75 text-white p-3 rounded-lg shadow-lg text-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Storage Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)} 
          className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
        >
          Hide
        </button>
      </div>
      <div>
        <p>Total: <span className="font-mono">{formatFileSize(storageInfo.totalStorageUsed)}</span></p>
        <p>Images: <span className="font-mono">{storageInfo.imageCount}</span></p>
        <p className="text-xs text-gray-400 mt-1">See console for detailed logs</p>
      </div>
    </div>
  );
}

export default StorageMonitor; 