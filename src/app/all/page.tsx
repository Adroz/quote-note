"use client";

import Link from "next/link";
import { QuoteList } from "@/components/QuoteList";
import { AddQuoteForm } from "@/components/AddQuoteForm";

export default function AllQuotes() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            QuoteNote
          </h1>
          <nav>
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Random Quote
            </Link>
          </nav>
        </div>
      </header>

      <QuoteList />
      <AddQuoteForm />
    </main>
  );
} 