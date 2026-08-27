'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit, ShieldCheck, Check, X } from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { Firm } from '@/lib/types';
import { getFirms, createFirm, deleteFirm } from '@/lib/firebase/services';

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [allocation, setAllocation] = useState('$2,000,000');
  const [split, setSplit] = useState('Up to 90%');
  const [payout, setPayout] = useState('Bi-Weekly');

  useEffect(() => {
    async function loadFirms() {
      try {
        const data = await getFirms();
        if (data && data.length > 0) {
          setFirms(data);
        } else {
          setFirms(MOCK_FIRMS);
        }
      } catch (err) {
        console.error('Failed to load firms:', err);
        setFirms(MOCK_FIRMS);
      } finally {
        setLoading(false);
      }
    }
    loadFirms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this firm profile?')) return;
    try {
      await deleteFirm(id);
      setFirms(firms.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete firm:', err);
      // Fallback
      setFirms(firms.filter(f => f.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newFirm: Omit<Firm, 'id'> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80',
      rating: 4.8,
      review_count: 100,
      max_allocation: allocation,
      profit_split_custom: split,
      payout_custom: payout,
      discount_label_custom: '15% OFF',
      coupon_code_custom: 'EMPIRIAL15',
      platforms: 'MT5, cTrader',
      category: 'forex',
      is_featured: true,
      is_verified: true,
      is_popular: true,
      trust_score: 95,
      founded_year: 2024,
      headquarters: 'Dubai, UAE',
      max_loss_pct: 10,
      daily_loss_pct: 5,
      profit_target_pct: 8,
      min_price: 99,
      description: 'Audited prop trading firm.',
    };

    try {
      const id = await createFirm(newFirm);
      setFirms([{ id, ...newFirm }, ...firms]);
    } catch (err) {
      console.error('Failed to create firm:', err);
      // Fallback
      setFirms([{ id: name.toLowerCase().replace(/\s+/g, '-'), ...newFirm }, ...firms]);
    }

    setIsAdding(false);
    setName('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading firms database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prop Firms Directory Manager</h1>
          <p className="text-xs text-slate-400">Configure parent prop firm listings, trust scores, and specs.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Firm</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Prop Firm Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Firm Name (e.g. Alpha Funded)"
              required
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              placeholder="Max Allocation ($2M)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={split}
              onChange={(e) => setSplit(e.target.value)}
              placeholder="Profit Split (Up to 90%)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="text"
              value={payout}
              onChange={(e) => setPayout(e.target.value)}
              placeholder="Payout Cycle (Bi-Weekly)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-elevation-card text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-purple-500 text-white font-bold text-xs"
            >
              Save Firm
            </button>
          </div>
        </form>
      )}

      {/* Firms Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Firm Name</th>
              <th className="p-4">Trust Score</th>
              <th className="p-4">Max Allocation</th>
              <th className="p-4">Profit Split</th>
              <th className="p-4">Coupon Code</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {firms.map((f) => (
              <tr key={f.id} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white">{f.name}</td>
                <td className="p-4 font-mono text-cyan-400 font-bold">{f.trust_score}/100</td>
                <td className="p-4 font-mono">{f.max_allocation}</td>
                <td className="p-4 font-mono text-emerald-400">{f.profit_split_custom}</td>
                <td className="p-4 font-mono text-purple-300">{f.coupon_code_custom}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
