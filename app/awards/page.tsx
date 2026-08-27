import React from 'react';
import { Metadata } from 'next';
import { AwardsClient } from './AwardsClient';

export const metadata: Metadata = {
  title: 'Prop Trading Industry Awards 2026 | EMPIRIAL 2.0',
  description: 'Cast your community votes in the 2026 Annual Prop Trading Awards for Best Prop Firm, Fastest Payouts, and Best Spreads.',
};

export default function AwardsPage() {
  return <AwardsClient />;
}
