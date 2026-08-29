import { BrokerSpread } from '@/lib/types';

export const MOCK_SPREADS: BrokerSpread[] = [
  {
    id: 'spr-1',
    feed_name: 'NYS Liquidity Provider',
    pair: 'EURUSD',
    spread_pips: 0.1,
    commission_per_lot: 3,
    account_type: 'Raw Spreads',
    platform: 'cTrader',
    status: 'active'
  },
  {
    id: 'spr-2',
    feed_name: 'CK Liquidity Provider',
    pair: 'GBPUSD',
    spread_pips: 0.3,
    commission_per_lot: 3.5,
    account_type: 'Raw Spreads',
    platform: 'MT5',
    status: 'active'
  },
  {
    id: 'spr-3',
    feed_name: 'FTMO Forex Feed',
    pair: 'EURUSD',
    spread_pips: 0.2,
    commission_per_lot: 3,
    account_type: 'FTMO Account',
    platform: 'MT5',
    status: 'active'
  },
  {
    id: 'spr-4',
    feed_name: 'Funding Pips Prime',
    pair: 'XAUUSD',
    spread_pips: 1.2,
    commission_per_lot: 2,
    account_type: 'Raw Spreads',
    platform: 'Match-Trader',
    status: 'active'
  }
];
