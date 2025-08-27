export interface ImageSlot {
  id: string;
  label: string;
}

export interface PromptModule {
  id: string;
  label: string;
  text: string;
}

export interface AdvancedWorkflow {
  id: string;
  label: string;
  image_slots: ImageSlot[];
  system_prompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  images?: string[]; // base64 strings or URLs
  // Context for gallery saving
  workflowId?: string;
  moduleIds?: string[];
}

export interface ImageFile {
  id:string;
  file: File;
  preview: string;
}

export type DraggableItem = 
  | { type: 'module'; id: string }
  | { type: 'workflow'; id: string };

export type ImageInput = ImageFile[] | Record<string, ImageFile | null>;