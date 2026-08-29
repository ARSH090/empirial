'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit, ShieldCheck, Check, X } from 'lucide-react';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { Firm } from '@/lib/types';
import { getFirms, createFirm, updateFirm, deleteFirm } from '@/lib/firebase/services';

export default function AdminFirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingFirm, setEditingFirm] = useState<Firm | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [trustScore, setTrustScore] = useState(90);
  const [allocation, setAllocation] = useState('$2,000,000');
  const [split, setSplit] = useState('Up to 90%');
  const [payout, setPayout] = useState('Bi-Weekly');
  const [discountLabel, setDiscountLabel] = useState('15% OFF');
  const [couponCode, setCouponCode] = useState('EMPIRIAL15');
  const [platforms, setPlatforms] = useState('MT5, cTrader');
  const [category, setCategory] = useState<'forex' | 'futures' | 'crypto'>('forex');
  const [foundedYear, setFoundedYear] = useState(2024);
  const [headquarters, setHeadquarters] = useState('Dubai, UAE');
  const [description, setDescription] = useState('Audited prop trading firm.');
  const [logoUrl, setLogoUrl] = useState('/logos/ftmo.svg');
  const [maxLossPct, setMaxLossPct] = useState(10);
  const [dailyLossPct, setDailyLossPct] = useState(5);
  const [profitTargetPct, setProfitTargetPct] = useState(8);
  const [minPrice, setMinPrice] = useState(99);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isVerified, setIsVerified] = useState(true);
  const [isPopular, setIsPopular] = useState(true);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds the 2MB limit.');
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/avif'].includes(file.type)) {
      alert('Invalid image format. Supported formats: PNG, JPG, JPEG, WEBP, AVIF, SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit && editingFirm) {
        setEditingFirm({
          ...editingFirm,
          logo_url: reader.result as string
        });
      } else {
        setLogoUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this firm profile?')) return;
    try {
      await deleteFirm(id);
      setFirms(firms.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete firm:', err);
      setFirms(firms.filter(f => f.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newFirm: Omit<Firm, 'id'> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      logo_url: logoUrl,
      rating: 4.8,
      review_count: 100,
      max_allocation: allocation,
      profit_split_custom: split,
      payout_custom: payout,
      discount_label_custom: discountLabel,
      coupon_code_custom: couponCode,
      platforms,
      category,
      is_featured: isFeatured,
      is_verified: isVerified,
      is_popular: isPopular,
      trust_score: trustScore,
      founded_year: foundedYear,
      headquarters,
      max_loss_pct: maxLossPct,
      daily_loss_pct: dailyLossPct,
      profit_target_pct: profitTargetPct,
      min_price: minPrice,
      description,
    };

    try {
      const id = await createFirm(newFirm);
      setFirms([{ id, ...newFirm }, ...firms]);
    } catch (err) {
      console.error('Failed to create firm:', err);
      setFirms([{ id: name.toLowerCase().replace(/\s+/g, '-'), ...newFirm }, ...firms]);
    }

    setIsAdding(false);
    resetForm();
  };

  const handleStartEdit = (firm: Firm) => {
    setEditingFirm(firm);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFirm) return;

    const updatedData: Partial<Firm> = {
      name: editingFirm.name,
      slug: editingFirm.name.toLowerCase().replace(/\s+/g, '-'),
      logo_url: editingFirm.logo_url,
      max_allocation: editingFirm.max_allocation,
      profit_split_custom: editingFirm.profit_split_custom,
      payout_custom: editingFirm.payout_custom,
      discount_label_custom: editingFirm.discount_label_custom,
      coupon_code_custom: editingFirm.coupon_code_custom,
      platforms: editingFirm.platforms,
      category: editingFirm.category,
      is_featured: editingFirm.is_featured,
      is_verified: editingFirm.is_verified,
      is_popular: editingFirm.is_popular,
      trust_score: editingFirm.trust_score,
      founded_year: editingFirm.founded_year,
      headquarters: editingFirm.headquarters,
      max_loss_pct: editingFirm.max_loss_pct,
      daily_loss_pct: editingFirm.daily_loss_pct,
      profit_target_pct: editingFirm.profit_target_pct,
      min_price: editingFirm.min_price,
      description: editingFirm.description,
    };

    try {
      await updateFirm(editingFirm.id, updatedData);
      setFirms(firms.map(f => f.id === editingFirm.id ? { ...f, ...updatedData } : f));
      setEditingFirm(null);
    } catch (err) {
      console.error('Failed to update firm:', err);
      setFirms(firms.map(f => f.id === editingFirm.id ? { ...f, ...updatedData } : f));
      setEditingFirm(null);
    }
  };

  const resetForm = () => {
    setName('');
    setAllocation('$2,000,000');
    setSplit('Up to 90%');
    setPayout('Bi-Weekly');
    setDiscountLabel('15% OFF');
    setCouponCode('EMPIRIAL15');
    setPlatforms('MT5, cTrader');
    setCategory('forex');
    setFoundedYear(2024);
    setHeadquarters('Dubai, UAE');
    setDescription('Audited prop trading firm.');
    setLogoUrl('/logos/ftmo.svg');
    setMaxLossPct(10);
    setDailyLossPct(5);
    setProfitTargetPct(8);
    setMinPrice(99);
    setTrustScore(90);
    setIsFeatured(true);
    setIsVerified(true);
    setIsPopular(true);
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
          <h1 className="text-xl font-semibold sm:text-2xl text-white">Prop Firms Directory Manager</h1>
          <p className="text-xs text-slate-400">Configure parent prop firm listings, ratings, trust scores, and specifications.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Firm</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Prop Firm Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Firm Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="FTMO"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Trust Score (out of 100)</label>
              <input
                type="number"
                value={trustScore}
                onChange={(e) => setTrustScore(parseInt(e.target.value))}
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Allocation</label>
              <input
                type="text"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
                placeholder="$2,000,000"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Split</label>
              <input
                type="text"
                value={split}
                onChange={(e) => setSplit(e.target.value)}
                placeholder="Up to 90%"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Payout Cycle</label>
              <input
                type="text"
                value={payout}
                onChange={(e) => setPayout(e.target.value)}
                placeholder="Bi-Weekly"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount Label</label>
              <input
                type="text"
                value={discountLabel}
                onChange={(e) => setDiscountLabel(e.target.value)}
                placeholder="15% OFF"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="EMPIRIAL15"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Platforms</label>
              <input
                type="text"
                value={platforms}
                onChange={(e) => setPlatforms(e.target.value)}
                placeholder="MT5, cTrader"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Category</label>
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
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Founded Year</label>
              <input
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(parseInt(e.target.value))}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Headquarters</label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="Prague, Czech Republic"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Minimum Price ($)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Loss Limit (%)</label>
              <input
                type="number"
                value={maxLossPct}
                onChange={(e) => setMaxLossPct(parseFloat(e.target.value))}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Daily Loss Limit (%)</label>
              <input
                type="number"
                value={dailyLossPct}
                onChange={(e) => setDailyLossPct(parseFloat(e.target.value))}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Target (%)</label>
              <input
                type="number"
                value={profitTargetPct}
                onChange={(e) => setProfitTargetPct(parseFloat(e.target.value))}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Firm Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(e)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold">Description</label>
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
              <span>Featured Listing</span>
            </label>
            <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
              />
              <span>Audited / Verified</span>
            </label>
            <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
              />
              <span>Popular Choice</span>
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
              Save Firm Profile
            </button>
          </div>
        </form>
      )}

      {/* Editing Firm Modal */}
      {editingFirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEdit}
            className="bg-elevation-modal border border-white/15 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <span>Edit Prop Firm Profile: {editingFirm.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingFirm(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Firm Name</label>
                <input
                  type="text"
                  value={editingFirm.name}
                  onChange={(e) => setEditingFirm({ ...editingFirm, name: e.target.value })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Trust Score (out of 100)</label>
                <input
                  type="number"
                  value={editingFirm.trust_score || 90}
                  onChange={(e) => setEditingFirm({ ...editingFirm, trust_score: parseInt(e.target.value) || 0 })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Allocation</label>
                <input
                  type="text"
                  value={editingFirm.max_allocation || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, max_allocation: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Split</label>
                <input
                  type="text"
                  value={editingFirm.profit_split_custom || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, profit_split_custom: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Payout Cycle</label>
                <input
                  type="text"
                  value={editingFirm.payout_custom || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, payout_custom: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount Label</label>
                <input
                  type="text"
                  value={editingFirm.discount_label_custom || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, discount_label_custom: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
                <input
                  type="text"
                  value={editingFirm.coupon_code_custom || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, coupon_code_custom: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Platforms</label>
                <input
                  type="text"
                  value={editingFirm.platforms || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, platforms: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Category</label>
                <select
                  value={editingFirm.category}
                  onChange={(e) => setEditingFirm({ ...editingFirm, category: e.target.value as any })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="forex">Forex</option>
                  <option value="futures">Futures</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Founded Year</label>
                <input
                  type="number"
                  value={editingFirm.founded_year || 0}
                  onChange={(e) => setEditingFirm({ ...editingFirm, founded_year: parseInt(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Headquarters</label>
                <input
                  type="text"
                  value={editingFirm.headquarters || ''}
                  onChange={(e) => setEditingFirm({ ...editingFirm, headquarters: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Minimum Price ($)</label>
                <input
                  type="number"
                  value={editingFirm.min_price || 0}
                  onChange={(e) => setEditingFirm({ ...editingFirm, min_price: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Loss Limit (%)</label>
                <input
                  type="number"
                  value={editingFirm.max_loss_pct || 0}
                  onChange={(e) => setEditingFirm({ ...editingFirm, max_loss_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Daily Loss Limit (%)</label>
                <input
                  type="number"
                  value={editingFirm.daily_loss_pct || 0}
                  onChange={(e) => setEditingFirm({ ...editingFirm, daily_loss_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Target (%)</label>
                <input
                  type="number"
                  value={editingFirm.profit_target_pct || 0}
                  onChange={(e) => setEditingFirm({ ...editingFirm, profit_target_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Replace Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, true)}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Description</label>
              <textarea
                value={editingFirm.description || ''}
                onChange={(e) => setEditingFirm({ ...editingFirm, description: e.target.value })}
                rows={2}
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingFirm.is_featured}
                  onChange={(e) => setEditingFirm({ ...editingFirm, is_featured: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Featured Listing</span>
              </label>
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingFirm.is_verified}
                  onChange={(e) => setEditingFirm({ ...editingFirm, is_verified: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Audited / Verified</span>
              </label>
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingFirm.is_popular}
                  onChange={(e) => setEditingFirm({ ...editingFirm, is_popular: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Popular Choice</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setEditingFirm(null)}
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

      {/* Firms Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Logo</th>
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
                <td className="p-4">
                  <div className="w-8 h-8 rounded-lg bg-elevation-card border border-white/5 flex items-center justify-center overflow-hidden">
                    <img src={f.logo_url} alt={f.name} className="object-contain max-w-full max-h-full p-1" />
                  </div>
                </td>
                <td className="p-4 font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span>{f.name}</span>
                    {f.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                </td>
                <td className="p-4 font-mono text-cyan-400 font-bold">{f.trust_score}/100</td>
                <td className="p-4 font-mono">{f.max_allocation}</td>
                <td className="p-4 font-mono text-emerald-400">{f.profit_split_custom}</td>
                <td className="p-4 font-mono text-purple-300">{f.coupon_code_custom}</td>
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(f)}
                    className="p-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
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
