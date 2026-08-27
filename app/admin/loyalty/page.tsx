'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Plus, Trash2 } from 'lucide-react';
import { MOCK_REWARDS } from '@/lib/data/loyalty-data';
import { LoyaltyReward } from '@/lib/types';
import { getLoyaltyRewards, createLoyaltyReward, deleteLoyaltyReward } from '@/lib/firebase/services';

export default function AdminLoyaltyPage() {
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [pointsCost, setPointsCost] = useState('1000');
  const [stock, setStock] = useState('50');

  useEffect(() => {
    async function loadRewards() {
      try {
        const data = await getLoyaltyRewards();
        if (data && data.length > 0) {
          setRewards(data);
        } else {
          setRewards(MOCK_REWARDS);
        }
      } catch (err) {
        console.error('Failed to load loyalty rewards:', err);
        setRewards(MOCK_REWARDS);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward item?')) return;
    try {
      await deleteLoyaltyReward(id);
      setRewards(rewards.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete reward:', err);
      // Fallback
      setRewards(rewards.filter(r => r.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) return;

    const newReward: Omit<LoyaltyReward, 'id'> = {
      title,
      description: desc,
      points_cost: parseInt(pointsCost) || 1000,
      stock: parseInt(stock) || 50,
      reward_type: 'voucher',
      is_active: true
    };

    try {
      const id = await createLoyaltyReward(newReward);
      setRewards([{ id, ...newReward }, ...rewards]);
    } catch (err) {
      console.error('Failed to create reward:', err);
      // Fallback
      setRewards([{ id: 'rw-' + Date.now(), ...newReward }, ...rewards]);
    }

    setIsAdding(false);
    setTitle('');
    setDesc('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading loyalty database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Loyalty Rewards & Voucher Store Manager</h1>
          <p className="text-xs text-slate-400">Configure redeemable vouchers, challenge discounts, and trader streetwear.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reward</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4 max-w-lg">
          <h3 className="text-sm font-bold text-white">Add New Store Reward</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Reward Title (e.g. NyS $50 Voucher)"
              required
              className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Reward description..."
              required
              rows={2}
              className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={pointsCost}
                onChange={(e) => setPointsCost(e.target.value)}
                placeholder="Points Cost"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock Quantity"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
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
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs"
            >
              Add Reward
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((r) => (
          <div key={r.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-3 relative group">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-400">{r.points_cost} Points</span>
              <span className="text-xs text-slate-400">Stock: {r.stock}</span>
            </div>
            <h3 className="text-base font-bold text-white pr-8">{r.title}</h3>
            <p className="text-xs text-slate-300">{r.description}</p>
            <button
              onClick={() => handleDelete(r.id)}
              className="absolute top-4 right-4 p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
