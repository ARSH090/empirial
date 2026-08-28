'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, ArrowRight, Loader2, UserPlus, LogIn } from 'lucide-react';
import {
  UserProfile,
  saveUser,
  DEFAULT_PURCHASED_ACCOUNTS,
} from '@/lib/utils/auth-store';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'discord' | 'email' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('open-login-modal', handleOpen);
    window.addEventListener('close-login-modal', handleClose);

    return () => {
      window.removeEventListener('open-login-modal', handleOpen);
      window.removeEventListener('close-login-modal', handleClose);
    };
  }, []);

  const handleGoogleConnect = async () => {
    setLoadingProvider('google');
    setErrorMsg('');
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/config');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Google Trader',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '+1 (555) 389-2049',
        role: 'trader',
        traderId: `EMP-${user.uid.substring(0, 5).toUpperCase()}`,
        avatarUrl: user.photoURL || undefined,
        points: mode === 'signup' ? 3000 : 2500,
        accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
        country: 'Global',
        discordHandle: user.displayName ? `@${user.displayName.toLowerCase().replace(/\s+/g, '_')}` : undefined,
        bio: 'Connected via Google Account. Trader on EMPIRIAL 2.0.',
      };
      saveUser(userProfile);
      setIsOpen(false);
    } catch (err: any) {
      console.error('Google connect error:', err);
      setErrorMsg(err.message || 'Google sign in failed. Please try again.');
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleDiscordConnect = () => {
    setLoadingProvider('discord');
    setErrorMsg('');
    try {
      const clientId = '1542933980955943013';
      const redirectUri = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}/api/auth/discord/callback`
        : 'https://empirial-bo6vs466p-arsh090s-projects.vercel.app/api/auth/discord/callback';
      
      const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify+email`;
      window.location.href = discordAuthUrl;
    } catch (err: any) {
      console.error('Discord redirect error:', err);
      setErrorMsg('Failed to redirect to Discord. Please try again.');
      setLoadingProvider(null);
    }
  };

  const handleEmailConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customPassword.trim()) return;

    setLoadingProvider('email');
    setErrorMsg('');
    try {
      const { 
        signInWithEmailAndPassword, 
        createUserWithEmailAndPassword, 
        updateProfile 
      } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase/config');
      
      if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, customEmail.trim(), customPassword.trim());
        const user = result.user;
        const displayName = customName.trim() || customEmail.split('@')[0];
        
        await updateProfile(user, { displayName });
        
        const userProfile: UserProfile = {
          uid: user.uid,
          displayName,
          email: customEmail.trim(),
          phoneNumber: customPhone.trim() || '+1 (555) 019-2834',
          role: 'trader',
          traderId: `EMP-${user.uid.substring(0, 5).toUpperCase()}`,
          avatarUrl: undefined,
          points: 3000,
          accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
          country: 'Global',
          discordHandle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
          bio: 'New registered trader on EMPIRIAL 2.0.',
        };
        saveUser(userProfile);
      } else {
        const result = await signInWithEmailAndPassword(auth, customEmail.trim(), customPassword.trim());
        const user = result.user;
        
        const userProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || customEmail.split('@')[0],
          email: user.email || customEmail.trim(),
          phoneNumber: '+1 (555) 019-2834',
          role: 'trader',
          traderId: `EMP-${user.uid.substring(0, 5).toUpperCase()}`,
          avatarUrl: user.photoURL || undefined,
          points: 2500,
          accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
          country: 'Global',
          discordHandle: user.displayName ? `@${user.displayName.toLowerCase().replace(/\s+/g, '_')}` : undefined,
          bio: 'Trader on EMPIRIAL 2.0.',
        };
        saveUser(userProfile);
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error('Email auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email address is already in use.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err.message || 'Authentication failed.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl cursor-default"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  <span>EMPIRIAL Passport Auth</span>
                </div>
                <h3 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
                  {mode === 'signup' ? 'Create Trader Account' : 'Connect Trader Account'}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {mode === 'signup'
                    ? 'Register your trader alias to claim welcome points, track passes, and leave reviews.'
                    : 'Access your profile, purchased accounts, reviews, and tournament registrations.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Segmented Switcher (Sign In vs Sign Up) */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-zinc-950 text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-zinc-950 text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Quick Provider Connect Options: Google & Discord */}
            <div className="space-y-2.5">
              {/* Option 1: Google */}
              <button
                type="button"
                onClick={handleGoogleConnect}
                disabled={loadingProvider !== null}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-foreground dark:hover:bg-zinc-800 font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="size-4 shrink-0 text-zinc-900 dark:text-zinc-100"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  <span>{mode === 'signup' ? 'Sign Up with Google' : 'Continue with Google'}</span>
                </div>
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                )}
              </button>

              {/* Option 2: Discord with authentic original Discord Blurple logo #5865F2 */}
              <button
                type="button"
                onClick={handleDiscordConnect}
                disabled={loadingProvider !== null}
                className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-foreground dark:hover:bg-zinc-800 font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center justify-between group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="#5865F2"
                    className="size-4 shrink-0 rounded-xs"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>{mode === 'signup' ? 'Sign Up with Discord' : 'Continue with Discord'}</span>
                </div>
                {loadingProvider === 'discord' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center text-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              <span className="absolute px-3 bg-white dark:bg-[#0A0A0A] text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                or with email
              </span>
            </div>

            {/* Error Message Display */}
            {errorMsg && (
              <div className="p-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Option 3: Custom Email Form */}
            <form onSubmit={handleEmailConnect} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">
                  Full Name / Trader Alias {mode === 'signup' && <span className="text-zinc-500">*</span>}
                </label>
                <input
                  type="text"
                  required={mode === 'signup'}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Anuraj FX Trader"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">
                  Email Address <span className="text-zinc-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="trader@empirial.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">
                  Password <span className="text-zinc-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">
                  Phone / WhatsApp Number <span className="text-muted-foreground text-[10px]">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+1 (555) 389-2049"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loadingProvider !== null}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingProvider === 'email' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>{mode === 'signup' ? 'Create Trader Account' : 'Sign In with Email'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Switch Mode Footer link */}
            <div className="text-center text-xs">
              {mode === 'signin' ? (
                <p className="text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-medium text-foreground underline hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                  >
                    Sign up free
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-medium text-foreground underline hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>

            {/* Footer Notice */}
            <div className="pt-1 text-center">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By connecting, you agree to EMPIRIAL Terms of Service and Verified Review Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
