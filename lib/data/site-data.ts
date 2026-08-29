import { MarketTicker } from '@/lib/types';

export const MOCK_TICKERS: MarketTicker[] = [];

export interface TrustStat {
  label: string;
  value: string;
  change: string;
}

export const TRUST_STATS: TrustStat[] = [];

export interface PartnerLogo {
  name: string;
  logo: string;
  badge: string;
}

export const PARTNER_LOGOS: PartnerLogo[] = [];

export interface Testimonial {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  stars: number;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [];

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  period: string;
  features: string[];
  ctaText: string;
  isPopular: boolean;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [];
