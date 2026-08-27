import React from 'react';
import { Metadata } from 'next';
import { PayoutsClient } from './PayoutsClient';

export const metadata: Metadata = {
  title: 'Verified Trader Payout Proofs & Receipts Gallery | EMPIRIAL 2.0',
  description: 'Real payout receipts and crypto transaction confirmations submitted by funded traders and forensically validated by EMPIRIAL.',
};

export default function PayoutsPage() {
  return <PayoutsClient />;
}
