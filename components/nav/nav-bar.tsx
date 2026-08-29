"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Gift,
  Shield,
  Layers,
  ArrowRight,
  Menu,
  X,
  TrendingUp,
  Coins,
  Zap,
} from "lucide-react";
import { SearchModal } from "./search-modal";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { openAuthModal, UserProfile } from "@/lib/utils/auth-store";
import { EmpirialLogo } from "@/components/ui/empirial-logo";

export function NavBar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("empirial_user");
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const navLinks = [
    { name: "Challenges", href: "/challenges", badge: "13-Col" },
    { name: "Compare", href: "/compare" },
    { name: "Deals & Coupons", href: "/deals", badge: "Hot", isHot: true },
    { name: "Payouts", href: "/payouts" },
    { name: "Spreads", href: "/spreads" },
    { name: "Community", href: "/community" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border-b border-border/80 shadow-sm"
            : "bg-background/40 backdrop-blur-md border-b border-border/40"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <EmpirialLogo height={36} />

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1 text-sm">
              <Link
                href="/challenges"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${pathname === "/challenges"
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
              >
                <span>Challenges</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  13-Col
                </span>
              </Link>

              {/* Radix Dropdown for Prop Firms Directory */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1 font-medium ${pathname.startsWith("/firms") || pathname.startsWith("/forex") || pathname.startsWith("/futures")
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <span>Prop Firms</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-1.5 rounded-2xl bg-white dark:bg-[#141414] backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-0.5">
                  <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                    <Link
                      href="/firms"
                      className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        <span>All Prop Firms Directory</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />
                  <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                    <Link href="/forex" className="flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-100">
                      <TrendingUp className="h-4 w-4 text-cyan-500" />
                      <span>Forex Prop Firms</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                    <Link href="/futures" className="flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-100">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span>Futures Prop Firms (Topstep, Apex)</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                    <Link href="/crypto" className="flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-100">
                      <Coins className="h-4 w-4 text-purple-500" />
                      <span>Crypto Prop Trading</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-2 cursor-pointer">
                    <Link href="/instant-funding" className="flex items-center gap-2 cursor-pointer text-zinc-900 dark:text-zinc-100">
                      <Gift className="h-4 w-4 text-emerald-500" />
                      <span>Instant Funding (No Evaluation)</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {navLinks.slice(1).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors relative ${isActive
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${link.isHot
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
                            : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Search Palette Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="gap-2 h-9 px-3 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline text-xs">Search...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono rounded bg-muted border border-border text-muted-foreground">
                ⌘K
              </kbd>
            </Button>

            {/* Connect on X Button (from saas template) */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 h-9"
            >
              <Link href="https://x.com/gonzalochale" target="_blank" rel="noopener noreferrer">
                <span className="text-xs">Connect on</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 1200 1227"
                  className="size-3"
                >
                  <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
                </svg>
              </Link>
            </Button>

            {/* Loyalty / Points */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex gap-1.5 h-9 bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
            >
              <Link href="/loyalty">
                <Gift className="w-3.5 h-3.5" />
                <span>{currentUser?.points || 200} pts</span>
              </Link>
            </Button>

            {/* Admin Portal Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex gap-1.5 h-9 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            >
              <Link href="/admin">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            </Button>

            {/* Theme Switcher Toggle */}
            <ThemeSwitcher />

            {/* User Profile / Login Trigger */}
            {currentUser ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 h-9 rounded-xl font-bold bg-black text-white dark:bg-white dark:text-black border-0 shadow-xs cursor-pointer"
              >
                <Link href="/profile">
                  <div className="w-5 h-5 rounded-md bg-zinc-800 dark:bg-zinc-200 overflow-hidden flex items-center justify-center font-bold text-[10px] text-white dark:text-black">
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <span className="text-xs">
                    PROFILE
                  </span>
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={openAuthModal}
                className="h-9 font-semibold text-xs rounded-xl bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer shadow-xs"
              >
                Connect
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Animated Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden border-t border-border/80 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 pb-2">
                <Link
                  href="/challenges"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:text-primary transition-colors"
                >
                  Challenges Matrix
                </Link>
                <Link
                  href="/firms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:text-primary transition-colors"
                >
                  Prop Firms
                </Link>
                <Link
                  href="/compare"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:text-primary transition-colors"
                >
                  Side-by-Side Compare
                </Link>
                <Link
                  href="/deals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-primary"
                >
                  Deals & Coupons (Hot)
                </Link>
                <Link
                  href="/payouts"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Payout Proofs
                </Link>
                <Link
                  href="/spreads"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Broker Spreads
                </Link>
                <Link
                  href="/community"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Trader Forum
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground"
                >
                  Pricing Plans
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default NavBar;
