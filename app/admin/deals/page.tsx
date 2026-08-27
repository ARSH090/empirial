'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit } from 'lucide-react';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { Deal } from '@/lib/types';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('20');
  const [label, setLabel] = useState('20% OFF Limited Time');

  const handleDelete = (id: string) => {
    setDeals(deals.filter(d => d.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newDeal: Deal = {
      id: 'deal-' + Date.now(),
      firm_id: 'ftmo',
      firm_name: 'FTMO',
      firm_slug: 'ftmo',
      code,
      discount_label: label,
      discount_pct: parseInt(discount, 10),
      description: 'Exclusive partner promo code.',
      category: 'forex',
      affiliate_url: 'https://ftmo.com?ref=empirial',
      clicks_count: 0,
      is_featured: true,
      is_verified: true,
    };

    setDeals([newDeal, ...deals]);
    setIsAdding(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Promo Codes & Discounts Manager</h1>
          <p className="text-xs text-slate-400">Manage verified coupon codes, affiliate URLs, and discount labels.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon Code</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Create New Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code (e.g. FLASH80)"
              required
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
            />
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Discount % (20)"
              className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g. 20% OFF Flash Deal)"
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
              Save Code
            </button>
          </div>
        </form>
      )}

      {/* Deals Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Prop Firm</th>
              <th className="p-4">Promo Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Label</th>
              <th className="p-4">Clicks Count</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {deals.map((d) => (
              <tr key={d.id} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white">{d.firm_name}</td>
                <td className="p-4 font-mono font-black text-cyan-400">{d.code}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">-{d.discount_pct}%</td>
                <td className="p-4 text-slate-300">{d.discount_label}</td>
                <td className="p-4 font-mono text-slate-400">{d.clicks_count.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(d.id)}
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
