import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  toggleDevAdminSimulation: () => void;
  isDevSimulatedAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'kumar.aaryan2003@gmail.com').toLowerCase();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDevSimulatedAdmin, setIsDevSimulatedAdmin] = useState<boolean>(() => {
    return localStorage.getItem('folioread_admin_sim') === 'true';
  });

  // Listen to Firebase Auth state
  useEffect(() => {
    // Check if returning from redirect sign-in
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const email = result.user.email?.toLowerCase();
          if (!email || email !== ADMIN_EMAIL) {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
            setIsAuthModalOpen(false);
          } else {
            setIsAuthModalOpen(false);
          }
        }
      })
      .catch((err) => {
        console.error('Redirect sign-in error:', err);
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check email match or admins collection document
        const isEmailMatch = currentUser.email?.toLowerCase() === ADMIN_EMAIL;
        if (isEmailMatch) {
          setUser(currentUser);
          setIsAdmin(true);
        } else {
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminSnap = await getDoc(adminDocRef);
            if (adminSnap.exists()) {
              setUser(currentUser);
              setIsAdmin(true);
            } else {
              await signOut(auth);
              setUser(null);
              setIsAdmin(false);
            }
          } catch {
            await signOut(auth);
            setUser(null);
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Global hidden keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAuthModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email?.toLowerCase();
      if (!email || email !== ADMIN_EMAIL) {
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        throw new Error('Incorrect Admin User');
      }
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Google Sign-in failed', err);
      throw err;
    }
  };

  const loginWithGoogleRedirect = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error('Google Redirect Sign-in failed', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsDevSimulatedAdmin(false);
    localStorage.removeItem('folioread_admin_sim');
    setIsAdmin(false);
  };

  const toggleDevAdminSimulation = () => {
    setIsDevSimulatedAdmin((prev) => {
      const next = !prev;
      localStorage.setItem('folioread_admin_sim', String(next));
      return next;
    });
  };

  const effectiveIsAdmin = isAdmin || isDevSimulatedAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: effectiveIsAdmin,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithGoogle,
        loginWithGoogleRedirect,
        logout,
        toggleDevAdminSimulation,
        isDevSimulatedAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
