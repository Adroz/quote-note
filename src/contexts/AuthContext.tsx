"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { clearLocalStorage } from '@/lib/storage';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to sign in with email and password
  function signIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject(new Error("Firebase authentication is not initialized properly"));
        return;
      }
      
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign in with Google
  function signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!auth || !googleProvider) {
        reject(new Error("Firebase authentication is not initialized properly"));
        return;
      }
      
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign up with email and password
  function signUp(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!auth) {
        reject(new Error("Firebase authentication is not initialized properly"));
        return;
      }
      
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign out
  async function signOut(): Promise<void> {
    if (!auth) {
      return Promise.reject(new Error("Firebase authentication is not initialized properly"));
    }
    
    try {
      // Clear local storage before signing out
      clearLocalStorage();
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // Function to reset password
  function resetPassword(email: string): Promise<void> {
    if (!auth) {
      return Promise.reject(new Error("Firebase authentication is not initialized properly"));
    }
    return sendPasswordResetEmail(auth, email);
  }

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized, user will remain signed out");
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      }, (error) => {
        console.error("Auth state change error:", error);
        setCurrentUser(null);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Failed to set up auth state listener:", error);
      setCurrentUser(null);
      setLoading(false);
      return () => {};
    }
  }, []);

  const value = {
    currentUser,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 