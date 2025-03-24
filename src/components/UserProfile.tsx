"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Define a type for Firebase errors
interface FirebaseError {
  message?: string;
  code?: string;
}

export const UserProfile = () => {
  const { currentUser, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      
      // Reload the application to ensure a fresh start
      // This ensures all components properly re-render with cleared local data
      window.location.href = '/';
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError;
      setError('Failed to sign out: ' + (firebaseError.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {currentUser ? (
        <>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="text-sm sm:text-base hidden xs:inline-block">
              {currentUser.email?.split('@')[0] || 'User'}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-slate-700">
              <div className="py-1 px-3 pt-2 border-b border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden overflow-ellipsis">
                  {currentUser.email}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  {loading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
              {error && (
                <div className="py-1 px-4 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link 
            href="/login" 
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}; 