import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
  title: 'Side-by-Side Prop Firm Comparator & Radar | EMPIRIAL 2.0',
  description: 'Compare up to 4 prop trading firms simultaneously with normalized radar charts, drawdown allowances, and consistency rules.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Comparator Terminal...</div>}>
      <CompareClient />
    </Suspense>
  );
}
