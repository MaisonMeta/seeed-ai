"use client";

import React from 'react';
import type { AdvancedWorkflow, ImageFile } from '@/lib/types';
import ImageDropzone from './ImageDropzone';

interface WorkflowSidebarProps {
  workflow: AdvancedWorkflow;
  images: Record<string, ImageFile | null>;
  onImagesChange: (files: ImageFile[], slotId: string) => void;
  onRemoveImage: (id: string, slotId: string) => void;
  onRemoveWorkflow: () => void;
}

const VIRTUAL_TRY_ON_TOOLTIPS: Record<string, string> = {
    'Img1': 'Upload a clear image of the person, pose, and background.',
    'Img2': 'Add the image of the shirt, jacket, or upper-body garment.',
    'Img3': 'Add the image of the pants, skirt, or lower-body garment.',
    'Img4': 'Add the image of the footwear.',
    'Img5': 'Optional: Add an accessory like a bag or jewelry.',
};

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflow,
  images,
  onImagesChange,
  onRemoveImage,
  onRemoveWorkflow,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full animate-fadeIn">
      <div className="p-4 flex justify-between items-center flex-shrink-0">
        <h3 className="text-lg font-bold text-brand-accent">{workflow.label}</h3>
        <button onClick={onRemoveWorkflow} className="text-brand-text-secondary hover:text-brand-accent p-1 rounded-full" aria-label="Close workflow">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {workflow.image_slots.map(slot => (
          <div key={slot.id} className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold text-brand-text">{slot.label}</p>
                 {workflow.id === 'workflow_virtual_try_on' && VIRTUAL_TRY_ON_TOOLTIPS[slot.id] && (
                    <div className="relative group/tooltip z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-text-secondary cursor-help" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-brand-primary text-brand-text text-xs rounded-md px-3 py-1.5 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none shadow-lg">
                            {VIRTUAL_TRY_ON_TOOLTIPS[slot.id]}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-brand-primary"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="relative group w-full max-w-32">
              <div className="w-full aspect-square">
                  <ImageDropzone
                    label={slot.label}
                    preview={images[slot.id]?.preview || null}
                    onFilesChange={(files) => onImagesChange(files, slot.id)}
                  />
              </div>
              {images[slot.id] && (
                <button onClick={() => onRemoveImage(images[slot.id]!.id, slot.id)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default WorkflowSidebar;