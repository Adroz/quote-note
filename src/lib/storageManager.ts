import { Quote, QuoteStore } from "@/types";
import * as LocalStorage from './storage';
import * as FirestoreStorage from './firestore';
import { auth } from './firebase';

// Enum for storage mode
export enum StorageMode {
  LOCAL = 'local',
  FIREBASE = 'firebase'
}

// Helper to check if a user is authenticated
const isAuthenticated = (): boolean => {
  return !!auth?.currentUser;
};

// Function to get current storage mode based on authentication status
export const getStorageMode = (): StorageMode => {
  // If user is authenticated, use Firebase
  if (isAuthenticated()) {
    return StorageMode.FIREBASE;
  }
  
  // Otherwise default to local storage
  return StorageMode.LOCAL;
};

// Function to initialize storage and get initial store
export const getInitialStore = async (): Promise<QuoteStore> => {
  // If authenticated, try to get from Firebase
  if (isAuthenticated()) {
    try {
      return await FirestoreStorage.getFirestoreStore();
    } catch (error) {
      console.error('Error getting store from Firebase:', error);
      // Fall back to local storage if Firebase fails
      return LocalStorage.getInitialStore();
    }
  } else {
    // Not authenticated, use local storage
    return LocalStorage.getInitialStore();
  }
};

// Add a quote
export const addQuote = async (store: QuoteStore, quote: Omit<Quote, "id" | "createdAt">): Promise<QuoteStore> => {
  // If authenticated, use Firebase
  if (isAuthenticated()) {
    try {
      const newQuote = await FirestoreStorage.addQuoteToFirestore(quote);
      if (newQuote) {
        // Also update local store for immediate rendering
        const updatedStore = {
          quotes: [...store.quotes, newQuote],
          tags: [...new Set([...store.tags, ...quote.tags])]
        };
        return updatedStore;
      }
      return store;
    } catch (error) {
      console.error('Error adding quote to Firebase:', error);
      // Fall back to local storage
      return LocalStorage.addQuote(store, quote);
    }
  } else {
    // Not authenticated, use local storage
    return LocalStorage.addQuote(store, quote);
  }
};

// Update a quote
export const updateQuote = async (store: QuoteStore, id: string, quote: Omit<Quote, "id" | "createdAt">): Promise<QuoteStore> => {
  // If authenticated, use Firebase
  if (isAuthenticated()) {
    try {
      const updatedQuote = await FirestoreStorage.updateQuoteInFirestore(id, quote);
      if (updatedQuote) {
        // Also update local store for immediate rendering
        const quoteIndex = store.quotes.findIndex(q => q.id === id);
        const updatedQuotes = [...store.quotes];
        
        if (quoteIndex !== -1) {
          updatedQuotes[quoteIndex] = updatedQuote;
        }
        
        // Recalculate tags
        const allTags = new Set<string>();
        updatedQuotes.forEach(q => q.tags.forEach(tag => allTags.add(tag)));
        
        return {
          quotes: updatedQuotes,
          tags: Array.from(allTags)
        };
      }
      return store;
    } catch (error) {
      console.error('Error updating quote in Firebase:', error);
      // Fall back to local storage
      return LocalStorage.updateQuote(store, id, quote);
    }
  } else {
    // Not authenticated, use local storage
    return LocalStorage.updateQuote(store, id, quote);
  }
};

// Delete a quote
export const deleteQuote = async (store: QuoteStore, id: string): Promise<QuoteStore> => {
  // If authenticated, use Firebase
  if (isAuthenticated()) {
    try {
      const success = await FirestoreStorage.deleteQuoteFromFirestore(id);
      if (success) {
        // Also update local store for immediate rendering
        const updatedQuotes = store.quotes.filter(q => q.id !== id);
        
        // Recalculate tags
        const allTags = new Set<string>();
        updatedQuotes.forEach(q => q.tags.forEach(tag => allTags.add(tag)));
        
        return {
          quotes: updatedQuotes,
          tags: Array.from(allTags)
        };
      }
      return store;
    } catch (error) {
      console.error('Error deleting quote from Firebase:', error);
      // Fall back to local storage
      return LocalStorage.deleteQuote(store, id);
    }
  } else {
    // Not authenticated, use local storage
    return LocalStorage.deleteQuote(store, id);
  }
};

// Get a random quote
export const getRandomQuote = async (store: QuoteStore, currentQuoteId?: string | null): Promise<Quote | null> => {
  // If authenticated, use Firebase
  if (isAuthenticated()) {
    try {
      return await FirestoreStorage.getRandomQuoteFromFirestore(currentQuoteId);
    } catch (error) {
      console.error('Error getting random quote from Firebase:', error);
      // Fall back to local storage
      return LocalStorage.getRandomQuote(store, currentQuoteId);
    }
  } else {
    // Not authenticated, use local storage
    return LocalStorage.getRandomQuote(store, currentQuoteId);
  }
}; 