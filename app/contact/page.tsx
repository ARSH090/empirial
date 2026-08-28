'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { getStoredUser, openAuthModal } from '@/lib/utils/auth-store';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Support');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>CONTACT & PARTNERSHIPS</span>
        </div>
        <h1 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Have an inquiry, partnership proposal, or want your prop firm audited? Reach out directly to our team.
        </p>
      </div>

      <div className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs">
        {submitted ? (
          <div className="py-12 text-center space-y-3 text-emerald-600 dark:text-emerald-400 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-14 h-14 mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Message Sent Successfully!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our support desk will review your inquiry and reply within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Miller"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@example.com"
                  required
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Subject / Inquiry Type</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              >
                <option value="Prop Firm Audit Request">Prop Firm Audit Request</option>
                <option value="Advertising / Promo Listing">Advertising / Promo Listing</option>
                <option value="Payout Proof Dispute">Payout Proof Dispute</option>
                <option value="General Support">General Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here..."
                required
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-xs text-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
