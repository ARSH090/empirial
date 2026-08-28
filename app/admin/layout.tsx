'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import {
  Shield,
  LayoutDashboard,
  Building2,
  Trophy,
  Tag,
  DollarSign,
  Star,
  Activity,
  Calendar,
  Award,
  BookOpen,
  Gift,
  Radio,
  Mail,
  Sliders,
  Image as ImageIcon,
  Settings,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          if (db) {
            const adminDocRef = doc(db, 'admins', user.uid);
            try {
              const adminDoc = await getDoc(adminDocRef);
              if (adminDoc.exists()) {
                if (adminDoc.data().is_active === true) {
                  setCurrentUser(user);
                } else {
                  console.warn('User is deactivated.');
                  setCurrentUser(null);
                  await signOut(auth);
                }
              } else if (user.email === 'admin@empirial.com' || user.email === 'admin@anurajfx.com') {
                try {
                  const { setDoc } = await import('firebase/firestore');
                  await setDoc(adminDocRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: 'Admin Master',
                    role: 'super_admin',
                    is_active: true,
                    created_at: new Date().toISOString()
                  });
                } catch (writeErr) {
                  console.warn('Failed to self-provision admin document (expected if Firestore rules restrict writes):', writeErr);
                }
                setCurrentUser(user);
              } else {
                console.warn('User is not in the admin whitelist.');
                setCurrentUser(null);
                await signOut(auth);
              }
            } catch (firestoreErr) {
              console.warn('Firestore lookup failed (offline/network issue). Checking email whitelist fallback:', firestoreErr);
              if (user.email === 'admin@empirial.com' || user.email === 'admin@anurajfx.com') {
                setCurrentUser(user);
              } else {
                setCurrentUser(null);
                await signOut(auth);
              }
            }
          } else {
            setCurrentUser(user);
          }
        } catch (err) {
          console.error('Error verifying admin whitelist:', err);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!currentUser && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [currentUser, loading, pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Authenticating session...</span>
      </div>
    );
  }

  const adminNav = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Trader Social & Verification', href: '/admin/social', icon: Shield, badge: 'Social' },
    { name: 'Prop Firms Directory', href: '/admin/firms', icon: Building2 },
    { name: 'Evaluation Challenges', href: '/admin/challenges', icon: Trophy },
    { name: 'Discount Promo Deals', href: '/admin/deals', icon: Tag },
    { name: 'Payout Proofs Queue', href: '/admin/payouts', icon: DollarSign, badge: 'Queue' },
    { name: 'Reviews Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Broker Spreads Matrix', href: '/admin/spreads', icon: Activity },
    { name: 'Tournaments & Events', href: '/admin/events', icon: Calendar },
    { name: 'Industry Awards 2026', href: '/admin/awards', icon: Award },
    { name: 'Blog Article CMS', href: '/admin/blog', icon: BookOpen },
    { name: 'Loyalty Rewards Store', href: '/admin/loyalty', icon: Gift },
    { name: 'Live Market Ticker', href: '/admin/market-ticker', icon: Radio },
    { name: 'Support Inbox', href: '/admin/messages', icon: Mail },
    { name: 'Page Builder CMS', href: '/admin/page-builder', icon: Sliders },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-elevation-surface border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Top Admin Badge */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white">ADMIN PORTAL</span>
                <p className="text-[10px] text-purple-400 font-mono">v2.0 Superadmin</p>
              </div>
            </div>

            <Link href="/" className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5" title="Exit to Public Site">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[10px]">
              AD
            </div>
            <div className="truncate max-w-[90px]">
              <span className="font-bold text-white block truncate">{currentUser?.email || 'Admin'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
            </div>
          </div>
          <button 
            onClick={async () => {
              if (auth) {
                await signOut(auth);
                router.push('/admin/login');
              }
            }}
            className="text-[9px] font-bold text-zinc-400 hover:text-white transition-colors uppercase bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
