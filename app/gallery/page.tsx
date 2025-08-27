"use client";

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GalleryPage: React.FC = () => {
  const { session, signInWithGoogle } = useAuth();

  if (!session) {
    return (
      <div className="p-4 sm:p-8 animate-fadeIn text-center flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-4">My Gallery</h1>
        <p className="text-brand-text-secondary mb-6 max-w-md">Please sign in with your Google account to view your saved generations.</p>
        <button
          onClick={signInWithGoogle}
          className="bg-brand-accent text-white font-bold rounded-lg py-3 px-6 hover:opacity-90 transition text-base"
        >
          Sign In
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4 sm:p-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-4 sm:mb-0">My Gallery</h1>
        <p className="text-brand-text-secondary">Your saved generations will appear here.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-brand-secondary rounded-lg aspect-square flex items-center justify-center p-2 group relative overflow-hidden shadow-sm">
            <div className="w-full h-full bg-brand-primary/50 rounded flex flex-col items-center justify-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <h3 className="text-white font-bold">Mocked Generation</h3>
              <p className="text-gray-300 text-xs mt-1">Prompt: "A cat in space..."</p>
              <div className="flex gap-2 mt-4">
                <button className="bg-brand-accent text-brand-primary-opposite text-xs px-3 py-1 rounded">View</button>
                <button className="bg-brand-secondary text-brand-text text-xs px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
