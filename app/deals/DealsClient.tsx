'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  ShieldCheck,
  Check,
  Copy,
  Gift,
  RotateCcw,
  Sparkles,
  Percent,
  Coins,
  X,
  Menu,
  ChevronDown,
  Tag,
} from 'lucide-react';
import { MOCK_DEALS } from '@/lib/data/deals-data';
import { Deal } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type OfferFilterType = 'all' | 'bogo' | 'cashback' | 'refund' | 'discount';

export function DealsClient() {
  const [query, setQuery] = useState('');
  const [selectedFirmType, setSelectedFirmType] = useState<string>('all');
  const [selectedOfferType, setSelectedOfferType] = useState<OfferFilterType>('all');

  // Discount code copying & validation states
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [hasCopiedCodes, setHasCopiedCodes] = useState<Record<string, boolean>>({});
  const [shakingDealId, setShakingDealId] = useState<string | null>(null);
  const [warningDealId, setWarningDealId] = useState<string | null>(null);

  const handleCopyCode = (code: string, dealId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(code);
      setHasCopiedCodes((prev) => ({ ...prev, [dealId]: true }));
      setCopiedCode(dealId);
      setWarningDealId(null);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleClaimOffer = (e: React.MouseEvent, deal: Deal) => {
    e.stopPropagation();
    if (!hasCopiedCodes[deal.id]) {
      e.preventDefault();
      // Trigger vibrating shake effect on Code button & warning banner
      setShakingDealId(deal.id);
      setWarningDealId(deal.id);

      setTimeout(() => setShakingDealId(null), 600);
      setTimeout(() => setWarningDealId(null), 4000);
      return;
    }

    // Code copied: open affiliate / discord link
    if (typeof window !== 'undefined') {
      window.open(deal.affiliate_url || 'https://discord.gg/ww4dkeeZdp', '_blank', 'noopener,noreferrer');
    }
  };

  const handleResetFilters = () => {
    setSelectedFirmType('all');
    setSelectedOfferType('all');
    setQuery('');
  };

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return MOCK_DEALS.filter((deal) => {
      // 1. Search Query
      if (query) {
        const q = query.toLowerCase();
        const matchName = deal.firm_name.toLowerCase().includes(q);
        const matchCode = deal.code.toLowerCase().includes(q);
        const matchDesc = deal.description.toLowerCase().includes(q);
        const matchLabel = deal.discount_label.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc && !matchLabel) {
          return false;
        }
      }

      // 2. Firm Type Filter (Forex, Futures, Crypto)
      if (selectedFirmType !== 'all' && deal.category !== selectedFirmType) {
        return false;
      }

      // 3. Offer Type Filter (BOGO, Cashback, Refund, Discount)
      if (selectedOfferType !== 'all') {
        if (selectedOfferType === 'bogo' && !deal.is_bogo && deal.offer_type !== 'bogo') {
          return false;
        }
        if (selectedOfferType === 'cashback' && deal.offer_type !== 'cashback') {
          return false;
        }
        if (selectedOfferType === 'refund' && deal.offer_type !== 'refund') {
          return false;
        }
        if (selectedOfferType === 'discount' && deal.offer_type !== 'discount') {
          return false;
        }
      }

      return true;
    });
  }, [query, selectedFirmType, selectedOfferType]);

  const firmTypeLabels: Record<string, string> = {
    all: 'Firm Types: All',
    forex: 'Firm Type: Forex',
    futures: 'Firm Type: Futures',
    crypto: 'Firm Type: Crypto',
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-background text-foreground transition-colors duration-200">
      {/* Continuous Atmospheric Tilted Pink Light Beam (Like in Home Page) */}
      <div className="absolute top-0 inset-x-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="relative w-full max-w-5xl mx-auto h-full flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.1, ease: 'easeOut' }}
            className="absolute -top-12 sm:-top-20 right-0 sm:right-6 md:right-12 w-20 sm:w-28 md:w-36 h-[2400px] sm:h-[3200px] lg:h-[4000px] bg-gradient-to-b from-[#ec4899] from-0% via-[#f43f5e]/60 via-35% to-transparent to-85% blur-[70px] sm:blur-[85px] rounded-full rotate-[28deg] sm:rotate-[32deg] origin-top will-change-transform opacity-80 dark:opacity-70"
          />
        </div>
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-12">
        {/* Centered Header (Strict RULE:BW & Git Repo Typography) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0 }}
          className="flex flex-col gap-3 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter mx-auto text-balance bg-gradient-to-b from-pink-700 dark:from-pink-100 to-foreground dark:to-foreground bg-clip-text text-transparent leading-[1.12]">
            Exclusive Prop Firm Deals & Offers
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground text-center text-xs sm:text-sm leading-relaxed">
            Verified promo codes, BOGO specials, fee refunds, and instant cashback deals tested and updated daily.
          </p>
        </motion.div>

        {/* Filter and Search Control Bar: Translucent in Light Theme, Solid in Dark Theme */}
        <div className="backdrop-blur-xl bg-white/70 dark:backdrop-blur-none dark:bg-card border border-zinc-200/80 dark:border-border rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 shadow-xs">
          {/* Left: Search Input & Hamburger Firm Types Dropdown */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            {/* Hamburger Firm Types Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-xs shrink-0 ${
                    selectedFirmType !== 'all'
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'border-zinc-200/80 bg-white/80 dark:bg-card text-zinc-900 dark:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:border-zinc-800'
                  }`}
                >
                  <Menu className="w-4 h-4" />
                  <span>{firmTypeLabels[selectedFirmType] || 'Firm Types'}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-48 p-1.5 rounded-2xl backdrop-blur-xl bg-white/90 dark:backdrop-blur-none dark:bg-card border border-zinc-200 dark:border-border shadow-xl space-y-1 z-50"
              >
                {[
                  { label: 'All Firm Types', val: 'all' },
                  { label: 'Forex Firms', val: 'forex' },
                  { label: 'Futures Firms', val: 'futures' },
                  { label: 'Crypto Firms', val: 'crypto' },
                ].map((type) => (
                  <DropdownMenuItem
                    key={type.val}
                    onClick={() => setSelectedFirmType(type.val)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                      selectedFirmType === type.val
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                        : 'text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{type.label}</span>
                    {selectedFirmType === type.val && <Check className="w-3.5 h-3.5" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-72 lg:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search firm, promo code, or offer..."
                className="w-full bg-zinc-50/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Offer Type Filter Pills (All Offers, BOGO, Cashback, Refund, Flash Sale) */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setSelectedOfferType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedOfferType === 'all'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100/70 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
              }`}
            >
              All Offers
            </button>

            <button
              type="button"
              onClick={() => setSelectedOfferType('bogo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedOfferType === 'bogo'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100/70 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>BOGO</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOfferType('cashback')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedOfferType === 'cashback'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100/70 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Cashback</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOfferType('refund')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedOfferType === 'refund'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100/70 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Refund (100%-200%)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOfferType('discount')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedOfferType === 'discount'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-zinc-100/70 dark:bg-zinc-900 text-zinc-600 hover:bg-zinc-200 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Flash Sale</span>
            </button>
          </div>
        </div>

        {/* Cards Grid: Translucent in White Theme, Solid in Black Theme */}
        <TooltipProvider>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredDeals.length > 0 ? (
                filteredDeals.map((deal) => {
                  const hasCopied = hasCopiedCodes[deal.id];
                  const isCopiedNow = copiedCode === deal.id;
                  const isShaking = shakingDealId === deal.id;
                  const hasWarning = warningDealId === deal.id;

                  return (
                    <motion.div
                      layout
                      key={deal.id}
                      initial={{ opacity: 0, y: 16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative flex flex-col ${deal.is_featured ? 'md:-translate-y-1 z-10' : ''}`}
                    >
                      <div
                        className={`relative h-full rounded-[24px] flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 ${
                          deal.is_featured
                            ? 'border-2 border-black dark:border-white backdrop-blur-xl bg-[#f4f4f5]/80 dark:backdrop-blur-none dark:bg-card shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.14)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.18)]'
                            : 'border border-zinc-200/80 dark:border-border backdrop-blur-xl bg-white/70 dark:backdrop-blur-none dark:bg-card hover:border-black dark:hover:border-white hover:shadow-[0_0_18px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_0_22px_rgba(255,255,255,0.16)]'
                        }`}
                      >
                        {/* Top Pill for Featured / Special Offer Badge */}
                        {deal.is_featured && (
                          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20">
                            <span className="rounded-full border border-black dark:border-white bg-white dark:bg-card px-4 py-0.5 text-xs font-semibold text-foreground whitespace-nowrap shadow-none">
                              {deal.offer_badge || 'Most Popular Offer'}
                            </span>
                          </div>
                        )}

                        <div>
                          {/* Header: Firm Name (Git repo styling), Verified Badge, Rating, Firm Type */}
                          <div className="text-center flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-lg font-bold sm:text-xl text-foreground">
                                {deal.firm_name}
                              </h3>
                              {deal.is_verified && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs font-semibold bg-card border border-border text-foreground">
                                    Verified Institutional Partner
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            {/* Rating & Category Pills */}
                            <div className="mt-1.5 flex items-center justify-center gap-2">
                              {/* Green Star Design */}
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/40 dark:border-emerald-600/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                                <span>{(deal.rating || 4.8).toFixed(1)}</span>
                                <span className="text-[10px] text-muted-foreground font-normal">
                                  ({deal.review_count?.toLocaleString('en-US') || '2,500+'})
                                </span>
                              </div>

                              {/* Firm Type Badge */}
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100/90 dark:bg-zinc-900 text-foreground border border-zinc-200/80 dark:border-zinc-800">
                                {deal.category}
                              </span>
                            </div>

                            {/* Prominent Authentic Logo */}
                            <div className="my-4 flex items-center justify-center h-16 sm:h-20 w-full">
                              {deal.firm_logo ? (
                                <img
                                  src={deal.firm_logo}
                                  alt={deal.firm_name}
                                  className="h-14 sm:h-16 w-auto max-w-[170px] sm:max-w-[200px] object-contain rounded-md transition-transform duration-200 hover:scale-105"
                                />
                              ) : (
                                <div className="h-14 w-28 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center font-extrabold text-foreground text-sm">
                                  {deal.firm_name.substring(0, 4)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dividing Line */}
                          <div className="my-3.5 h-[1px] w-full bg-zinc-200/80 dark:bg-border" />

                          {/* PURE OFFERS SECTION (Formatted as per Git repo standards) */}
                          <div className="space-y-3.5 py-1">
                            {/* Offer Headline Badge */}
                            <div className="flex items-center justify-center">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
                                <Sparkles className="w-3.5 h-3.5 text-foreground shrink-0" />
                                <span className="text-xs sm:text-sm font-extrabold text-foreground tracking-tight">
                                  {deal.discount_label}
                                </span>
                              </div>
                            </div>

                            {/* Offer Description (text-muted-foreground per Git Repo) */}
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center px-1">
                              {deal.description}
                            </p>

                            {/* Offer Highlights / Perks Tags */}
                            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                              {deal.is_bogo && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-black">
                                  <Gift className="w-3 h-3" />
                                  <span>2nd Account Free</span>
                                </span>
                              )}
                              {deal.cashback_pct && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-black">
                                  <Coins className="w-3 h-3" />
                                  <span>{deal.cashback_pct}% Cashback</span>
                                </span>
                              )}
                              {deal.refund_pct && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-900 text-white dark:bg-white dark:text-black">
                                  <Percent className="w-3 h-3" />
                                  <span>{deal.refund_pct}% Fee Refund</span>
                                </span>
                              )}
                              {deal.discount_pct && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-zinc-300/80 dark:border-zinc-700 bg-zinc-100/90 dark:bg-zinc-900 text-foreground">
                                  <Tag className="w-3 h-3" />
                                  <span>-{deal.discount_pct}% OFF</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Buttons Section (Code Button with Shake + Claim Offer CTA per RULE:BW) */}
                        <div className="mt-5 pt-1 flex flex-col gap-2 w-full">
                          <div className="flex items-center gap-2 w-full">
                            {/* Code Button with Vibrating Shake Effect */}
                            <motion.button
                              type="button"
                              animate={isShaking ? { x: [-6, 6, -6, 6, -3, 3, 0] } : {}}
                              transition={{ duration: 0.4 }}
                              onClick={(e) => handleCopyCode(deal.code, deal.id, e)}
                              className={`flex-1 font-semibold rounded-xl h-10 text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs ${
                                hasCopied
                                  ? 'border-black dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-black font-bold'
                                  : 'border-zinc-200/80 bg-white/80 dark:bg-card text-zinc-900 dark:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:border-zinc-800'
                              }`}
                            >
                              {isCopiedNow ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : hasCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Code Copied ✓</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Code {deal.code}</span>
                                </>
                              )}
                            </motion.button>

                            {/* Claim Offer / Buy Challenge Button */}
                            <button
                              type="button"
                              onClick={(e) => handleClaimOffer(e, deal)}
                              className="flex-1 font-semibold rounded-xl h-10 text-xs sm:text-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors cursor-pointer flex items-center justify-center shadow-xs text-center"
                            >
                              Claim Offer
                            </button>
                          </div>

                          {/* Warning Alert Notification Toast */}
                          <AnimatePresence>
                            {hasWarning && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="w-full text-center text-[11px] sm:text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-md flex items-center justify-center gap-1"
                              >
                                <span>⚠️ Kindly Copy code for Max Discount</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full backdrop-blur-xl bg-white/70 dark:backdrop-blur-none dark:bg-card border border-zinc-200/80 dark:border-border rounded-2xl p-12 text-center space-y-3"
                >
                  <p className="text-base font-semibold text-foreground">No exclusive offers match your filters.</p>
                  <p className="text-xs text-muted-foreground">Try clearing your search query or selecting another offer category.</p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TooltipProvider>
      </div>
    </div>
  );
}
