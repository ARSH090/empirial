import { Review } from '@/lib/types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    firm_id: 'ftmo',
    firm_name: 'FTMO',
    user_name: 'alex_trader99',
    full_name: 'Alex Mercer',
    title: 'Flawless payout process and great execution',
    body: 'I have requested three payouts so far and all were processed within 8 hours. The trading conditions on MT5 are great, commissions are reasonable, and support was helpful when I had issues with my KYC.',
    overall_rating: 5,
    trading_conditions: 5,
    customer_care: 5,
    user_friendliness: 4,
    payout_process: 5,
    is_verified_trader: true,
    upvotes: 34,
    created_at: '2026-08-15'
  },
  {
    id: 'rev-2',
    firm_id: 'nys',
    firm_name: 'NYS Capital',
    user_name: 'anuraj_fx',
    full_name: 'Anuraj Sen',
    title: 'Incredibly easy 1-Step evaluation parameters',
    body: 'Passed my NYS 100K 1-step challenge in 4 days. The trailing drawdown can be tricky if you do not manage risk, but the 6% target is very achievable. Highly recommend code EMPIRE for discount.',
    overall_rating: 5,
    trading_conditions: 5,
    customer_care: 4,
    user_friendliness: 5,
    payout_process: 5,
    is_verified_trader: true,
    upvotes: 18,
    created_at: '2026-08-20'
  },
  {
    id: 'rev-3',
    firm_id: 'ck-capital',
    firm_name: 'CK Capital',
    user_name: 'sophie_t',
    full_name: 'Sophie Dubois',
    title: 'Very solid dashboard and low spreads',
    body: 'Spreads on CK Capital are some of the lowest I have seen, particularly on EURUSD. The 2-step Stellar program is simple and the 28% off with code EMPIRE makes it extremely affordable.',
    overall_rating: 4,
    trading_conditions: 5,
    customer_care: 4,
    user_friendliness: 4,
    payout_process: 4,
    is_verified_trader: true,
    upvotes: 12,
    created_at: '2026-08-22'
  }
];
