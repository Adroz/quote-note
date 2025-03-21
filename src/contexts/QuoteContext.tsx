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

  const refreshRandomQuote = () => {
    // Pass the current quote ID to avoid showing the same quote again
    const currentId = randomQuote ? randomQuote.id : null;
    getRandomQuoteFromStore(store, currentId);
  };

  const handleAddQuote = (quote: Omit<Quote, "id" | "createdAt">) => {
    const updatedStore = addQuote(store, quote);
    setStore(updatedStore);
    
    // If this is the first quote, set it as random quote
    if (store.quotes.length === 0) {
      setRandomQuote(updatedStore.quotes[0]);
    }
  };

  const handleUpdateQuote = (id: string, quote: Omit<Quote, "id" | "createdAt">) => {
    const updatedStore = updateQuote(store, id, quote);
    setStore(updatedStore);
    
    // If the updated quote is the current random quote, update it
    if (randomQuote && randomQuote.id === id) {
      const updatedQuote = updatedStore.quotes.find(q => q.id === id);
      if (updatedQuote) {
        setRandomQuote(updatedQuote);
      }
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
        refreshRandomQuote
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