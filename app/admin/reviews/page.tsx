'use client';

import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { MOCK_REVIEWS } from '@/lib/data/reviews-data';
import { Review } from '@/lib/types';
import { getReviews, updateReview, deleteReview } from '@/lib/firebase/services';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getReviews();
        if (data && data.length > 0) {
          setReviews(data);
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete review:', err);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleToggleVerify = async (review: Review) => {
    const nextVerify = !review.is_verified_trader;
    try {
      await updateReview(review.id, { is_verified_trader: nextVerify });
      setReviews(reviews.map(r => r.id === review.id ? { ...r, is_verified_trader: nextVerify } : r));
    } catch (err) {
      console.error('Failed to toggle review verification:', err);
      setReviews(reviews.map(r => r.id === review.id ? { ...r, is_verified_trader: nextVerify } : r));
    }
  };

  const handleStartEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const overall = Math.round(
      (editingReview.trading_conditions +
        editingReview.customer_care +
        editingReview.user_friendliness +
        editingReview.payout_process) /
        4
    );

    const updatedData: Partial<Review> = {
      title: editingReview.title,
      body: editingReview.body,
      overall_rating: overall,
      trading_conditions: editingReview.trading_conditions,
      customer_care: editingReview.customer_care,
      user_friendliness: editingReview.user_friendliness,
      payout_process: editingReview.payout_process,
    };

    try {
      await updateReview(editingReview.id, updatedData);
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...updatedData, overall_rating: overall } : r));
      setEditingReview(null);
    } catch (err) {
      console.error('Failed to update review:', err);
      setReviews(reviews.map(r => r.id === editingReview.id ? { ...r, ...updatedData, overall_rating: overall } : r));
      setEditingReview(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading reviews database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-xl font-semibold sm:text-2xl text-white">Trader Reviews Moderation</h1>
        <p className="text-xs text-slate-400">Moderate community reviews, toggle verified trader badges, and edit metadata specs.</p>
      </div>

      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEdit}
            className="bg-elevation-modal border border-white/15 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span>Edit Trader Review for {editingReview.firm_name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Trading Conditions (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.trading_conditions}
                  onChange={(e) => setEditingReview({ ...editingReview, trading_conditions: parseInt(e.target.value) || 5 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Customer Care (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.customer_care}
                  onChange={(e) => setEditingReview({ ...editingReview, customer_care: parseInt(e.target.value) || 5 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Usability / App (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.user_friendliness}
                  onChange={(e) => setEditingReview({ ...editingReview, user_friendliness: parseInt(e.target.value) || 5 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Payout Process (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.payout_process}
                  onChange={(e) => setEditingReview({ ...editingReview, payout_process: parseInt(e.target.value) || 5 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Review Title</label>
              <input
                type="text"
                value={editingReview.title}
                onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Review Content / Body</label>
              <textarea
                value={editingReview.body}
                onChange={(e) => setEditingReview({ ...editingReview, body: e.target.value })}
                rows={4}
                className="bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-3 py-1.5 rounded-lg bg-elevation-card hover:bg-elevation-raised text-xs text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Trader & Firm</th>
              <th className="p-4">Status</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Review Title & Excerpt</th>
              <th className="p-4">4-Criteria Breakdown</th>
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
                <td className="p-4">
                  <button
                    onClick={() => handleToggleVerify(r)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      r.is_verified_trader
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-900/60 text-slate-400 border-zinc-700/30 hover:border-zinc-500/55'
                    }`}
                    title="Click to toggle verified trader badge"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{r.is_verified_trader ? 'Verified' : 'Unverified'}</span>
                  </button>
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
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(r)}
                    className="p-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
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
