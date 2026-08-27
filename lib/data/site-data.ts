import { MarketTicker } from '@/lib/types';

export const MOCK_TICKERS: MarketTicker[] = [
  { symbol: 'EUR/USD', price: '1.0845', change_24h: '+0.34%', is_positive: true },
  { symbol: 'GBP/USD', price: '1.2710', change_24h: '+0.18%', is_positive: true },
  { symbol: 'USD/JPY', price: '154.20', change_24h: '-0.42%', is_positive: false },
  { symbol: 'XAU/USD', price: '2,514.80', change_24h: '+1.15%', is_positive: true },
  { symbol: 'BTC/USD', price: '64,320.00', change_24h: '+3.42%', is_positive: true },
  { symbol: 'US30', price: '40,890.50', change_24h: '+0.52%', is_positive: true },
  { symbol: 'NAS100', price: '19,740.10', change_24h: '+0.88%', is_positive: true },
];

export const TRUST_STATS = [
  { label: 'Verified Payouts Tracked', value: '$15,231,890+', change: '+20.1% this month' },
  { label: 'Active Prop Traders', value: '48,500+', change: '+180% active users' },
  { label: 'Evaluation Challenges Audited', value: '520+', change: 'Updated daily' },
  { label: 'Exclusive Discounts Saved', value: '$1.4M+', change: 'Average 18% savings' },
];

export const PARTNER_LOGOS = [
  { name: 'FTMO', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80', badge: 'Verified Leader' },
  { name: 'The5ers', logo: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=100&auto=format&fit=crop&q=80', badge: '100% Split' },
  { name: 'Funding Pips', logo: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=100&auto=format&fit=crop&q=80', badge: '5-Day Payout' },
  { name: 'Alpha Capital', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', badge: '0% Comm' },
  { name: 'Topstep', logo: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&auto=format&fit=crop&q=80', badge: '#1 Futures' },
  { name: 'E8 Markets', logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80', badge: '14% Drawdown' },
  { name: 'FundedNext', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&auto=format&fit=crop&q=80', badge: '15% Pass Share' },
  { name: 'AquaFunded', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80', badge: '25% OFF' },
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    initials: 'SC',
    name: 'Sarah Chen',
    role: 'CEO at TechStart',
    company: 'TechStart',
    stars: 5,
    text: 'This platform has transformed how we manage our business. The analytics features alone have saved us countless hours and improved our decision-making process significantly.',
  },
  {
    id: 't-2',
    initials: 'ET',
    name: 'Emma Thompson',
    role: 'CTO at DataFlow',
    company: 'DataFlow',
    stars: 5,
    text: 'Security was our main concern when choosing a platform, and this solution exceeded our expectations. The encryption and compliance features give us complete peace of mind.',
  },
  {
    id: 't-3',
    initials: 'MG',
    name: 'Maria Garcia',
    role: 'Director of Operations at StreamlineOps',
    company: 'StreamlineOps',
    stars: 5,
    text: 'The customer support is phenomenal. Every question gets answered quickly and thoroughly. It’s like having an extended team member.',
  },
  {
    id: 't-4',
    initials: 'MR',
    name: 'Marcus Rodriguez',
    role: 'Product Manager at Scale Co',
    company: 'Scale Co',
    stars: 5,
    text: 'The integration capabilities are outstanding. We were able to connect all our existing tools seamlessly. The customer support team is also incredibly responsive and helpful.',
  },
  {
    id: 't-5',
    initials: 'RT',
    name: 'Robert Taylor',
    role: 'CTO at FinanceFlow',
    company: 'FinanceFlow',
    stars: 5,
    text: 'Security and compliance are critical in our industry. This platform not only meets but exceeds all our regulatory requirements.',
  },
  {
    id: 't-6',
    initials: 'KL',
    name: 'Kevin Lee',
    role: 'Founder at NextGen Solutions',
    company: 'NextGen Solutions',
    stars: 5,
    text: 'We’ve tried many platforms, but this one stands out for its reliability and performance. Zero downtime in 18 months of usage.',
  },
];

export const PRICING_PLANS = [
  {
    id: 'hobby',
    name: 'Hobby Plan',
    subtitle: 'Perfect for getting started',
    price: 0,
    period: '/month',
    features: [
      'Make the best schedule',
      'Support your team',
      'Basic analytics',
      'Browse all 500+ challenges',
      'Copy verified promo codes',
    ],
    ctaText: 'Get Started Free',
    isPopular: false,
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    subtitle: 'Best for growing teams',
    price: 29,
    period: '/month',
    features: [
      'Everything in Hobby',
      'Advanced team features',
      'Priority support',
      'Video calls',
      'Custom integrations',
      'Real-time drawdown risk alerts',
      'Live broker spreads terminal',
      'Exclusive 30%+ discount codes',
    ],
    ctaText: 'Choose Plan',
    isPopular: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    subtitle: 'For large organizations',
    price: 99,
    period: '/month',
    features: [
      'Everything in Pro',
      'Advanced security',
      'Custom branding',
      'Dedicated support',
      'SLA guarantee',
      'Automated trade copier API',
      'Private 1-on-1 risk audits',
      'Institutional liquidity feeds',
    ],
    ctaText: 'Choose Plan',
    isPopular: false,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How does EMPIRIAL verify prop firm payouts?',
    answer: 'Every payout proof submitted on EMPIRIAL undergoes a forensic audit pipeline including cryptographic transaction hash verification, bank/Rise payment receipt cross-checks, and user trade journal logs to eliminate fraudulent claims.',
  },
  {
    question: 'Are the discount coupon codes guaranteed to work?',
    answer: 'Yes. Our automated telemetry tracks coupon success rates every 15 minutes. If a promo code expires or fails, it is immediately updated or removed from the verified deals catalog.',
  },
  {
    question: 'What is the difference between Balance-based and Equity-based drawdown?',
    answer: 'Balance-based drawdown calculates your maximum loss floor strictly based on your closed balance at the start of the day. Equity-based (trailing) drawdown tracks your highest unrealized floating profit and pulls the loss floor upwards, requiring stricter risk management during active swings.',
  },
  {
    question: 'How do I earn loyalty reward points on EMPIRIAL?',
    answer: 'Traders earn loyalty points by registering an account (+200 pts), submitting genuine challenge reviews (+300 pts), uploading verified payout proofs (+500 pts), and referring fellow traders (+1,000 pts). Points can be redeemed for 100% challenge fee reimbursements and gear.',
  },
];
