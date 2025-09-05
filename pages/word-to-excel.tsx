'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ConversionStatus {
  status: 'pending' | 'processing' | 'done' | 'error';
  progress: number;
  message: string;
}

interface FileInfo {
  file: File;
  name: string;
  size: string;
  type: string;
}

const WordToExcelConverter: React.FC = () => {
  // State management
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [conversionStatus, setConversionStatus] = useState<ConversionStatus | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Theme toggle
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // File validation
  const validateFile = (file: File): string | null => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.doc', '.docx'];

    if (file.size > maxSize) {
      return 'File size must be less than 20MB';
    }

    if (!allowedTypes.includes(file.type) && 
        !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return 'Only .doc and .docx files are allowed';
    }

    return null;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFileInfo({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'Unknown'
    });
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // File input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Upload file and start conversion
  const startConversion = async () => {
    if (!fileInfo) return;

    setIsUploading(true);
    setError(null);
    setConversionStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', fileInfo.file);

      const response = await fetch('http://localhost:8000/convert/word-to-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setJobId(data.jobId);
      setConversionStatus({
        status: 'pending',
        progress: 0,
        message: 'Conversion started...'
      });

      // Start polling for status
      startPolling(data.jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  // Poll for conversion status
  const startPolling = (jobId: string) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/status/${jobId}`);
        if (!response.ok) {
          throw new Error('Failed to check status');
        }

        const status: ConversionStatus = await response.json();
        setConversionStatus(status);

        if (status.status === 'done') {
          clearInterval(pollingIntervalRef.current!);
          setIsUploading(false);
          downloadResult(jobId);
        } else if (status.status === 'error') {
          clearInterval(pollingIntervalRef.current!);
          setIsUploading(false);
          setError(status.message || 'Conversion failed');
        }
      } catch (err) {
        clearInterval(pollingIntervalRef.current!);
        setIsUploading(false);
        setError('Failed to check conversion status');
      }
    }, 1000);
  };

  // Download result
  const downloadResult = async (jobId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/download/${jobId}`);
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileInfo?.name.replace(/\.(doc|docx)$/i, '')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download result');
    }
  };

  // Manual download
  const handleDownload = () => {
    if (jobId) {
      downloadResult(jobId);
    }
  };

  // Open in new tab
  const handleOpenInNewTab = () => {
    if (jobId) {
      window.open(`http://localhost:8000/download/${jobId}`, '_blank');
    }
  };

  // Reset everything
  const reset = () => {
    setFileInfo(null);
    setConversionStatus(null);
    setJobId(null);
    setError(null);
    setIsUploading(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Word → Excel Converter
            </h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Drop your Word document here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Supports .doc and .docx files up to 20MB
                </p>
              </div>
            </div>
          </div>

          {/* File Info */}
          {fileInfo && (
            <div className={`mt-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{fileInfo.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {fileInfo.size} • {fileInfo.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Remove file"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={startConversion}
            disabled={!fileInfo || isUploading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !fileInfo || isUploading
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isUploading ? 'Converting...' : 'Start Conversion'}
          </button>
          
          <button
            onClick={reset}
            disabled={isUploading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isUploading
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Progress Section */}
        {conversionStatus && (
          <div className={`p-6 rounded-lg ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } border border-gray-200 dark:border-gray-700`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Conversion Status
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  conversionStatus.status === 'done'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : conversionStatus.status === 'error'
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {conversionStatus.status.charAt(0).toUpperCase() + conversionStatus.status.slice(1)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Progress</span>
                  <span>{conversionStatus.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${conversionStatus.progress}%` }}
                  />
                </div>
              </div>

              {/* Status Message */}
              <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
                {conversionStatus.message}
              </p>

              {/* Result Actions */}
              {conversionStatus.status === 'done' && (
                <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Download Excel
                  </button>
                  <button
                    onClick={handleOpenInNewTab}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                  >
                    Open in New Tab
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WordToExcelConverter;

