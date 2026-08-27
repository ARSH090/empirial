import React from 'react';
import { Metadata } from 'next';
import { EventsClient } from './EventsClient';

export const metadata: Metadata = {
  title: 'Prop Trading Tournaments, Bootcamps & Live Events | EMPIRIAL 2.0',
  description: 'Compete in trading championships for $100k+ in cash and free 100K challenge accounts, or join institutional masterclasses.',
};

export default function EventsPage() {
  return <EventsClient />;
}
