import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const visibleCount = isMobile ? 2 : 6;
  const DEFAULT_TESTIMONIALS = [
    {
      name: "Sarah Chen",
      role: "Funded Forex Trader",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Empirial made finding the perfect prop firm challenge effortless. The side-by-side comparison of drawdown rules, payout splits, and spread telemetry saved me weeks of manual research.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "Prop Portfolio Manager",
      avatar: "https://i.pravatar.cc/150?img=5",
      content:
        "Empirial's evaluation breakdown tool helped me discover prop firms offering 90%+ profit splits and zero news trading restrictions. The community giveaway events and promo discounts are awesome!",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Day Trader & Active Member",
      avatar: "https://i.pravatar.cc/150?img=17",
      content:
        "Empirial is hands down the best platform for prop traders. The transparent firm ratings, prompt support, and community discussions helped me avoid hidden rules and get funded on my first try.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Futures & Algo Trader",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "The multi-firm rating system and community feedback on Empirial are unmatched. I filtered firms by instant funding, no-time-limit challenges, and verified payout proofs before committing capital.",
      rating: 5,
    },
    {
      name: "Robert Taylor",
      role: "Macro & Swing Trader",
      avatar: "https://i.pravatar.cc/150?img=15",
      content:
        "Comparing evaluation rules across top prop firms side-by-side on Empirial completely transformed my strategy. I found a firm that matches my exact risk profile with static drawdown limits.",
      rating: 5,
    },
    {
      name: "Kevin Lee",
      role: "Scalper & Crypto Trader",
      avatar: "https://i.pravatar.cc/150?img=19",
      content:
        "I use Empirial to track spread telemetry and compare firm rules across multiple prop accounts. Having real trader ratings and multi-firm comparisons in one place gives me complete confidence.",
      rating: 5,
    },
    {
      name: "Anuraj Sen",
      role: "Funded Trader (NYS Capital)",
      avatar: "https://i.pravatar.cc/150?img=11",
      content:
        "Passed my NYS Capital 1-Step evaluation using code EMPIRE! Empirial made comparing drawdown rules, payout speed, and profit targets effortless.",
      rating: 5,
    },
    {
      name: "David Krause",
      role: "95% Split Trader (GTF)",
      avatar: "https://i.pravatar.cc/150?img=33",
      content:
        "Got my first payout of $4,200 with Goat Funded Trader! Finding discount codes and genuine ratings on Empirial saved me time and capital.",
      rating: 5,
    },
  ];

  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    async function loadTestimonials() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        if (!snap.empty && snap.docs.length > 0) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Filter only active if is_active is defined
          const activeList = list.filter((t: any) => t.is_active !== false);
          if (activeList.length > 0) {
            setTestimonials(activeList);
          } else {
            setTestimonials(DEFAULT_TESTIMONIALS);
          }
        } else {
          setTestimonials(DEFAULT_TESTIMONIALS);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    }
    loadTestimonials();
  }, []);

  const StarIcon = () => (
    <svg
      className="h-3.5 w-3.5 text-yellow-500 sm:h-4 sm:w-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  return (
    <section id="testimonials" className="px-3 py-16 sm:px-4 sm:py-24 bg-transparent w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col gap-3 text-center sm:mb-20"
        >
          <h2 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
            Loved by Traders Worldwide
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground text-center">
            Join thousands of traders that trust our platform.
          </p>
        </motion.div>

        <div className="relative">
          {/* Always Visible Primary Grid */}
          <div className="columns-2 gap-3 space-y-3 sm:gap-8 sm:space-y-8 md:columns-2 lg:columns-3">
            {testimonials.slice(0, visibleCount).map((testimonial, index) => (
              <motion.div
                key={testimonial.name + index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="mb-3 break-inside-avoid sm:mb-8"
              >
                <div className="rounded-lg border border-zinc-200/80 dark:border-border bg-white/60 dark:bg-card backdrop-blur-md p-3 transition-colors duration-300 sm:rounded-xl sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700">
                  <div className="mb-2 flex sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  <p className="mb-4 text-xs leading-snug text-muted-foreground sm:mb-6 sm:text-sm sm:leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-linear-to-br from-primary/20 to-primary/10 text-xs font-medium sm:h-10 sm:w-10 sm:text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-xs font-semibold sm:text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="truncate text-[10px] leading-tight text-muted-foreground sm:text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Smooth Collapsible Height Container for Expanded Items */}
          {testimonials.length > visibleCount && (
            <motion.div
              initial={false}
              animate={{
                height: showAll ? "auto" : 0,
                opacity: showAll ? 1 : 0,
              }}
              transition={{
                height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.35, ease: "easeInOut" },
              }}
              className="overflow-hidden"
            >
              <div className="pt-3 sm:pt-8 columns-2 gap-3 space-y-3 sm:gap-8 sm:space-y-8 md:columns-2 lg:columns-3">
                {testimonials.slice(visibleCount).map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name + index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={showAll ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: showAll ? index * 0.05 : 0,
                      ease: "easeOut",
                    }}
                    className="mb-3 break-inside-avoid sm:mb-8"
                  >
                    <div className="rounded-lg border border-zinc-200/80 dark:border-border bg-white/60 dark:bg-card backdrop-blur-md p-3 transition-colors duration-300 sm:rounded-xl sm:p-6 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700">
                      <div className="mb-2 flex sm:mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>

                      <p className="mb-4 text-xs leading-snug text-muted-foreground sm:mb-6 sm:text-sm sm:leading-relaxed">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>

                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-linear-to-br from-primary/20 to-primary/10 text-xs font-medium sm:h-10 sm:w-10 sm:text-sm">
                          {testimonial.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-xs font-semibold sm:text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="truncate text-[10px] leading-tight text-muted-foreground sm:text-xs">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Smooth Fade Transition for Gradient Mask */}
          <AnimatePresence>
            {!showAll && testimonials.length > visibleCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-background via-background/90 to-transparent z-10"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-5 font-semibold text-xs sm:text-sm border-border cursor-pointer transition-all duration-200 active:scale-95 hover:border-zinc-400 dark:hover:border-zinc-600"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View less" : "View more"}
          </Button>
          <a
            href="/reviews"
            className="inline-flex items-center justify-center rounded-xl px-5 h-9 sm:h-10 font-semibold text-xs sm:text-sm bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors shadow-xs"
          >
            Give Review
          </a>
        </div>
      </div>
    </section>
  );
}
