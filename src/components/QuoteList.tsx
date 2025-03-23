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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {selectedTag ? `Quotes tagged with "${selectedTag}"` : "All Quotes"}
      </h1>
      
      {((isShowcase && showcaseTags.length > 0) || (!isShowcase && store.tags.length > 0)) && (
        <div className="mb-6">
          <h2 className="text-sm uppercase font-semibold mb-2 text-gray-600 dark:text-gray-400">Filter by tag:</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTag === null 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {isShowcase 
              ? showcaseTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))
              : store.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedTag === tag 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))
            }
          </div>
        </div>
      )}
      
      {sortedQuotes.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          {(isShowcase || store.quotes.length === 0) ? (
            <p>No quotes yet. Add your first one!</p>
          ) : (
            <p>No quotes found with the selected tag.</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedQuotes.map(quote => (
            <QuoteCard key={quote.id} quote={quote} isShowcase={isShowcase} />
          ))}
        </div>
      )}
    </div>
  );
}; 