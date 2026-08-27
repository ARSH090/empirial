import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Operational Transparency & Anti-Bias Audit Standards | EMPIRIAL 2.0',
  description: 'Read our strict code of ethics, forensic audit pipeline standards, and editorial independence policy.',
};

export default function TransparencyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CODE OF ETHICS & INDEPENDENCE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Transparency & Audit Standards
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          How EMPIRIAL preserves uncompromised editorial integrity and eliminates deceptive prop firm practices.
        </p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-lg font-bold text-white">Our 4 Fundamental Commitments:</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">1. Zero Paid Placement in Comparative Rankings:</strong>
              Prop firms cannot buy higher rankings in our 13-column matrix, radar score terminals, or awards votes.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">2. Forensic Proof Verification:</strong>
              Every payout proof submitted requires multi-point cryptographic or banking validation before publishing.
            </div>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">3. Real-Time Liquidity Testing:</strong>
              We deploy automated live trade ping bots to audit slippage and spread widening during major market news sessions.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
