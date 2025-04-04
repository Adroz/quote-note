import { Quote, QuoteStore } from "@/types";

const STORAGE_KEY = "quote-note-data";

export const getInitialStore = (): QuoteStore => {
  if (typeof window === "undefined") {
    return { quotes: [], tags: [], forceQuotesInterface: false };
  }
  
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      // Ensure the forceQuotesInterface property exists
      return {
        ...parsedData,
        forceQuotesInterface: parsedData.forceQuotesInterface || false
      };
    }
  } catch (error) {
    console.error("Error loading from local storage:", error);
  }
  
  return { quotes: [], tags: [], forceQuotesInterface: false };
};

export const saveToStorage = (store: QuoteStore) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const addQuote = (store: QuoteStore, quote: Omit<Quote, "id" | "createdAt">): QuoteStore => {
  const newQuote: Quote = {
    ...quote,
    id: crypto.randomUUID(),
    createdAt: Date.now()
  };
  
  // Extract and add any new tags
  const newTags = quote.tags.filter(tag => !store.tags.includes(tag));
  const updatedStore = {
    ...store,
    quotes: [...store.quotes, newQuote],
    tags: [...store.tags, ...newTags]
  };
  
  saveToStorage(updatedStore);
  return updatedStore;
};

export const getRandomQuote = (store: QuoteStore, currentQuoteId?: string | null): Quote | null => {
  // If there are no quotes, return null
  if (!store.quotes.length) return null;
  
  // If there's only one quote, return it regardless
  if (store.quotes.length === 1) return store.quotes[0];
  
  // Filter out the current quote if it exists
  const availableQuotes = currentQuoteId 
    ? store.quotes.filter(quote => quote.id !== currentQuoteId)
    : store.quotes;
  
  // If somehow all quotes were filtered out (shouldn't happen), use all quotes
  const quotesToSelectFrom = availableQuotes.length > 0 ? availableQuotes : store.quotes;
  
  // Use a more robust random method
  const seed = Date.now();
  const randomIndex = Math.floor((Math.random() * seed) % quotesToSelectFrom.length);
  
  return quotesToSelectFrom[randomIndex];
};

export const updateQuote = (store: QuoteStore, id: string, updatedQuote: Omit<Quote, "id" | "createdAt">): QuoteStore => {
  const quoteIndex = store.quotes.findIndex(quote => quote.id === id);
  
  if (quoteIndex === -1) {
    return store;
  }
  
  const existingQuote = store.quotes[quoteIndex];
  const updatedQuoteObject: Quote = {
    ...existingQuote,
    ...updatedQuote,
    id,
    createdAt: existingQuote.createdAt
  };
  
  const updatedQuotes = [...store.quotes];
  updatedQuotes[quoteIndex] = updatedQuoteObject;
  
  // Extract and add any new tags
  const newTags = updatedQuote.tags.filter(tag => !store.tags.includes(tag));
  const updatedStore = {
    ...store,
    quotes: updatedQuotes,
    tags: [...store.tags, ...newTags]
  };
  
  saveToStorage(updatedStore);
  return updatedStore;
};

export const deleteQuote = (store: QuoteStore, id: string): QuoteStore => {
  const updatedQuotes = store.quotes.filter(quote => quote.id !== id);
  
  // If no change, return original store
  if (updatedQuotes.length === store.quotes.length) {
    return store;
  }
  
  // Re-analyze tags in use
  const tagsInUse = new Set<string>();
  updatedQuotes.forEach(quote => {
    quote.tags.forEach(tag => tagsInUse.add(tag));
  });
  
  const updatedStore = {
    ...store,
    quotes: updatedQuotes,
    tags: Array.from(tagsInUse)
  };
  
  saveToStorage(updatedStore);
  return updatedStore;
};

// Function to clear all locally stored quotes
export const clearLocalStorage = (): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Local storage quotes cleared");
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};

export const setForceQuotesInterface = (store: QuoteStore, value: boolean): QuoteStore => {
  const updatedStore = {
    ...store,
    forceQuotesInterface: value
  };
  
  saveToStorage(updatedStore);
  return updatedStore;
}; 