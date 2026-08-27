import React from 'react';
import { adminDb } from '@/lib/firebase/admin';
import { MOCK_FIRMS } from '@/lib/data/firms-data';
import { MOCK_CHALLENGES } from '@/lib/data/challenges-data';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { MOCK_REVIEWS } from '@/lib/data/reviews-data';
import { MOCK_PAYOUTS } from '@/lib/data/payouts-data';
import { FirmProfileClient } from './FirmProfileClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let firmName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  if (adminDb) {
    try {
      const firmSnap = await adminDb.collection('firms').where('slug', '==', slug).limit(1).get();
      if (!firmSnap.empty) {
        firmName = firmSnap.docs[0].data().name;
      }
    } catch (_) {}
  }

  return {
    title: `${firmName} Audited Specs, Coupons & Reviews | EMPIRIAL 2.0`,
    description: `Complete audited prop trading metrics, challenge accounts pricing, active coupon codes, and verified trader payout proofs for ${firmName}.`,
  };
}

export default async function FirmProfilePage({ params }: PageProps) {
  const { slug } = await params;
  
  let firm = MOCK_FIRMS.find((f) => f.slug === slug);
  let firmChallenges = [];
  let firmDeals = [];
  let firmReviews = [];
  let firmPayouts = [];

  if (adminDb) {
    try {
      const firmSnap = await adminDb.collection('firms').where('slug', '==', slug).limit(1).get();
      if (!firmSnap.empty) {
        firm = { id: firmSnap.docs[0].id, ...firmSnap.docs[0].data() } as any;
      }

      if (firm) {
        const challSnap = await adminDb.collection('challenges').where('firm_id', '==', firm.id).get();
        firmChallenges = challSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;

        const dealSnap = await adminDb.collection('deals').where('firm_id', '==', firm.id).get();
        firmDeals = dealSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;

        const reviewSnap = await adminDb.collection('reviews').where('firm_id', '==', firm.id).get();
        firmReviews = reviewSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;

        const payoutSnap = await adminDb.collection('payouts').where('firm_id', '==', firm.id).get();
        firmPayouts = payoutSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any;
      }
    } catch (err) {
      console.error('Failed to load firm profile server-side:', err);
    }
  }

  // Fallback to static mock datasets
  if (!firm) {
    firm = MOCK_FIRMS[0];
  }
  if (firmChallenges.length === 0) {
    firmChallenges = MOCK_CHALLENGES.filter((c) => c.firm_slug === firm!.slug || c.firm_id === firm!.id);
  }
  if (firmDeals.length === 0) {
    firmDeals = MOCK_DEALS.filter((d) => d.firm_slug === firm!.slug || d.firm_id === firm!.id);
  }
  if (firmReviews.length === 0) {
    firmReviews = MOCK_REVIEWS.filter((r) => r.firm_id === firm!.id);
  }
  if (firmPayouts.length === 0) {
    firmPayouts = MOCK_PAYOUTS.filter((p) => p.firm_id === firm!.id);
  }

  return (
    <FirmProfileClient
      firm={firm}
      firmChallenges={firmChallenges}
      firmDeals={firmDeals}
      firmReviews={firmReviews}
      firmPayouts={firmPayouts}
    />
  );
}
