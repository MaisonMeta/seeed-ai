import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from '../components/ChatMessage';
import Composer from '../components/Composer';
import PromptPalette from '../components/PromptPalette';
import WorkflowSidebar from '../components/WorkflowSidebar';
import { useChat } from '../hooks/useChat';
import { ALL_PROMPTS } from '../constants/prompts';
import type { ChatMessage as ChatMessageType, DraggableItem, ImageFile } from '../types';

const ChatPage: React.FC = () => {
    const {
        messages,
        isLoading,
        error,
        activeWorkflow,
        selectedModules,
        images,
        sendMessage,
        onDropItem,
        onRemoveModule,
        onRemoveWorkflow,
        onImagesChange,
        onRemoveImage,
    } = useChat();
    
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSaveToGallery = (message: ChatMessageType, imageUrl: string) => {
        const messageIndex = messages.findIndex(m => m.id === message.id);
        let userPromptText = '';
        let userImages: string[] | undefined = [];

        if (messageIndex > 0) {
            // Find the last user message that came before this model message
            for (let i = messageIndex - 1; i >= 0; i--) {
                if (messages[i].role === 'user') {
                    userPromptText = messages[i].text;
                    userImages = messages[i].images;
                    break;
                }
            }
        }

        const payload = {
            imageUrlToSave: imageUrl,
            modelResponseText: message.text,
            userPromptText: userPromptText,
            userUploadedImages: userImages,
            workflowId: message.workflowId,
            moduleIds: message.moduleIds,
            createdAt: new Date().toISOString(),
        };

        console.log('Gallery Save Payload:', payload);
        alert(`Image saved to gallery (mocked).\nSee console for the full data payload that would be sent to the API.`);
    };

    const handleSelectItem = (item: DraggableItem) => {
        if (item.type === 'workflow') {
            onDropItem(item); // Reuse the drop logic to set the workflow
            setIsPaletteOpen(false); // Close the palette automatically
        }
    };
    
    const renderWelcomeState = () => {
        if (activeWorkflow) {
            return (
                 <div className="flex flex-col items-center justify-center h-full text-brand-text-secondary animate-fadeIn p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22l-.648-1.437a4.5 4.5 0 01-3.09-3.09L10.5 16.5l1.437-.648a4.5 4.5 0 013.09 3.09L16.25 20l.648.562z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-brand-text">{activeWorkflow.label} Activated</h2>
                    <p className="mt-2 text-center max-w-md">Add the required images in the sidebar on the left to get started.</p>
                </div>
            )
        }
        
        return (
            <div className="flex flex-col items-center justify-center h-full text-brand-text-secondary p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-2xl font-bold text-brand-text">Welcome to seeed.ai Chat</h2>
                <p>Start a conversation or click the '+' button to add prompts.</p>
            </div>
        );
    }

    return (
        <div className="relative h-full flex">
            {activeWorkflow && (
                <WorkflowSidebar
                    workflow={activeWorkflow}
                    images={images as Record<string, ImageFile | null>}
                    onImagesChange={onImagesChange}
                    onRemoveImage={onRemoveImage}
                    onRemoveWorkflow={onRemoveWorkflow}
                />
            )}
            <div className="flex-grow flex flex-col h-full bg-brand-primary">
                <div className="flex-grow overflow-y-auto p-4">
                    {messages.length === 0 
                        ? renderWelcomeState() 
                        : messages.map((msg) => (
                            <ChatMessage 
                                key={msg.id} 
                                message={msg} 
                                onSaveToGallery={handleSaveToGallery} 
                            />
                        ))
                    }
                    <div ref={messagesEndRef} />
                </div>
                {error && <div className="p-4 text-red-500 bg-red-500/10 border-t border-brand-secondary">{error}</div>}
                <Composer 
                    isLoading={isLoading}
                    activeWorkflow={activeWorkflow}
                    selectedModules={selectedModules}
                    images={images}
                    onSendMessage={sendMessage}
                    onDropItem={onDropItem}
                    onRemoveModule={onRemoveModule}
                    onRemoveWorkflow={onRemoveWorkflow}
                    onImagesChange={onImagesChange}
                    onRemoveImage={onRemoveImage}
                />
            </div>

            <button
                onClick={() => setIsPaletteOpen(true)}
                className={`absolute top-4 right-4 z-20 bg-brand-accent text-brand-primary-opposite rounded-full p-3 shadow-lg hover:scale-110 transition-transform ${isPaletteOpen ? 'hidden' : 'block'}`}
                aria-label="Open prompt palette"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            
            <PromptPalette 
                modules={ALL_PROMPTS.modules} 
                workflows={ALL_PROMPTS.workflows}
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
                onSelectItem={handleSelectItem}
                activeWorkflowId={activeWorkflow?.id || null}
            />
        </div>
    );
};

export default ChatPage;