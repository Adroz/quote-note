"use client";

import { useState } from "react";
import { Quote } from "@/types";
import { EditQuoteForm } from "./EditQuoteForm";
import { useQuotes } from "@/contexts/QuoteContext";
import Link from "next/link";

interface QuoteCardProps {
  quote: Quote;
  isShowcase?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
}

export const QuoteCard = ({ quote, isShowcase = false, onEditStateChange }: QuoteCardProps) => {
  const { deleteQuote } = useQuotes();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    if (onEditStateChange) {
      onEditStateChange(true);
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    if (onEditStateChange) {
      onEditStateChange(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      deleteQuote(quote.id);
    }
  };

  if (isEditing) {
    return <EditQuoteForm quote={quote} onComplete={handleEditComplete} />;
  }

  return (
    <div className={`quote-card group bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700 ${isShowcase ? 'showcase-card' : ''}`}>
      <div className="mb-4">
        <p className="text-lg text-gray-800 dark:text-white font-medium leading-relaxed whitespace-pre-wrap">&ldquo;{quote.text}&rdquo;</p>
        {quote.author && (
          <p className="mt-2 text-right text-gray-600 dark:text-gray-400">
            — {quote.author}
          </p>
        )}
      </div>
      
      <div className={`mt-4 flex flex-wrap items-center ${isShowcase ? 'justify-start' : 'justify-between'}`}>
        <div className="flex flex-wrap gap-2">
          {quote.tags.length > 0 && quote.tags.map(tag => (
            <Link 
              key={tag}
              href={isShowcase ? "#" : `/all?tag=${encodeURIComponent(tag)}`}
              onClick={isShowcase ? (e) => e.preventDefault() : undefined}
            >
              <span 
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Only show edit/delete buttons in non-showcase mode */}
        {!isShowcase && (
          <div className="flex gap-2 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 md:invisible md:group-hover:visible sm:opacity-100 sm:visible md:opacity-0">
            <button 
              onClick={handleEdit}
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
        )}
      </div>

      {/* Only render modals if not in showcase mode */}
      {!isShowcase && (
        <>
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
      )}
    </div>
  );
}; 