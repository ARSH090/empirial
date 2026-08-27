import { BlogPost } from '@/lib/types';

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-to-pass-prop-firm-challenges-in-2026',
    title: 'The Definitive 2026 Blueprint for Passing 100K & 200K Prop Challenges',
    excerpt: 'A comprehensive guide on position sizing, maximum daily loss calculation models, and avoiding common rule violations.',
    cover_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-08-20',
    read_time: '7 min read',
    category: 'Strategy & Risk',
    author: {
      name: 'Anuraj Sharma',
      role: 'Chief Market Strategist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    content: `
Passing a prop firm evaluation challenge is not about hitting home-run trades. It is entirely an exercise in **drawdown preservation** and **mathematical expectancy**.

### 1. The Real Mathematical Hurdle: Asymmetric Loss Limits
Most traders fail because they believe a 10% profit target with a 10% maximum loss gives them a 1:1 risk-to-reward ratio. In reality:
- If your account size is $100,000, your starting equity is $100,000.
- Your maximum allowed loss is $10,000 (reaching $90,000 equity).
- Your risk budget is therefore **$10,000, not $100,000**.
- Making $10,000 on a $10,000 true risk capital pool means you must make a **100% gain on your actual risk budget**.

### 2. The 0.5% Rule of Longevity
To survive a standard 5-to-10 trade losing streak without breaching the 5% daily loss limit:
- Maximum risk per trade: **0.50% of account balance** ($500 on a 100K account).
- Daily stop: Stop trading if you hit **-1.50% in a single calendar day**.
- With 1:2.5 minimum Risk-to-Reward on winning setups, you only need a **38% win rate** to hit the phase 1 target within 15-20 trading days.

### 3. Understanding Balance vs Equity Drawdown
Always verify if the prop firm calculates daily loss based on **Day-Start Balance** or **High-Water-Mark Equity**. If it is equity-based, trailing floating profits can dangerously narrow your daily floor during active news sessions.
    `,
  },
  {
    id: 'blog-2',
    slug: 'prop-firm-consistency-rules-explained',
    title: 'Decoding Consistency Rules, Lot Size Limits, and News Trading Policies',
    excerpt: 'Avoid getting disqualified upon requesting your first payout. Here is everything you need to know about consistency rules.',
    cover_image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-08-15',
    read_time: '5 min read',
    category: 'Rules & Compliance',
    author: {
      name: 'Elena Vance',
      role: 'Head of Compliance Audits',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    },
    content: `
Many prop firms enforce hidden consistency metrics before approving profit payouts.

### Key Consistency Models:
1. **The 30% / 40% Single-Day Profit Rule**: No single trading day can generate more than 30% of your total profit. If your payout request is $10,000, your best day cannot exceed $3,000.
2. **Lot Size Variance Bands**: If your average position size is 2.0 lots, opening a 10.0 lot trade to catch a high-impact CPI release will flag your account for lot inconsistency.
3. **Holding Over Weekends**: Ensure your challenge tier is designated as a "Swing" account if you intend to leave open risk over Friday market closes.
    `,
  },
];
