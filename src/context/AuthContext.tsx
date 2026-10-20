import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
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
  logout: () => Promise<void>;
  toggleDevAdminSimulation: () => void;
  isDevSimulatedAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'kumar.aaryan2003@gmail.com';

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check email match or admins collection document
        const isEmailMatch = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        if (isEmailMatch) {
          setIsAdmin(true);
        } else {
          try {
            const adminDocRef = doc(db, 'admins', currentUser.uid);
            const adminSnap = await getDoc(adminDocRef);
            setIsAdmin(adminSnap.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
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
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Google Sign-in failed', err);
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
