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
      signInWithEmailAndPassword(auth!, email, password)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign in with Google
  function signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      signInWithPopup(auth!, googleProvider!)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign up with email and password
  function signUp(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth!, email, password)
        .then((result) => {
          resolve(result.user);
        })
        .catch(reject);
    });
  }

  // Function to sign out
  function signOut(): Promise<void> {
    return firebaseSignOut(auth!);
  }

  // Function to reset password
  function resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth!, email);
  }

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
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