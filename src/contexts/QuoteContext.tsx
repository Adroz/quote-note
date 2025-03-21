"use client";

import { Quote, QuoteStore } from "@/types";
import * as StorageManager from "@/lib/storageManager";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface QuoteContextType {
  store: QuoteStore;
  randomQuote: Quote | null;
  addQuote: (quote: Omit<Quote, "id" | "createdAt">) => void;
  updateQuote: (id: string, quote: Omit<Quote, "id" | "createdAt">) => void;
  deleteQuote: (id: string) => void;
  refreshRandomQuote: () => void;
  setCurrentQuote: (id: string) => void;
  isLoading: boolean;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<QuoteStore>({ quotes: [], tags: [] });
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth(); // Get current auth state

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const initialStore = await StorageManager.getInitialStore();
        setStore(initialStore);
        await getRandomQuoteFromStore(initialStore);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [currentUser]); // Reload when auth state changes

  const getRandomQuoteFromStore = async (storeData: QuoteStore, currentQuoteId?: string | null) => {
    try {
      const randomQuoteItem = await StorageManager.getRandomQuote(storeData, currentQuoteId);
      setRandomQuote(randomQuoteItem);
    } catch (error) {
      console.error("Error getting random quote:", error);
    }
  };

  // Function to set specific quote as the current quote
  const setCurrentQuote = (id: string) => {
    const quote = store.quotes.find(q => q.id === id);
    if (quote) {
      setRandomQuote(quote);
    }
  };

  const refreshRandomQuote = async () => {
    // Pass the current quote ID to avoid showing the same quote again
    const currentId = randomQuote ? randomQuote.id : null;
    await getRandomQuoteFromStore(store, currentId);
  };

  const handleAddQuote = async (quote: Omit<Quote, "id" | "createdAt">) => {
    setIsLoading(true);
    try {
      const updatedStore = await StorageManager.addQuote(store, quote);
      setStore(updatedStore);
      
      // Find the newly added quote (it will be the last one)
      const newQuote = updatedStore.quotes[updatedStore.quotes.length - 1];
      
      // Set it as the current quote to display
      if (newQuote) {
        setRandomQuote(newQuote);
      }
    } catch (error) {
      console.error("Error adding quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuote = async (id: string, quote: Omit<Quote, "id" | "createdAt">) => {
    setIsLoading(true);
    try {
      const updatedStore = await StorageManager.updateQuote(store, id, quote);
      setStore(updatedStore);
      
      // Find the updated quote and set it as the current quote
      const updatedQuote = updatedStore.quotes.find(q => q.id === id);
      if (updatedQuote) {
        setRandomQuote(updatedQuote);
      }
    } catch (error) {
      console.error("Error updating quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    setIsLoading(true);
    try {
      const updatedStore = await StorageManager.deleteQuote(store, id);
      setStore(updatedStore);
      
      // If the deleted quote is the current random quote, get a new one
      if (randomQuote && randomQuote.id === id) {
        if (updatedStore.quotes.length > 0) {
          await getRandomQuoteFromStore(updatedStore);
        } else {
          setRandomQuote(null);
        }
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return null; // Don't render until data is loaded
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
        setCurrentQuote,
        isLoading
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