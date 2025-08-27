
import { GoogleGenAI, Modality } from "@google/genai";
import type { ChatMessage, PromptModule, AdvancedWorkflow, ImageInput } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

// FIX: Use process.env.API_KEY as per coding guidelines.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Update warning message to reflect the correct environment variable name.
  console.warn("Gemini API key not found. Please set the API_KEY environment variable. Using mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const buildSystemInstruction = (
    workflow: AdvancedWorkflow | null,
    modules: PromptModule[]
): string => {
    let systemInstruction = "You are a creative, multimodal AI assistant.";
    if (workflow) {
        systemInstruction += `\n\nWORKFLOW: ${workflow.label}\n${workflow.system_prompt}`;
    }
    if (modules.length > 0) {
        const moduleTexts = modules.map(m => m.text).join('\n');
        systemInstruction += `\n\nAPPLY THE FOLLOWING MODIFIERS:\n${moduleTexts}`;
    }
    return systemInstruction;
};

const buildContentParts = async (prompt: string, images: ImageInput) => {
    const parts: any[] = [{ text: prompt }];

    const imagePromises: Promise<any>[] = [];

    if (Array.isArray(images)) {
        images.forEach(imgFile => {
            imagePromises.push(fileToBase64(imgFile.file).then(base64 => ({
                inlineData: {
                    mimeType: imgFile.file.type,
                    data: base64,
                },
            })));
        });
    } else {
        Object.values(images).forEach(imgFile => {
            if (imgFile) {
                imagePromises.push(fileToBase64(imgFile.file).then(base64 => ({
                    inlineData: {
                        mimeType: imgFile.file.type,
                        data: base64,
                    },
                })));
            }
        });
    }
    
    const imageParts = await Promise.all(imagePromises);
    return [...imageParts, ...parts];
};

export const generateImageResponse = async (
    prompt: string,
    images: ImageInput,
    workflow: AdvancedWorkflow | null,
    modules: PromptModule[]
): Promise<{ text: string | null; images: string[] }> => {
    const systemInstruction = buildSystemInstruction(workflow, modules);
    const contentParts = await buildContentParts(prompt, images);

    if (!ai) {
        // Mock response for development without API key
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            text: `This is a mocked image generation response for your prompt: "${prompt}". A real image would be generated here.`,
            images: ['https://via.placeholder.com/512/1e1e1e/00ff99?text=Mocked+Image'],
        };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: contentParts },
        config: {
            systemInstruction: systemInstruction,
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

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

    return { text: responseText, images: responseImages };
};


export const streamChatResponse = async (
    history: ChatMessage[],
    prompt: string,
    images: ImageInput,
    workflow: AdvancedWorkflow | null,
    modules: PromptModule[],
    onChunk: (chunk: string) => void
) => {
    const systemInstruction = buildSystemInstruction(workflow, modules);
    const contentParts = await buildContentParts(prompt, images);

    if (!ai) {
        // Mock response for development without API key
        const mockResponse = `This is a mocked streaming response for your prompt: "${prompt}".\n\nWorkflow: ${workflow?.label || 'None'}\nModules: ${modules.map(m => m.label).join(', ') || 'None'}\n\nNormally, a real multimodal response from Gemini would be generated here.`;
        const words = mockResponse.split(' ');
        for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            onChunk(words[i] + ' ');
        }
        return;
    }

    // This stateless approach is suitable for how the useChat hook manages history.
    const contents = [
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }] // Note: existing implementation only considers text history
        })),
        {
            role: 'user' as const,
            parts: contentParts
        }
    ];

    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    for await (const chunk of response) {
        onChunk(chunk.text);
    }
};
