import React from 'react';
import { SocialFeedClient } from '@/components/social/social-feed-client';

export const metadata = {
  title: 'State Hall | EMPIRIAL 2.0',
  description: 'State Hall: Live prop firm announcements, institutional trade ideas, challenge discounts, and psychological frameworks.',
};

export default function AnnouncementsPage() {
  return <SocialFeedClient />;
}
