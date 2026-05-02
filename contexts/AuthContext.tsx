import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import {
  subscribeToAuthState,
  signInWithGoogle as googleSignIn,
  signInAsGuest as guestSignIn,
  signOutUser,
} from "@/services/authService";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInAsGuest: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await googleSignIn();
  };

  const signInAsGuest = async () => {
    await guestSignIn();
  };

  const signOut = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
