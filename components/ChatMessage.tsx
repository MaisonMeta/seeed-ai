"use client";

import React from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import Image from 'next/image';

interface ChatMessageProps {
  message: ChatMessageType;
  onSaveToGallery?: (message: ChatMessageType, imageUrl: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSaveToGallery }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-accent flex-shrink-0 flex items-center justify-center font-bold text-brand-primary-opposite">
          AI
        </div>
      )}
      <div className={`max-w-3xl w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`inline-block p-4 rounded-lg shadow-sm ${isUser ? 'bg-brand-complement text-brand-primary-opposite' : 'bg-brand-secondary text-brand-text'}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          {message.images && message.images.length > 0 && (
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {message.images.map((img, index) => (
                <div key={index} className="group relative rounded-md overflow-hidden aspect-square">
                  <Image src={img} alt={isUser ? `user upload ${index + 1}` : `generated image ${index + 1}`} fill className="object-cover"/>
                  {!isUser && onSaveToGallery && (
                      <button
                          onClick={() => onSaveToGallery(message, img)}
                          className="absolute bottom-2 right-2 bg-brand-primary/70 backdrop-blur-sm text-brand-accent text-xs font-bold py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:bg-brand-accent hover:text-brand-primary-opposite"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 4a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2H5z"/>
                              <path d="M15 8a1 1 0 100-2 1 1 0 000 2z"/>
                          </svg>
                          <span>Save</span>
                      </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-brand-secondary flex-shrink-0 flex items-center justify-center">
            <Image 
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
              alt="User Avatar"
              width={32}
              height={32}
              className="w-full h-full rounded-full"
            />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;