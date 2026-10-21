import React, { useState } from 'react';
import { X, Shield, Lock, CheckCircle, ArrowRight, Sparkles, Key, Trash2, RotateCcw, BookPlus, Info, Copy, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogle,
    loginWithGoogleRedirect,
    isAdmin,
    user,
    logout,
  } = useAuth();
  const { clearAllBooks, resetToDefaultData, books } = useData();
  const { theme } = useTheme();

  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const [showVercelGuide, setShowVercelGuide] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  if (!isAuthModalOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      if (err?.code === 'auth/unauthorized-domain') {
        setErrorMsg(
          `Domain Unauthorized in Firebase: "${currentHostname}" has not been added to your Firebase project authorized domains list. Follow the guide below to add it in 30 seconds.`
        );
        setShowVercelGuide(true);
      } else if (err?.code === 'auth/popup-blocked') {
        setErrorMsg('Sign-in popup was blocked by browser. Attempting direct redirect...');
        try {
          await loginWithGoogleRedirect();
        } catch (redirErr: any) {
          setErrorMsg(`Redirect failed: ${redirErr?.message || 'Please enable popups for this domain in your browser settings.'}`);
        }
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in popup was closed before completing login.');
      } else {
        setErrorMsg(`Google Sign-In failed: ${err?.message || 'Please check network and Firebase configuration.'}`);
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleCopyEnv = () => {
    const envText = `VITE_FIREBASE_API_KEY=AIzaSyCK8BOu-MiuBeCYyffJD4uKDM1cIsMEZ7k
VITE_FIREBASE_AUTH_DOMAIN=mystic-sled-9zbz0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystic-sled-9zbz0
VITE_FIREBASE_STORAGE_BUCKET=mystic-sled-9zbz0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=964978876760
VITE_FIREBASE_APP_ID=1:964978876760:web:22d6d5386af673350a452d
VITE_FIREBASE_DATABASE_ID=ai-studio-7df4f68b-18f5-4bf6-8ac0-118220c85b78`;
    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  const handleClearMockup = async () => {
    if (window.confirm('Delete all current mockup books to start with a fresh, empty library?')) {
      await clearAllBooks();
      setConfirmMsg('All mockup items cleared. Your library is now a clean canvas!');
      setTimeout(() => setConfirmMsg(null), 4000);
    }
  };

  const handleRestoreMockup = async () => {
    await resetToDefaultData();
    setConfirmMsg('Sample demo library restored!');
    setTimeout(() => setConfirmMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800">
          <Shield className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
          Curator Access & Management Portal
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-6">
          The invisible control center. Visitors view a clean, read-only portfolio. Only you can upload, edit reviews, and manage library items.
        </p>

        {confirmMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{confirmMsg}</span>
          </div>
        )}

        {/* Status Card if Already Authenticated */}
        {isAdmin ? (
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Curator Mode Is Active ({books.length} Books in Library)</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-400">
                {user ? `Signed in as ${user.email}` : 'Curator Mode Active (Testing Switch)'}
              </p>
              <button
                onClick={logout}
                className="w-full py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Exit Curator Mode (Return to Public Read-Only View)
              </button>
            </div>

            {/* How to Upload Guide */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 font-semibold text-stone-800 dark:text-stone-200">
                <BookPlus className="w-4 h-4 text-blue-600" />
                <span>How to Upload Your Real Books</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                <li>Click the blue <strong>"+ New"</strong> button in the top navigation bar or the floating round blue button in the bottom corner.</li>
                <li>Or inside <strong>My Library</strong> or <strong>Currently Reading</strong>, click any <strong>"+ New page"</strong> row.</li>
                <li>Enter your book's title, author, cover image URL, reading status, total pages, and initial reading reflections.</li>
                <li>Click <strong>"Add to Collection"</strong> — it syncs immediately to Firebase and updates your dashboard!</li>
              </ol>
            </div>

            {/* Wipe Mockups / Start Fresh Buttons */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={handleClearMockup}
                className="w-full py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-center space-x-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Mockups (Start Fresh)</span>
              </button>

              <button
                onClick={handleRestoreMockup}
                className="w-full py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium flex items-center justify-center space-x-1.5 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Sample Data</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Real Firebase Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoadingGoogle}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-semibold text-xs transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoadingGoogle ? 'Connecting with Google...' : 'Sign in with Google (kumar.aaryan2003@gmail.com)'}</span>
            </button>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs space-y-2 text-rose-800 dark:text-rose-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="leading-snug">{errorMsg}</p>
                </div>

                {errorMsg.includes('Unauthorized') && currentHostname && (
                  <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-stone-600 dark:text-stone-300 truncate max-w-[200px]">
                      {currentHostname}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="px-2 py-1 rounded-lg bg-rose-200/80 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-medium flex items-center space-x-1 cursor-pointer hover:bg-rose-300"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedDomain ? 'Copied!' : 'Copy Domain'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Vercel Deployment & OAuth Setup Guide Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowVercelGuide(!showVercelGuide)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Vercel Deployment & OAuth Configuration Guide</span>
                </div>
                {showVercelGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showVercelGuide && (
                <div className="mt-2 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3.5 text-xs text-stone-700 dark:text-stone-300 animate-in fade-in">
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 mb-1">
                      1. Authorize your Vercel Domain in Firebase
                    </h4>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                      Firebase rejects Google OAuth logins from any domain not in its whitelist:
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-stone-600 dark:text-stone-400 mt-1.5">
                      <li>Open <a href="https://console.firebase.google.com/project/mystic-sled-9zbz0/authentication/settings" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-semibold">Firebase Console Authentication Settings</a>.</li>
                      <li>Scroll down to <strong>"Authorized Domains"</strong>.</li>
                      <li>Click <strong>"Add domain"</strong> and enter: <code className="px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono text-[10px]">{currentHostname || 'your-app.vercel.app'}</code>.</li>
                    </ol>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">
                        2. Environment Variables for Vercel
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyEnv}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedEnv ? 'Copied 7 Variables!' : 'Copy All Env Vars'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-2 leading-relaxed">
                      Paste these into your Vercel Project Settings &rarr; Environment Variables:
                    </p>
                    <pre className="p-2.5 rounded-xl bg-stone-900 text-amber-300 font-mono text-[10px] overflow-x-auto leading-relaxed">
{`VITE_FIREBASE_API_KEY=AIzaSyCK8BOu-MiuBeCYyffJD4uKDM1cIsMEZ7k
VITE_FIREBASE_AUTH_DOMAIN=mystic-sled-9zbz0.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mystic-sled-9zbz0
VITE_FIREBASE_STORAGE_BUCKET=mystic-sled-9zbz0.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=964978876760
VITE_FIREBASE_APP_ID=1:964978876760:web:22d6d5386af673350a452d
VITE_FIREBASE_DATABASE_ID=ai-studio-7df4f68b-18f5-4bf6-8ac0-118220c85b78`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 text-center font-serif">
          Aaryan's Private Curator Vault
        </div>

      </div>
    </div>
  );
};
