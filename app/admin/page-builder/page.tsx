'use client';

import React, { useState } from 'react';
import { Sliders, CheckCircle2 } from 'lucide-react';

export default function AdminPageBuilderPage() {
  const [headline, setHeadline] = useState('The Ultimate Prop Trading Intelligence Matrix');
  const [subtext, setSubtext] = useState('Compare 500+ evaluation challenges with 5-segment profit split gauges, track forensic payout proofs, and unlock exclusive discounts up to 80%.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Homepage Content & Page Builder CMS</h1>
        <p className="text-xs text-slate-400">Configure hero copy, trust metrics, and section ordering.</p>
      </div>

      <form onSubmit={handleSave} className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Hero Main Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full bg-elevation-base border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Hero Subtext</label>
          <textarea
            value={subtext}
            onChange={(e) => setSubtext(e.target.value)}
            rows={3}
            className="w-full bg-elevation-base border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Homepage content updated & cached!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs ml-auto shadow cursor-pointer"
          >
            Save Content Changes
          </button>
        </div>
      </form>
    </div>
  );
}
