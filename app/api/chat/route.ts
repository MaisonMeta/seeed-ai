
import { GoogleGenAI, Modality } from "@google/genai";
import { ALL_PROMPTS } from '../../lib/prompts';
import { NextResponse } from 'next/server';

// FIX: Use process.env.API_KEY as per coding guidelines.
const API_KEY = process.env.API_KEY;

// Initialize AI client only if API key is available
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!API_KEY) {
  // FIX: Update warning message to reflect the correct environment variable name.
  console.warn("API_KEY is not set. The API will return mock responses.");
}

// Helper to build the system instruction string
const buildSystemInstruction = (workflowId: string | null, moduleIds: string[]): string => {
    const workflow = workflowId ? ALL_PROMPTS.workflows.find(w => w.id === workflowId) : null;
    const modules = moduleIds.map(id => ALL_PROMPTS.modules.find(m => m.id === id)).filter(Boolean);

    let systemInstruction = "You are a creative, multimodal AI assistant.";
    if (workflow) {
        systemInstruction += `\n\nWORKFLOW: ${workflow.label}\n${workflow.system_prompt}`;
    }
    if (modules.length > 0) {
        const moduleTexts = modules.map(m => m!.text).join('\n');
        systemInstruction += `\n\nAPPLY THE FOLLOWING MODIFIERS:\n${moduleTexts}`;
    }
    return systemInstruction;
};

// --- Mock Response Handlers ---

function getMockImageResponse(prompt: string) {
    // A grey placeholder image, base64 encoded.
    const MOCK_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAPZJREFUeJzt2dENwyAMRFG09J12ig7hUAmxgomK9iZ+d8A47zEQt9f1fd8LAwDAAADP920AwD9/LYA3gLcA3gCeAt4CeAN4C3gL4A3gLeAtgDeAt4C3AN4C3gJ4A3gLeAvgDeAt4C2AN4C3gLcAvgDeAt4CeAN4C3gL4A3gLeAtgDeAt4C3AN4C3gJ4A3gLeAvgDeAt4C2AN4C3gLcAvgDeAt4CeAN4C3gL4A3gLeAtgDeAt4C3AN4C3gJ4A3gLeAvgDeAt4C2AN4C3gLcAvgDeAt4CeAN4C3gL4A3gLeAtgDeAt4C3gA+A/D5eA8BxPAEAYP6X8gfYAOfVmf32/gAAAABJRU5ErkJggg==';
    return NextResponse.json({
        candidates: [{
            content: {
                parts: [
                    { text: `This is a mocked image response for your prompt: "${prompt}".\nThe API key is missing.` },
                    { inlineData: { mimeType: 'image/png', data: MOCK_IMAGE_BASE64 } }
                ]
            }
        }]
    });
}

function getMockTextStreamResponse(prompt: string) {
    const mockResponse = `This is a mocked streaming response for your prompt: "${prompt}".\nThe API key is missing.`;
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            const words = mockResponse.split(' ');
            for (const word of words) {
                await new Promise(resolve => setTimeout(resolve, 50));
                controller.enqueue(encoder.encode(word + ' '));
            }
            controller.close();
        },
    });
    return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const prompt = formData.get('prompt') as string;
        const workflowId = formData.get('workflowId') as string | null;
        const moduleIds = JSON.parse(formData.get('moduleIds') as string || '[]') as string[];

        const imageEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('images['));
        const hasImages = imageEntries.length > 0;
       
        // --- Handle Mocking if API key is not available ---
        if (!ai) {
            if (hasImages) {
                return getMockImageResponse(prompt);
            } else {
                return getMockTextStreamResponse(prompt);
            }
        }

        const systemInstruction = buildSystemInstruction(workflowId, moduleIds);

        if (hasImages) {
            const contentParts: any[] = [];
             for (const [, value] of imageEntries) {
                const file = value as File;
                const buffer = Buffer.from(await file.arrayBuffer());
                contentParts.push({
                    inlineData: {
                        mimeType: file.type,
                        data: buffer.toString('base64'),
                    },
                });
            }
            contentParts.push({ text: prompt });

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: { parts: contentParts },
                config: {
                    systemInstruction: systemInstruction,
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            return NextResponse.json(response);

        } else {
            const responseStream = await ai.models.generateContentStream({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ text: prompt }] },
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of responseStream) {
                        const chunkText = chunk.text;
                        if (chunkText) {
                           controller.enqueue(new TextEncoder().encode(chunkText));
                        }
                    }
                    controller.close();
                },
            });

            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            });
        }
    } catch (error) {
        console.error("Error in /api/chat:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}
