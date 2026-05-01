import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import {
  subscribeToAuthState,
  signInWithGoogle,
  signOutUser,
} from "@/services/authService";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
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

  const signIn = async (idToken: string) => {
    await signInWithGoogle(idToken);
  };

  const signOut = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
