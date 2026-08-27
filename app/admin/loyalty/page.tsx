'use client';

import React, { useState } from 'react';
import { Gift, Plus, Trash2 } from 'lucide-react';
import { MOCK_REWARDS } from '@/lib/data/loyalty-data';
import { LoyaltyReward } from '@/lib/types';

export default function AdminLoyaltyPage() {
  const [rewards, setRewards] = useState<LoyaltyReward[]>(MOCK_REWARDS);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Loyalty Rewards & Voucher Store Manager</h1>
        <p className="text-xs text-slate-400">Configure redeemable vouchers, challenge discounts, and trader streetwear.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((r) => (
          <div key={r.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-400">{r.points_cost} Points</span>
              <span className="text-xs text-slate-400">Stock: {r.stock}</span>
            </div>
            <h3 className="text-base font-bold text-white">{r.title}</h3>
            <p className="text-xs text-slate-300">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
