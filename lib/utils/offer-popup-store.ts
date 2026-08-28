export interface OfferPosterConfig {
  enabled: boolean;
  layoutStructure: 'side-by-side' | 'stacked';
  badge: string;
  title: string;
  subtitle: string;
  discountTag: string;
  couponCode: string;
  buttonText: string;
  buttonLink: string;
  posterImageUrl?: string;
  benefits: string[];
  extraNote?: string;
}

export const DEFAULT_OFFER_POSTER: OfferPosterConfig = {
  enabled: true,
  layoutStructure: 'side-by-side',
  badge: "VERY LIMITED DEAL + 1 FREE ACCOUNT ‼️",
  title: "Funded Futures Family Flash Sale",
  subtitle: "Get Discount of up to 80% in FUNDED FUTURES FAMILY + 1 FREE ACCOUNT for the Lucky Trader!",
  discountTag: "UP TO 80% OFF",
  couponCode: "ANURAJ",
  buttonText: "Claim 80% Discount & Buy Challenge",
  buttonLink: "https://app.fundedfuturesfamily.com/affiliation/?ref_code=ebf4f4f2-30a0-4067-bdc7-396dca6c5258",
  posterImageUrl: "/posters/funded-futures-family.jpg",
  benefits: [
    "Payout Protection Guarantee",
    "Special Accounts (100% OFF)",
    "Special VIP Support via Discord (Link in Bio)",
  ],
  extraNote: "Valid till Friday 5 PM EST. 1 Lucky buyer gets a 100% Free Account!",
};

const STORAGE_KEY = "empirial_offer_poster_config";

export function getStoredOfferPoster(): OfferPosterConfig {
  if (typeof window === "undefined") return DEFAULT_OFFER_POSTER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_OFFER_POSTER;
    return { ...DEFAULT_OFFER_POSTER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_OFFER_POSTER;
  }
}

export function saveOfferPoster(config: OfferPosterConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent("offer-poster-changed", { detail: config }));
  } catch (err) {
    console.error("Failed to save offer poster config", err);
  }
}

export function resetOfferPoster(): OfferPosterConfig {
  if (typeof window === "undefined") return DEFAULT_OFFER_POSTER;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("offer-poster-changed", { detail: DEFAULT_OFFER_POSTER }));
  } catch {}
  return DEFAULT_OFFER_POSTER;
}
