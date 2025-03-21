"use client";

import { useState } from "react";
import { Quote } from "@/types";
import { EditQuoteForm } from "./EditQuoteForm";
import { useQuotes } from "@/contexts/QuoteContext";
import Link from "next/link";

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard = ({ quote }: QuoteCardProps) => {
  const { deleteQuote } = useQuotes();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleDelete = () => {
    deleteQuote(quote.id);
    setIsDeleteConfirmOpen(false);
  };

  return (
    <>
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mx-auto relative group">
        <blockquote className="relative">
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
            &ldquo;{quote.text}&rdquo;
          </p>
          {quote.author && (
            <footer className="text-right">
              <p className="text-sm md:text-base font-semibold text-gray-600 dark:text-gray-400">
                — {quote.author}
              </p>
            </footer>
          )}
        </blockquote>
        
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {quote.tags.length > 0 && quote.tags.map(tag => (
              <Link 
                key={tag}
                href={`/all?tag=${encodeURIComponent(tag)}`}
              >
                <span 
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="flex gap-2 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 md:invisible md:group-hover:visible sm:opacity-100 sm:visible md:opacity-0">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              aria-label="Edit quote"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Delete quote"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditQuoteForm 
        quote={quote} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Delete Quote</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this quote? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 