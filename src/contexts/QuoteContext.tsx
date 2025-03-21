"use client";

import { Quote, QuoteStore } from "@/types";
import { addQuote, deleteQuote, getInitialStore, updateQuote, getRandomQuote } from "@/lib/storage";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

interface QuoteContextType {
  store: QuoteStore;
  randomQuote: Quote | null;
  addQuote: (quote: Omit<Quote, "id" | "createdAt">) => void;
  updateQuote: (id: string, quote: Omit<Quote, "id" | "createdAt">) => void;
  deleteQuote: (id: string) => void;
  refreshRandomQuote: () => void;
  setCurrentQuote: (id: string) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<QuoteStore>({ quotes: [], tags: [] });
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const initialStore = getInitialStore();
    setStore(initialStore);
    getRandomQuoteFromStore(initialStore);
    setIsLoaded(true);
  }, []);

  const getRandomQuoteFromStore = (storeData: QuoteStore, currentQuoteId?: string | null) => {
    const randomQuoteItem = getRandomQuote(storeData, currentQuoteId);
    setRandomQuote(randomQuoteItem);
  };

  // Function to set specific quote as the current quote
  const setCurrentQuote = (id: string) => {
    const quote = store.quotes.find(q => q.id === id);
    if (quote) {
      setRandomQuote(quote);
    }
  };

  const refreshRandomQuote = () => {
    // Pass the current quote ID to avoid showing the same quote again
    const currentId = randomQuote ? randomQuote.id : null;
    getRandomQuoteFromStore(store, currentId);
  };

  const handleAddQuote = (quote: Omit<Quote, "id" | "createdAt">) => {
    const updatedStore = addQuote(store, quote);
    setStore(updatedStore);
    
    // Find the newly added quote (it will be the last one)
    const newQuote = updatedStore.quotes[updatedStore.quotes.length - 1];
    
    // Set it as the current quote to display
    setRandomQuote(newQuote);
  };

  const handleUpdateQuote = (id: string, quote: Omit<Quote, "id" | "createdAt">) => {
    const updatedStore = updateQuote(store, id, quote);
    setStore(updatedStore);
    
    // Find the updated quote and set it as the current quote
    const updatedQuote = updatedStore.quotes.find(q => q.id === id);
    if (updatedQuote) {
      setRandomQuote(updatedQuote);
    }
  };

  const handleDeleteQuote = (id: string) => {
    const updatedStore = deleteQuote(store, id);
    setStore(updatedStore);
    
    // If the deleted quote is the current random quote, get a new one
    if (randomQuote && randomQuote.id === id) {
      if (updatedStore.quotes.length > 0) {
        getRandomQuoteFromStore(updatedStore);
      } else {
        setRandomQuote(null);
      }
    }
  };

  if (!isLoaded) {
    return null; // Don't render until data is loaded from localStorage
  }

  return (
    <QuoteContext.Provider 
      value={{ 
        store, 
        randomQuote, 
        addQuote: handleAddQuote,
        updateQuote: handleUpdateQuote,
        deleteQuote: handleDeleteQuote,
        refreshRandomQuote,
        setCurrentQuote
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuotes = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuotes must be used within a QuoteProvider");
  }
  return context;
}; 