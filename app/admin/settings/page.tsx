'use client';

import React, { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('EMPIRIAL 2.0 (ANURAJ FX)');
  const [maintenance, setMaintenance] = useState(false);
  const [eventPopup, setEventPopup] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">System Settings & Configuration</h1>
        <p className="text-xs text-slate-400">Configure global metadata, event popup banners, and system parameters.</p>
      </div>

      <form onSubmit={handleSave} className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Platform Brand Title</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-elevation-base border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Event Popup Modal</span>
              <span className="text-[11px] text-slate-400">Show tournament registration banner on homepage load.</span>
            </div>
            <input
              type="checkbox"
              checked={eventPopup}
              onChange={(e) => setEventPopup(e.target.checked)}
              className="w-4 h-4 accent-purple-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Maintenance Mode</span>
              <span className="text-[11px] text-slate-400">Temporarily restrict public access during scheduled database migrations.</span>
            </div>
            <input
              type="checkbox"
              checked={maintenance}
              onChange={(e) => setMaintenance(e.target.checked)}
              className="w-4 h-4 accent-purple-500 rounded"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {saved && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs ml-auto shadow cursor-pointer"
          >
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
