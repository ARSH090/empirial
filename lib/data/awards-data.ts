import { Award } from '@/lib/types';

export const MOCK_AWARDS: Award[] = [
  {
    id: 'award-best-overall',
    category_name: 'Best Overall Prop Firm of the Year 2026',
    description: 'Recognizing outstanding trust, liquidity consistency, payout punctuality, and fair evaluation conditions.',
    year: 2026,
    is_voting_open: true,
    nominated_firms: [
      { firm_id: 'ftmo', firm_name: 'FTMO', votes: 4210, logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'the-5ers', firm_name: 'The5ers', votes: 3680, logo_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'funding-pips', firm_name: 'Funding Pips', votes: 3120, logo_url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'alpha-capital', firm_name: 'Alpha Capital Group', votes: 1980, logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'award-best-payout',
    category_name: 'Fastest & Most Reliable Payouts 2026',
    description: 'Voted by verified traders based on processing speed, payout guarantees, and crypto/wire options.',
    year: 2026,
    is_voting_open: true,
    nominated_firms: [
      { firm_id: 'funding-pips', firm_name: 'Funding Pips (5-Day Cycles)', votes: 4890, logo_url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'topstep', firm_name: 'Topstep (Daily Payouts)', votes: 3940, logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'ftmo', firm_name: 'FTMO (Bi-Weekly / On-Demand)', votes: 3750, logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'the-5ers', firm_name: 'The5ers', votes: 2400, logo_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=120&auto=format&fit=crop&q=80' },
    ],
  },
  {
    id: 'award-best-futures',
    category_name: 'Best Futures Prop Firm 2026',
    description: 'Top exchange execution, CME/CBOT market depth, Tradovate/NinjaTrader support, and drawdown models.',
    year: 2026,
    is_voting_open: true,
    nominated_firms: [
      { firm_id: 'topstep', firm_name: 'Topstep', votes: 6120, logo_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=120&auto=format&fit=crop&q=80' },
      { firm_id: 'apex-trader-funding', firm_name: 'Apex Trader Funding', votes: 5410, logo_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=120&auto=format&fit=crop&q=80' },
    ],
  },
];
