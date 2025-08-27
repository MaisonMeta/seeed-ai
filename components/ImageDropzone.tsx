"use client";

import React, { useState, useRef, useCallback } from 'react';
import { ImageFile } from '@/lib/types';
import Image from 'next/image';

interface ImageDropzoneProps {
  onFilesChange: (files: ImageFile[]) => void;
  preview?: string | null;
  label: string;
  multiple?: boolean;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFilesChange, preview, label, multiple = false }) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsHovering(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  }, []);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const acceptedFiles: ImageFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file && file.type.startsWith('image/')) {
            acceptedFiles.push({
                id: `${file.name}-${Date.now()}-${i}`,
                file,
                preview: URL.createObjectURL(file),
            });
        }
    }

    if (acceptedFiles.length > 0) {
        onFilesChange(acceptedFiles);
    }
  }, [onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative group/preview cursor-pointer w-full h-full"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
        multiple={multiple}
      />
      {preview ? (
        <>
          <Image src={preview} alt="Preview" fill className="object-contain rounded-md" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center rounded-lg" aria-hidden="true">
            <span className="text-white text-sm font-bold pointer-events-none">Change</span>
          </div>
        </>
      ) : (
        <div 
          className={`w-full h-full border-2 rounded-lg transition-colors flex flex-col items-center justify-center 
            ${isHovering 
              ? 'border-brand-accent' 
              : 'border-dashed border-brand-border hover:border-brand-accent/50'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs text-brand-text-secondary mt-1 text-center">{label}</span>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;