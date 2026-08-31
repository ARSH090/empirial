import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ReviewsClient } from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Prop Firm Trader Reviews & Ratings | EMPIRIAL 2.0',
  description: 'Unfiltered ratings across 4 critical parameters: Trading Conditions, Customer Care, User Friendliness, and Payout Reliability.',
};

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Trader Reviews...</div>}>
      <ReviewsClient />
    </Suspense>
  );
}
