"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, XCircle, File as FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  label: string;
  accept: Record<string, string[]>;
  onUploadSuccess: (url: string) => void;
}

export function FileUpload({ label, accept, onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setUploadStatus('idle');
    setProgress(0);

    // Simulate progress for better UX since fetch doesn't support upload progress natively easily
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response.ok) {
        setTimeout(() => {
          setUploadStatus('success');
          setIsUploading(false);
          onUploadSuccess(data.secure_url);
        }, 500);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Upload Error:', error);
      setUploadStatus('error');
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">{label}</label>
      <div
        {...getRootProps()}
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-guild-red bg-red-900/20 scale-[1.02]' : 'border-gray-700 bg-gray-900/50 hover:border-guild-red hover:bg-gray-800/50'}
        `}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center w-full max-w-xs"
            >
              <FileIcon className="w-10 h-10 text-guild-red mb-4 animate-pulse" />
              <p className="text-sm font-medium text-gray-300 mb-2 truncate w-full text-center">{fileName}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-guild-red to-guild-yellow h-2.5 rounded-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                ></motion.div>
              </div>
              <p className="text-xs text-gray-400 font-bold">{progress}%</p>
            </motion.div>
          ) : uploadStatus === 'success' ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-green-500"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="w-12 h-12 mb-3 drop-shadow-md" />
              </motion.div>
              <p className="text-base font-bold">Upload Complete!</p>
              <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{fileName}</p>
            </motion.div>
          ) : uploadStatus === 'error' ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-red-500"
            >
              <XCircle className="w-12 h-12 mb-3" />
              <p className="text-base font-bold">Upload Failed</p>
              <p className="text-xs text-gray-400 mt-1">Click to try again</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-gray-400 group"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-guild-red' : 'text-gray-500 group-hover:text-guild-red'}`} />
              </motion.div>
              <p className="text-base font-medium text-gray-300">
                {isDragActive ? 'Drop it like it\'s hot!' : 'Drag & drop your file here'}
              </p>
              <p className="text-xs text-gray-500 mt-2">or click to browse files</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
