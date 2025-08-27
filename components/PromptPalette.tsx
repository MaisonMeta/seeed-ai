"use client";

import React from 'react';
import { PromptModule, AdvancedWorkflow, DraggableItem } from '../lib/types';

interface PromptPaletteProps {
  modules: PromptModule[];
  workflows: AdvancedWorkflow[];
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: DraggableItem) => void;
  activeWorkflowId: string | null;
}

const DraggableCard: React.FC<{ 
  item: PromptModule | AdvancedWorkflow; 
  type: 'module' | 'workflow';
  isActive?: boolean;
  onClick?: () => void;
}> = ({ item, type, isActive = false, onClick }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const data: DraggableItem = { type, id: item.id };
    e.dataTransfer.setData('application/json', JSON.stringify(data));
  };

  const interactiveClass = type === 'workflow' ? 'cursor-pointer' : 'cursor-grab';
  const activeClasses = isActive ? 'bg-brand-accent/20 border-brand-accent' : 'border-transparent';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`bg-brand-secondary p-3 rounded-lg active:cursor-grabbing hover:bg-brand-accent/10 border transition-all ${interactiveClass} ${activeClasses}`}
    >
      <h4 className="font-semibold text-brand-text">{item.label}</h4>
      {type === 'workflow' && <p className="text-xs text-brand-text-secondary mt-1">Advanced Workflow</p>}
    </div>
  );
};


const PromptPalette: React.FC<PromptPaletteProps> = ({ modules, workflows, isOpen, onClose, onSelectItem, activeWorkflowId }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className={`fixed top-0 right-0 w-80 h-full bg-brand-primary border-l border-brand-border flex flex-col z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-title"
      >
        <div className="p-4 flex justify-between items-center border-b border-brand-border flex-shrink-0">
          <h2 id="palette-title" className="text-xl font-bold text-brand-text">Prompts</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-brand-accent p-1 rounded-full" aria-label="Close prompt palette">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
            <div>
              <h3 className="text-lg font-bold mb-3 text-brand-accent">Prompt Modules</h3>
              <div className="flex flex-col gap-2">
                {modules.map(module => (
                  <DraggableCard key={module.id} item={module} type="module" />
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3 text-brand-accent">Advanced Workflows</h3>
              <div className="flex flex-col gap-2">
                {workflows.map(workflow => (
                  <DraggableCard 
                    key={workflow.id} 
                    item={workflow} 
                    type="workflow" 
                    isActive={workflow.id === activeWorkflowId}
                    onClick={() => onSelectItem({ type: 'workflow', id: workflow.id })}
                  />
                ))}
              </div>
            </div>
        </div>
      </aside>
    </>
  );
};

export default PromptPalette;
