'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Plus, Trash2, Edit, X } from 'lucide-react';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { Firm, Challenge } from '@/lib/types';
import { getChallenges, getFirms, createChallenge, updateChallenge, deleteChallenge } from '@/lib/firebase/services';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  // Form States
  const [firmId, setFirmId] = useState('');
  const [name, setName] = useState('');
  const [size, setSize] = useState(100000);
  const [steps, setSteps] = useState(2);
  const [price, setPrice] = useState(499);
  const [originalPrice, setOriginalPrice] = useState(599);
  const [split, setSplit] = useState(90);
  const [dailyLoss, setDailyLoss] = useState(5);
  const [maxLoss, setMaxLoss] = useState(10);
  const [target, setTarget] = useState(8);
  const [minDays, setMinDays] = useState(0);
  const [maxDays, setMaxDays] = useState('Unlimited');
  const [payoutFreq, setPayoutFreq] = useState('Bi-Weekly');
  const [leverage, setLeverage] = useState('1:100');
  const [refundableFee, setRefundableFee] = useState(true);
  const [buyUrl, setBuyUrl] = useState('https://ftmo.com?ref=empirial');
  const [couponCode, setCouponCode] = useState('EMPIRIAL10');
  const [discountPct, setDiscountPct] = useState(10);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [category, setCategory] = useState<'forex' | 'futures' | 'crypto'>('forex');
  const [lossType, setLossType] = useState<'Static' | 'Trailing'>('Static');

  useEffect(() => {
    async function loadData() {
      try {
        const [challsData, firmsData] = await Promise.all([getChallenges(), getFirms()]);
        if (challsData && challsData.length > 0) {
          setChallenges(challsData);
        } else {
          setChallenges(MOCK_CHALLENGES);
        }
        if (firmsData && firmsData.length > 0) {
          setFirms(firmsData);
          setFirmId(firmsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load challenges database:', err);
        setChallenges(MOCK_CHALLENGES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge tier?')) return;
    try {
      await deleteChallenge(id);
      setChallenges(challenges.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete challenge:', err);
      setChallenges(challenges.filter(c => c.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !firmId) return;

    const selectedFirm = firms.find(f => f.id === firmId);
    if (!selectedFirm) return;

    const newChallenge: Omit<Challenge, 'id'> = {
      firm_id: selectedFirm.id,
      firm_name: selectedFirm.name,
      firm_slug: selectedFirm.slug,
      name,
      account_size: size,
      steps,
      price,
      original_price: originalPrice,
      profit_split_pct: split,
      daily_loss_limit_pct: dailyLoss,
      max_loss_limit_pct: maxLoss,
      profit_target_pct: target,
      min_trading_days: minDays,
      max_trading_days: maxDays,
      payout_frequency: payoutFreq,
      leverage,
      refundable_fee: refundableFee,
      buy_url: buyUrl,
      coupon_code: couponCode,
      discount_pct: discountPct,
      is_featured: isFeatured,
      is_best_seller: isBestSeller,
      category,
      loss_type: lossType
    };

    try {
      const id = await createChallenge(newChallenge);
      setChallenges([{ id, ...newChallenge }, ...challenges]);
    } catch (err) {
      console.error('Failed to create challenge:', err);
      setChallenges([{ id: 'ch-' + Date.now(), ...newChallenge }, ...challenges]);
    }

    setIsAdding(false);
    resetForm();
  };

  const handleStartEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChallenge) return;

    const selectedFirm = firms.find(f => f.id === editingChallenge.firm_id);
    const updatedData: Partial<Challenge> = {
      firm_id: editingChallenge.firm_id,
      firm_name: selectedFirm?.name || editingChallenge.firm_name,
      firm_slug: selectedFirm?.slug || editingChallenge.firm_slug,
      name: editingChallenge.name,
      account_size: editingChallenge.account_size,
      steps: editingChallenge.steps,
      price: editingChallenge.price,
      original_price: editingChallenge.original_price,
      profit_split_pct: editingChallenge.profit_split_pct,
      daily_loss_limit_pct: editingChallenge.daily_loss_limit_pct,
      max_loss_limit_pct: editingChallenge.max_loss_limit_pct,
      profit_target_pct: editingChallenge.profit_target_pct,
      min_trading_days: editingChallenge.min_trading_days,
      max_trading_days: editingChallenge.max_trading_days,
      payout_frequency: editingChallenge.payout_frequency,
      leverage: editingChallenge.leverage,
      refundable_fee: editingChallenge.refundable_fee,
      buy_url: editingChallenge.buy_url,
      coupon_code: editingChallenge.coupon_code,
      discount_pct: editingChallenge.discount_pct,
      is_featured: editingChallenge.is_featured,
      is_best_seller: editingChallenge.is_best_seller,
      category: editingChallenge.category,
      loss_type: editingChallenge.loss_type
    };

    try {
      await updateChallenge(editingChallenge.id, updatedData);
      setChallenges(challenges.map(c => c.id === editingChallenge.id ? { ...c, ...updatedData } : c));
      setEditingChallenge(null);
    } catch (err) {
      console.error('Failed to update challenge:', err);
      setChallenges(challenges.map(c => c.id === editingChallenge.id ? { ...c, ...updatedData } : c));
      setEditingChallenge(null);
    }
  };

  const resetForm = () => {
    setName('');
    setSize(100000);
    setSteps(2);
    setPrice(499);
    setOriginalPrice(599);
    setSplit(90);
    setDailyLoss(5);
    setMaxLoss(10);
    setTarget(8);
    setMinDays(0);
    setMaxDays('Unlimited');
    setPayoutFreq('Bi-Weekly');
    setLeverage('1:100');
    setRefundableFee(true);
    setBuyUrl('https://ftmo.com?ref=empirial');
    setCouponCode('EMPIRIAL10');
    setDiscountPct(10);
    setIsFeatured(true);
    setIsBestSeller(false);
    setCategory('forex');
    setLossType('Static');
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
          <h1 className="text-xl font-semibold sm:text-2xl text-white">Evaluation Challenges Manager</h1>
          <p className="text-xs text-slate-400">Configure prices, steps, targets, loss thresholds, buy links, and affiliate details.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Challenge Tier</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Create Challenge Evaluation Tier</h3>
          
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
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Challenge Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="100K Stellar"
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Account Size ($)</label>
              <input
                type="number"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value) || 0)}
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Steps</label>
              <select
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value={0}>Instant Funding (0-Step)</option>
                <option value={1}>1-Step Challenge</option>
                <option value={2}>2-Step Challenge</option>
                <option value={3}>3-Step Challenge</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                required
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Split (%)</label>
              <input
                type="number"
                value={split}
                onChange={(e) => setSplit(parseInt(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Leverage</label>
              <input
                type="text"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                placeholder="1:100"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Daily Loss Limit (%)</label>
              <input
                type="number"
                value={dailyLoss}
                onChange={(e) => setDailyLoss(parseFloat(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Loss Limit (%)</label>
              <input
                type="number"
                value={maxLoss}
                onChange={(e) => setMaxLoss(parseFloat(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Target (%)</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Loss Type Model</label>
              <select
                value={lossType}
                onChange={(e) => setLossType(e.target.value as any)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Static">Static / Balance Base</option>
                <option value="Trailing">Trailing Drawdown</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Payout Frequency</label>
              <input
                type="text"
                value={payoutFreq}
                onChange={(e) => setPayoutFreq(e.target.value)}
                placeholder="Bi-Weekly"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="EMPIRE"
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount (%)</label>
              <input
                type="number"
                value={discountPct}
                onChange={(e) => setDiscountPct(parseInt(e.target.value) || 0)}
                className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold">Buy Affiliate Link URL</label>
            <input
              type="url"
              value={buyUrl}
              onChange={(e) => setBuyUrl(e.target.value)}
              placeholder="https://ftmo.com?ref=empirial"
              required
              className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
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
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
              />
              <span>Best Seller Badge</span>
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
              Create Challenge Tier
            </button>
          </div>
        </form>
      )}

      {/* Editing Challenge Modal */}
      {editingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEdit}
            className="bg-elevation-modal border border-white/15 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                <span>Edit Challenge Tier: {editingChallenge.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingChallenge(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Select Prop Firm</label>
                <select
                  value={editingChallenge.firm_id}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, firm_id: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {firms.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Challenge Name</label>
                <input
                  type="text"
                  value={editingChallenge.name}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, name: e.target.value })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Account Size ($)</label>
                <input
                  type="number"
                  value={editingChallenge.account_size}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, account_size: parseInt(e.target.value) || 0 })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Steps</label>
                <select
                  value={editingChallenge.steps}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, steps: parseInt(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value={0}>Instant Funding (0-Step)</option>
                  <option value={1}>1-Step Challenge</option>
                  <option value={2}>2-Step Challenge</option>
                  <option value={3}>3-Step Challenge</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Price ($)</label>
                <input
                  type="number"
                  value={editingChallenge.price}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, price: parseFloat(e.target.value) || 0 })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Original Price ($)</label>
                <input
                  type="number"
                  value={editingChallenge.original_price}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, original_price: parseFloat(e.target.value) || 0 })}
                  required
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Split (%)</label>
                <input
                  type="number"
                  value={editingChallenge.profit_split_pct}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, profit_split_pct: parseInt(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Leverage</label>
                <input
                  type="text"
                  value={editingChallenge.leverage || ''}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, leverage: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Daily Loss Limit (%)</label>
                <input
                  type="number"
                  value={editingChallenge.daily_loss_limit_pct}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, daily_loss_limit_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Max Loss Limit (%)</label>
                <input
                  type="number"
                  value={editingChallenge.max_loss_limit_pct}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, max_loss_limit_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Profit Target (%)</label>
                <input
                  type="number"
                  value={editingChallenge.profit_target_pct}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, profit_target_pct: parseFloat(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Loss Type Model</label>
                <select
                  value={editingChallenge.loss_type || 'Static'}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, loss_type: e.target.value as any })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Static">Static / Balance Base</option>
                  <option value="Trailing">Trailing Drawdown</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Category Type</label>
                <select
                  value={editingChallenge.category}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, category: e.target.value as any })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="forex">Forex</option>
                  <option value="futures">Futures</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Payout Frequency</label>
                <input
                  type="text"
                  value={editingChallenge.payout_frequency || ''}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, payout_frequency: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Coupon Code</label>
                <input
                  type="text"
                  value={editingChallenge.coupon_code || ''}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, coupon_code: e.target.value })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Discount (%)</label>
                <input
                  type="number"
                  value={editingChallenge.discount_pct || 0}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, discount_pct: parseInt(e.target.value) || 0 })}
                  className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1">
              <label className="text-[10px] text-slate-400 uppercase font-semibold">Buy Affiliate Link URL</label>
              <input
                type="url"
                value={editingChallenge.buy_url}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, buy_url: e.target.value })}
                required
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingChallenge.is_featured}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, is_featured: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Featured Listing</span>
              </label>
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingChallenge.is_best_seller}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, is_best_seller: e.target.checked })}
                  className="rounded border-zinc-700 text-purple-500 focus:ring-0 bg-transparent"
                />
                <span>Best Seller Badge</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setEditingChallenge(null)}
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
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(c)}
                    className="p-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
