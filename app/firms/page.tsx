import React from 'react';
import { Metadata } from 'next';
import { FirmsClient } from './FirmsClient';

export const metadata: Metadata = {
  title: 'Audited Prop Trading Firms Directory | EMPIRIAL 2.0',
  description: 'Forensically audited prop firms ranked by financial solvency, payout consistency, maximum allocations, and trader sentiment.',
};

export default function FirmsPage() {
  return <FirmsClient />;
}
