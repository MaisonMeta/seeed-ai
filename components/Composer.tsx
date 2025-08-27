import React from 'react';
import type { PromptModule, AdvancedWorkflow, ImageFile, ImageInput, DraggableItem } from '../types';
import ImageDropzone from './ImageDropzone';

interface ComposerProps {
    isLoading: boolean;
    activeWorkflow: AdvancedWorkflow | null;
    selectedModules: PromptModule[];
    images: ImageInput;
    onSendMessage: (prompt: string) => void;
    onDropItem: (item: DraggableItem) => void;
    onRemoveModule: (id: string) => void;
    onRemoveWorkflow: () => void;
    onImagesChange: (images: ImageFile[], slotId?: string) => void;
    onRemoveImage: (id: string, slotId?: string) => void;
}

const Composer: React.FC<ComposerProps> = ({
    isLoading,
    activeWorkflow,
    selectedModules,
    images,
    onSendMessage,
    onDropItem,
    onRemoveModule,
    onRemoveWorkflow,
    onImagesChange,
    onRemoveImage,
}) => {
    const [prompt, setPrompt] = React.useState('');
    const [isDropping, setIsDropping] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onSendMessage(prompt);
            setPrompt('');
        }
    };

    const handleDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        // Only show the drop overlay for modules/workflows, not for files.
        if (e.dataTransfer.types.includes('application/json')) {
            setIsDropping(true);
        }
    }, []);

    const handleDragLeave = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDropping(false);
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDropping(false);
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            if (data.type && data.id) {
                onDropItem(data);
            }
        } catch (error) {
            // This can happen if a file is dropped here instead of a dropzone, which is fine.
            // We just don't want to parse it as JSON.
        }
    }, [onDropItem]);
    
    const renderImageSlots = () => {
        // When a workflow is active, the new sidebar handles image slots.
        if (activeWorkflow) {
            return null;
        }

        // This is the standard mode (no active workflow).
        const typedImages = images as ImageFile[];
        return (
             <div className="flex items-end flex-wrap gap-2 mb-2">
                {typedImages.map(img => (
                    <div key={img.id} className="relative group max-h-20">
                        <img src={img.preview} className="block h-full w-auto object-contain rounded-lg" alt="upload preview" />
                        <button onClick={() => onRemoveImage(img.id)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))}
                <div className="w-20 h-20">
                    <ImageDropzone 
                        label="Add Images" 
                        onFilesChange={(files) => onImagesChange(files)}
                        multiple={true}
                    />
                </div>
            </div>
        )
    };
    
    const renderChips = () => (
        <div className="flex flex-wrap gap-2 mb-2">
            {activeWorkflow && (
                <div className="flex items-center gap-2 bg-brand-accent/20 text-brand-text rounded-full px-3 py-1 text-sm">
                    <span>{activeWorkflow.label}</span>
                    <button onClick={onRemoveWorkflow} className="hover:text-white">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
            {selectedModules.map(module => (
                <div key={module.id} className="flex items-center gap-2 bg-brand-primary text-brand-text rounded-full px-3 py-1 text-sm">
                    <span>{module.label}</span>
                     <button onClick={() => onRemoveModule(module.id)} className="hover:text-brand-accent">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            ))}
        </div>
    );
    
    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 border-t border-brand-border transition-all relative bg-brand-secondary`}
        >
             {isDropping && (
                <div className="absolute inset-0 bg-brand-accent/20 border-2 border-dashed border-brand-accent rounded-lg flex items-center justify-center pointer-events-none z-10">
                    <p className="text-brand-accent font-bold">Drop Module or Workflow Here</p>
                </div>
            )}
            {renderImageSlots()}
            {renderChips()}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Type your message or drag a module..."
                    className="w-full bg-brand-primary border border-brand-border focus:border-brand-accent focus:ring-0 rounded-lg p-3 resize-none transition"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-brand-accent text-white font-bold rounded-lg p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" transform="rotate(90 12 12)" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Composer;