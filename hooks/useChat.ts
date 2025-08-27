"use client";

import { useState, useCallback } from 'react';
import { ChatMessage, AdvancedWorkflow, PromptModule, DraggableItem, ImageFile, ImageInput } from '@/lib/types';
import { ALL_PROMPTS } from '@/lib/prompts';
import { GenerateContentResponse } from '@google/genai';

export const useChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activeWorkflow, setActiveWorkflow] = useState<AdvancedWorkflow | null>(null);
    const [selectedModules, setSelectedModules] = useState<PromptModule[]>([]);
    const [images, setImages] = useState<ImageInput>([]);
    
    const onDropItem = useCallback((item: DraggableItem) => {
        if (item.type === 'workflow') {
            const workflow = ALL_PROMPTS.workflows.find(w => w.id === item.id);
            if (workflow) {
                setActiveWorkflow(workflow);
                setSelectedModules([]);
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
        setImages([]);
    }, []);

    const onImagesChange = useCallback((files: ImageFile[], slotId?: string) => {
        if (activeWorkflow && slotId) {
            setImages(prev => ({ ...(prev as Record<string, ImageFile | null>), [slotId]: files[0] || null }));
        } else {
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
        
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);

        const modelMessageId = (Date.now() + 1).toString();
        const initialModelMessage: ChatMessage = {
            id: modelMessageId,
            role: 'model',
            text: hasImages ? 'Generating response with images...' : '...',
            images: [],
            workflowId: activeWorkflow?.id,
            moduleIds: selectedModules.map(m => m.id),
        };
        setMessages(prev => [...prev, initialModelMessage]);

        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('workflowId', activeWorkflow?.id || '');
        formData.append('moduleIds', JSON.stringify(selectedModules.map(m => m.id)));

        const imageFiles = Array.isArray(images) 
            ? images 
            : Object.values(images).filter((i): i is ImageFile => i !== null);

        imageFiles.forEach((imgFile, index) => {
            formData.append(`images[${index}]`, imgFile.file);
        });

        if (!hasImages) {
            // For text-only chat, send message history for context
            const history = currentMessages.filter(m => m.role === 'user' || m.role === 'model');
            formData.append('history', JSON.stringify(history));
        }

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'API request failed');
            }

            if (hasImages) {
                const response: GenerateContentResponse = await res.json();
                let responseText: string | null = null;
                const responseImages: string[] = [];

                if (response.candidates && response.candidates.length > 0) {
                    for (const part of response.candidates[0].content.parts) {
                        if (part.text) {
                            responseText = (responseText || '') + part.text;
                        } else if (part.inlineData) {
                            const base64ImageBytes: string = part.inlineData.data;
                            const mimeType = part.inlineData.mimeType;
                            const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                            responseImages.push(imageUrl);
                        }
                    }
                } else {
                    responseText = "I couldn't generate a response. The request may have been blocked due to safety policies. Please try again with a different prompt or image.";
                }
                
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === modelMessageId
                            ? { ...msg, text: responseText || '', images: responseImages }
                            : msg
                    )
                );

            } else {
                const reader = res.body?.getReader();
                if (!reader) throw new Error("Failed to read response body");

                const decoder = new TextDecoder();
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === modelMessageId
                            ? { ...msg, text: '' } // Clear the '...'
                            : msg
                    )
                );

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                     setMessages(prev =>
                        prev.map(msg =>
                            msg.id === modelMessageId
                                ? { ...msg, text: msg.text + chunk }
                                : msg
                        )
                    );
                }
            }

            // On success, reset the composer state for the next message
            setActiveWorkflow(null);
            setSelectedModules([]);
            setImages([]);

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
        }
    }, [isLoading, images, activeWorkflow, selectedModules, messages]);

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