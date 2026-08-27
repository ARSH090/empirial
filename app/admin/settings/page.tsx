'use client';

import React, { useState } from 'react';
import { Settings, CheckCircle2, Database, AlertTriangle } from 'lucide-react';
import { seedDatabase } from '@/lib/firebase/seeder';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('EMPIRIAL 2.0 (ANURAJ FX)');
  const [maintenance, setMaintenance] = useState(false);
  const [eventPopup, setEventPopup] = useState(true);
  const [saved, setSaved] = useState(false);

  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      await seedDatabase();
      setSeedSuccess(true);
    } catch (err) {
      console.error('Seeding failed:', err);
      alert('Firestore seeding failed. Please check console for configuration or authentication details.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Database Utility seeding block */}
      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-white">Database & Seeding Utilities</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          If your Cloud Firestore database collections are empty, trigger the automated seeding pipeline below to populate it with all pre-structured mock records for Firms, Challenges, Blog Guides, Tournaments, and Spread telemetry.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs">
          <div className="flex items-start gap-2 text-amber-400/90 leading-normal max-w-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Seeding will automatically create collections and write documents. It will check if documents already exist before writing to avoid duplicate keys.
            </span>
          </div>

          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1.5 ${
              seeding
                ? 'bg-amber-800 text-amber-300 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-black'
            }`}
          >
            {seeding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <span>Seed Firestore Database</span>
            )}
          </button>
        </div>

        {seedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All mock records successfully seeded into Firestore!</span>
          </div>
        )}
      </div>
    </div>
  );
}
