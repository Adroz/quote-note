"use client";

import Link from "next/link";
import { QuoteList } from "@/components/QuoteList";
import { AddQuoteForm } from "@/components/AddQuoteForm";
import { useQuotes } from "@/contexts/QuoteContext";
import { UserProfile } from "@/components/UserProfile";

export default function AllQuotes() {
  const { isLoading } = useQuotes();
  
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <Link href="/">QuoteNote</Link>
          </h1>
          <div className="flex items-center">
            <nav className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Random Quote
              </Link>
              <UserProfile />
            </nav>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <QuoteList />
      )}
      <AddQuoteForm />
    </main>
  );
} 