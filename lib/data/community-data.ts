import { CommunityPost } from '@/lib/types';

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How I passed the FTMO 200K Challenge in 8 Trading Days (ICT Killzone Strategy)',
    body: `Here is the full breakdown of how I completed Phase 1 and Phase 2 without taking more than 0.75% risk per trade.

### Key Rules I Followed:
1. **London Open Killzone Only**: 07:00 to 09:30 UTC for EURUSD and GBPUSD.
2. **Daily Loss Buffer**: If I lost 1.5% in a single day, my terminal was locked automatically.
3. **Targeting Clean 1:3 RR**: Look for Asian Session liquidity sweeps followed by strong displacement with Fair Value Gaps (FVG).

Always remember: passing the challenge is 20% strategy and 80% emotional discipline. Don't rush!`,
    user_name: 'Anuraj Trader',
    user_avatar: 'AT',
    is_verified: true,
    firm_tag: 'FTMO',
    category_tag: 'KNOWLEDGE',
    upvotes: 248,
    downvotes: 4,
    views: 3120,
    comments_count: 38,
    created_at: '2026-08-22T10:30:00Z',
    comments: [
      {
        id: 'c-1',
        user_name: 'Liam Vance',
        content: 'Great insight on the daily loss buffer. Locking the terminal after 1.5% drawdown completely fixed my revenge trading.',
        created_at: '2026-08-22T12:15:00Z',
        upvotes: 19,
      },
      {
        id: 'c-2',
        user_name: 'Elena R.',
        content: 'Did you hold any trades during CPI news or flat before red folders?',
        created_at: '2026-08-22T14:40:00Z',
        upvotes: 8,
      },
    ],
  },
  {
    id: 'post-2',
    title: 'Funding Pips vs The5ers: Which one has better spreads on XAUUSD and Crypto?',
    body: `I did a 30-day live test comparing raw execution between Funding Pips (cTrader) and The5ers (MT5) on Gold (XAUUSD) and Bitcoin.

### Results:
- **XAUUSD Avg Spread**: Funding Pips averaged 1.1 pips with $2 commission. The5ers averaged 1.4 pips with $4 commission.
- **Crypto Weekend Slippage**: Funding Pips showed tighter spreads on BTCUSD during Sunday NY opens.
- **Payout Speed**: Funding Pips paid within 4 hours via USDT on day 5. The5ers paid within 24 hours via Rise.

Overall, both are top tier, but for scalping Gold, Funding Pips has a slight edge on commissions.`,
    user_name: 'Devon Miles',
    user_avatar: 'DM',
    is_verified: true,
    firm_tag: 'Funding Pips',
    category_tag: 'RULES',
    upvotes: 184,
    downvotes: 6,
    views: 2450,
    comments_count: 22,
    created_at: '2026-08-21T16:00:00Z',
    comments: [
      {
        id: 'c-3',
        user_name: 'Vikram Patel',
        content: 'Thanks for this benchmark! Really helpful for Indian traders using crypto payouts.',
        created_at: '2026-08-21T18:20:00Z',
        upvotes: 12,
      },
    ],
  },
  {
    id: 'post-3',
    title: 'PSA: Apex Trader Funding 80% discount coupon code active today',
    body: `Code **SAVENOW** gives 80% off all futures combines today. Valid on 50k, 100k, and 150k accounts with 1-day pass rules. Check the Deals section for the verified link!`,
    user_name: 'Deal Hunter Pro',
    user_avatar: 'DH',
    is_verified: false,
    firm_tag: 'Apex Trader Funding',
    category_tag: 'OFFERS',
    upvotes: 310,
    downvotes: 2,
    views: 4200,
    comments_count: 14,
    created_at: '2026-08-24T08:00:00Z',
    comments: [],
  },
];
