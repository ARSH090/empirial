import React from 'react';

export const metadata = {
  title: 'Privacy Policy | EMPIRIAL 2.0',
  description: 'Learn how EMPIRIAL handles and protects user account information and audit telemetry.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Last updated: August 2026</p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
        <p>
          We collect basic user registration data (email, display username) and optional user-submitted payout proof screenshots and community forum contributions.
        </p>

        <h2 className="text-base font-bold text-white">2. Use of Telemetry & Cookies</h2>
        <p>
          We use anonymized cookies to track affiliate discount code click-through rates and verify coupon efficacy. We never sell personal information to third parties.
        </p>

        <h2 className="text-base font-bold text-white">3. Data Security & GDPR Compliance</h2>
        <p>
          All account information and submitted receipts are stored behind encrypted security barriers. Users may request full account and data deletion at any time.
        </p>
      </div>
    </div>
  );
}
