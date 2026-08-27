import { LoyaltyReward } from '@/lib/types';

export const MOCK_REWARDS: LoyaltyReward[] = [
  {
    id: 'rew-1',
    title: '$100 Prop Challenge Fee Reimbursement',
    points_cost: 2500,
    reward_type: 'voucher',
    stock: 45,
    is_active: true,
    description: 'Claim a $100 cash reimbursement directly to your crypto/Rise wallet upon purchasing any partner challenge.',
  },
  {
    id: 'rew-2',
    title: 'Free 25K Funding Pips Evaluation Voucher',
    points_cost: 3500,
    reward_type: 'voucher',
    stock: 20,
    is_active: true,
    description: '100% free challenge promo code for a 25K 2-step evaluation with 95% profit split.',
  },
  {
    id: 'rew-3',
    title: 'EMPIRIAL / ANURAJ FX Premium Hoodie & Cap',
    points_cost: 1800,
    reward_type: 'merchandise',
    stock: 50,
    is_active: true,
    description: 'High-thread-count embroidered trader streetwear hoodie with discreet minimalist logo.',
  },
  {
    id: 'rew-4',
    title: 'Lifetime 1-on-1 Risk Management Audit & Coaching Call',
    points_cost: 5000,
    reward_type: 'voucher',
    stock: 8,
    is_active: true,
    description: '60-minute private strategy & journal audit session with an institutional prop firm trader.',
  },
];
