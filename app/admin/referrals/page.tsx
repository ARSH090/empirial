"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ArrowUpRight, 
  Search, 
  ArrowUpDown, 
  Calendar, 
  User, 
  Link as LinkIcon, 
  X,
  FileText,
  Percent,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getAdminReferralStats } from '@/lib/firebase/services';

export default function AdminReferralPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  // Tab state: 'referrers' | 'leads'
  const [activeTab, setActiveTab] = useState<'referrers' | 'leads'>('referrers');
  
  // Referrers Filters & Sorting
  const [referrerSearch, setReferrerSearch] = useState('');
  const [referrerSortField, setReferrerSortField] = useState<'visitors' | 'registrations' | 'conversionRate'>('registrations');
  const [referrerSortOrder, setReferrerSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Leads Filters
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<'ALL' | 'REGISTERED' | 'NOT REGISTERED'>('ALL');
  
  // Detail View State
  const [selectedReferrer, setSelectedReferrer] = useState<any>(null);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const stats = await getAdminReferralStats();
      setData(stats);
    } catch (err) {
      console.error('Failed to load admin referral stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered and sorted Referrers List
  const processedReferrers = useMemo(() => {
    if (!data?.referrers) return [];
    
    // Search filter
    let list = data.referrers.filter((r: any) => 
      r.name.toLowerCase().includes(referrerSearch.toLowerCase()) || 
      r.code.toLowerCase().includes(referrerSearch.toLowerCase()) ||
      r.uid.toLowerCase().includes(referrerSearch.toLowerCase())
    );
    
    // Sorting
    list.sort((a: any, b: any) => {
      let aVal = a[referrerSortField];
      let bVal = b[referrerSortField];
      
      if (aVal < bVal) return referrerSortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return referrerSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return list;
  }, [data, referrerSearch, referrerSortField, referrerSortOrder]);

  // Filtered Leads List
  const processedLeads = useMemo(() => {
    if (!data?.leads) return [];
    
    return data.leads.filter((l: any) => {
      // Status filter
      if (leadStatusFilter !== 'ALL' && l.status !== leadStatusFilter) return false;
      
      // Search filter
      const searchLower = leadSearch.toLowerCase();
      return (
        l.visitorId.toLowerCase().includes(searchLower) ||
        l.referredByCode.toLowerCase().includes(searchLower) ||
        l.referredByName.toLowerCase().includes(searchLower) ||
        l.name.toLowerCase().includes(searchLower)
      );
    });
  }, [data, leadSearch, leadStatusFilter]);

  // Handle Sort Change
  const handleSort = (field: 'visitors' | 'registrations' | 'conversionRate') => {
    if (referrerSortField === field) {
      setReferrerSortOrder(referrerSortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setReferrerSortField(field);
      setReferrerSortOrder('desc');
    }
  };

  // Referrer Detail info modal helper
  const handleSelectReferrer = (referrer: any) => {
    if (!data?.leads) return;
    
    // Find all leads associated with this referrer
    const referrerLeads = data.leads.filter((l: any) => l.referredByUid === referrer.uid);
    setSelectedReferrer({
      ...referrer,
      leads: referrerLeads
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
        <span className="text-xs text-zinc-500 font-mono">Loading referral intelligence...</span>
      </div>
    );
  }

  const overallVisitors = data?.totalVisitors || 0;
  const overallRegistrations = data?.totalRegistrations || 0;
  const activeReferrersCount = data?.activeReferrers || 0;
  const overallConversionRate = data?.conversionRate || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Header (B&W Typography) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
            Referral & Lead Tracking
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Audit landing page visitor attributions, registration conversions, and referrer statistics.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* 2. Metrics Grid (Strict B&W styling, tight numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Visitors */}
        <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-800 space-y-1.5">
          <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Referral Visitors</span>
          <div className="text-3xl font-bold tracking-tight text-white">
            {overallVisitors.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Unique inbound landing hits</p>
        </div>

        {/* Registrations */}
        <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-800 space-y-1.5">
          <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Referred Signups</span>
          <div className="text-3xl font-bold tracking-tight text-white">
            {overallRegistrations.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Connected Firebase user accounts</p>
        </div>

        {/* Active Referrers */}
        <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-800 space-y-1.5">
          <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Active Referrers</span>
          <div className="text-3xl font-bold tracking-tight text-white">
            {activeReferrersCount.toLocaleString()}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Users driving inbound visitors</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-6 rounded-[24px] bg-zinc-950 border border-zinc-800 space-y-1.5">
          <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Conversion Rate</span>
          <div className="text-3xl font-bold tracking-tight text-white font-mono">
            {overallConversionRate.toFixed(2)}%
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">Attributed Signups / Total Visits</p>
        </div>

      </div>

      {/* 3. Section Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => { setActiveTab('referrers'); setSelectedReferrer(null); }}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'referrers' 
              ? 'border-white text-white font-extrabold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Referrers List ({processedReferrers.length})
        </button>
        <button
          onClick={() => { setActiveTab('leads'); setSelectedReferrer(null); }}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'leads' 
              ? 'border-white text-white font-extrabold' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          All Referral Leads ({processedLeads.length})
        </button>
      </div>

      {/* 4. Tab Content */}
      <div className="space-y-4">
        
        {activeTab === 'referrers' && (
          <div className="space-y-4">
            
            {/* Search Filter bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search referrers by name, ID or code..."
                  value={referrerSearch}
                  onChange={(e) => setReferrerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-900/30">
                      <th className="p-4">Referrer Profile</th>
                      <th className="p-4">Referral Code</th>
                      <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('visitors')}>
                        <div className="flex items-center gap-1.5">
                          <span>Total Visitors</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('registrations')}>
                        <div className="flex items-center gap-1.5">
                          <span>Registrations</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-4 cursor-pointer hover:text-white" onClick={() => handleSort('conversionRate')}>
                        <div className="flex items-center gap-1.5">
                          <span>Conversion Rate</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-xs">
                    {processedReferrers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono">
                          No active referrers found matching query.
                        </td>
                      </tr>
                    ) : (
                      processedReferrers.map((r: any) => (
                        <tr 
                          key={r.uid} 
                          onClick={() => handleSelectReferrer(r)}
                          className="hover:bg-zinc-900/40 cursor-pointer transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-bold text-white">{r.name}</div>
                            <div className="text-[10px] text-zinc-500 font-mono max-w-[150px] truncate">{r.uid}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-white">
                              {r.code}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-white font-mono">{r.visitors.toLocaleString()}</td>
                          <td className="p-4 font-semibold text-white font-mono">{r.registrations.toLocaleString()}</td>
                          <td className="p-4 font-semibold text-white font-mono">{r.conversionRate.toFixed(1)}%</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSelectReferrer(r); }}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-white rounded-lg transition-colors"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Search Filter bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search leads by visitor ID, referrer name/code..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 self-stretch sm:self-auto bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                {(['ALL', 'REGISTERED', 'NOT REGISTERED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setLeadStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      leadStatusFilter === status
                        ? 'bg-white text-black font-extrabold shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {status.replace(' ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-900/30">
                      <th className="p-4">Visitor Tracking ID</th>
                      <th className="p-4">Landing Attribution</th>
                      <th className="p-4">Attributed Referrer</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">First Landing Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800 text-xs">
                    {processedLeads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500 font-mono">
                          No referral leads matching filter criteria.
                        </td>
                      </tr>
                    ) : (
                      processedLeads.map((l: any) => (
                        <tr key={l.visitorId} className="hover:bg-zinc-900/20">
                          <td className="p-4 font-mono text-[11px] text-zinc-300">{l.visitorId}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-white">
                              {l.referredByCode}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-white">{l.referredByName}</div>
                            <div className="text-[10px] text-zinc-500 font-mono max-w-[120px] truncate">{l.referredByUid}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              l.status === 'REGISTERED' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono text-[11px] text-zinc-400">
                            {new Date(l.visitedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. Referrer Detail Modal Panel */}
      {selectedReferrer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Referrer Intelligence File</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">UID: {selectedReferrer.uid}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReferrer(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Profile Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/20 p-5 rounded-2xl border border-zinc-800/80">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Identity & Link details</span>
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400">Referrer Name:</span>
                    <p className="text-sm font-extrabold text-white">{selectedReferrer.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-400">Referral Code:</span>
                    <div>
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-white">
                        {selectedReferrer.code}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Conversion Metrics</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-zinc-500 block">Visitors</span>
                      <span className="text-sm font-bold text-white font-mono">{selectedReferrer.visitors}</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-zinc-500 block">Signups</span>
                      <span className="text-sm font-bold text-white font-mono">{selectedReferrer.registrations}</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-zinc-500 block">Rate</span>
                      <span className="text-sm font-bold text-white font-mono">{selectedReferrer.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referred Leads List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Referred Leads Activity Log</h4>
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-[9px] font-bold text-zinc-400 uppercase bg-zinc-900/40">
                          <th className="p-3">Visitor ID</th>
                          <th className="p-3">Visitor Name</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Landing Visit Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800 text-[11px] font-mono">
                        {selectedReferrer.leads.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-zinc-500">
                              No landing visits logged for this referrer.
                            </td>
                          </tr>
                        ) : (
                          selectedReferrer.leads.map((l: any) => (
                            <tr key={l.visitorId} className="hover:bg-zinc-900/10">
                              <td className="p-3 text-zinc-400">{l.visitorId}</td>
                              <td className="p-3 text-white font-sans font-medium">{l.name}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  l.status === 'REGISTERED' 
                                    ? 'bg-emerald-500/15 text-emerald-400' 
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}>
                                  {l.status}
                                </span>
                              </td>
                              <td className="p-3 text-right text-zinc-400">
                                {new Date(l.visitedAt).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-end bg-zinc-900/20">
              <button
                onClick={() => setSelectedReferrer(null)}
                className="px-4 py-2 border border-zinc-800 hover:bg-zinc-900 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer"
              >
                Close File
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
