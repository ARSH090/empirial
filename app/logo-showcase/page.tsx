"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/nav/nav-bar";
import Footer from "@/components/footer";
import { LogoTridentE, LogoVariant } from "@/components/ui/logo-trident-e";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Download, Sun, Moon, Sparkles, ArrowLeft, Layers, ShieldCheck } from "lucide-react";

interface VariantMetadata {
  id: LogoVariant;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

const VARIANTS: VariantMetadata[] = [
  {
    id: "v1",
    title: "Variant 1: Sharp Geometric Trident 'E'",
    subtitle: "Modern Precision & Clean Architectural Angles",
    description: "Features crisp horizontal arms terminating in distinct trident prongs with rounded inner joints for optimum legibility across all digital screen sizes.",
    badge: "Recommended Standard",
  },
  {
    id: "v2",
    title: "Variant 2: Sovereign Curved Trident 'E'",
    subtitle: "Luxury Sweeping Curves & Dominant Spearhead",
    description: "Inspired by Poseidon's trident, featuring elegant bezier curves flowing into a prominent central spearhead. Premium high-end luxury feel.",
    badge: "Luxury Monogram",
  },
  {
    id: "v3",
    title: "Variant 3: Abstract Minimal Cutout 'E'",
    subtitle: "Architectural Block & Negative Space Accents",
    description: "Bold structural silhouette with integrated negative-space trident cutouts and accent geometric node points.",
    badge: "Minimalist Crest",
  },
  {
    id: "v4",
    title: "Variant 4: Cyber Line-Art Smooth 'E'",
    subtitle: "Continuous Precision Vector Line Drawing",
    description: "Sleek continuous stroke vector drawing that morphs the letter E into a smooth 3-pronged cyber trident.",
    badge: "Vector Stroke",
  },
  {
    id: "v5",
    title: "Variant 5: Imperial Monogram Emblem 'E'",
    subtitle: "Symmetrical Sovereign Crest & Beveled Tines",
    description: "Combines an architectural vertical column with a crowned trident emblem for an authoritative brand identity.",
    badge: "Imperial Crest",
  },
];

export default function LogoShowcasePage() {
  const [activeTheme, setActiveTheme] = useState<"both" | "dark" | "light">("both");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySvg = (variantId: LogoVariant) => {
    const svgPath = `/logos/empirial-trident-e-${variantId}.svg`;
    fetch(svgPath)
      .then((res) => res.text())
      .then((text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(variantId);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.error("Failed to copy SVG:", err));
  };

  const handleDownloadSvg = (variantId: LogoVariant) => {
    const link = document.createElement("a");
    link.href = `/logos/empirial-trident-e-${variantId}.svg`;
    link.download = `empirial-trident-e-${variantId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Platform
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand Identity System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
              Black & White Trident "E" Logo Collection
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Minimalist, premium monochrome brand logo designs. Theme-adaptive vector architecture automatically switches between crisp white drawing on pure black background and crisp black drawing on pure white background.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-xl border border-border/60">
            <Button
              variant={activeTheme === "both" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTheme("both")}
              className="rounded-lg text-xs font-medium"
            >
              <Layers className="w-3.5 h-3.5 mr-1.5" /> Both Themes
            </Button>
            <Button
              variant={activeTheme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTheme("dark")}
              className="rounded-lg text-xs font-medium"
            >
              <Moon className="w-3.5 h-3.5 mr-1.5" /> Dark Mode Only
            </Button>
            <Button
              variant={activeTheme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTheme("light")}
              className="rounded-lg text-xs font-medium"
            >
              <Sun className="w-3.5 h-3.5 mr-1.5" /> Light Mode Only
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-black dark:border-white text-foreground text-[11px] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 mr-1" /> Dynamic SVG Engine
              </Badge>
              <span className="text-xs text-muted-foreground font-medium">100% Vector Vector Graphics</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Theme Adaptive Contract (Rule 2 Monochrome Standard)
            </h2>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              When user is in <strong>Dark Theme</strong>: Logo renders on <strong>Black Background</strong> with <strong>White Drawing</strong>. <br />
              When user is in <strong>Light Theme</strong>: Logo renders on <strong>White Background</strong> with <strong>Black Drawing</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 bg-black text-white px-4 py-3 rounded-xl text-xs font-medium shadow-md">
              <img src="/logos/empirial-dark-logo.png" alt="Black Theme Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span>1st Image Logo (Black Theme)</span>
            </div>
            <div className="flex items-center gap-3 bg-white text-black border border-zinc-200 px-4 py-3 rounded-xl text-xs font-medium shadow-md">
              <img src="/logos/empirial-light-logo.png" alt="White Theme Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span>2nd Image Logo (White Theme)</span>
            </div>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Logo Variations & Mockup Previews
            </h3>
            <span className="text-xs text-muted-foreground">5 Premium Concepts Available</span>
          </div>

          <div className="space-y-10">
            {VARIANTS.map((v) => (
              <div
                key={v.id}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-bold text-foreground">{v.title}</h4>
                      <Badge className="bg-black text-white dark:bg-white dark:text-black font-semibold text-[10px]">
                        {v.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{v.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopySvg(v.id)}
                      className="rounded-xl text-xs font-medium"
                    >
                      {copiedId === v.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Copied SVG!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy SVG Code
                        </>
                      )}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleDownloadSvg(v.id)}
                      className="rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download SVG
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(activeTheme === "both" || activeTheme === "dark") && (
                      <div className="rounded-2xl bg-[#000000] border border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[220px] relative group overflow-hidden">
                        <div className="absolute top-3 left-4 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
                            Dark Theme (Black Background)
                          </span>
                        </div>
                        
                        <div className="my-auto transition-transform duration-300 group-hover:scale-110">
                          <LogoTridentE variant={v.id} size={96} themeMode="dark" />
                        </div>

                        <span className="text-[10px] font-mono text-zinc-500 mt-2">White Vector Fill (#FFFFFF)</span>
                      </div>
                    )}

                    {(activeTheme === "both" || activeTheme === "light") && (
                      <div className="rounded-2xl bg-[#FFFFFF] border border-zinc-200 p-8 flex flex-col items-center justify-center min-h-[220px] relative group overflow-hidden shadow-inner">
                        <div className="absolute top-3 left-4 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-black" />
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">
                            Light Theme (White Background)
                          </span>
                        </div>

                        <div className="my-auto transition-transform duration-300 group-hover:scale-110">
                          <LogoTridentE variant={v.id} size={96} themeMode="light" />
                        </div>

                        <span className="text-[10px] font-mono text-zinc-400 mt-2">Black Vector Fill (#000000)</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center justify-between gap-6 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-2xl">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Responsive Scale Testing:
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center gap-1">
                        <div className="p-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">
                          <LogoTridentE variant={v.id} size={20} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">20px Nav</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="p-2 rounded-xl bg-black dark:bg-white text-white dark:text-black">
                          <LogoTridentE variant={v.id} size={32} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">32px App</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="p-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-sm">
                          <LogoTridentE variant={v.id} size={44} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">44px Header</span>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <div className="p-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-md">
                          <LogoTridentE variant={v.id} size={56} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">56px Hero</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Technical Specification & Integration Code</h3>
              <p className="text-xs text-muted-foreground">How to use these theme-adaptive logos across your project</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono">
              <div className="text-muted-foreground font-sans font-semibold mb-2">React Component Usage:</div>
              <pre className="text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap">
{`import { LogoTridentE } from "@/components/ui/logo-trident-e";

// Standard Theme-Adaptive Usage (Black/White)
<LogoTridentE variant="v1" size={32} />

// Forced Dark Mode (Black BG + White Drawing)
<LogoTridentE variant="v1" size={32} themeMode="dark" />

// Forced Light Mode (White BG + Black Drawing)
<LogoTridentE variant="v1" size={32} themeMode="light" />`}
              </pre>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono">
              <div className="text-muted-foreground font-sans font-semibold mb-2">Static File Paths:</div>
              <pre className="text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-pre-wrap">
{`/public/logos/empirial-trident-e-v1.svg
/public/logos/empirial-trident-e-v2.svg
/public/logos/empirial-trident-e-v3.svg
/public/logos/empirial-trident-e-v4.svg
/public/logos/empirial-trident-e-v5.svg`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
