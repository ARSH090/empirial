'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, CheckCircle2 } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/lib/firebase/services';

export default function AdminPageBuilderPage() {
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getSiteSettings();
        if (settings && settings.hero) {
          setHeadline(settings.hero.title || 'The Ultimate Prop Trading Intelligence Matrix');
          setSubtext(settings.hero.subtitle || 'Compare evaluation challenges, track forensic payout proofs, and unlock exclusive discounts.');
        }
      } catch (err) {
        console.error('Failed to load page settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSiteSettings({
        hero: {
          title: headline,
          subtitle: subtext
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save page settings:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading builder console...</p>
      </div>
    );
  }

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
