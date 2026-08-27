"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
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
          <h1 className="text-4xl font-medium tracking-tighter mx-auto sm:text-5xl md:text-6xl text-balance bg-gradient-to-b from-sky-800 dark:from-sky-100 to-foreground dark:to-foreground bg-clip-text text-transparent leading-[1.12]">
            EMPIRIAL<br />
            Building Empires
          </h1>
          <p className="max-w-2xl text-base sm:text-lg mx-auto text-muted-foreground text-balance leading-relaxed">
            Compare prop firms, grab verified discount codes, and access our trading community
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
              <Link href="/deals">GRAB OFFERS</Link>
            </Button>
            <Button
              asChild
              className="w-full sm:w-auto shadow-lg px-7 py-2.5 rounded-xl font-medium bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors"
              size="lg"
            >
              <Link
                href="https://discord.gg/ww4dkeeZdp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
