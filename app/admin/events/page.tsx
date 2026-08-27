'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Trophy, Gift, Radio, GraduationCap, Gamepad2, Sparkles, Building2, ShieldCheck, Check } from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/data/events-data';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { Event, EventCategory, GiveawaySubCategory, EventSubCategory, EventEntryType } from '@/lib/types';
import { getEvents, createEvent, deleteEvent, getFirms } from '@/lib/firebase/services';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [firmsList, setFirmsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('giveaway');
  const [subCategory, setSubCategory] = useState<string>('tournament');
  const [entryType, setEntryType] = useState<EventEntryType>('free');
  const [entryFee, setEntryFee] = useState<number>(0);
  
  // Firm Association Toggle
  const [isFirmSponsored, setIsFirmSponsored] = useState(true);
  const [selectedFirmId, setSelectedFirmId] = useState<string>('nys');
  const [independentHostName, setIndependentHostName] = useState('EMPIRIAL Official');
  
  const [prizePool, setPrizePool] = useState('$100,000 in Accounts + $10,000 Cash');
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('Starts in 7 Days');
  
  // Discord & Participation Tasks controls
  const [requiresDiscord, setRequiresDiscord] = useState(true);
  const [discordUrl, setDiscordUrl] = useState('https://discord.gg/empirial');
  const [enableTasks, setEnableTasks] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [tasksList, setTasksList] = useState<string[]>([
    'Join Official Discord Server',
    'Submit Platform Account ID & Verification',
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsData, firmsData] = await Promise.all([getEvents(), getFirms()]);
        setEvents(eventsData.length > 0 ? eventsData : MOCK_EVENTS);
        setFirmsList(firmsData.length > 0 ? firmsData : MOCK_FIRMS);
        if (firmsData.length > 0) {
          setSelectedFirmId(firmsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load events data:', err);
        setEvents(MOCK_EVENTS);
        setFirmsList(MOCK_FIRMS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete event:', err);
      // Fallback
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const firmObj = isFirmSponsored ? (firmsList.find((f) => f.id === selectedFirmId) || MOCK_FIRMS.find((f) => f.id === selectedFirmId)) : undefined;

    const newEv: Omit<Event, 'id'> = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      sub_category: subCategory,
      type: subCategory as any,
      entry_type: entryType,
      entry_fee: entryType === 'paid' ? Number(entryFee) : 0,
      is_firm_sponsored: isFirmSponsored,
      firm_id: isFirmSponsored ? selectedFirmId : undefined,
      firm_name: isFirmSponsored ? firmObj?.name : undefined,
      firm_logo: isFirmSponsored ? firmObj?.logo_url : undefined,
      host_name: isFirmSponsored ? (firmObj?.name || 'Partner Firm') : (independentHostName.trim() || 'EMPIRIAL Official'),
      host_firm: isFirmSponsored ? (firmObj?.name || 'Partner Firm') : undefined,
      prize_pool: prizePool.trim(),
      poster_url: posterUrl.trim() || 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 86400000).toISOString(),
      countdown_label: countdownLabel.trim() || 'Active Now',
      participants_count: 0,
      max_participants: 2000,
      popularity_score: 85,
      created_at: new Date().toISOString().split('T')[0],
      registration_url: '#',
      is_active: true,
      description: description.trim() || 'Official prop trading opportunity.',
      requires_discord: requiresDiscord,
      discord_url: requiresDiscord ? discordUrl.trim() : undefined,
      registration_tasks: enableTasks && tasksList.length > 0
        ? tasksList.map((t, idx) => ({
            id: `t-admin-${Date.now()}-${idx}`,
            title: t,
            type: t.toLowerCase().includes('discord') ? 'discord' : 'form',
            action_url: t.toLowerCase().includes('discord') ? discordUrl : undefined,
          }))
        : undefined,
    };

    try {
      const id = await createEvent(newEv);
      setEvents([{ id, ...newEv }, ...events]);
    } catch (err) {
      console.error('Failed to create event:', err);
      // Fallback
      setEvents([{ id: 'ev-' + Date.now(), ...newEv }, ...events]);
    }

    setIsAdding(false);
    setTitle('');
    setPosterUrl('');
    setDescription('');
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs text-zinc-400 font-mono">Loading events database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Events & Giveaways Coordinator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage trading tournaments, gaming contests, learn & crack challenges, live sessions, and bootcamps.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'New Event / Giveaway'}</span>
        </button>
      </div>

      {/* Add New Event Form (Black & White Theme) */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-foreground">Create New Event or Giveaway</h3>
            <p className="text-xs text-muted-foreground">Configure firm sponsorship, entry pricing, subcategories, and rewards.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World Prop Trading League 2026"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white"
              />
            </div>

            {/* Main Category */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Main Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as EventCategory;
                  setCategory(cat);
                  setSubCategory(cat === 'giveaway' ? 'tournament' : 'live-session');
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white"
              >
                <option value="giveaway">Giveaway</option>
                <option value="event">Event</option>
              </select>
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Subcategory</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white"
              >
                {category === 'giveaway' ? (
                  <>
                    <option value="tournament">Trading Tournaments</option>
                    <option value="gaming">Gaming Contests</option>
                    <option value="learn-crack">Learn & Crack</option>
                  </>
                ) : (
                  <>
                    <option value="live-session">Live Sessions</option>
                    <option value="bootcamp">Bootcamps</option>
                  </>
                )}
              </select>
            </div>

            {/* Entry Type */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Entry Type & Cost</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as EventEntryType)}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="free">Free Entry</option>
                  <option value="paid">Paid Entry</option>
                </select>

                {entryType === 'paid' ? (
                  <input
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(Number(e.target.value))}
                    placeholder="Fee ($)"
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground"
                  />
                ) : (
                  <div className="flex items-center px-3 py-2 text-xs text-muted-foreground bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                    $0 (Free)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Firm Association Option (Requirement 3) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">Firm Association Option</span>
                <span className="text-[11px] text-muted-foreground">Select whether this event is co-sponsored by a specific firm or independently hosted.</span>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs">
                <button
                  type="button"
                  onClick={() => setIsFirmSponsored(true)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    isFirmSponsored ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  Associated Firm
                </button>
                <button
                  type="button"
                  onClick={() => setIsFirmSponsored(false)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    !isFirmSponsored ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs' : 'text-muted-foreground'
                  }`}
                >
                  Independent Host
                </button>
              </div>
            </div>

            {isFirmSponsored ? (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Select Partner Prop Firm</label>
                <select
                  value={selectedFirmId}
                  onChange={(e) => setSelectedFirmId(e.target.value)}
                  className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-foreground"
                >
                  {MOCK_FIRMS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.headquarters || 'Global'})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Independent Host / Academy Name</label>
                <input
                  type="text"
                  value={independentHostName}
                  onChange={(e) => setIndependentHostName(e.target.value)}
                  placeholder="e.g. EMPIRIAL Quant Lab, Global FX Summit, ICT Academy"
                  className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-foreground"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Prize Pool / Reward</label>
              <input
                type="text"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="e.g. $250,000 in Accounts + $50,000 Cash"
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Countdown / Timing Label</label>
              <input
                type="text"
                value={countdownLabel}
                onChange={(e) => setCountdownLabel(e.target.value)}
                placeholder="e.g. Starts in 5 Days"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-foreground"
              />
            </div>
          </div>

          {/* Discord Requirement & Custom Entry Tasks Controls (Points 1 & 2) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-foreground block">Require Discord Server Join</span>
                <span className="text-[11px] text-muted-foreground">User must join Discord to participate (Point 1).</span>
              </div>
              <input
                type="checkbox"
                checked={requiresDiscord}
                onChange={(e) => setRequiresDiscord(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </div>

            {requiresDiscord && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Discord Invite URL</label>
                <input
                  type="text"
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.gg/your-server"
                  className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-foreground"
                />
              </div>
            )}

            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-foreground block">Custom Participation Tasks</span>
                  <span className="text-[11px] text-muted-foreground">If enabled, tasks will be shown to users. If disabled, tasks column is omitted! (Point 2)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableTasks(!enableTasks)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    enableTasks ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-zinc-200 dark:bg-zinc-800 text-muted-foreground'
                  }`}
                >
                  {enableTasks ? 'Tasks Enabled' : 'No Tasks (Omitted)'}
                </button>
              </div>

              {enableTasks && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Add task e.g. Retweet Competition Announcement"
                      className="flex-1 bg-white dark:bg-card border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTaskTitle.trim()) {
                          setTasksList([...tasksList, newTaskTitle.trim()]);
                          setNewTaskTitle('');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs cursor-pointer"
                    >
                      Add Task
                    </button>
                  </div>

                  {tasksList.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {tasksList.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 text-xs">
                          <span className="font-semibold text-foreground">{t}</span>
                          <button
                            type="button"
                            onClick={() => setTasksList(tasksList.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:underline text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">Event Description & Rules</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide competition details, eligibility, target drawdown, and platform specifications..."
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-xs text-foreground"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs shadow-xs"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      )}

      {/* Events Table (Strictly RULE:BW) */}
      <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 text-muted-foreground uppercase font-semibold text-[11px]">
                <th className="p-4">Opportunity</th>
                <th className="p-4">Category</th>
                <th className="p-4">Host / Firm</th>
                <th className="p-4">Prize Pool / Value</th>
                <th className="p-4">Entry</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-foreground">{ev.title}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{ev.countdown_label}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-foreground border border-zinc-200/80 dark:border-zinc-700">
                      {ev.category} • {ev.sub_category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ev.is_firm_sponsored && ev.firm_logo ? (
                        <img src={ev.firm_logo} alt={ev.host_name} className="w-4 h-4 object-contain rounded" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-foreground shrink-0" />
                      )}
                      <span className="font-medium text-foreground">{ev.host_name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-foreground font-mono">{ev.prize_pool}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      ev.entry_type === 'free' ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground' : 'bg-black text-white dark:bg-white dark:text-black'
                    }`}>
                      {ev.entry_type === 'free' ? 'Free' : `$${ev.entry_fee}`}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(ev.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
