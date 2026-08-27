import React from 'react';

export const metadata = {
  title: 'Terms and Conditions & Risk Disclaimer | EMPIRIAL 2.0',
  description: 'Terms of service and financial risk disclaimers for EMPIRIAL / ANURAJ FX Platform.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms and Conditions</h1>
        <p className="text-xs text-slate-400">Last updated: August 2026</p>
      </div>

      <div className="bg-elevation-surface border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        <h2 className="text-base font-bold text-white">1. Platform Service Nature</h2>
        <p>
          EMPIRIAL (operated under ANURAJ FX) provides comparison, analytical intelligence, discount aggregation, and educational community features. We are not a broker-dealer, financial advisor, or proprietary trading evaluation provider.
        </p>

        <h2 className="text-base font-bold text-white">2. High-Risk Trading Warning</h2>
        <p>
          Trading leveraged forex, commodities, futures, and cryptographic assets entails extreme financial risk and the potential loss of capital. Simulated evaluation accounts do not guarantee live trading profitability.
        </p>

        <h2 className="text-base font-bold text-white">3. Third-Party Links & Affiliate Disclosures</h2>
        <p>
          Some coupon links redirect to independent third-party prop firms where we may receive an affiliate referral commission at zero additional cost to you.
        </p>
      </div>
    </div>
  );
}
