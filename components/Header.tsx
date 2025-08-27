'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (theme === null) return null; // Avoid rendering until theme is loaded

  return (
    <button onClick={toggleTheme} className="text-brand-text-secondary hover:text-brand-accent transition-colors p-2 rounded-full" aria-label="Toggle theme">
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );
};

const NavIconLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const activeLinkClass = "text-brand-accent";
  const inactiveLinkClass = "text-brand-text-secondary hover:text-brand-text transition-colors";

  return (
    <div className="relative group flex justify-center">
      <Link href={href} className={isActive ? activeLinkClass : inactiveLinkClass}>
        {children}
        <span className="sr-only">{label}</span>
      </Link>
      <div className="absolute bottom-full mb-2 w-auto p-2 min-w-max bg-brand-primary-opposite text-white text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </div>
    </div>
  );
};

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Open user menu">
        <Image
          src={user.user_metadata.avatar_url || `https://www.gravatar.com/avatar/${user.id}?d=mp&f=y`}
          alt="User Avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border-2 border-brand-primary"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-brand-secondary rounded-md shadow-lg z-20 border border-brand-border animate-fadeIn" style={{ animationDuration: '150ms' }}>
          <div className="p-4 border-b border-brand-border">
            <p className="font-semibold text-brand-text truncate">{user.user_metadata.full_name || 'User'}</p>
            <p className="text-sm text-brand-text-secondary truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <button
              onClick={signOut}
              className="w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-primary hover:text-brand-text rounded-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const { session, signInWithGoogle } = useAuth();
  return (
    <header className="bg-brand-secondary border-b border-brand-border p-4 flex justify-between items-center z-10 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-brand-accent p-2 rounded-lg">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold text-brand-text">seeed.ai</h1>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <NavIconLink href="/" label="Chat">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </NavIconLink>
        <NavIconLink href="/gallery" label="Gallery">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </NavIconLink>
        <NavIconLink href="/account" label="Account">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </NavIconLink>
      </nav>
       <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        {session ? (
          <UserMenu />
        ) : (
          <button
            onClick={signInWithGoogle}
            className="bg-brand-accent text-white font-bold rounded-lg py-2 px-4 hover:opacity-90 transition text-sm"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;