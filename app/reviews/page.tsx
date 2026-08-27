import React from 'react';
import { Metadata } from 'next';
import { ReviewsClient } from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Prop Firm Trader Reviews & Ratings | EMPIRIAL 2.0',
  description: 'Unfiltered ratings across 4 critical parameters: Trading Conditions, Customer Care, User Friendliness, and Payout Reliability.',
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
