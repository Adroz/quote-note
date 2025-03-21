"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (currentUser) {
      // User is already logged in, redirect to home page
      router.push('/');
    }
  }, [currentUser, router]);
  
  // Don't render children while checking authentication or if user is authenticated
  if (currentUser) {
    return null;
  }
  
  return <>{children}</>;
}; 