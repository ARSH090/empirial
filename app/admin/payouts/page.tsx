'use client';

import React, { useState } from 'react';
import { DollarSign, CheckCircle2, XCircle, Trash2, Eye } from 'lucide-react';
import { MOCK_PAYOUTS } from '@/lib/data/payouts-data';
import { Payout } from '@/lib/types';

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>(MOCK_PAYOUTS);

  const handleApprove = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, is_verified: true } : p));
  };

  const handleReject = (id: string) => {
    setPayouts(payouts.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Payout Proofs Moderation Queue</h1>
        <p className="text-xs text-slate-400">Forensic review queue for approving, auditing, or rejecting user-uploaded payout receipts.</p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Trader & Firm</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Region & Concept</th>
              <th className="p-4">Payout Method</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-elevation-raised/60">
                <td className="p-4">
                  <div className="font-bold text-white">{p.trader_display_name}</div>
                  <div className="text-[10px] text-cyan-400 font-normal">{p.firm_name} ({p.account_size})</div>
                </td>
                <td className="p-4 font-mono font-black text-emerald-400 text-sm">
                  ${p.amount.toLocaleString()} {p.currency}
                </td>
                <td className="p-4 text-slate-300">
                  {p.region} • {p.concept}
                </td>
                <td className="p-4 text-slate-400">
                  {p.payout_method}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.is_verified
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }`}>
                    {p.is_verified ? 'Verified & Published' : 'Pending Audit'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {!p.is_verified && (
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-bold text-[11px]"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(p.id)}
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
