import React from 'react';
import { Metadata } from 'next';
import { CommunityClient } from './CommunityClient';

export const metadata: Metadata = {
  title: 'Trader Community Forum & Discussion Boards | EMPIRIAL 2.0',
  description: 'Discuss challenge setups, ICT execution killzones, drawdown preservation, and broker slippage with 48,500+ verified traders.',
};

export default function CommunityPage() {
  return <CommunityClient />;
}
