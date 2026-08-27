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
