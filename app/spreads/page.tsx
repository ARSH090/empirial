import React from 'react';
import { Metadata } from 'next';
import { SpreadsClient } from './SpreadsClient';

export const metadata: Metadata = {
  title: 'Live Broker Spreads & Commissions Comparison | EMPIRIAL 2.0',
  description: 'Forensic real-time bid/ask spread tracking on EURUSD, GBPUSD, XAUUSD, BTCUSD, and US30 with exact per-lot commissions.',
};

export default function SpreadsPage() {
  return <SpreadsClient />;
}
