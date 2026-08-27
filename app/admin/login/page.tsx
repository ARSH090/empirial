'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { ShieldAlert, ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAutoRegister = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!auth) throw new Error('Firebase Auth is not initialized. Make sure your environment variables are configured.');
      await createUserWithEmailAndPassword(auth, 'admin@anurajfx.com', 'Anuraj@admin12145');
      alert('Admin account created! You can now sign in.');
      setEmail('admin@anurajfx.com');
      setPassword('Anuraj@admin12145');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        alert('Admin account already exists in Firebase Auth.');
      } else {
        setError(err.message || 'An error occurred during account registration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!auth) {
        throw new Error('Firebase Auth is not initialized. Make sure your environment variables are configured.');
      }
      await signInWithEmailAndPassword(auth, email, password);
      
      // Verification of admin membership occurs inside the layout check,
      // but we redirect them straight to /admin upon successful Auth sign in.
      router.push('/admin');
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid administrative credentials. Access denied.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Decorative background light beam */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-zinc-900/40 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[24px] p-6 sm:p-8 space-y-8 shadow-2xl relative z-10">
        {/* Logo and Brand Title */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-zinc-800 flex items-center justify-center text-white">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white mt-3">
              EMPIRIAL Admin Portal
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Sign in with your administrator credentials to access dashboard control modules.
            </p>
          </div>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 block">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empirial.com"
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 block">
              Security Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-white rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold text-xs transition-all cursor-pointer shadow flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Access Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 space-y-3 flex flex-col items-center">
          <button
            type="button"
            onClick={handleAutoRegister}
            className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold transition-colors underline cursor-pointer"
          >
            Auto-Register Admin Account
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-[10px] text-zinc-500 hover:text-white transition-colors animate-pulse"
          >
            ← Return to public website
          </button>
        </div>
      </div>
    </div>
  );
}
