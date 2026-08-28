'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit, Sparkles, Check, CheckCircle2, Save, RotateCcw } from 'lucide-react';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { Deal } from '@/lib/types';
import { getDeals, createDeal, deleteDeal } from '@/lib/firebase/services';
import {
  OfferPosterConfig,
  getStoredOfferPoster,
  saveOfferPoster,
  resetOfferPoster,
  DEFAULT_OFFER_POSTER,
} from '@/lib/utils/offer-popup-store';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('20');
  const [label, setLabel] = useState('20% OFF Limited Time');

  // Offer Poster Config State
  const [posterConfig, setPosterConfig] = useState<OfferPosterConfig>(DEFAULT_OFFER_POSTER);
  const [isPosterSaved, setIsPosterSaved] = useState(false);

  useEffect(() => {
    setPosterConfig(getStoredOfferPoster());

    async function loadDeals() {
      try {
        const data = await getDeals();
        if (data && data.length > 0) {
          setDeals(data);
        } else {
          setDeals(MOCK_DEALS);
        }
      } catch (err) {
        console.error('Failed to load deals:', err);
        setDeals(MOCK_DEALS);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const handleSavePoster = (e: React.FormEvent) => {
    e.preventDefault();
    saveOfferPoster(posterConfig);
    setIsPosterSaved(true);
    setTimeout(() => setIsPosterSaved(false), 2500);
  };

  const handleResetPoster = () => {
    const defaultConf = resetOfferPoster();
    setPosterConfig(defaultConf);
    setIsPosterSaved(true);
    setTimeout(() => setIsPosterSaved(false), 2500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon code?')) return;
    try {
      await deleteDeal(id);
      setDeals(deals.filter(d => d.id !== id));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
      // Fallback
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const newDeal: Omit<Deal, 'id'> = {
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

    try {
      const id = await createDeal(newDeal);
      setDeals([{ id, ...newDeal }, ...deals]);
    } catch (err) {
      console.error('Failed to create coupon:', err);
      // Fallback
      setDeals([{ id: 'deal-' + Date.now(), ...newDeal }, ...deals]);
    }

    setIsAdding(false);
    setCode('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading coupons database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Global Welcome Offer Poster Manager */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-card p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Session Welcome Offer Poster
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure the popup poster that automatically greets first-time session visitors on website open.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={posterConfig.enabled}
                onChange={(e) => setPosterConfig({ ...posterConfig, enabled: e.target.checked })}
                className="w-4 h-4 rounded accent-black dark:accent-white cursor-pointer"
              />
              <span className={posterConfig.enabled ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground"}>
                {posterConfig.enabled ? "Popup Active" : "Popup Disabled"}
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSavePoster} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Layout Structure
              </label>
              <select
                value={posterConfig.layoutStructure || 'side-by-side'}
                onChange={(e) => setPosterConfig({ ...posterConfig, layoutStructure: e.target.value as any })}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors font-medium"
              >
                <option value="side-by-side">Side-by-Side (Portrait Left + Details Right)</option>
                <option value="stacked">Stacked (Portrait Top + Details Downside)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Badge / Top Label
              </label>
              <input
                type="text"
                value={posterConfig.badge}
                onChange={(e) => setPosterConfig({ ...posterConfig, badge: e.target.value })}
                placeholder="e.g. VERY LIMITED DEAL + 1 FREE ACCOUNT ‼️"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={posterConfig.title}
                onChange={(e) => setPosterConfig({ ...posterConfig, title: e.target.value })}
                placeholder="e.g. Flash Prop Discounts & VIP Perks"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Discount Tag / Reward
              </label>
              <input
                type="text"
                value={posterConfig.discountTag}
                onChange={(e) => setPosterConfig({ ...posterConfig, discountTag: e.target.value })}
                placeholder="e.g. UP TO 30% OFF"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground font-bold focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={posterConfig.couponCode}
                onChange={(e) => setPosterConfig({ ...posterConfig, couponCode: e.target.value })}
                placeholder="e.g. EMPIRE"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 font-mono uppercase text-foreground font-bold focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={posterConfig.buttonText}
                onChange={(e) => setPosterConfig({ ...posterConfig, buttonText: e.target.value })}
                placeholder="e.g. Claim Offer & Enroll Now"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Button Destination Link
              </label>
              <input
                type="text"
                value={posterConfig.buttonLink}
                onChange={(e) => setPosterConfig({ ...posterConfig, buttonLink: e.target.value })}
                placeholder="e.g. /deals or https://..."
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Poster Image URL / Path
              </label>
              <input
                type="text"
                value={posterConfig.posterImageUrl || ''}
                onChange={(e) => setPosterConfig({ ...posterConfig, posterImageUrl: e.target.value })}
                placeholder="e.g. /posters/funded-futures-family.jpg"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Description / Offer Details
              </label>
              <textarea
                rows={3}
                value={posterConfig.subtitle}
                onChange={(e) => setPosterConfig({ ...posterConfig, subtitle: e.target.value })}
                placeholder="Detailed explanation of the promo offer..."
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Additional Benefits (One per line)
              </label>
              <textarea
                rows={3}
                value={(posterConfig.benefits || []).join('\n')}
                onChange={(e) =>
                  setPosterConfig({
                    ...posterConfig,
                    benefits: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  })
                }
                placeholder="Payout Protection&#10;Special Accounts (100% OFF)&#10;Special VIP Support via Discord"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Extra Note / Draw Information
            </label>
            <input
              type="text"
              value={posterConfig.extraNote || ''}
              onChange={(e) => setPosterConfig({ ...posterConfig, extraNote: e.target.value })}
              placeholder="e.g. Valid till Friday 5 PM EST. 1 Lucky buyer gets a 100% Free Account!"
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleResetPoster}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>

            <div className="flex items-center gap-3">
              {isPosterSaved && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved & Updated Live!
                </span>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Poster Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Promo Codes & Discounts Manager */}
      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Promo Codes & Discounts Manager</h1>
          <p className="text-xs text-muted-foreground">Manage verified coupon codes, affiliate URLs, and discount labels.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
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
