"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/firebase/services";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title: "EMPIRIAL\nBuilding Empires",
    subtitle: "Compare prop firms, grab verified discount codes, and access our trading community",
    cta1Text: "GRAB OFFERS",
    cta1Url: "/deals",
    cta2Text: "Join Discord",
    cta2Url: "https://discord.gg/ww4dkeeZdp"
  });

  useEffect(() => {
    async function loadHero() {
      try {
        const settings = await getSiteSettings();
        if (settings && settings.hero) {
          setHeroData({
            title: settings.hero.title || heroData.title,
            subtitle: settings.hero.subtitle || heroData.subtitle,
            cta1Text: settings.hero.cta1Text || heroData.cta1Text,
            cta1Url: settings.hero.cta1Url || heroData.cta1Url,
            cta2Text: settings.hero.cta2Text || heroData.cta2Text,
            cta2Url: settings.hero.cta2Url || heroData.cta2Url,
          });
        }
      } catch (err) {
        console.error('Failed to load hero from Firestore:', err);
      }
    }
    loadHero();
  }, []);

  return (
    <div className="relative justify-center items-center bg-transparent w-full">
      <section className="max-w-7xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.6, type: "spring", bounce: 0 }}
          className="flex flex-col justify-center items-center space-y-5 max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl font-medium tracking-tighter mx-auto sm:text-5xl md:text-6xl text-balance bg-gradient-to-b from-sky-800 dark:from-sky-100 to-foreground dark:to-foreground bg-clip-text text-transparent leading-[1.12] whitespace-pre-line">
            {heroData.title}
          </h1>
          <p className="max-w-2xl text-base sm:text-lg mx-auto text-muted-foreground text-balance leading-relaxed">
            {heroData.subtitle}
          </p>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 w-full sm:w-auto"
          >
            <Button
              asChild
              className="w-full sm:w-auto shadow-lg px-7 py-2.5 rounded-xl font-medium bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
              size="lg"
            >
              <Link href={heroData.cta1Url}>{heroData.cta1Text}</Link>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto shadow-lg px-7 py-2.5 rounded-xl font-medium bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
              size="lg"
            >
              <Link
                href={heroData.cta2Url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {heroData.cta2Text}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
