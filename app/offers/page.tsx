import React from 'react';
import { Metadata } from 'next';
import { DealsClient } from '@/app/deals/DealsClient';

export const metadata: Metadata = {
  title: 'Exclusive Prop Firm Offers & Discount Deals | EMPIRIAL 2.0',
  description: 'Verified promo codes, BOGO specials, fee refunds, and instant cashback deals tested and updated daily.',
};

export default function OffersPage() {
  return <DealsClient />;
}
