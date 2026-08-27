'use client';

import React from 'react';
import { Trophy, Medal, ShieldCheck, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { MOCK_PAYOUTS } from '@/lib/data/payouts-data';

export default function LeaderboardPage() {
  const leaderboardTraders = [
    { rank: 1, name: 'Anuraj S.', region: 'India', flag: '🇮🇳', firm: 'FTMO & The5ers', totalPayouts: '$148,500', passes: 8, badge: 'Grandmaster' },
    { rank: 2, name: 'Sarah Chen', region: 'Global', flag: '🇸🇬', firm: 'The5ers', totalPayouts: '$112,400', passes: 6, badge: 'Elite Pro' },
    { rank: 3, name: 'Marcus K.', region: 'UAE', flag: '🇦🇪', firm: 'Funding Pips', totalPayouts: '$94,200', passes: 7, badge: 'Elite Pro' },
    { rank: 4, name: 'David Miller', region: 'USA', flag: '🇺🇸', firm: 'Topstep', totalPayouts: '$81,600', passes: 5, badge: 'Futures Legend' },
    { rank: 5, name: 'Rohan Gupta', region: 'India', flag: '🇮🇳', firm: 'Alpha Capital', totalPayouts: '$67,800', passes: 4, badge: 'Pro Trader' },
    { rank: 6, name: 'Elena Rostova', region: 'Europe', flag: '🇩🇪', firm: 'FundedNext', totalPayouts: '$59,450', passes: 4, badge: 'Pro Trader' },
    { rank: 7, name: 'Liam Vance', region: 'UK', flag: '🇬🇧', firm: 'FTMO', totalPayouts: '$48,900', passes: 3, badge: 'Pro Trader' },
    { rank: 8, name: 'Kevin Lee', region: 'Global', flag: '🇨🇦', firm: 'E8 Markets', totalPayouts: '$42,300', passes: 3, badge: 'Funded' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>VERIFIED PERFORMANCE HALL OF FAME</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Trader Payout Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Rankings of the top-earning prop traders forensically audited across verified crypto hashes, Rise payment batches, and bank receipts.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 text-center order-2 md:order-1">
          <div className="w-12 h-12 rounded-full bg-slate-300/10 border border-slate-300/30 text-slate-200 flex items-center justify-center font-black text-lg mx-auto">
            2
          </div>
          <div>
            <span className="text-xl">{leaderboardTraders[1].flag}</span>
            <h3 className="text-lg font-bold text-white mt-1">{leaderboardTraders[1].name}</h3>
            <span className="text-xs text-slate-400">{leaderboardTraders[1].firm}</span>
          </div>
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase">Audited Payouts</span>
            <div className="text-xl font-mono font-black text-cyan-400 mt-0.5">{leaderboardTraders[1].totalPayouts}</div>
          </div>
        </div>

        {/* Rank 1 (Center Champion) */}
        <div className="bg-gradient-to-b from-amber-950/40 via-elevation-surface to-elevation-surface border-2 border-amber-400/50 rounded-3xl p-8 flex flex-col justify-between space-y-4 text-center order-1 md:order-2 shadow-2xl shadow-amber-500/10 scale-105">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black mx-auto">
            <Trophy className="w-4 h-4" />
            <span>#1 TOP AUDITED TRADER</span>
          </div>
          <div>
            <span className="text-2xl">{leaderboardTraders[0].flag}</span>
            <h3 className="text-2xl font-black text-white mt-1">{leaderboardTraders[0].name}</h3>
            <span className="text-xs text-amber-400 font-semibold">{leaderboardTraders[0].firm}</span>
          </div>
          <div className="p-4 rounded-xl bg-elevation-card border border-amber-400/20">
            <span className="text-[10px] text-slate-400 uppercase">Audited Payouts</span>
            <div className="text-3xl font-mono font-black text-amber-400 mt-0.5">{leaderboardTraders[0].totalPayouts}</div>
          </div>
        </div>

        {/* Rank 3 */}
        <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 text-center order-3">
          <div className="w-12 h-12 rounded-full bg-amber-700/10 border border-amber-700/30 text-amber-600 flex items-center justify-center font-black text-lg mx-auto">
            3
          </div>
          <div>
            <span className="text-xl">{leaderboardTraders[2].flag}</span>
            <h3 className="text-lg font-bold text-white mt-1">{leaderboardTraders[2].name}</h3>
            <span className="text-xs text-slate-400">{leaderboardTraders[2].firm}</span>
          </div>
          <div className="p-3 rounded-xl bg-elevation-card border border-white/5">
            <span className="text-[10px] text-slate-400 uppercase">Audited Payouts</span>
            <div className="text-xl font-mono font-black text-cyan-400 mt-0.5">{leaderboardTraders[2].totalPayouts}</div>
          </div>
        </div>
      </div>

      {/* Leaderboard Rankings Table */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-elevation-card/80 text-slate-400 uppercase font-bold text-[10px]">
                <th className="p-4 w-16">Rank</th>
                <th className="p-4">Trader</th>
                <th className="p-4">Country</th>
                <th className="p-4">Funded Firm</th>
                <th className="p-4">Challenges Passed</th>
                <th className="p-4">Trader Badge</th>
                <th className="p-4 text-right">Total Verified Payouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {leaderboardTraders.map((trader) => (
                <tr key={trader.rank} className="hover:bg-elevation-raised/60 transition-colors">
                  <td className="p-4 font-mono font-black text-slate-400">
                    #{trader.rank}
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap">
                    {trader.name}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="mr-1.5">{trader.flag}</span>
                    <span className="text-slate-300">{trader.region}</span>
                  </td>
                  <td className="p-4 text-cyan-400 font-semibold whitespace-nowrap">
                    {trader.firm}
                  </td>
                  <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                    {trader.passes} accounts
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-amber-300">
                      {trader.badge}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono font-black text-emerald-400 whitespace-nowrap text-sm">
                    {trader.totalPayouts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
