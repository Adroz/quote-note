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

  if (!currentUser) {
    return (
      <div className="flex flex-col items-end">
        <div className="flex space-x-4 items-center">
          <Link 
            href="/login" 
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Sign Up
          </Link>
        </div>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
          Sign in to backup to cloud
        </p>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
      >
        <span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 mr-2">
          {currentUser.email?.charAt(0).toUpperCase() || 'U'}
        </span>
        <span className="text-sm truncate max-w-[120px]">
          {currentUser.email}
        </span>
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            Signed in as<br />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {currentUser.email}
            </span>
          </div>
          
          <div className="px-4 py-2 text-xs text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700">
            Using cloud storage
          </div>
          
          {error && (
            <div className="px-4 py-2 text-xs text-red-500">
              {error}
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}; 