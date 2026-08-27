'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, Vote } from 'lucide-react';
import { MOCK_AWARDS } from '@/lib/data/awards-data';
import { Award } from '@/lib/types';
import { getAwards, submitAwardVote } from '@/lib/firebase/services';

export function AwardsClient() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedCategories, setVotedCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function loadAwards() {
      try {
        const data = await getAwards();
        if (data && data.length > 0) {
          setAwards(data);
        } else {
          setAwards(MOCK_AWARDS);
        }
      } catch (err) {
        console.error('Failed to load awards:', err);
        setAwards(MOCK_AWARDS);
      } finally {
        setLoading(false);
      }
    }
    loadAwards();
  }, []);

  const handleVote = async (awardId: string, firmId: string) => {
    if (votedCategories[awardId]) return;

    try {
      await submitAwardVote(awardId, firmId);
      
      setAwards(prev =>
        prev.map(a => {
          if (a.id === awardId) {
            return {
              ...a,
              nominated_firms: a.nominated_firms.map(f => {
                if (f.firm_id === firmId) {
                  return { ...f, votes: f.votes + 1 };
                }
                return f;
              }),
            };
          }
          return a;
        })
      );

      setVotedCategories({
        ...votedCategories,
        [awardId]: firmId,
      });
    } catch (err) {
      console.error('Failed to register vote in database:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-4 min-h-screen flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading voting categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>ANNUAL TRADER CHOICE AWARDS 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prop Trading Industry Awards 2026
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Cast your authenticated community votes for the best prop trading institutions, fastest payouts, and superior execution conditions.
        </p>
      </div>

      {/* Awards Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {awards.map((award) => {
          const totalVotes = award.nominated_firms.reduce((sum, f) => sum + f.votes, 0);
          const hasVoted = votedCategories[award.id];

          return (
            <div
              key={award.id}
              className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  {award.year} Official Category
                </span>
                <h3 className="text-xl font-bold text-white leading-snug">
                  {award.category_name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {award.description}
                </p>
              </div>

              {/* Nominees Voting List */}
              <div className="space-y-3">
                {award.nominated_firms.map((firm) => {
                  const percentage = totalVotes > 0 ? Math.round((firm.votes / totalVotes) * 100) : 0;
                  const isUserPick = hasVoted === firm.firm_id;

                  return (
                    <div
                      key={firm.firm_id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isUserPick
                          ? 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/30'
                          : 'bg-elevation-card border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-white">
                          {firm.firm_name}
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {percentage}% ({firm.votes.toLocaleString()} votes)
                        </span>
                      </div>

                      {/* Animated Voting Progress Bar */}
                      <div className="w-full bg-elevation-base h-2 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {/* Vote Trigger Button */}
                      {!hasVoted ? (
                        <button
                          onClick={() => handleVote(award.id, firm.firm_id)}
                          className="w-full py-1.5 rounded-xl bg-elevation-raised hover:bg-white/10 text-white hover:text-amber-400 font-bold text-xs border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Vote className="w-3.5 h-3.5" />
                          <span>Cast Vote</span>
                        </button>
                      ) : isUserPick ? (
                        <div className="text-[11px] font-bold text-amber-400 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Your Pick</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Total votes footer */}
              <div className="pt-2 border-t border-white/5 flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Total Authenticated Votes:</span>
                <strong className="text-slate-300">{totalVotes.toLocaleString()}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
