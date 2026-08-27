import { Firm, Challenge } from '@/lib/types';

export interface ComparisonMetricScore {
  subject: string;
  score: number;
  displayValue: string;
  fullMark: number;
}

// 1. Calculate scores for Prop Firms comparison
export function calculateFirmComparisonScores(firm: Firm): ComparisonMetricScore[] {
  // Metric 1: Max Allocation (At Top for Firms Comparison)
  const allocStr = firm.max_allocation || '$1,000,000';
  const allocNumMatch = allocStr.replace(/[^0-9]/g, '');
  const allocVal = allocNumMatch ? parseInt(allocNumMatch, 10) : 1000000;
  // Scaled: $4M+ = 100, $2.5M = 95, $2M = 90, $1.5M = 80, $1M = 70, $500K = 50
  let allocScore = 50;
  if (allocVal >= 4000000) allocScore = 100;
  else if (allocVal >= 2500000) allocScore = 95;
  else if (allocVal >= 2000000) allocScore = 90;
  else if (allocVal >= 1500000) allocScore = 80;
  else if (allocVal >= 1000000) allocScore = 70;
  else allocScore = Math.max(30, Math.round((allocVal / 1000000) * 70));

  // Metric 2: Profit Split
  const splitMatch = firm.profit_split_custom?.match(/(\d+)%/);
  const splitVal = splitMatch ? parseInt(splitMatch[1], 10) : 80;
  const splitScore = splitVal >= 100 ? 100 : splitVal >= 90 ? 92 : splitVal >= 85 ? 82 : splitVal >= 80 ? 72 : 55;

  // Metric 3: Max Drawdown Limit
  const maxLoss = firm.max_loss_pct || 10;
  const maxLossScore = maxLoss >= 12 ? 100 : maxLoss >= 10 ? 90 : maxLoss >= 8 ? 75 : maxLoss >= 6 ? 60 : 45;

  // Metric 4: Consistency (0 or No rule = Best / 100)
  const hasNoConsistency = !firm.consistency_rules_content || 
    firm.consistency_rules_content.toLowerCase().includes('no') ||
    firm.consistency_rules_content.toLowerCase().includes('zero') ||
    firm.consistency_rules_content.toLowerCase().includes('balanced');
  const consistencyScore = hasNoConsistency ? 100 : 75;
  const consistencyDisplay = hasNoConsistency ? 'No Rule (Best)' : 'Standard Rule';

  // Metric 5: Min. Trading Days (Fewer is better: 0 days = 100 / Best)
  const minDaysStr = firm.firm_rules_content || '';
  const minDaysVal = minDaysStr.toLowerCase().includes('no minimum') ? 0 : 3;
  const minDaysScore = minDaysVal === 0 ? 100 : minDaysVal <= 3 ? 85 : minDaysVal <= 5 ? 70 : 50;
  const minDaysDisplay = minDaysVal === 0 ? '0 Days (Best)' : `${minDaysVal} Days`;

  return [
    { subject: 'Max Allocation', score: allocScore, displayValue: allocStr, fullMark: 100 },
    { subject: 'Profit Split', score: splitScore, displayValue: firm.profit_split_custom || `${splitVal}%`, fullMark: 100 },
    { subject: 'Max Drawdown Limit', score: maxLossScore, displayValue: `${maxLoss}% Max`, fullMark: 100 },
    { subject: 'Consistency', score: consistencyScore, displayValue: consistencyDisplay, fullMark: 100 },
    { subject: 'Min. Trading Days', score: minDaysScore, displayValue: minDaysDisplay, fullMark: 100 },
  ];
}

// 2. Calculate scores for Challenges / Accounts comparison (Payout Frequency replaces Max Allocation)
export function calculateChallengeComparisonScores(ch: Challenge): ComparisonMetricScore[] {
  // Metric 1: Profit Split
  const splitVal = ch.profit_split_pct || 80;
  const splitScore = splitVal >= 100 ? 100 : splitVal >= 90 ? 92 : splitVal >= 85 ? 82 : splitVal >= 80 ? 72 : 55;

  // Metric 2: Max Drawdown Limit
  const maxLoss = ch.max_loss_limit_pct || 8;
  const maxLossScore = maxLoss >= 12 ? 100 : maxLoss >= 10 ? 90 : maxLoss >= 8 ? 78 : maxLoss >= 6 ? 60 : 45;

  // Metric 3: Consistency (0 or No rule = Best / 100)
  const isNoConsistency = !ch.consistency_rule || 
    ch.consistency_rule.toLowerCase().includes('no') ||
    ch.consistency_rule.toLowerCase().includes('none') ||
    ch.consistency_rule.toLowerCase().includes('0');
  const consistencyScore = isNoConsistency ? 100 : 75;
  const consistencyDisplay = ch.consistency_rule || (isNoConsistency ? 'No Rule (Best)' : 'Active Rule');

  // Metric 4: Min. Trading Days (0 days = 100 / Best)
  const minDaysVal = ch.min_trading_days ?? 0;
  const minDaysScore = minDaysVal === 0 ? 100 : minDaysVal <= 3 ? 85 : minDaysVal <= 5 ? 70 : 50;
  const minDaysDisplay = minDaysVal === 0 ? '0 Days (Best)' : `${minDaysVal} Days`;

  // Metric 5: Payout Frequency
  const payoutStr = ch.payout_frequency || 'Bi-Weekly';
  let payoutScore = 75;
  if (payoutStr.toLowerCase().includes('6hr') || payoutStr.toLowerCase().includes('instant') || payoutStr.toLowerCase().includes('demand')) {
    payoutScore = 100;
  } else if (payoutStr.toLowerCase().includes('weekly') && !payoutStr.toLowerCase().includes('bi-weekly')) {
    payoutScore = 90;
  } else if (payoutStr.toLowerCase().includes('bi-weekly') || payoutStr.toLowerCase().includes('14')) {
    payoutScore = 80;
  } else {
    payoutScore = 60;
  }

  return [
    { subject: 'Profit Split', score: splitScore, displayValue: `Up to ${splitVal}%`, fullMark: 100 },
    { subject: 'Max Drawdown Limit', score: maxLossScore, displayValue: `${maxLoss}% Max`, fullMark: 100 },
    { subject: 'Consistency', score: consistencyScore, displayValue: consistencyDisplay, fullMark: 100 },
    { subject: 'Min. Trading Days', score: minDaysScore, displayValue: minDaysDisplay, fullMark: 100 },
    { subject: 'Payout Frequency', score: payoutScore, displayValue: payoutStr, fullMark: 100 },
  ];
}

// Backward compatible alias
export function calculateFirmScores(firm: Firm): ComparisonMetricScore[] {
  return calculateFirmComparisonScores(firm);
}
