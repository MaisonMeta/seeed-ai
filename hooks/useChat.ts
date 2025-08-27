
import { useState, useCallback } from 'react';
import { ChatMessage, AdvancedWorkflow, PromptModule, DraggableItem, ImageFile, ImageInput } from '../types';
import { ALL_PROMPTS } from '../constants/prompts';
import { streamChatResponse, generateImageResponse } from '../services/geminiService';

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activeWorkflow, setActiveWorkflow] = useState<AdvancedWorkflow | null>(null);
    const [selectedModules, setSelectedModules] = useState<PromptModule[]>([]);
    const [images, setImages] = useState<ImageInput>([]);

    const resetComposer = () => {
        setActiveWorkflow(null);
        setSelectedModules([]);
        setImages([]);
    };
    
    const onDropItem = useCallback((item: DraggableItem) => {
        if (item.type === 'workflow') {
            const workflow = ALL_PROMPTS.workflows.find(w => w.id === item.id);
            if (workflow) {
                // Reset everything when a new workflow is selected
                setActiveWorkflow(workflow);
                setSelectedModules([]);
                // Initialize image state for workflow slots
                const initialImages: Record<string, null> = {};
                workflow.image_slots.forEach(slot => {
                    initialImages[slot.id] = null;
                });
                setImages(initialImages);
            }
        } else if (item.type === 'module') {
            const module = ALL_PROMPTS.modules.find(m => m.id === item.id);
            if (module && !selectedModules.some(m => m.id === module.id)) {
                setSelectedModules(prev => [...prev, module]);
            }
        }
    }, [selectedModules]);

    const onRemoveModule = useCallback((id: string) => {
        setSelectedModules(prev => prev.filter(m => m.id !== id));
    }, []);
    
    const onRemoveWorkflow = useCallback(() => {
        setActiveWorkflow(null);
        setImages([]); // Reset to standard image array
    }, []);

    const onImagesChange = useCallback((files: ImageFile[], slotId?: string) => {
        if (activeWorkflow && slotId) {
            // In workflow mode, a slot only takes one image.
            setImages(prev => ({ ...(prev as Record<string, ImageFile | null>), [slotId]: files[0] || null }));
        } else {
            // In standard mode, append all new images.
            setImages(prev => [...(prev as ImageFile[]), ...files]);
        }
    }, [activeWorkflow]);

    const onRemoveImage = useCallback((id: string, slotId?: string) => {
        if (activeWorkflow && slotId) {
            setImages(prev => ({ ...(prev as Record<string, ImageFile | null>), [slotId]: null }));
        } else {
            setImages(prev => (prev as ImageFile[]).filter(img => img.id !== id));
        }
    }, [activeWorkflow]);

    const sendMessage = useCallback(async (prompt: string) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        const hasImages = Array.isArray(images) ? images.length > 0 : Object.values(images).some(i => i !== null);

        const userMessageId = Date.now().toString();
        const imagePreviews = Array.isArray(images)
            ? images.map(i => i.preview)
            : Object.values(images).filter((i): i is ImageFile => i !== null).map(i => i.preview);
            
        const userMessage: ChatMessage = {
            id: userMessageId,
            role: 'user',
            text: prompt,
            images: imagePreviews,
        };
        
        setMessages(prev => [...prev, userMessage]);

        const modelMessageId = (Date.now() + 1).toString();
        const initialModelMessage: ChatMessage = {
            id: modelMessageId,
            role: 'model',
            text: '...',
            images: [],
            workflowId: activeWorkflow?.id,
            moduleIds: selectedModules.map(m => m.id),
        };
        setMessages(prev => [...prev, initialModelMessage]);

        try {
            if (hasImages) {
                // Use new image generation service for multimodal prompts
                const response = await generateImageResponse(
                    prompt,
                    images,
                    activeWorkflow,
                    selectedModules
                );

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === modelMessageId
                            ? { ...msg, text: response.text || '', images: response.images }
                            : msg
                    )
                );
            } else {
                // Use existing text streaming service for text-only prompts
                await streamChatResponse(
                    messages,
                    prompt,
                    images, // Will be empty array
                    activeWorkflow,
                    selectedModules,
                    (chunk) => {
                        setMessages(prev =>
                            prev.map(msg =>
                                msg.id === modelMessageId
                                    ? { ...msg, text: msg.text === '...' ? chunk : msg.text + chunk }
                                    : msg
                            )
                        );
                    }
                );
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
            setError(errorMessage);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === modelMessageId
                        ? { ...msg, text: `Error: ${errorMessage}` }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
            resetComposer();
        }
    }, [isLoading, messages, images, activeWorkflow, selectedModules]);

    return {
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
    };
};