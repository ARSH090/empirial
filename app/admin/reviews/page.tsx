'use client';

import React, { useState } from 'react';
import { Star, Trash2, CheckCircle2 } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/data/reviews-data';
import { Review } from '@/lib/types';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Trader Reviews Moderation</h1>
        <p className="text-xs text-slate-400">Moderate community reviews and verify authentic trader feedback.</p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Trader & Firm</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Title & Excerpt</th>
              <th className="p-4">4-Criteria (Conditions / Support / App / Payout)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-elevation-raised/60">
                <td className="p-4 font-bold text-white">
                  <div>{r.full_name}</div>
                  <div className="text-[10px] text-cyan-400 font-normal">{r.firm_name}</div>
                </td>
                <td className="p-4 font-bold text-amber-400">
                  {r.overall_rating} ★
                </td>
                <td className="p-4 max-w-xs">
                  <div className="font-semibold text-white truncate">{r.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{r.body}</div>
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-300">
                  {r.trading_conditions} / {r.customer_care} / {r.user_friendliness} / {r.payout_process}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
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
