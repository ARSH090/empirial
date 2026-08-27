'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-white/10 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Mail className="w-3.5 h-3.5" />
          <span>CONTACT & PARTNERSHIPS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Have an inquiry, partnership proposal, or want your prop firm audited? Reach out directly to our team.
        </p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {submitted ? (
          <div className="py-12 text-center space-y-3 text-emerald-400 animate-in zoom-in-90 duration-200">
            <CheckCircle2 className="w-14 h-14 mx-auto" />
            <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Our support desk will review your inquiry and reply within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anuraj Sharma"
                  required
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  required
                  className="w-full bg-elevation-base border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Inquiry Type</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-elevation-base border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Prop Firm Audit Request">Prop Firm Audit Request</option>
                <option value="Advertising / Promo Listing">Advertising / Promo Listing</option>
                <option value="Payout Proof Dispute">Payout Proof Dispute</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                required
                className="w-full bg-elevation-base border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
