import { db, auth } from './firebase';
import { Quote, QuoteStore } from "@/types";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  Timestamp,
  where,
  DocumentData, 
  QueryDocumentSnapshot 
} from 'firebase/firestore';

const QUOTES_COLLECTION = 'quotes';

// Helper to check if Firebase is initialized
const isFirebaseInitialized = (): boolean => {
  return !!db && !!auth;
};

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  return auth?.currentUser?.uid || null;
};

// Helper to convert Firestore data to our app data
const convertFirestoreQuoteToQuote = (doc: QueryDocumentSnapshot<DocumentData>): Quote => {
  const data = doc.data();
  return {
    id: doc.id,
    text: data.text,
    author: data.author || undefined,
    tags: data.tags || [],
    createdAt: data.createdAt?.toMillis() || Date.now()
  };
};

// Load initial store data from Firestore
export const getFirestoreStore = async (): Promise<QuoteStore> => {
  try {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, returning empty store');
      return { quotes: [], tags: [] };
    }
    
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.warn('No authenticated user, returning empty store');
      return { quotes: [], tags: [] };
    }
    
    // Get quotes for the current user
    const quotesQuery = query(
      collection(db!, QUOTES_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const quotesSnapshot = await getDocs(quotesQuery);
    const quotes = quotesSnapshot.docs.map(convertFirestoreQuoteToQuote);
    
    // Get all unique tags from quotes
    const tagsSet = new Set<string>();
    quotes.forEach(quote => {
      quote.tags.forEach(tag => tagsSet.add(tag));
    });
    const tags = Array.from(tagsSet);
    
    return { quotes, tags };
  } catch (error) {
    console.error("Error loading from Firestore:", error);
    return { quotes: [], tags: [] };
  }
};

// Add a new quote to Firestore
export const addQuoteToFirestore = async (quote: Omit<Quote, "id" | "createdAt">): Promise<Quote | null> => {
  try {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, cannot add quote to Firestore');
      return null;
    }
    
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.warn('No authenticated user, cannot add quote to Firestore');
      return null;
    }
    
    const quoteData = {
      ...quote,
      userId, // Associate quote with current user
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db!, QUOTES_COLLECTION), quoteData);
    
    return {
      ...quote,
      id: docRef.id,
      createdAt: Date.now()
    };
  } catch (error) {
    console.error("Error adding quote to Firestore:", error);
    return null;
  }
};

// Update an existing quote in Firestore
export const updateQuoteInFirestore = async (id: string, quote: Omit<Quote, "id" | "createdAt">): Promise<Quote | null> => {
  try {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, cannot update quote in Firestore');
      return null;
    }
    
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.warn('No authenticated user, cannot update quote in Firestore');
      return null;
    }
    
    const quoteRef = doc(db!, QUOTES_COLLECTION, id);
    await updateDoc(quoteRef, {
      text: quote.text,
      author: quote.author || null,
      tags: quote.tags
    });
    
    return {
      ...quote,
      id,
      createdAt: Date.now() // We don't update the timestamp when editing
    };
  } catch (error) {
    console.error("Error updating quote in Firestore:", error);
    return null;
  }
};

// Delete a quote from Firestore
export const deleteQuoteFromFirestore = async (id: string): Promise<boolean> => {
  try {
    if (!isFirebaseInitialized()) {
      console.warn('Firebase not initialized, cannot delete quote from Firestore');
      return false;
    }
    
    const userId = getCurrentUserId();
    
    if (!userId) {
      console.warn('No authenticated user, cannot delete quote from Firestore');
      return false;
    }
    
    await deleteDoc(doc(db!, QUOTES_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting quote from Firestore:", error);
    return false;
  }
};

// Get a random quote from Firestore
export const getRandomQuoteFromFirestore = async (currentQuoteId?: string | null): Promise<Quote | null> => {
  try {
    const store = await getFirestoreStore();
    
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
  } catch (error) {
    console.error("Error getting random quote from Firestore:", error);
    return null;
  }
}; 