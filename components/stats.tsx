"use client";

import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/firebase/services";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";

export default function Stats() {
  const [animate, setAnimate] = useState(false);
  const DEFAULT_STATS = [
    { value: 50, suffix: "K+", label: "Active Traders" },
    { value: 40, suffix: "+", label: "Verified Firms" },
    { value: 150, suffix: "+", label: "Challenges" },
    { value: 12, suffix: "K+", label: "Reviews" },
  ];

  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    async function loadStats() {
      try {
        const settings = await getSiteSettings();
        if (settings && settings.stats && settings.stats.length >= 4) {
          // Verify that Firestore stats match required labels or use DEFAULT_STATS
          const hasRequiredLabels = settings.stats.some(
            (s: any) => s.label === "Verified Firms" || s.label === "Challenges"
          );
          if (hasRequiredLabels) {
            setStats(settings.stats);
          } else {
            setStats(DEFAULT_STATS);
          }
        } else {
          setStats(DEFAULT_STATS);
        }
      } catch (err) {
        console.error('Failed to load stats from Firestore:', err);
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
