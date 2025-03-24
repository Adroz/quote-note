"use client";

import { useState, useEffect } from "react";
import { useQuotes } from "@/contexts/QuoteContext";
import { QuoteCard } from "./QuoteCard";
import { useSearchParams } from "next/navigation";

interface QuoteListProps {
  isShowcase?: boolean;
}

export const QuoteList = ({ isShowcase = false }: QuoteListProps) => {
  const { store } = useQuotes();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const searchParams = useSearchParams();
  
  // Check for tag in URL query params when component mounts
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [searchParams]);
  
  const filteredQuotes = selectedTag 
    ? store.quotes.filter(quote => quote.tags.includes(selectedTag))
    : store.quotes;
    
  // Sort by newest first
  const sortedQuotes = [...filteredQuotes].sort((a, b) => b.createdAt - a.createdAt);

  // Tags to display in showcase mode
  const showcaseTags = ["wisdom", "✨", "🏆"];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800 dark:text-white">
        {selectedTag ? `Quotes tagged with "${selectedTag}"` : "All Quotes"}
      </h1>
      
      {((isShowcase && showcaseTags.length > 0) || (!isShowcase && store.tags.length > 0)) && (
        <div className="mb-4 sm:mb-6">
          <h2 className="text-sm uppercase font-semibold mb-2 text-gray-600 dark:text-gray-400">Filter by tag:</h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                selectedTag === null 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            
            {isShowcase ? (
              <>
                {showcaseTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      selectedTag === tag 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </>
            ) : (
              <>
                {store.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                      selectedTag === tag 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="space-y-4 sm:space-y-6">
        {sortedQuotes.length > 0 ? (
          sortedQuotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} isShowcase={isShowcase} />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-5 sm:p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTag ? `No quotes found with the tag "${selectedTag}".` : "No quotes found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 