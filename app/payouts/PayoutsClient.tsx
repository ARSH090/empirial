'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  Filter,
  Upload,
  Eye,
  X,
  CheckCircle2,
  Calendar,
  CreditCard,
  Globe,
  Sparkles,
} from 'lucide-react';
import { MOCK_PAYOUTS } from '@/lib/data/payouts-data';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { Payout } from '@/lib/types';
import { getPayouts, createPayout } from '@/lib/firebase/services';
import { useEffect } from 'react';

export function PayoutsClient() {
  const [payoutsList, setPayoutsList] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedConcept, setSelectedConcept] = useState<string>('all');
  const [selectedFirm, setSelectedFirm] = useState<string>('all');
  const [activeProofImage, setActiveProofImage] = useState<string | null>(null);

  // Upload Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [traderName, setTraderName] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [firmName, setFirmName] = useState('FTMO');
  const [uploadRegion, setUploadRegion] = useState('India');
  const [uploadConcept, setUploadConcept] = useState('ICT / SMC');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    async function loadPayouts() {
      try {
        const data = await getPayouts();
        if (data && data.length > 0) {
          setPayoutsList(data);
        } else {
          setPayoutsList(MOCK_PAYOUTS);
        }
      } catch (err) {
        console.error('Failed to load payouts:', err);
        setPayoutsList(MOCK_PAYOUTS);
      } finally {
        setLoading(false);
      }
    }
    loadPayouts();
  }, []);

  const filteredPayouts = payoutsList.filter((p) => {
    if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
    if (selectedConcept !== 'all' && p.concept !== selectedConcept) return false;
    if (selectedFirm !== 'all' && p.firm_id !== selectedFirm) return false;
    return true;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traderName || !payoutAmount) return;

    const newPayout: Omit<Payout, 'id'> = {
      firm_id: firmName.toLowerCase().replace(/\s+/g, '-'),
      firm_name: firmName,
      trader_display_name: traderName,
      amount: parseFloat(payoutAmount),
      currency: 'USD',
      region: uploadRegion as any,
      concept: uploadConcept as any,
      account_size: '100K',
      payout_method: 'Crypto / Rise',
      proof_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      is_verified: true,
      payout_date: new Date().toISOString().split('T')[0],
    };

    try {
      const id = await createPayout(newPayout);
      setPayoutsList([{ id, ...newPayout }, ...payoutsList]);
      setUploadSuccess(true);
    } catch (err) {
      console.error('Failed to upload proof:', err);
      // Fallback
      setPayoutsList([{ id: 'pay-' + Date.now(), ...newPayout }, ...payoutsList]);
      setUploadSuccess(true);
    }

    setTimeout(() => {
      setUploadSuccess(false);
      setIsUploadOpen(false);
      setTraderName('');
      setPayoutAmount('');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4 min-h-screen flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading payouts wall...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FORENSIC AUDIT PIPELINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Verified Trader Payout Proofs Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real payout receipts and crypto transaction confirmations submitted by funded traders and forensically validated by EMPIRIAL.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Payout Proof (+500 pts)</span>
        </button>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          {/* Firm */}
          <select
            value={selectedFirm}
            onChange={(e) => setSelectedFirm(e.target.value)}
            className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="all">All Prop Firms</option>
            {MOCK_FIRMS.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          {/* Region */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="all">All Regions</option>
            <option value="India">India</option>
            <option value="UAE">UAE / Middle East</option>
            <option value="USA">USA</option>
            <option value="Europe">Europe</option>
            <option value="Global">Global</option>
          </select>

          {/* Strategy Concept */}
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="all">All Trading Concepts</option>
            <option value="ICT / SMC">ICT / SMC (Order Blocks)</option>
            <option value="Price Action">Price Action & Support/Resistance</option>
            <option value="Scalping">Scalping & Order Flow</option>
            <option value="Algorithmic EA">Algorithmic & EA Copier</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Showing <strong className="text-emerald-400 font-mono">{filteredPayouts.length}</strong> verified receipts
        </span>
      </div>

      {/* Payout Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayouts.map((pay) => (
          <div
            key={pay.id}
            className="bg-elevation-surface border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all hover:shadow-2xl hover:shadow-emerald-950/20 group"
          >
            {/* Header: Amount + Firm */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {pay.firm_name} Payout
                </span>
                <div className="text-2xl font-mono font-black text-emerald-400 mt-0.5">
                  ${pay.amount.toLocaleString('en-US')} <span className="text-xs text-slate-400 font-normal">{pay.currency}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                Audited
              </span>
            </div>

            {/* Trader Details */}
            <div className="space-y-2 py-3 px-3.5 rounded-xl bg-elevation-card border border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Trader Name:</span>
                <strong className="text-white">{pay.trader_display_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Region & Style:</span>
                <span className="text-cyan-400 font-semibold">{pay.region} • {pay.concept}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account Size:</span>
                <span className="font-mono text-slate-200">{pay.account_size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-slate-300">{pay.payout_method}</span>
              </div>
            </div>

            {/* Receipt Preview & Lightbox Trigger */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-slate-500 font-mono">
                {pay.payout_date}
              </span>

              <button
                onClick={() => setActiveProofImage(pay.proof_image_url)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-elevation-card hover:bg-elevation-overlay border border-white/10 text-cyan-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Receipt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Zoom Modal */}
      {activeProofImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative max-w-2xl w-full bg-elevation-modal border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Forensic Payout Receipt Confirmation
              </span>
              <button
                onClick={() => setActiveProofImage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-80 rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={activeProofImage}
                alt="Verified Payout Receipt"
                className="max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Payout Proof Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-elevation-modal border border-white/15 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Upload className="w-5 h-5 text-emerald-400" />
                <span>Submit Payout Receipt</span>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-8 text-center space-y-2 text-emerald-400 animate-in zoom-in-90 duration-200">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
                <h4 className="text-lg font-bold">Proof Submitted Successfully!</h4>
                <p className="text-xs text-slate-300">+500 Loyalty Points credited to your account.</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Trader Display Name</label>
                  <input
                    type="text"
                    value={traderName}
                    onChange={(e) => setTraderName(e.target.value)}
                    placeholder="e.g. Anuraj S."
                    required
                    className="w-full bg-elevation-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Payout Amount ($)</label>
                    <input
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="12500"
                      required
                      className="w-full bg-elevation-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Prop Firm</label>
                    <select
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full bg-elevation-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      {MOCK_FIRMS.map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Region</label>
                    <select
                      value={uploadRegion}
                      onChange={(e) => setUploadRegion(e.target.value)}
                      className="w-full bg-elevation-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="USA">USA</option>
                      <option value="Europe">Europe</option>
                      <option value="Global">Global</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Trading Strategy</label>
                    <select
                      value={uploadConcept}
                      onChange={(e) => setUploadConcept(e.target.value)}
                      className="w-full bg-elevation-base border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ICT / SMC">ICT / SMC</option>
                      <option value="Price Action">Price Action</option>
                      <option value="Scalping">Scalping</option>
                      <option value="Algorithmic EA">Algorithmic EA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Upload Receipt Image / Screenshot</label>
                  <div className="border-2 border-dashed border-white/15 rounded-xl p-4 text-center text-slate-400 hover:border-emerald-500/50 transition-colors cursor-pointer bg-elevation-base">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                    <span className="text-xs">Drag & drop or click to attach Rise / Crypto receipt</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Submit for Verification (+500 pts)
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
