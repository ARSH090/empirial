'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit, Trophy, Gift, ShieldCheck, Check, X } from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/data/events-data';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { Event, EventCategory, EventEntryType } from '@/lib/types';
import { getEvents, createEvent, updateEvent, deleteEvent, getFirms } from '@/lib/firebase/services';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [firmsList, setFirmsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

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
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const firmObj = isFirmSponsored ? firmsList.find((f) => f.id === selectedFirmId) : undefined;

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
      setEvents([{ id: 'ev-' + Date.now(), ...newEv }, ...events]);
    }

    setIsAdding(false);
    resetForm();
  };

  const handleStartEdit = (event: Event) => {
    setEditingEvent(event);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    const firmObj = editingEvent.is_firm_sponsored ? firmsList.find((f) => f.id === editingEvent.firm_id) : undefined;
    const updatedData: Partial<Event> = {
      title: editingEvent.title,
      slug: editingEvent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: editingEvent.category,
      sub_category: editingEvent.sub_category,
      entry_type: editingEvent.entry_type,
      entry_fee: editingEvent.entry_type === 'paid' ? Number(editingEvent.entry_fee) : 0,
      is_firm_sponsored: editingEvent.is_firm_sponsored,
      firm_id: editingEvent.is_firm_sponsored ? editingEvent.firm_id : undefined,
      firm_name: editingEvent.is_firm_sponsored ? firmObj?.name : undefined,
      firm_logo: editingEvent.is_firm_sponsored ? firmObj?.logo_url : undefined,
      host_name: editingEvent.is_firm_sponsored ? (firmObj?.name || 'Partner Firm') : (editingEvent.host_name || 'EMPIRIAL Official'),
      prize_pool: editingEvent.prize_pool,
      poster_url: editingEvent.poster_url,
      countdown_label: editingEvent.countdown_label,
      description: editingEvent.description,
      requires_discord: editingEvent.requires_discord,
      discord_url: editingEvent.requires_discord ? editingEvent.discord_url : undefined,
    };

    try {
      await updateEvent(editingEvent.id, updatedData);
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...updatedData } : ev));
      setEditingEvent(null);
    } catch (err) {
      console.error('Failed to update event:', err);
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...updatedData } : ev));
      setEditingEvent(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('giveaway');
    setSubCategory('tournament');
    setEntryType('free');
    setEntryFee(0);
    setIsFirmSponsored(true);
    setIndependentHostName('EMPIRIAL Official');
    setPrizePool('$100,000 in Accounts + $10,000 Cash');
    setPosterUrl('');
    setDescription('');
    setCountdownLabel('Starts in 7 Days');
    setRequiresDiscord(true);
    setDiscordUrl('https://discord.gg/empirial');
    setEnableTasks(true);
    setTasksList([
      'Join Official Discord Server',
      'Submit Platform Account ID & Verification',
    ]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Events & Giveaways Coordinator</h1>
          <p className="text-xs text-slate-400">Configure trading tournaments, gaming contests, bootcamps, and live sessions.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'New Event / Giveaway'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-elevation-surface border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Create New Event or Giveaway</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="World Prop Trading League 2026"
                required
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Main Category</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as EventCategory;
                  setCategory(cat);
                  setSubCategory(cat === 'giveaway' ? 'tournament' : 'live-session');
                }}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="giveaway">Giveaway</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Subcategory</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Entry Type</label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as EventEntryType)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="free">Free Entry</option>
                <option value="paid">Paid Entry</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Entry Fee ($)</label>
              <input
                type="number"
                disabled={entryType === 'free'}
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Prize Pool Description</label>
              <input
                type="text"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Countdown Label</label>
              <input
                type="text"
                value={countdownLabel}
                onChange={(e) => setCountdownLabel(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFirmSponsored}
                  onChange={(e) => setIsFirmSponsored(e.target.checked)}
                  className="rounded border-zinc-700 text-purple-500 bg-transparent focus:ring-0"
                />
                <span>Firm Sponsored</span>
              </label>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Sponsored Prop Firm</label>
              <select
                disabled={!isFirmSponsored}
                value={selectedFirmId}
                onChange={(e) => setSelectedFirmId(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                {firmsList.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Independent Host Name</label>
              <input
                type="text"
                disabled={isFirmSponsored}
                value={independentHostName}
                onChange={(e) => setIndependentHostName(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresDiscord}
                  onChange={(e) => setRequiresDiscord(e.target.checked)}
                  className="rounded border-zinc-700 text-purple-500 bg-transparent focus:ring-0"
                />
                <span>Requires Discord Connection</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Discord Invite URL</label>
              <input
                type="url"
                disabled={!requiresDiscord}
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Event Poster Image URL</label>
              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Event Description & Rules</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-elevation-card hover:bg-elevation-raised text-xs text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
            >
              Publish Event
            </button>
          </div>
        </form>
      )}

      {/* Editing Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveEdit}
            className="bg-elevation-modal border border-white/15 rounded-3xl p-6 max-w-3xl w-full space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Edit Event / Giveaway: {editingEvent.title}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Main Category</label>
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="giveaway">Giveaway</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Subcategory</label>
                <input
                  type="text"
                  value={editingEvent.sub_category}
                  onChange={(e) => setEditingEvent({ ...editingEvent, sub_category: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Entry Type</label>
                <select
                  value={editingEvent.entry_type}
                  onChange={(e) => setEditingEvent({ ...editingEvent, entry_type: e.target.value as any })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="free">Free Entry</option>
                  <option value="paid">Paid Entry</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Entry Fee ($)</label>
                <input
                  type="number"
                  disabled={editingEvent.entry_type === 'free'}
                  value={editingEvent.entry_fee}
                  onChange={(e) => setEditingEvent({ ...editingEvent, entry_fee: Number(e.target.value) })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Prize Pool</label>
                <input
                  type="text"
                  value={editingEvent.prize_pool}
                  onChange={(e) => setEditingEvent({ ...editingEvent, prize_pool: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Countdown Label</label>
                <input
                  type="text"
                  value={editingEvent.countdown_label}
                  onChange={(e) => setEditingEvent({ ...editingEvent, countdown_label: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.is_firm_sponsored}
                    onChange={(e) => setEditingEvent({ ...editingEvent, is_firm_sponsored: e.target.checked })}
                    className="rounded border-zinc-700 text-purple-500 bg-transparent focus:ring-0"
                  />
                  <span>Firm Sponsored</span>
                </label>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Sponsored Prop Firm</label>
                <select
                  disabled={!editingEvent.is_firm_sponsored}
                  value={editingEvent.firm_id || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, firm_id: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  {firmsList.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Independent Host Name</label>
                <input
                  type="text"
                  disabled={editingEvent.is_firm_sponsored}
                  value={editingEvent.host_name || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, host_name: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEvent.requires_discord}
                    onChange={(e) => setEditingEvent({ ...editingEvent, requires_discord: e.target.checked })}
                    className="rounded border-zinc-700 text-purple-500 bg-transparent focus:ring-0"
                  />
                  <span>Requires Discord Connection</span>
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Discord Invite URL</label>
                <input
                  type="url"
                  disabled={!editingEvent.requires_discord}
                  value={editingEvent.discord_url || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, discord_url: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Event Poster Image URL</label>
                <input
                  type="text"
                  value={editingEvent.poster_url}
                  onChange={(e) => setEditingEvent({ ...editingEvent, poster_url: e.target.value })}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Event Description & Rules</label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={3}
                  className="w-full bg-elevation-base border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-3 py-1.5 rounded-lg bg-elevation-card hover:bg-elevation-raised text-xs text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table (Strictly RULE:BW) */}
      <div className="bg-elevation-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-elevation-card text-slate-400 uppercase font-bold text-[10px]">
              <th className="p-4">Opportunity</th>
              <th className="p-4">Category</th>
              <th className="p-4">Host / Firm</th>
              <th className="p-4">Prize Pool / Value</th>
              <th className="p-4">Entry</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-elevation-raised/60">
                <td className="p-4">
                  <div className="font-bold text-white">{ev.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{ev.countdown_label}</div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/5">
                    {ev.category} • {ev.sub_category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {ev.is_firm_sponsored && ev.firm_logo ? (
                      <img src={ev.firm_logo} alt={ev.host_name} className="w-4 h-4 object-contain rounded" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span className="font-medium text-white">{ev.host_name}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-white font-mono">{ev.prize_pool}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    ev.entry_type === 'free' ? 'bg-white/10 text-white' : 'bg-white text-black font-bold'
                  }`}>
                    {ev.entry_type === 'free' ? 'Free' : `$${ev.entry_fee}`}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1.5">
                  <button
                    onClick={() => handleStartEdit(ev)}
                    className="p-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 rounded bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
