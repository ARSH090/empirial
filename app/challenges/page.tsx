import React from 'react';
import { Metadata } from 'next';
import { ChallengesClient } from './ChallengesClient';

export const metadata: Metadata = {
  title: 'Prop Firm Challenge Comparison Matrix (13-Col) | EMPIRIAL 2.0',
  description: 'Compare 500+ prop evaluation challenges with 5-segment profit split gauges, daily/max loss thresholds, and exclusive discount coupons.',
};

export default function ChallengesPage() {
  return <ChallengesClient />;
}
