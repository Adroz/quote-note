"use client";

import { useState } from 'react';
import { transferLocalQuotesToCloud } from '@/lib/storageManager';

interface MigrationPromptProps {
  onComplete: () => void;
}

export const MigrationPrompt = ({ onComplete }: MigrationPromptProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleMigration = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await transferLocalQuotesToCloud();
      
      if (result) {
        setSuccess(true);
        console.log('Quotes successfully backed up to cloud');
        
        // Wait a moment to show success message before closing
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        console.log('No quotes needed migration');
        setSuccess(true);
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } catch (err) {
      console.error('Error migrating quotes:', err);
      setError('Failed to save quotes to cloud. Please try again later.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Save Your Quotes to the Cloud?</h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We noticed you have quotes stored locally on this device. Would you like to add them to your cloud account so you can access them from any device?
        </p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">Your quotes were successfully saved to the cloud!</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
          {!success && (
            <>
              <button
                onClick={handleSkip}
                disabled={loading}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none disabled:opacity-50"
              >
                Skip
              </button>
              
              <button
                onClick={handleMigration}
                disabled={loading}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Moving Quotes...' : 'Yes, Save to Cloud'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 