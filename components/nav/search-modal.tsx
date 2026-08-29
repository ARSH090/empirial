'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Trophy, Tag, ArrowRight } from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { getFirms, getChallenges, getDeals } from '@/lib/firebase/services';
import { Firm, Challenge, Deal } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [firms, setFirms] = useState<Firm[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    async function loadSearchData() {
      try {
        const [fData, cData, dData] = await Promise.all([getFirms(), getChallenges(), getDeals()]);
        setFirms(fData.length > 0 ? fData : MOCK_FIRMS);
        setChallenges(cData.length > 0 ? cData : MOCK_CHALLENGES);
        setDeals(dData.length > 0 ? dData : MOCK_DEALS);
      } catch (err) {
        console.error('Failed to load search dynamic data:', err);
        setFirms(MOCK_FIRMS);
        setChallenges(MOCK_CHALLENGES);
        setDeals(MOCK_DEALS);
      }
    }
    loadSearchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredFirms = firms.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    (f.category && f.category.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4);

  const filteredChallenges = challenges.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.firm_name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredDeals = deals.filter(d =>
    d.firm_name.toLowerCase().includes(query.toLowerCase()) ||
    d.code.toLowerCase().includes(query.toLowerCase()) ||
    (d.discount_label && d.discount_label.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-elevation-modal border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prop firms, challenges, coupon codes, rules..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {/* Quick Links Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Popular Prop Firms
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredFirms.map(firm => (
                <Link
                  key={firm.id}
                  href={`/firms/${firm.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-elevation-card hover:bg-elevation-overlay border border-white/5 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      {firm.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {firm.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {firm.profit_split_custom || '90%'} • {firm.rating} ★
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Challenges Section */}
          {filteredChallenges.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Top Evaluation Challenges
              </span>
              <div className="space-y-1.5">
                {filteredChallenges.map(ch => (
                  <Link
                    key={ch.id}
                    href="/challenges"
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-lg bg-elevation-card hover:bg-elevation-overlay border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-400">
                          {ch.firm_name} - {ch.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ${(ch.account_size / 1000).toFixed(0)}k • {ch.steps === 0 ? 'Instant' : `${ch.steps}-Step`} • {ch.profit_split_pct}% Split
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">
                      ${ch.price}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Deals Section */}
          {filteredDeals.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                Discount Deals & Promo Codes
              </span>
              <div className="space-y-1.5">
                {filteredDeals.map(deal => (
                  <Link
                    key={deal.id}
                    href="/deals"
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-lg bg-elevation-card hover:bg-elevation-overlay border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-400">
                          {deal.firm_name}: {deal.discount_label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Code: <span className="font-mono text-cyan-400">{deal.code}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      -{deal.discount_pct}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-elevation-base flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">↓</kbd></span>
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
