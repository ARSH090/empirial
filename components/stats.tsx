"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, getLivePlatformStats } from "@/lib/firebase/services";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

export default function Stats() {
  const [animate, setAnimate] = useState(false);
  const DEFAULT_STATS = [
    { value: 10, suffix: "+", label: "Active Traders" },
    { value: 7, suffix: "+", label: "Verified Firms" },
    { value: 42, suffix: "+", label: "Challenges" },
    { value: 0, suffix: "+", label: "Community Reviews" },
  ];

  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    async function loadStats() {
      try {
        const [settings, liveStats] = await Promise.all([
          getSiteSettings(),
          getLivePlatformStats(),
        ]);

        if (settings && settings.stats_auto_sync === false && settings.stats && settings.stats.length >= 4) {
          setStats(settings.stats);
          return;
        }

        // Compute live values dynamically from real backend state
        const rawTraders = liveStats.activeTraders || 10;
        const tradersVal = rawTraders >= 1000 ? Math.round(rawTraders / 1000) : rawTraders;
        const tradersSuffix = rawTraders >= 1000 ? "K+" : "+";

        const rawReviews = liveStats.reviews || 0;
        const reviewsVal = rawReviews >= 1000 ? Number((rawReviews / 1000).toFixed(rawReviews % 1000 === 0 ? 0 : 1)) : rawReviews;
        const reviewsSuffix = rawReviews >= 1000 ? "K+" : "+";

        const dynamicStats = [
          {
            value: tradersVal,
            suffix: tradersSuffix,
            label: "Active Traders",
          },
          {
            value: liveStats.verifiedFirms || 7,
            suffix: "+",
            label: "Verified Firms",
          },
          {
            value: liveStats.challenges || 42,
            suffix: "+",
            label: "Challenges",
          },
          {
            value: reviewsVal,
            suffix: reviewsSuffix,
            label: "Community Reviews",
          },
        ];

        setStats(dynamicStats);
      } catch (err) {
        console.error("Failed to load dynamic stats:", err);
        setStats(DEFAULT_STATS);
      }
    }
    loadStats();
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 bg-transparent w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          onViewportEnter={() => setAnimate(true)}
          viewport={{ once: true, amount: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-1.5">
                <NumberFlow
                  value={animate ? stat.value : 0}
                  format={{
                    maximumFractionDigits: stat.value % 1 === 0 ? 0 : 1,
                  }}
                />
                {stat.suffix}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
