'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  BarChart3,
  Star,
  Plus,
  Trash2,
  Edit,
  Building2,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Check,
  RefreshCw,
  Layers,
  ArrowRight,
  Eye,
  X,
  Search,
  Filter,
} from 'lucide-react';
import {
  getSiteSettings,
  updateSiteSettings,
  getPartnerLogos,
  savePartnerLogos,
  getPricingPlans,
  savePricingPlans,
  getTestimonialsList,
  saveTestimonialsList,
  getLivePlatformStats,
  getFirms,
  getReviews,
  getChallenges,
} from '@/lib/firebase/services';
import { Firm, Review, Challenge } from '@/lib/types';

export default function AdminPageBuilderPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'partners' | 'plans' | 'stats' | 'testimonials'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Db references
  const [firmsList, setFirmsList] = useState<Firm[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [challengesList, setChallengesList] = useState<Challenge[]>([]);

  // 1. HERO STATE
  const [heroTitle, setHeroTitle] = useState('EMPIRIAL\nBuilding Empires');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Compare prop firms, grab verified discount codes, and access our trading community'
  );
  const [cta1Text, setCta1Text] = useState('GRAB OFFERS');
  const [cta1Url, setCta1Url] = useState('/deals');
  const [cta2Text, setCta2Text] = useState('Join Discord');
  const [cta2Url, setCta2Url] = useState('https://discord.gg/ww4dkeeZdp');

  // 2. PARTNER LOGOS STATE & MODAL POPUP
  const [partners, setPartners] = useState<
    Array<{
      id: string;
      name: string;
      logo: string;
      shape: 'square' | 'rounded-md' | 'rounded-lg';
      size: 'small' | 'medium' | 'large';
    }>
  >([]);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [editingLogoIndex, setEditingLogoIndex] = useState<number | null>(null);
  const [logoModalData, setLogoModalData] = useState<{
    id?: string;
    name: string;
    logo: string;
    shape: 'square' | 'rounded-md' | 'rounded-lg';
    size: 'small' | 'medium' | 'large';
  }>({
    name: '',
    logo: '/logos/nys.png',
    shape: 'rounded-md',
    size: 'medium',
  });

  // 3. CHOOSE YOUR PLAN (3 PLANS) STATE
  const [plans, setPlans] = useState<any[]>([]);

  // 4. STATS STATE
  const [statsAutoSync, setStatsAutoSync] = useState(true);
  const [liveDbCounts, setLiveDbCounts] = useState({
    activeTraders: 50000,
    verifiedFirms: 40,
    challenges: 150,
    reviews: 12000,
  });
  const [customStats, setCustomStats] = useState([
    { label: 'Active Traders', value: 50, suffix: 'K+' },
    { label: 'Verified Firms', value: 40, suffix: '+' },
    { label: 'Challenges', value: 150, suffix: '+' },
    { label: 'Reviews', value: 12, suffix: 'K+' },
  ]);

  // 5. TESTIMONIALS (LOVED BY TRADERS WORLDWIDE) & REVIEWS EXPLORER
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewFirmFilter, setReviewFirmFilter] = useState('all');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');

  // Load All Homepage Configuration Data
  useEffect(() => {
    async function loadAllConfig() {
      try {
        const [
          settings,
          pLogos,
          pPlans,
          tList,
          liveStats,
          fData,
          rData,
          cData,
        ] = await Promise.all([
          getSiteSettings(),
          getPartnerLogos(),
          getPricingPlans(),
          getTestimonialsList(),
          getLivePlatformStats(),
          getFirms(),
          getReviews(),
          getChallenges(),
        ]);

        // 1. Hero
        if (settings && settings.hero) {
          setHeroTitle(settings.hero.title || 'EMPIRIAL\nBuilding Empires');
          setHeroSubtitle(settings.hero.subtitle || '');
          setCta1Text(settings.hero.cta1Text || 'GRAB OFFERS');
          setCta1Url(settings.hero.cta1Url || '/deals');
          setCta2Text(settings.hero.cta2Text || 'Join Discord');
          setCta2Url(settings.hero.cta2Url || 'https://discord.gg/ww4dkeeZdp');
        }

        // 2. Partner Logos
        if (pLogos && pLogos.length > 0) {
          setPartners(
            pLogos.map((p, idx) => ({
              id: p.id || `partner_${idx}`,
              name: p.name || 'Verified Firm',
              logo: p.logo || p.logo_url || '/logos/nys.png',
              shape: p.shape || 'rounded-md',
              size: p.size || 'medium',
            }))
          );
        } else {
          setPartners([
            { id: '1', name: 'Alpha Capital', logo: '/logos/alpha-capital.png', shape: 'rounded-md', size: 'medium' },
            { id: '2', name: 'CK Capital', logo: '/logos/ck-capital.avif', shape: 'rounded-md', size: 'medium' },
            { id: '3', name: 'GTF', logo: '/logos/gtf.svg', shape: 'rounded-md', size: 'medium' },
            { id: '4', name: 'NYS Capital', logo: '/logos/nys.png', shape: 'rounded-md', size: 'medium' },
            { id: '5', name: 'Pipstone', logo: '/logos/pipstone.png', shape: 'rounded-md', size: 'medium' },
            { id: '6', name: 'Shark Funded', logo: '/logos/shark-funded.webp', shape: 'rounded-md', size: 'medium' },
            { id: '7', name: 'Sure Leverage Funding', logo: '/logos/sure-leverage.jpg', shape: 'rounded-md', size: 'medium' },
          ]);
        }

        // 3. Pricing Plans
        if (pPlans && pPlans.length >= 3) {
          setPlans(pPlans);
        } else {
          setPlans([
            {
              id: 'nys',
              name: 'NYS Capital',
              logo: '/logos/nys.png',
              accountSize: '$5K - $100K',
              evalType: '( 1-Step )',
              isMostPop: false,
              profitTarget: '6%',
              drawdownDaily: '4%',
              drawdownMax: '6%',
              lossType: 'Trailing',
              profitSplit: '80%',
              discount: '20% DISCOUNT',
              discountSubtitle: '( Max you can get )',
              code: 'EMPIRE',
              buyUrl: '/challenges?firm=nys-capital',
            },
            {
              id: 'ck-capital',
              name: 'CK Capital',
              logo: '/logos/ck-capital.avif',
              accountSize: '$10K - $200K',
              evalType: '( 2-Step )',
              isMostPop: true,
              profitTarget: '8% | 5%',
              drawdownDaily: '5%',
              drawdownMax: '10%',
              lossType: 'Static',
              profitSplit: '85%',
              discount: '28% DISCOUNT',
              discountSubtitle: '( Max you can get )',
              code: 'EMPIRE',
              buyUrl: '/challenges?firm=ck-capital',
            },
            {
              id: 'alpha-capital',
              name: 'Alpha Capital',
              logo: '/logos/alpha-capital.png',
              accountSize: '$5K - $300K',
              evalType: '( Instant )',
              isMostPop: false,
              profitTarget: '8%',
              drawdownDaily: '4%',
              drawdownMax: '8%',
              lossType: 'Static',
              profitSplit: '80%',
              discount: '20% DISCOUNT',
              discountSubtitle: '( Max you can get )',
              code: 'EMPIRE',
              buyUrl: '/challenges?firm=alpha-capital',
            },
          ]);
        }

        // 4. Live Stats
        setLiveDbCounts(liveStats);
        if (settings && settings.stats_auto_sync !== undefined) {
          setStatsAutoSync(settings.stats_auto_sync);
        }
        if (settings && settings.stats && settings.stats.length >= 4) {
          setCustomStats(settings.stats);
        }

        // 5. Testimonials
        if (tList && tList.length > 0) {
          setTestimonials(tList);
        } else {
          setTestimonials([
            {
              id: 't1',
              name: 'Sarah Chen',
              role: 'Funded Forex Trader',
              content:
                'Empirial made finding the perfect prop firm challenge effortless. The side-by-side comparison of drawdown rules and payout splits saved me weeks of manual research.',
              rating: 5,
              is_active: true,
            },
            {
              id: 't2',
              name: 'Emma Thompson',
              role: 'Prop Portfolio Manager',
              content:
                "Empirial's evaluation breakdown tool helped me discover prop firms offering 90%+ profit splits and zero news trading restrictions.",
              rating: 5,
              is_active: true,
            },
            {
              id: 't3',
              name: 'Maria Garcia',
              role: 'Day Trader & Active Member',
              content:
                'Empirial is hands down the best platform for prop traders. Transparent firm ratings, prompt support, and community discussions.',
              rating: 5,
              is_active: true,
            },
          ]);
        }

        setFirmsList(fData);
        setReviewsList(rData);
        setChallengesList(cData);
      } catch (err) {
        console.error('Failed to load page builder config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAllConfig();
  }, []);

  const showNotification = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3500);
  };

  // SAVE 1: HERO SECTION
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings({
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          cta1Text,
          cta1Url,
          cta2Text,
          cta2Url,
        },
      });
      showNotification('Hero section updated successfully!');
    } catch (err) {
      console.error('Failed to save hero:', err);
      alert('Failed to save hero settings.');
    } finally {
      setSaving(false);
    }
  };

  // SAVE 2: PARTNER LOGOS & MODAL HANDLERS
  const handleSavePartners = async () => {
    setSaving(true);
    try {
      await savePartnerLogos(partners);
      showNotification('Verified firm partner logos saved successfully!');
    } catch (err) {
      console.error('Failed to save partner logos:', err);
      alert('Failed to save partner logos.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddLogoModal = () => {
    const defaultFirm = firmsList[0];
    setEditingLogoIndex(null);
    setLogoModalData({
      name: defaultFirm?.name || 'Verified Prop Firm',
      logo: defaultFirm?.logo_url || '/logos/nys.png',
      shape: 'rounded-md',
      size: 'medium',
    });
    setIsLogoModalOpen(true);
  };

  const handleOpenEditLogoModal = (index: number) => {
    setEditingLogoIndex(index);
    setLogoModalData({ ...partners[index] });
    setIsLogoModalOpen(true);
  };

  const handleSaveLogoModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoModalData.name || !logoModalData.logo) {
      alert('Firm name and logo are required.');
      return;
    }

    const item = {
      id: logoModalData.id || `partner_${Date.now()}`,
      name: logoModalData.name.trim(),
      logo: logoModalData.logo.trim(),
      shape: logoModalData.shape || 'rounded-md',
      size: logoModalData.size || 'medium',
    };

    if (editingLogoIndex !== null) {
      const updated = [...partners];
      updated[editingLogoIndex] = item;
      setPartners(updated);
    } else {
      setPartners([...partners, item]);
    }

    setIsLogoModalOpen(false);
    showNotification('Partner logo updated in preview list!');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoModalData((prev) => ({
        ...prev,
        logo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleQuickLoadFirmForLogo = (firmId: string) => {
    const firm = firmsList.find((f) => f.id === firmId);
    if (firm) {
      setLogoModalData((prev) => ({
        ...prev,
        name: firm.name,
        logo: firm.logo_url || prev.logo,
      }));
    }
  };

  // SAVE 3: CHOOSE YOUR PLAN (3 PLANS)
  const handleSavePlans = async () => {
    setSaving(true);
    try {
      await savePricingPlans(plans);
      showNotification('Choose Your Plan (3 Challenges) saved successfully!');
    } catch (err) {
      console.error('Failed to save pricing plans:', err);
      alert('Failed to save pricing plans.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = (index: number, field: string, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const handlePlanFirmSelect = (index: number, firmId: string) => {
    const firm = firmsList.find((f) => f.id === firmId);
    if (firm) {
      const updated = [...plans];
      updated[index] = {
        ...updated[index],
        id: firm.slug || firm.id,
        name: firm.name,
        logo: firm.logo_url,
        profitSplit: firm.profit_split_custom || updated[index].profitSplit,
        discount: firm.discount_label_custom || updated[index].discount,
        code: firm.coupon_code_custom || updated[index].code,
        drawdownDaily: `${firm.daily_loss_pct || 5}%`,
        drawdownMax: `${firm.max_loss_pct || 10}%`,
        profitTarget: `${firm.profit_target_pct || 8}%`,
        buyUrl: `/challenges?firm=${encodeURIComponent(firm.slug || firm.id)}`,
      };
      setPlans(updated);
    }
  };

  // SAVE 4: STATS
  const handleSaveStats = async () => {
    setSaving(true);
    try {
      await updateSiteSettings({
        stats_auto_sync: statsAutoSync,
        stats: customStats,
      });
      showNotification('Stats settings and dynamic counter rules saved!');
    } catch (err) {
      console.error('Failed to save stats:', err);
      alert('Failed to save stats.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshLiveCounts = async () => {
    const counts = await getLivePlatformStats();
    setLiveDbCounts(counts);
    showNotification('Live aggregate database counters refreshed!');
  };

  // SAVE 5: TESTIMONIALS
  const handleSaveTestimonials = async () => {
    setSaving(true);
    try {
      await saveTestimonialsList(testimonials);
      showNotification('Curated testimonials list saved to homepage!');
    } catch (err) {
      console.error('Failed to save testimonials:', err);
      alert('Failed to save testimonials.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonialFromReview = (rev: Review) => {
    if (testimonials.some((t) => t.review_id === rev.id)) {
      alert('This review is already in the curated homepage list.');
      return;
    }
    const newT = {
      id: `curated_${rev.id}`,
      review_id: rev.id,
      name: rev.full_name,
      role: `Funded Trader (${rev.firm_name})`,
      content: rev.body,
      rating: rev.overall_rating,
      is_active: true,
    };
    setTestimonials([newT, ...testimonials]);
    showNotification(`Review by ${rev.full_name} added to homepage testimonials!`);
  };

  const handleAddCustomTestimonial = () => {
    setTestimonials([
      {
        id: `custom_${Date.now()}`,
        name: 'Alex Turner',
        role: 'Funded Trader (NYS Capital)',
        content: 'Passed my 1-step challenge and requested my first payout using code EMPIRE.',
        rating: 5,
        is_active: true,
      },
      ...testimonials,
    ]);
  };

  // Filtered reviews explorer list
  const filteredReviewsList = reviewsList.filter((r) => {
    const q = reviewSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.full_name?.toLowerCase().includes(q) ||
      r.user_name?.toLowerCase().includes(q) ||
      r.title?.toLowerCase().includes(q) ||
      r.body?.toLowerCase().includes(q) ||
      r.firm_name?.toLowerCase().includes(q);

    const matchesFirm = reviewFirmFilter === 'all' || r.firm_id === reviewFirmFilter || r.firm_name === reviewFirmFilter;
    const matchesRating = reviewRatingFilter === 'all' || r.overall_rating === parseInt(reviewRatingFilter);

    return matchesSearch && matchesFirm && matchesRating;
  });

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-foreground rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground font-mono">Loading Page Builder CMS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
            Home Page Builder CMS
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Edit Hero copy, Buttons & direct links, Verified Firms logos with shape options, 3 Challenge Plans, Dynamic Live Stats, and Curated Testimonials.
          </p>
        </div>

        {savedMessage && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-300/40 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        {[
          { id: 'hero', label: '1. Hero Headline & CTAs', icon: Sparkles },
          { id: 'partners', label: '2. Verified Firms Logos', icon: ImageIcon },
          { id: 'plans', label: '3. Choose Your Plan (3 Cards)', icon: Trophy },
          { id: 'stats', label: '4. Dynamic Live Stats', icon: BarChart3 },
          { id: 'testimonials', label: '5. Loved By Traders Worldwide', icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: HERO COPY & BUTTONS */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Hero Headline, Subheading & Action Buttons</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize the main headline text (supports multiline line breaks), subtitle, and the two primary CTA buttons.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Main Headline */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">
                Main Headline (Tip: Enter line break for 2-line styling)
              </label>
              <textarea
                rows={2}
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="EMPIRIAL&#10;Building Empires"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-sm text-foreground focus:outline-none focus:border-foreground font-medium"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground block">Sub Heading Description</label>
              <textarea
                rows={3}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Compare prop firms, grab verified discount codes, and access our trading community"
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>

            {/* CTAs Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Button 1: GRAB OFFERS */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                <span className="font-bold text-foreground block">Primary Button (1)</span>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-semibold">Button Text</label>
                  <input
                    type="text"
                    required
                    value={cta1Text}
                    onChange={(e) => setCta1Text(e.target.value)}
                    placeholder="GRAB OFFERS"
                    className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-semibold">Directing Link / Page</label>
                  <input
                    type="text"
                    required
                    value={cta1Url}
                    onChange={(e) => setCta1Url(e.target.value)}
                    placeholder="/deals"
                    className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>

              {/* Button 2: JOIN DISCORD */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
                <span className="font-bold text-foreground block">Secondary Button (2)</span>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-semibold">Button Text</label>
                  <input
                    type="text"
                    required
                    value={cta2Text}
                    onChange={(e) => setCta2Text(e.target.value)}
                    placeholder="Join Discord"
                    className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-semibold">Directing Link / Page</label>
                  <input
                    type="text"
                    required
                    value={cta2Url}
                    onChange={(e) => setCta2Url(e.target.value)}
                    placeholder="https://discord.gg/ww4dkeeZdp"
                    className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
            >
              {saving ? 'Saving...' : 'Save Hero Changes'}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: VERIFIED FIRMS LOGOS & POPUP MODAL */}
      {/* ========================================================================= */}
      {activeTab === 'partners' && (
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Verified Firms Logos Carousel / Grid</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add and edit firm logos using the popup modal to select image, logo shape (Square or Slightly Rounded Edges), and display size.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAddLogoModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Firm Logo</span>
              </button>
              <button
                type="button"
                onClick={handleSavePartners}
                disabled={saving}
                className="px-5 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Logos'}
              </button>
            </div>
          </div>

          {/* Logos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner, index) => (
              <div
                key={partner.id || index}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center shrink-0 ${
                      partner.shape === 'square'
                        ? 'rounded-none'
                        : partner.shape === 'rounded-lg'
                        ? 'rounded-lg'
                        : 'rounded-md'
                    }`}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className={`w-auto object-contain ${
                        partner.size === 'small' ? 'h-6' : partner.size === 'large' ? 'h-10' : 'h-8'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{partner.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span className="capitalize font-mono">Shape: {partner.shape || 'rounded-md'}</span>
                      <span>•</span>
                      <span className="capitalize">Size: {partner.size || 'medium'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditLogoModal(index)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    title="Edit Logo"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartners(partners.filter((_, i) => i !== index))}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* POPUP MODAL FOR ADDING / EDITING LOGO */}
          {isLogoModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <form
                onSubmit={handleSaveLogoModal}
                className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-foreground" />
                    <h3 className="text-base font-bold text-foreground">
                      {editingLogoIndex !== null ? 'Edit Firm Logo' : 'Add Firm Logo'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Quick Select from Prop Firms Directory */}
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Quick Prefill from Firms Directory</label>
                    <select
                      onChange={(e) => handleQuickLoadFirmForLogo(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground font-semibold"
                    >
                      <option value="">-- Choose Existing Prop Firm --</option>
                      {firmsList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Firm Name */}
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Firm Name *</label>
                    <input
                      type="text"
                      required
                      value={logoModalData.name}
                      onChange={(e) => setLogoModalData({ ...logoModalData, name: e.target.value })}
                      placeholder="e.g. NYS Capital"
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground font-bold"
                    />
                  </div>

                  {/* Logo Image & Upload */}
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Logo Image (URL or Upload File)</label>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center shrink-0 ${
                          logoModalData.shape === 'square'
                            ? 'rounded-none'
                            : logoModalData.shape === 'rounded-lg'
                            ? 'rounded-lg'
                            : 'rounded-md'
                        }`}
                      >
                        <img
                          src={logoModalData.logo || '/logos/nys.png'}
                          alt="Logo Preview"
                          className="h-8 w-auto max-w-[40px] object-contain"
                        />
                      </div>
                      <input
                        type="text"
                        value={logoModalData.logo}
                        onChange={(e) => setLogoModalData({ ...logoModalData, logo: e.target.value })}
                        placeholder="/logos/nys.png or image URL"
                        className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground"
                      />
                      <label className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground font-semibold cursor-pointer shrink-0">
                        Upload
                        <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Logo Shape (2 main shapes: Square & Slightly Rounded Edges) */}
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Logo Shape Style</label>
                    <select
                      value={logoModalData.shape}
                      onChange={(e) => setLogoModalData({ ...logoModalData, shape: e.target.value as any })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground font-semibold"
                    >
                      <option value="rounded-md">Slightly Rounded Edges (rounded-md)</option>
                      <option value="rounded-lg">Rounded Edges (rounded-lg)</option>
                      <option value="square">Square (rounded-none)</option>
                    </select>
                  </div>

                  {/* Display Size */}
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Display Size</label>
                    <select
                      value={logoModalData.size}
                      onChange={(e) => setLogoModalData({ ...logoModalData, size: e.target.value as any })}
                      className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-foreground font-semibold"
                    >
                      <option value="small">Small (Height: 32px)</option>
                      <option value="medium">Medium Standard (Height: 40px)</option>
                      <option value="large">Large (Height: 48px)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Save Logo
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: CHOOSE YOUR PLAN (3 CHALLENGE PLANS) */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>&ldquo;CHOOSE YOUR PLAN&rdquo; (3 Featured Challenge Cards)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure the 3 featured plans shown on the homepage with full details (Firm, Account Size, Eval Type, Most Popular badge, Profit Target, Drawdown Daily & Max, Loss Type, Profit Split, Discount, Code Empire, and Buy Challenge redirect).
              </p>
            </div>

            <button
              type="button"
              onClick={handleSavePlans}
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs shrink-0"
            >
              {saving ? 'Saving...' : 'Save 3 Plans'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.slice(0, 3).map((plan, index) => (
              <div
                key={plan.id || index}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  plan.isMostPop
                    ? 'border-2 border-black dark:border-white bg-[#f4f4f5]/80 dark:bg-card'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
                }`}
              >
                <div className="space-y-3.5 text-xs">
                  {/* Card Title & Most Popular Toggle */}
                  <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-2">
                    <span className="font-extrabold text-foreground text-sm">Plan #{index + 1}</span>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!plan.isMostPop}
                        onChange={(e) => handleUpdatePlan(index, 'isMostPop', e.target.checked)}
                        className="rounded text-black focus:ring-black"
                      />
                      <span>Most Popular</span>
                    </label>
                  </div>

                  {/* Firm Select Helper */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Load from Firm</label>
                    <select
                      onChange={(e) => handlePlanFirmSelect(index, e.target.value)}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-semibold"
                    >
                      <option value="">-- Quick Load Firm Specs --</option>
                      {firmsList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Firm Name & Logo URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Firm Name</label>
                    <input
                      type="text"
                      value={plan.name || ''}
                      onChange={(e) => handleUpdatePlan(index, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Logo URL</label>
                    <input
                      type="text"
                      value={plan.logo || ''}
                      onChange={(e) => handleUpdatePlan(index, 'logo', e.target.value)}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground"
                    />
                  </div>

                  {/* Account Size & Eval Type */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Account Size</label>
                      <input
                        type="text"
                        value={plan.accountSize || '$100K'}
                        onChange={(e) => handleUpdatePlan(index, 'accountSize', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-extrabold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Eval Type</label>
                      <input
                        type="text"
                        value={plan.evalType || '( 2-Step )'}
                        onChange={(e) => handleUpdatePlan(index, 'evalType', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-semibold"
                      />
                    </div>
                  </div>

                  {/* Profit Target & Max Loss Type */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Profit Target</label>
                      <input
                        type="text"
                        value={plan.profitTarget || '8%'}
                        onChange={(e) => handleUpdatePlan(index, 'profitTarget', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Loss Type</label>
                      <select
                        value={plan.lossType || 'Static'}
                        onChange={(e) => handleUpdatePlan(index, 'lossType', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-foreground font-semibold"
                      >
                        <option value="Static">Static</option>
                        <option value="Trailing">Trailing</option>
                      </select>
                    </div>
                  </div>

                  {/* Drawdown Daily & Max */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Daily Drawdown</label>
                      <input
                        type="text"
                        value={plan.drawdownDaily || '5%'}
                        onChange={(e) => handleUpdatePlan(index, 'drawdownDaily', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Max Drawdown</label>
                      <input
                        type="text"
                        value={plan.drawdownMax || '10%'}
                        onChange={(e) => handleUpdatePlan(index, 'drawdownMax', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                      />
                    </div>
                  </div>

                  {/* Profit Split & Discount Text */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Profit Split</label>
                      <input
                        type="text"
                        value={plan.profitSplit || '85%'}
                        onChange={(e) => handleUpdatePlan(index, 'profitSplit', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Discount Text</label>
                      <input
                        type="text"
                        value={plan.discount || '20% DISCOUNT'}
                        onChange={(e) => handleUpdatePlan(index, 'discount', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-bold"
                      />
                    </div>
                  </div>

                  {/* Promo Code & Directing URL */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Code Empire Text</label>
                      <input
                        type="text"
                        value={plan.code || 'EMPIRE'}
                        onChange={(e) => handleUpdatePlan(index, 'code', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Buy Directing Link</label>
                      <input
                        type="text"
                        value={plan.buyUrl || `/challenges?firm=${plan.id}`}
                        onChange={(e) => handleUpdatePlan(index, 'buyUrl', e.target.value)}
                        className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-foreground font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: DYNAMIC LIVE STATS ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'stats' && (
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Dynamic Platform Stats Engine</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically calculates stats based on registered users, listed firms, challenges, and total aggregate reviews (sum of all firm review counts + website posted reviews).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefreshLiveCounts}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Counts</span>
              </button>
              <button
                type="button"
                onClick={handleSaveStats}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
              >
                {saving ? 'Saving...' : 'Save Stats'}
              </button>
            </div>
          </div>

          {/* Live Auto-Sync Switch */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-foreground block">
                Auto-Calculate Live Stats from Database
              </span>
              <span className="text-xs text-muted-foreground">
                When enabled, the homepage automatically calculates Active Traders, Verified Firms, Challenges, and Aggregate Reviews (firm reviews sum + posted reviews).
              </span>
            </div>
            <input
              type="checkbox"
              checked={statsAutoSync}
              onChange={(e) => setStatsAutoSync(e.target.checked)}
              className="w-5 h-5 rounded text-black focus:ring-black cursor-pointer"
            />
          </div>

          {/* Live Database Real Counter Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Active Traders</span>
              <span className="text-2xl font-black text-foreground mt-1 block">
                {liveDbCounts.activeTraders.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] text-muted-foreground">From registered user profiles</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Verified Firms</span>
              <span className="text-2xl font-black text-foreground mt-1 block">{liveDbCounts.verifiedFirms}</span>
              <span className="text-[10px] text-muted-foreground">From prop firms database</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Challenges</span>
              <span className="text-2xl font-black text-foreground mt-1 block">{liveDbCounts.challenges}</span>
              <span className="text-[10px] text-muted-foreground">From challenges database</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">Total Aggregate Reviews</span>
              <span className="text-2xl font-black text-foreground mt-1 block">
                {liveDbCounts.reviews.toLocaleString('en-US')}
              </span>
              <span className="text-[10px] text-muted-foreground">Firms reviews sum + posted reviews</span>
            </div>
          </div>

          {/* Editable Display Labels & Suffixes */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase text-foreground tracking-wider">Configure Custom Suffixes & Labels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {customStats.map((st, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Label</label>
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const updated = [...customStats];
                        updated[idx].label = e.target.value;
                        setCustomStats(updated);
                      }}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-foreground font-semibold"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Value</label>
                    <input
                      type="number"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...customStats];
                        updated[idx].value = parseFloat(e.target.value) || 0;
                        setCustomStats(updated);
                      }}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-foreground font-bold"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-[10px] uppercase font-semibold text-muted-foreground">Suffix</label>
                    <input
                      type="text"
                      value={st.suffix}
                      onChange={(e) => {
                        const updated = [...customStats];
                        updated[idx].suffix = e.target.value;
                        setCustomStats(updated);
                      }}
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-foreground font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: "LOVED BY TRADERS WORLDWIDE" (CURATED REVIEWS EXPLORER) */}
      {/* ========================================================================= */}
      {activeTab === 'testimonials' && (
        <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>&ldquo;LOVED BY TRADERS WORLDWIDE&rdquo; (Curated Homepage Reviews)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse and filter every single review posted on the website. Select whichever reviews you like to display on the Home Page testimonial grid!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddCustomTestimonial}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-card dark:text-foreground text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Quote</span>
              </button>
              <button
                type="button"
                onClick={handleSaveTestimonials}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-semibold cursor-pointer shadow-xs"
              >
                {saving ? 'Saving...' : 'Save Testimonials'}
              </button>
            </div>
          </div>

          {/* REVIEWS FILTER BROWSER */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-foreground" />
                <span className="text-xs font-bold text-foreground">Filter & Select Website Reviews ({filteredReviewsList.length} reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search reviews or users..."
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-foreground focus:outline-none focus:border-foreground"
                />
              </div>

              <select
                value={reviewFirmFilter}
                onChange={(e) => setReviewFirmFilter(e.target.value)}
                className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground font-semibold"
              >
                <option value="all">All Prop Firms</option>
                {firmsList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                value={reviewRatingFilter}
                onChange={(e) => setReviewRatingFilter(e.target.value)}
                className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-foreground focus:outline-none focus:border-foreground font-semibold"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            {/* Filtered Reviews Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredReviewsList.map((rev) => {
                const isSelected = testimonials.some((t) => t.review_id === rev.id || t.name === rev.full_name);
                return (
                  <div
                    key={rev.id}
                    className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-card border-zinc-200/80 dark:border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">{rev.full_name}</span>
                          <span className="text-[10px] text-muted-foreground font-semibold">({rev.firm_name})</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-500 text-[11px]">
                          <span>{rev.overall_rating}</span>
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">&ldquo;{rev.body}&rdquo;</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 text-xs">
                      <span className="text-[10px] text-muted-foreground">{rev.created_at || 'Verified Review'}</span>
                      <button
                        type="button"
                        disabled={isSelected}
                        onClick={() => handleAddTestimonialFromReview(rev)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 cursor-default'
                            : 'bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 shadow-2xs'
                        }`}
                      >
                        {isSelected ? 'Featured on Home ✓' : '+ Add to Homepage'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curated Testimonials Currently Active on Homepage */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Featured Homepage Cards ({testimonials.filter(t => t.is_active !== false).length} Active)
            </h3>
            <div className="space-y-3.5">
              {testimonials.map((test, index) => (
                <div
                  key={test.id || index}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-start justify-between gap-4 text-xs"
                >
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={test.name || ''}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].name = e.target.value;
                          setTestimonials(updated);
                        }}
                        placeholder="Trader Name"
                        className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 font-bold text-foreground w-48"
                      />
                      <input
                        type="text"
                        value={test.role || ''}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].role = e.target.value;
                          setTestimonials(updated);
                        }}
                        placeholder="Trader Role / Firm"
                        className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-muted-foreground font-semibold flex-1"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={test.content || ''}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[index].content = e.target.value;
                        setTestimonials(updated);
                      }}
                      placeholder="Trader Review Quote..."
                      className="w-full bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-foreground text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={test.rating || 5}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].rating = parseInt(e.target.value) || 5;
                          setTestimonials(updated);
                        }}
                        className="bg-white dark:bg-card border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-foreground font-bold w-16"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-semibold text-muted-foreground">Active</label>
                      <input
                        type="checkbox"
                        checked={test.is_active !== false}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].is_active = e.target.checked;
                          setTestimonials(updated);
                        }}
                        className="w-5 h-5 rounded text-black focus:ring-black cursor-pointer"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setTestimonials(testimonials.filter((_, i) => i !== index))}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors mt-3"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
