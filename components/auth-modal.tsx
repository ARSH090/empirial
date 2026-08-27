'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, UserCheck, ArrowRight, Lock, Sparkles, Check } from 'lucide-react';
import {
  UserProfile,
  DEMO_TRADER,
  saveUser,
  getStoredUser,
  DEFAULT_PURCHASED_ACCOUNTS,
} from '@/lib/utils/auth-store';

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleConnectDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      saveUser(DEMO_TRADER);
      setIsLoading(false);
      setIsOpen(false);
    }, 400);
  };

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        uid: `trader-${Date.now()}`,
        displayName: customName.trim(),
        email: customEmail.trim(),
        phoneNumber: customPhone.trim() || '+1 (555) 019-2834',
        role: 'trader',
        traderId: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        points: 2500,
        accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
        country: 'Global',
        discordHandle: `@${customName.toLowerCase().replace(/\s+/g, '_')}`,
        bio: 'Prop challenge and funded trader on EMPIRIAL 2.0.',
      };
      saveUser(user);
      setIsLoading(false);
      setIsOpen(false);
    }, 400);
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
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl cursor-default"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-foreground mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>EMPIRIAL Passport Auth</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Connect Trader Account
                </h3>
                <p className="text-xs text-muted-foreground">
                  Access your profile, purchased accounts, reviews, and tournament registrations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              {/* Google / Quick Connect */}
              <button
                type="button"
                onClick={handleConnectDemo}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="size-4 shrink-0"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>{isLoading ? 'Connecting...' : 'One-Click Connect (Google / Demo)'}</span>
              </button>

              <div className="relative flex items-center justify-center text-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                <span className="absolute px-3 bg-white dark:bg-zinc-950 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  or custom credentials
                </span>
              </div>
            </div>

            {/* Custom Sign-in Form */}
            <form onSubmit={handleCustomConnect} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground text-[11px]">Full Name / Trader Alias</label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Anuraj FX Trader"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground text-[11px]">Email Address</label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="trader@empirial.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground text-[11px]">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+1 (555) 389-2049"
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground font-semibold text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Complete Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-1 text-center">
              <p className="text-[10px] text-muted-foreground">
                By connecting, you agree to EMPIRIAL Terms of Service and Verified Review Policy.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
