"use client";

import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Stats() {
  const [animate, setAnimate] = useState(false);

  const stats = [
    { value: 50, suffix: "K+", label: "Active Traders" },
    { value: 40, suffix: "+", label: "Listed Firms" },
    { value: 12, suffix: "K+", label: "Community Reviews" },
    { value: 150, suffix: "+", label: "Active Challenges" },
  ];

  return (
    <section className="py-20 px-4 bg-transparent w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
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
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <NumberFlow
                  value={animate ? stat.value : 0}
                  format={{
                    maximumFractionDigits: stat.value % 1 === 0 ? 0 : 1,
                  }}
                />
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
