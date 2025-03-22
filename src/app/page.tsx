"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuotes } from "@/contexts/QuoteContext";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/UserProfile";
import { QuoteCard } from "@/components/QuoteCard";
import { AddQuoteForm } from "@/components/AddQuoteForm";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { currentUser } = useAuth();
  const { store, randomQuote, refreshRandomQuote, isLoading, setForceQuotesInterface } = useQuotes();
  // Use this ref to detect when the page is loaded/refreshed
  const isFirstRender = useRef(true);
  // State to control the quote form visibility
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Only refresh the quote on actual page refresh, not on every render
  useEffect(() => {
    // Only run this effect on first render (page load/refresh)
    if (isFirstRender.current) {
      refreshRandomQuote();
      isFirstRender.current = false;
    }
    // This effect depends on refreshRandomQuote
  }, [refreshRandomQuote]);

  // Handle the "run locally" action
  const handleRunLocally = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force the app to show the quotes interface with the form open
    setShowQuoteForm(true);
    // Force the quotes interface to show
    if (!hasQuotes && !currentUser) {
      // We want to switch away from the landing page
      // This is a hack to force the UI to show the quotes interface
      setForceQuotesInterface(true);
    }
  };

  // Handle the quote form opening/closing
  const handleQuoteFormOpenChange = (open: boolean) => {
    setShowQuoteForm(open);
    
    // If user closes the form and still has no quotes, reset to landing page
    if (!open && !hasQuotes && !currentUser) {
      setForceQuotesInterface(false);
    }
  };

  // Determine if we should show the landing page or the quotes interface
  const hasQuotes = store.quotes.length > 0;
  // Only show landing page for anonymous users without quotes and not forcing quotes interface
  const showLandingPage = !currentUser && !hasQuotes && !store.forceQuotesInterface;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            QuoteNote
          </h1>
          <div className="flex items-center">
            <nav className="flex items-center space-x-4">
              {/* Only show View All Quotes when there are quotes or the user is logged in */}
              {(hasQuotes || currentUser) && (
                <Link 
                  href="/all" 
                  className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  View All Quotes
                </Link>
              )}
              <UserProfile />
            </nav>
          </div>
        </div>
      </header>

      {showLandingPage ? (
        <>
          {/* Hero Section */}
          <section className="py-16 px-4 bg-gradient-to-b from-white to-indigo-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    Capture Quotes, Find Inspiration
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your personal collection of quotes and ideas that matter to you
                  </p>
                  <div className="space-y-4">
                    <Link 
                      href="/signup" 
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-md transition duration-300 text-center w-full sm:w-auto"
                    >
                      Sign up to start your collection
                    </Link>
                    <div className="text-center sm:text-left">
                      <a 
                        href="#" 
                        onClick={handleRunLocally}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                      >
                        or run locally without an account
                      </a>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full h-96 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for app screenshot */}
                      <p className="text-center">
                        App screenshot showing beautiful quote display
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Value Proposition */}
          <section className="py-16 px-4 bg-white dark:bg-slate-900">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-playfair text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Why QuoteNote?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Collect</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Save quotes from books, conversations, and your own thoughts
                  </p>
                </div>
                
                {/* Feature 2 */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Organize</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tag and categorize your collection for easy reference
                  </p>
                </div>
                
                {/* Feature 3 */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Discover</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Revisit your favorite quotes when you need inspiration
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Showcase */}
          <section className="py-16 px-4 bg-indigo-50 dark:bg-slate-800">
            <div className="container mx-auto max-w-6xl">
              <h2 className="font-playfair text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                How QuoteNote Works
              </h2>
              
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center mb-16">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Beautiful Quote Display</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Each quote is elegantly presented with options to edit, tag, and organize. Quotes can include multiple lines and formatting is preserved.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for feature screenshot */}
                      <p className="text-center">
                        Screenshot of quote card design
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-16">
                <div className="md:w-1/2 md:pl-8 mb-8 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Tag System</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Clickable tags make filtering your collection simple. The most used tags are suggested first, making organization intuitive.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for feature screenshot */}
                      <p className="text-center">
                        Screenshot of tagging system
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Seamless Experience</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    QuoteNote works both online and offline. Use it locally without an account, or sign up for cloud storage to access your quotes anywhere.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative w-full h-64 bg-gray-200 dark:bg-slate-700 rounded-lg shadow-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for feature screenshot */}
                      <p className="text-center">
                        Screenshot of cross-device sync
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-indigo-600 dark:bg-indigo-800 text-white">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Start Building Your Collection Today
              </h2>
              <p className="text-xl mb-8 text-indigo-100">
                It's free, simple, and ready for your favorite quotes
              </p>
              <div className="space-y-4">
                <Link 
                  href="/signup" 
                  className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-8 rounded-md transition duration-300 text-center w-full sm:w-auto"
                >
                  Sign up to start your collection
                </Link>
                <div>
                  <a 
                    href="#" 
                    onClick={handleRunLocally}
                    className="text-indigo-100 hover:text-white hover:underline text-sm"
                  >
                    or run locally without an account
                  </a>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
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

          <AddQuoteForm initialOpen={showQuoteForm} onOpenChange={handleQuoteFormOpenChange} />
        </>
      )}
    </main>
  );
}
