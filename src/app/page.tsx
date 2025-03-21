"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useQuotes } from "@/contexts/QuoteContext";
import { QuoteCard } from "@/components/QuoteCard";
import { AddQuoteForm } from "@/components/AddQuoteForm";
import { UserProfile } from "@/components/UserProfile";

export default function Home() {
  const { randomQuote, refreshRandomQuote, isLoading } = useQuotes();
  // Use this ref to detect when the page is loaded/refreshed
  const isFirstRender = useRef(true);

  // Only refresh the quote on actual page refresh, not on every render
  useEffect(() => {
    // Only run this effect on first render (page load/refresh)
    if (isFirstRender.current) {
      refreshRandomQuote();
      isFirstRender.current = false;
    }
    // This effect depends on refreshRandomQuote
  }, [refreshRandomQuote]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            QuoteNote
          </h1>
          <div className="flex items-center">
            <nav className="flex items-center space-x-4">
              <Link 
                href="/all" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                View All Quotes
              </Link>
              <UserProfile />
            </nav>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : randomQuote ? (
          <>
            <QuoteCard quote={randomQuote} />
            <button
              onClick={refreshRandomQuote}
              className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Show Another Quote
            </button>
          </>
        ) : (
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Welcome to QuoteNote!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add your first quote to get started.
            </p>
          </div>
        )}
      </div>

      <AddQuoteForm />
    </main>
  );
}
