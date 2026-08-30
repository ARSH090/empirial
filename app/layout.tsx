import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/navbar';
import { OfferPosterModal } from '@/components/offer-poster-modal';
import { ReferralTracker } from '@/components/referral-tracker';
import { BrandingSync } from '@/components/branding-sync';

export const metadata: Metadata = {
  title: 'EMPIRIAL | Prop Trading Intelligence & Evaluation Platform',
  description: 'Compare prop trading firms, evaluate rules, telemetry spreads, and find verified payout proof.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Centralized Branding Synchronizer */}
          <BrandingSync />

          {/* Referral & Session Synchronizer */}
          <ReferralTracker />

          {/* Global Navigation */}
          <NavBar />

          {/* Session Welcome Offer Poster Modal */}
          <OfferPosterModal />

          {/* Main Content Area */}
          <main className="flex-1 w-full bg-background">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
