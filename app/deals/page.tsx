import React from 'react';
import { Metadata } from 'next';
import { DealsClient } from './DealsClient';

export const metadata: Metadata = {
  title: 'Exclusive Prop Firm Promo Codes & Discount Coupons | EMPIRIAL 2.0',
  description: 'Verified discount coupon codes tested every 15 minutes. Save up to 80% on evaluation challenges and futures combines.',
};

export default function DealsPage() {
  return <DealsClient />;
}
