'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit, Sparkles, Check, X, Save, RotateCcw } from 'lucide-react';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { Firm, Deal } from '@/lib/types';
import { getDeals, getFirms, createDeal, updateDeal, deleteDeal } from '@/lib/firebase/services';
import {
  OfferPosterConfig,
  getStoredOfferPoster,
  saveOfferPoster,
  resetOfferPoster,
  DEFAULT_OFFER_POSTER,
} from '@/lib/utils/offer-popup-store';

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  // Form States
  const [firmId, setFirmId] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('20');
  const [label, setLabel] = useState('20% OFF Limited Time');
  const [description, setDescription] = useState('Exclusive partner promo code.');
  const [affiliateUrl, setAffiliateUrl] = useState('https://ftmo.com?ref=empirial');
  const [category, setCategory] = useState<'forex' | 'futures' | 'crypto'>('forex');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isVerified, setIsVerified] = useState(true);

  // Offer Poster Config State
  const [posterConfig, setPosterConfig] = useState<OfferPosterConfig>(DEFAULT_OFFER_POSTER);
  const [isPosterSaved, setIsPosterSaved] = useState(false);

  useEffect(() => {
    setPosterConfig(getStoredOfferPoster());

    async function loadData() {
      try {
        const [dealsData, firmsData] = await Promise.all([getDeals(), getFirms()]);
        if (dealsData && dealsData.length > 0) {
          setDeals(dealsData);
        } else {
          setDeals(MOCK_DEALS);
        }
        if (firmsData && firmsData.length > 0) {
          setFirms(firmsData);
          setFirmId(firmsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load deals data:', err);
        setDeals(MOCK_DEALS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
      setDeals(deals.filter(d => d.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !firmId) return;

    const selectedFirm = firms.find(f => f.id === firmId);
    if (!selectedFirm) return;

    const newDeal: Omit<Deal, 'id'> = {
      firm_id: selectedFirm.id,
      firm_name: selectedFirm.name,
      firm_slug: selectedFirm.slug,
      code: code.toUpperCase(),
      discount_label: label,
      discount_pct: parseInt(discount, 10),
      description,
      category,
      affiliate_url: affiliateUrl,
      clicks_count: 0,
      is_featured: isFeatured,
      is_verified: isVerified,
    };

    try {
      const id = await createDeal(newDeal);
      setDeals([{ id, ...newDeal }, ...deals]);
    } catch (err) {
      console.error('Failed to create coupon:', err);
      setDeals([{ id: 'deal-' + Date.now(), ...newDeal }, ...deals]);
    }

    setIsAdding(false);
    resetForm();
  };

  const handleStartEdit = (deal: Deal) => {
    setEditingDeal(deal);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    const selectedFirm = firms.find(f => f.id === editingDeal.firm_id);
    const updatedData: Partial<Deal> = {
      firm_id: editingDeal.firm_id,
      firm_name: selectedFirm?.name || editingDeal.firm_name,
      firm_slug: selectedFirm?.slug || editingDeal.firm_slug,
      code: editingDeal.code.toUpperCase(),
      discount_label: editingDeal.discount_label,
      discount_pct: editingDeal.discount_pct,
      description: editingDeal.description,
      category: editingDeal.category,
      affiliate_url: editingDeal.affiliate_url,
      is_featured: editingDeal.is_featured,
      is_verified: editingDeal.is_verified,
    };

    try {
      await updateDeal(editingDeal.id, updatedData);
      setDeals(deals.map(d => d.id === editingDeal.id ? { ...d, ...updatedData } : d));
      setEditingDeal(null);
    } catch (err) {
      console.error('Failed to update coupon:', err);
      setDeals(deals.map(d => d.id === editingDeal.id ? { ...d, ...updatedData } : d));
      setEditingDeal(null);
    }
  };

  const resetForm = () => {
    setCode('');
    setDiscount('20');
    setLabel('20% OFF Limited Time');
    setDescription('Exclusive partner promo code.');
    setAffiliateUrl('https://ftmo.com?ref=empirial');
    setCategory('forex');
    setIsFeatured(true);
    setIsVerified(true);
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
      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Session Welcome Offer Poster
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Configure the popup poster that automatically greets first-time session visitors on website open.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={posterConfig.enabled}
                onChange={(e) => setPosterConfig({ ...posterConfig, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-700 text-purple-500 bg-transparent focus:ring-0 cursor-pointer"
              />
              <span className={posterConfig.enabled ? "text-emerald-400 font-bold" : "text-slate-400"}>
                {posterConfig.enabled ? "Popup Active" : "Popup Disabled"}
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={handleSavePoster} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Layout Structure
              </label>
              <select
                value={posterConfig.layoutStructure || 'side-by-side'}
                onChange={(e) => setPosterConfig({ ...posterConfig, layoutStructure: e.target.value as any })}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors font-medium"
              >
                <option value="side-by-side">Side-by-Side (Portrait Left + Details Right)</option>
                <option value="stacked">Stacked (Portrait Top + Details Downside)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Badge / Top Label
              </label>
              <input
                type="text"
                value={posterConfig.badge}
                onChange={(e) => setPosterConfig({ ...posterConfig, badge: e.target.value })}
                placeholder="e.g. VERY LIMITED DEAL + 1 FREE ACCOUNT ‼️"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Headline Title
              </label>
              <input
                type="text"
                value={posterConfig.title}
                onChange={(e) => setPosterConfig({ ...posterConfig, title: e.target.value })}
                placeholder="e.g. Flash Prop Discounts & VIP Perks"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Discount Tag / Reward
              </label>
              <input
                type="text"
                value={posterConfig.discountTag}
                onChange={(e) => setPosterConfig({ ...posterConfig, discountTag: e.target.value })}
                placeholder="e.g. UP TO 30% OFF"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={posterConfig.couponCode}
                onChange={(e) => setPosterConfig({ ...posterConfig, couponCode: e.target.value })}
                placeholder="e.g. EMPIRE"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 font-mono uppercase text-white font-bold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={posterConfig.buttonText}
                onChange={(e) => setPosterConfig({ ...posterConfig, buttonText: e.target.value })}
                placeholder="e.g. Claim Offer & Enroll Now"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Button Destination Link
              </label>
              <input
                type="text"
                value={posterConfig.buttonLink}
                onChange={(e) => setPosterConfig({ ...posterConfig, buttonLink: e.target.value })}
                placeholder="e.g. /deals or https://..."
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Poster Image URL
              </label>
              <input
                type="text"
                value={posterConfig.posterImageUrl || ''}
                onChange={(e) => setPosterConfig({ ...posterConfig, posterImageUrl: e.target.value })}
                placeholder="e.g. /posters/funded.jpg"
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Description / Offer Details
              </label>
              <textarea
                rows={2}
                value={posterConfig.subtitle}
                onChange={(e) => setPosterConfig({ ...posterConfig, subtitle: e.target.value })}
                placeholder="Detailed explanation of the promo offer..."
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Additional Benefits (One per line)
              </label>
              <textarea
                rows={2}
                value={(posterConfig.benefits || []).join('\n')}
                onChange={(e) =>
                  setPosterConfig({
                    ...posterConfig,
                    benefits: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  })
                }
                placeholder="Payout Protection&#10;Special Accounts (100% OFF)"
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-white focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Extra Note / Draw Information
            </label>
            <input
              type="text"
              value={posterConfig.extraNote || ''}
              onChange={(e) => setPosterConfig({ ...posterConfig, extraNote: e.target.value })}
              placeholder="e.g. Valid till Friday 5 PM EST."
              className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={handleResetPoster}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>

            <div className="flex items-center gap-3">
              {isPosterSaved && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved & Updated Live!
                </span>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Poster Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. Promo Codes & Discounts Manager */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Promo Codes & Discounts Manager</h1>
          <p className="text-xs text-slate-400">Manage verified coupon codes, affiliate URLs, categories, and descriptions.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon Code</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Create New Promo Code</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Select Prop Firm</label>
              <select
                value={firmId}
                onChange={(e) => setFirmId(e.target.value)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                {firms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="FLASH80"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="20"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="20% OFF Flash Deal"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Category Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="forex">Forex</option>
                <option value="futures">Futures</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Affiliate Referral Link URL</label>
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                placeholder="https://ftmo.com?ref=empirial"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold">Description / Coupon Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs">
            <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
              />
              <span>Featured Coupon</span>
            </label>
            <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
              />
              <span>Verified Coupon</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-elevation-card hover:bg-elevation-raised text-xs text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
            >
              Save Coupon Code
            </button>
          </div>
        </form>
      )}

      {/* Editing Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEdit}
            className="bg-elevation-modal border border-white/15 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyan-400" />
                <span>Edit Coupon Code: {editingDeal.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Select Prop Firm</label>
                <select
                  value={editingDeal.firm_id}
                  onChange={(e) => setEditingDeal({ ...editingDeal, firm_id: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {firms.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
                <input
                  type="text"
                  value={editingDeal.code}
                  onChange={(e) => setEditingDeal({ ...editingDeal, code: e.target.value })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount (%)</label>
                <input
                  type="number"
                  value={editingDeal.discount_pct}
                  onChange={(e) => setEditingDeal({ ...editingDeal, discount_pct: parseInt(e.target.value) || 0 })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount Label</label>
                <input
                  type="text"
                  value={editingDeal.discount_label}
                  onChange={(e) => setEditingDeal({ ...editingDeal, discount_label: e.target.value })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Category Type</label>
                <select
                  value={editingDeal.category}
                  onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value as any })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="forex">Forex</option>
                  <option value="futures">Futures</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Affiliate Referral Link URL</label>
                <input
                  type="url"
                  value={editingDeal.affiliate_url}
                  onChange={(e) => setEditingDeal({ ...editingDeal, affiliate_url: e.target.value })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Description / Coupon Details</label>
              <textarea
                value={editingDeal.description || ''}
                onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                rows={2}
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingDeal.is_featured}
                  onChange={(e) => setEditingDeal({ ...editingDeal, is_featured: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Featured Coupon</span>
              </label>
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingDeal.is_verified}
                  onChange={(e) => setEditingDeal({ ...editingDeal, is_verified: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Verified Coupon</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
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
                <td className="p-4 font-mono text-slate-400">{(d.clicks_count || 0).toLocaleString()}</td>
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(d)}
                    className="p-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
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
