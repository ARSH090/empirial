import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating: number;
  reviewCount?: number;
  showStars?: boolean;
  size?: 'sm' | 'md';
}

export function RatingBadge({ rating, reviewCount, showStars = true, size = 'sm' }: RatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-400 font-medium">
      {showStars && <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />}
      <span className={size === 'sm' ? 'text-xs font-bold' : 'text-sm font-bold'}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-[10px] text-slate-400 font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
