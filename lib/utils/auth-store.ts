export interface UserPurchasedAccount {
  id: string;
  firm_id: string;
  firm_name: string;
  firm_logo: string;
  account_type: string;
  account_size: number;
  platform: string;
  account_number: string;
  purchase_date: string;
  status: 'active' | 'passed' | 'scaling' | 'funded';
  order_id: string;
  price_paid: number;
}

export interface UserSupportMessage {
  id: string;
  sender: 'user' | 'support' | 'admin';
  sender_name: string;
  text: string;
  timestamp: string;
}

export interface UserSupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  subject: string;
  category: 'payouts' | 'accounts' | 'events' | 'discounts' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
  messages: UserSupportMessage[];
}

export interface UserProfileReview {
  id: string;
  firm_id: string;
  firm_name: string;
  firm_logo?: string;
  user_name: string;
  title: string;
  body: string;
  overall_rating: number;
  trading_conditions: number;
  customer_care: number;
  user_friendliness: number;
  payout_process: number;
  status: 'published' | 'pending' | 'replied';
  firm_reply?: {
    author: string;
    message: string;
    replied_at: string;
  };
  upvotes: number;
  created_at: string;
}

export interface UserReferralItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joined_at: string;
  status: 'account_created' | 'challenge_purchased';
  points_earned: number;
  commission_earned: number;
  purchased_account_title?: string;
}

export interface UserRedeemedReward {
  id: string;
  reward_title: string;
  category: 'cash' | 'challenge' | 'commission';
  points_spent: number;
  value_display: string;
  status: 'completed' | 'processing';
  date: string;
  delivery_info?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  role: 'admin' | 'trader';
  avatarUrl?: string;
  traderId: string;
  points: number;
  accountsPurchased: UserPurchasedAccount[];
  country?: string;
  discordHandle?: string;
  bio?: string;
  is_verified?: boolean;
  verification_status?: 'not_applied' | 'pending' | 'approved' | 'rejected';
  following_ids?: string[];
  firm_badge?: string;
  firm_logo?: string;
  referral_code?: string;
  referrals_count?: number;
  referral_points?: number;
  referral_commission?: number;
  referrals?: UserReferralItem[];
  redeemed_referral_rewards?: UserRedeemedReward[];
}

export const DEFAULT_PURCHASED_ACCOUNTS: UserPurchasedAccount[] = [
  {
    id: 'acc-1',
    firm_id: 'nys',
    firm_name: 'NYS Capital',
    firm_logo: '/logos/nys.png',
    account_type: '$100,000 1-Step Evaluation',
    account_size: 100000,
    platform: 'cTrader',
    account_number: 'NYS-CTR-884029',
    purchase_date: '2026-08-15',
    status: 'funded',
    order_id: 'ORD-NYS-9941',
    price_paid: 499,
  },
  {
    id: 'acc-2',
    firm_id: 'topstep',
    firm_name: 'Topstep',
    firm_logo: '/logos/topstep.png',
    account_type: '$150,000 Express Trading Combine',
    account_size: 150000,
    platform: 'Tradovate',
    account_number: 'TS-TRD-441209',
    purchase_date: '2026-08-01',
    status: 'passed',
    order_id: 'ORD-TS-7721',
    price_paid: 375,
  },
  {
    id: 'acc-3',
    firm_id: 'alpha-capital',
    firm_name: 'Alpha Capital Group',
    firm_logo: '/logos/alpha.png',
    account_type: '$100,000 Alpha Pro 2-Step',
    account_size: 100000,
    platform: 'cTrader',
    account_number: 'ACG-CTR-110294',
    purchase_date: '2026-07-20',
    status: 'scaling',
    order_id: 'ORD-ACG-5510',
    price_paid: 495,
  },
  {
    id: 'acc-4',
    firm_id: 'fundednext',
    firm_name: 'FundedNext',
    firm_logo: '/logos/fundednext.png',
    account_type: '$50,000 Stellar 2-Phase Challenge',
    account_size: 50000,
    platform: 'Match-Trader',
    account_number: 'FN-MTR-309482',
    purchase_date: '2026-08-10',
    status: 'active',
    order_id: 'ORD-FN-4421',
    price_paid: 299,
  },
  {
    id: 'acc-5',
    firm_id: 'shark-funded',
    firm_name: 'Shark Funded',
    firm_logo: '/logos/shark.png',
    account_type: '$25,000 Rapid Evaluation Account',
    account_size: 25000,
    platform: 'TradeLocker',
    account_number: 'SF-TL-902481',
    purchase_date: '2026-08-22',
    status: 'active',
    order_id: 'ORD-SF-1192',
    price_paid: 189,
  },
];

export const DEMO_ADMIN: UserProfile = {
  uid: 'admin-001',
  email: 'admin@empirial.com',
  displayName: 'EMPIRIAL Admin',
  phoneNumber: '+1 (555) 992-0011',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  traderId: 'EMP-ADM01',
  points: 12500,
  accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
  country: 'Global',
  discordHandle: '@empirial_admin',
  bio: 'EMPIRIAL 2.0 System Administrator and Verification Desk.',
  is_verified: true,
  verification_status: 'approved',
  following_ids: ['author-firm-1', 'author-firm-2'],
};

export const DEMO_TRADER: UserProfile = {
  uid: 'trader-001',
  email: 'trader@empirial.com',
  displayName: 'Anuraj FX Trader',
  phoneNumber: '+1 (555) 389-2049',
  role: 'trader',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  traderId: 'EMP-90428',
  points: 4850,
  accountsPurchased: DEFAULT_PURCHASED_ACCOUNTS,
  country: 'India',
  discordHandle: '@anuraj_trader',
  bio: 'Algorithmic SMC and Price Action Trader. Focusing on Gold & US30 prop challenges.',
  is_verified: true,
  verification_status: 'approved',
  following_ids: ['author-firm-1', 'author-trader-2'],
  referral_code: 'EMP-90428',
  referrals_count: 18,
  referral_points: 1800,
  referral_commission: 285.00,
};


export const INITIAL_USER_REVIEWS: UserProfileReview[] = [
  {
    id: 'rev-user-1',
    firm_id: 'nys',
    firm_name: 'NYS Capital',
    firm_logo: '/logos/nys.png',
    user_name: 'Anuraj FX Trader',
    title: 'Flawless 6-hour payout turnaround and institutional spreads',
    body: 'The rapid payout processing of NYS Capital is unmatched in the industry. Execution on cTrader has virtually zero slippage even during London open high volatility.',
    overall_rating: 5,
    trading_conditions: 5,
    customer_care: 5,
    user_friendliness: 5,
    payout_process: 5,
    status: 'replied',
    firm_reply: {
      author: 'NYS Capital Official Support',
      message: 'Thank you Anuraj! We take pride in sub-6 hour payout turnaround times. Best of luck with your scaling allocation!',
      replied_at: '2026-08-25',
    },
    upvotes: 68,
    created_at: '2026-08-24',
  },
  {
    id: 'rev-user-2',
    firm_id: 'topstep',
    firm_name: 'Topstep',
    firm_logo: '/logos/topstep.png',
    user_name: 'Anuraj FX Trader',
    title: 'Tradovate integration on CME Futures is silky smooth',
    body: 'Express combine rules are crystal clear. Instant daily payouts after reaching consistency buffer. Highly recommended for ES and NQ day traders.',
    overall_rating: 5,
    trading_conditions: 5,
    customer_care: 5,
    user_friendliness: 4,
    payout_process: 5,
    status: 'published',
    upvotes: 42,
    created_at: '2026-08-18',
  },
  {
    id: 'rev-user-3',
    firm_id: 'alpha-capital',
    firm_name: 'Alpha Capital Group',
    firm_logo: '/logos/alpha.png',
    user_name: 'Anuraj FX Trader',
    title: 'Zero commissions on cTrader indices and prompt scaling',
    body: 'Solid infrastructure with zero commission indices. Currently scaling to Phase 2 with strict 5% daily limit.',
    overall_rating: 4,
    trading_conditions: 5,
    customer_care: 4,
    user_friendliness: 4,
    payout_process: 4,
    status: 'published',
    upvotes: 19,
    created_at: '2026-08-10',
  },
  {
    id: 'rev-user-4',
    firm_id: 'shark-funded',
    firm_name: 'Shark Funded',
    firm_logo: '/logos/shark.png',
    user_name: 'Anuraj FX Trader',
    title: 'Testing weekend crypto execution & payout speed',
    body: 'Just started the 25K Rapid evaluation to test weekend BTCUSD volatility and TradeLocker execution. Awaiting verification of first withdrawal.',
    overall_rating: 4,
    trading_conditions: 4,
    customer_care: 4,
    user_friendliness: 4,
    payout_process: 4,
    status: 'pending',
    upvotes: 5,
    created_at: '2026-08-26',
  },
];

export const INITIAL_SUPPORT_TICKETS: UserSupportTicket[] = [
  {
    id: 'TICK-8492',
    user_id: 'trader-001',
    user_name: 'Anuraj FX Trader',
    user_email: 'trader@empirial.com',
    user_phone: '+1 (555) 389-2049',
    subject: 'Payout Telemetry Sync with NYS Capital cTrader Account',
    category: 'payouts',
    priority: 'high',
    status: 'in_progress',
    created_at: '2026-08-26T10:15:00Z',
    updated_at: '2026-08-26T14:30:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        sender_name: 'Anuraj FX Trader',
        text: 'Hello EMPIRIAL team, I recently received a $4,200 payout from NYS Capital on account NYS-CTR-884029. Could you please verify and sync the telemetry badge onto my profile leaderboard?',
        timestamp: '2026-08-26 10:15',
      },
      {
        id: 'msg-2',
        sender: 'support',
        sender_name: 'EMPIRIAL Admin Support',
        text: 'Hi Anuraj, we have received your request and transaction hash. Our automated verification bot is reconciling the on-chain payout telemetry. We will update your status within 2 hours.',
        timestamp: '2026-08-26 14:30',
      },
    ],
  },
  {
    id: 'TICK-8210',
    user_id: 'trader-001',
    user_name: 'Anuraj FX Trader',
    user_email: 'trader@empirial.com',
    user_phone: '+1 (555) 389-2049',
    subject: 'Tournament Passport Registration Verification for Global Summer League',
    category: 'events',
    priority: 'normal',
    status: 'resolved',
    created_at: '2026-08-23T08:00:00Z',
    updated_at: '2026-08-23T11:45:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        sender_name: 'Anuraj FX Trader',
        text: 'I submitted my screenshot proof for the Discord task in the Global Summer Prop Trading League. Has it been approved?',
        timestamp: '2026-08-23 08:00',
      },
      {
        id: 'msg-2',
        sender: 'support',
        sender_name: 'EMPIRIAL Admin Support',
        text: 'Your registration proof has been verified! Your passport PASS: REG-2026-X01 is confirmed and active.',
        timestamp: '2026-08-23 11:45',
      },
    ],
  },
];

// Helper Functions
export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('empirial_user');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch (e) {
    return null;
  }
}

export function saveUser(user: UserProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('empirial_user', JSON.stringify(user));
  localStorage.removeItem('empirial_logged_out');
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
}

export function loginAsDemoTrader(): UserProfile {
  const user = { ...DEMO_TRADER };
  saveUser(user);
  return user;
}

export function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('empirial_user');
  localStorage.setItem('empirial_logged_out', 'true');
  
  // Trigger Firebase signOut in the background
  import('@/lib/firebase/config').then(({ auth }) => {
    import('firebase/auth').then(({ signOut }) => {
      signOut(auth).catch((err) => console.error('Firebase Auth sign out error:', err));
    });
  });
  
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: null }));
}

export function openAuthModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-login-modal'));
  }
}

export function closeAuthModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('close-login-modal'));
  }
}

export function getStoredSupportTickets(): UserSupportTicket[] {
  if (typeof window === 'undefined') return INITIAL_SUPPORT_TICKETS;
  const saved = localStorage.getItem('empirial_support_tickets');
  if (!saved) {
    localStorage.setItem('empirial_support_tickets', JSON.stringify(INITIAL_SUPPORT_TICKETS));
    return INITIAL_SUPPORT_TICKETS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_SUPPORT_TICKETS;
  }
}

export function saveSupportTickets(tickets: UserSupportTicket[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('empirial_support_tickets', JSON.stringify(tickets));
  window.dispatchEvent(new CustomEvent('support-tickets-changed', { detail: tickets }));
}

export function addSupportTicket(ticket: Omit<UserSupportTicket, 'id' | 'created_at' | 'updated_at' | 'messages' | 'status'> & { initialMessage: string }): UserSupportTicket {
  const tickets = getStoredSupportTickets();
  const newTicket: UserSupportTicket = {
    id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    user_id: ticket.user_id,
    user_name: ticket.user_name,
    user_email: ticket.user_email,
    user_phone: ticket.user_phone,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        sender_name: ticket.user_name,
        text: ticket.initialMessage,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      },
    ],
  };
  const updated = [newTicket, ...tickets];
  saveSupportTickets(updated);
  return newTicket;
}

export function replyToSupportTicket(ticketId: string, text: string, sender: 'user' | 'support' | 'admin', senderName: string): UserSupportTicket | null {
  const tickets = getStoredSupportTickets();
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) return null;

  const ticket = tickets[ticketIndex];
  const newMsg: UserSupportMessage = {
    id: `msg-${Date.now()}`,
    sender,
    sender_name: senderName,
    text,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  ticket.messages.push(newMsg);
  ticket.updated_at = new Date().toISOString();
  if (sender === 'support' || sender === 'admin') {
    ticket.status = 'in_progress';
  }

  tickets[ticketIndex] = ticket;
  saveSupportTickets(tickets);
  return ticket;
}

export function getStoredUserReviews(): UserProfileReview[] {
  if (typeof window === 'undefined') return INITIAL_USER_REVIEWS;
  const saved = localStorage.getItem('empirial_user_reviews');
  if (!saved) {
    localStorage.setItem('empirial_user_reviews', JSON.stringify(INITIAL_USER_REVIEWS));
    return INITIAL_USER_REVIEWS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_USER_REVIEWS;
  }
}

export function saveUserReviews(reviews: UserProfileReview[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('empirial_user_reviews', JSON.stringify(reviews));
  window.dispatchEvent(new CustomEvent('user-reviews-changed', { detail: reviews }));
}

export function addUserReview(review: Omit<UserProfileReview, 'id' | 'created_at' | 'status' | 'upvotes'>): UserProfileReview {
  const reviews = getStoredUserReviews();
  const newReview: UserProfileReview = {
    id: `rev-user-${Date.now()}`,
    ...review,
    status: 'pending',
    upvotes: 0,
    created_at: new Date().toISOString().split('T')[0],
  };
  const updated = [newReview, ...reviews];
  saveUserReviews(updated);
  return newReview;
}

export const INITIAL_USER_REFERRALS: UserReferralItem[] = [
  {
    id: 'ref-1',
    name: 'Marcus Chen',
    email: 'marcus.fx@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-27',
    status: 'challenge_purchased',
    points_earned: 100,
    commission_earned: 74.85,
    purchased_account_title: 'NYS Capital $100K 1-Step Evaluation',
  },
  {
    id: 'ref-2',
    name: 'Sarah Jenkins',
    email: 'sarah.trades@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-26',
    status: 'challenge_purchased',
    points_earned: 100,
    commission_earned: 44.85,
    purchased_account_title: 'FundedNext $50K Stellar 2-Phase',
  },
  {
    id: 'ref-3',
    name: 'Devon Vance',
    email: 'devon.vance@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-25',
    status: 'challenge_purchased',
    points_earned: 100,
    commission_earned: 99.80,
    purchased_account_title: 'Topstep $50K CME Futures Combine',
  },
  {
    id: 'ref-4',
    name: 'Liam O\'Connor',
    email: 'liam.trader@yahoo.com',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-24',
    status: 'challenge_purchased',
    points_earned: 100,
    commission_earned: 65.50,
    purchased_account_title: 'Alpha Capital Group $100K Challenge',
  },
  {
    id: 'ref-5',
    name: 'Elena Rostova',
    email: 'elena.rostova@icloud.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-23',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-6',
    name: 'Alexandre Dubois',
    email: 'dubois.alex@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-22',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-7',
    name: 'Priya Sharma',
    email: 'priya.sharma99@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-21',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-8',
    name: 'Carlos Mendez',
    email: 'carlos.m@tradinghub.io',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-20',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-9',
    name: 'Kenji Takahashi',
    email: 'kenji.takahashi@tokyo-fx.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-19',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-10',
    name: 'Zack Miller',
    email: 'zack.scalper@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-18',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-11',
    name: 'Fatima Al-Mansoor',
    email: 'fatima.dubai@fxmarket.ae',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-17',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-12',
    name: 'David Becker',
    email: 'david.becker@berlin-capital.de',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-16',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-13',
    name: 'Matteo Rossi',
    email: 'matteo.rossi@milano.it',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-15',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-14',
    name: 'Lucas Silva',
    email: 'lucas.silva@sao-paulo.br',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-14',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-15',
    name: 'Hannah Nguyen',
    email: 'hannah.nguyen@sydney-trades.au',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-13',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-16',
    name: 'Nico Santos',
    email: 'nico.santos@manila-fx.ph',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-12',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-17',
    name: 'Tariq Hassan',
    email: 'tariq.trader@cairo-capital.eg',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-11',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
  {
    id: 'ref-18',
    name: 'Oliver Wright',
    email: 'oliver.wright@london-fx.uk',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    joined_at: '2026-08-10',
    status: 'account_created',
    points_earned: 100,
    commission_earned: 0,
  },
];

export function getStoredReferrals(): UserReferralItem[] {
  if (typeof window === 'undefined') return INITIAL_USER_REFERRALS;
  const saved = localStorage.getItem('empirial_user_referrals');
  if (!saved) {
    localStorage.setItem('empirial_user_referrals', JSON.stringify(INITIAL_USER_REFERRALS));
    return INITIAL_USER_REFERRALS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_USER_REFERRALS;
  }
}

export function saveStoredReferrals(referrals: UserReferralItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('empirial_user_referrals', JSON.stringify(referrals));
  window.dispatchEvent(new CustomEvent('user-referrals-changed', { detail: referrals }));
}

export function addReferralInvite(name: string, email: string, purchasedAccount?: string): UserReferralItem {
  const current = getStoredReferrals();
  const hasPurchased = !!purchasedAccount;
  const commission = hasPurchased ? 45.00 : 0;
  const newRef: UserReferralItem = {
    id: `ref-${Date.now()}`,
    name,
    email,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    joined_at: new Date().toISOString().split('T')[0],
    status: hasPurchased ? 'challenge_purchased' : 'account_created',
    points_earned: 100,
    commission_earned: commission,
    purchased_account_title: purchasedAccount,
  };
  const updated = [newRef, ...current];
  saveStoredReferrals(updated);
  return newRef;
}

export function getStoredRedeemedRewards(): UserRedeemedReward[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('empirial_redeemed_rewards');
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

export function addRedeemedReward(reward: Omit<UserRedeemedReward, 'id' | 'date' | 'status'>): UserRedeemedReward {
  const current = getStoredRedeemedRewards();
  const newReward: UserRedeemedReward = {
    id: `red-${Date.now()}`,
    ...reward,
    status: 'completed',
    date: new Date().toISOString().split('T')[0],
  };
  const updated = [newReward, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem('empirial_redeemed_rewards', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('redeemed-rewards-changed', { detail: updated }));
  }
  return newReward;
}
