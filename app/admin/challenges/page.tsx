'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Edit } from 'lucide-react';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { Challenge } from '@/lib/types';
import { ProfitSplitGauge } from '@/components/ui/profit-split-gauge';
import { getChallenges, createChallenge, deleteChallenge } from '@/lib/firebase/services';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [size, setSize] = useState('100000');
  const [price, setPrice] = useState('499');
  const [split, setSplit] = useState('90');

  useEffect(() => {
    async function loadChallenges() {
      try {
        const data = await getChallenges();
        if (data && data.length > 0) {
          setChallenges(data);
        } else {
          setChallenges(MOCK_CHALLENGES);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
        setChallenges(MOCK_CHALLENGES);
      } finally {
        setLoading(false);
      }
    }
    loadChallenges();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge tier?')) return;
    try {
      await deleteChallenge(id);
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete challenge:', err);
      // Fallback
      setChallenges(challenges.filter(c => c.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newChallenge: Omit<Challenge, 'id'> = {
      firm_id: 'ftmo',
      firm_name: 'FTMO',
      firm_slug: 'ftmo',
      name,
      account_size: parseInt(size, 10),
      steps: 2,
      price: parseFloat(price),
      original_price: parseFloat(price) * 1.2,
      profit_split_pct: parseInt(split, 10),
      daily_loss_limit_pct: 5,
      max_loss_limit_pct: 10,
      profit_target_pct: 8,
      min_trading_days: 4,
      max_trading_days: 'Unlimited',
      payout_frequency: 'Bi-Weekly',
      leverage: '1:100',
      refundable_fee: true,
      buy_url: 'https://ftmo.com?ref=empirial',
      coupon_code: 'EMPIRIAL10',
      discount_pct: 10,
      is_featured: true,
      is_best_seller: false,
      category: 'forex',
    };

    try {
      const id = await createChallenge(newChallenge);
      setChallenges([{ id, ...newChallenge }, ...challenges]);
    } catch (err) {
      console.error('Failed to create challenge:', err);
      // Fallback
      setChallenges([{ id: 'ch-' + Date.now(), ...newChallenge }, ...challenges]);
    }

    setIsAdding(false);
    setName('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading challenges database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Evaluation Challenges Manager</h1>
          <p className="text-xs text-slate-400">Configure prices, targets, loss thresholds, and profit split gauges.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Challenge Tier</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Create Challenge Evaluation Tier</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Challenge Name (e.g. 100K Stellar)"
              required
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Size (100000)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price ($499)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              value={split}
              onChange={(e) => setSplit(e.target.value)}
              placeholder="Split (90)"
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
              Save Tier
            </button>
          </div>
        </form>
      )}

      {/* Challenges Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Firm & Challenge</th>
              <th className="p-4">Size</th>
              <th className="p-4">Steps</th>
              <th className="p-4">Target / Max Loss</th>
              <th className="p-4">Split</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {challenges.map((c) => (
              <tr key={c.id} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white">
                  <div>{c.name}</div>
                  <div className="text-[10px] text-cyan-400 font-normal">{c.firm_name}</div>
                </td>
                <td className="p-4 font-mono font-bold">${(c.account_size / 1000).toFixed(0)}k</td>
                <td className="p-4 font-mono">{c.steps === 0 ? 'Instant' : `${c.steps}-Step`}</td>
                <td className="p-4 font-mono text-emerald-400">{c.profit_target_pct}% / {c.max_loss_limit_pct}%</td>
                <td className="p-4 font-mono text-cyan-400">{c.profit_split_pct}%</td>
                <td className="p-4 font-mono font-bold text-white">${c.price}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
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
