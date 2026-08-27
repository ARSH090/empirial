'use client';

import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { MOCK_AWARDS } from '@/lib/data/awards-data';
import { Award as AwardType } from '@/lib/types';

export default function AdminAwardsPage() {
  const [awards, setAwards] = useState<AwardType[]>(MOCK_AWARDS);

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">Prop Industry Awards 2026 Manager</h1>
        <p className="text-xs text-slate-400">Configure award categories, nominees, and monitor live voting tallies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {awards.map((award) => {
          const total = award.nominated_firms.reduce((s, f) => s + f.votes, 0);

          return (
            <div key={award.id} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{award.year} Category</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{award.category_name}</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{total.toLocaleString()} votes</span>
              </div>

              <div className="space-y-2">
                {award.nominated_firms.map((firm) => (
                  <div key={firm.firm_id} className="flex justify-between items-center p-2.5 rounded-xl bg-elevation-card border border-white/5 text-xs">
                    <span className="font-bold text-white">{firm.firm_name}</span>
                    <span className="font-mono text-amber-400 font-bold">{firm.votes.toLocaleString()} votes</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
