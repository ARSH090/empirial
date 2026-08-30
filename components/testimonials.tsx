import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const visibleCount = isMobile ? 2 : 6;

  useEffect(() => {
    async function loadTestimonials() {
      if (!db) return;
      try {
        const snap = await getDocs(collection(db, 'testimonials'));
        if (!snap.empty) {
          setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      name: "Marcus Rodriguez",
      role: "Futures & Algo Trader",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "The multi-firm rating system and community feedback on Empirial are unmatched. I filtered firms by instant funding, no-time-limit challenges, and verified payout proofs before committing capital.",
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
      name: "Robert Taylor",
      role: "Macro & Swing Trader",
      avatar: "https://i.pravatar.cc/150?img=15",
      content:
        "Comparing evaluation rules across top prop firms side-by-side on Empirial completely transformed my strategy. I found a firm that matches my exact risk profile with static drawdown limits.",
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
      name: "Kevin Lee",
      role: "Scalper & Crypto Trader",
      avatar: "https://i.pravatar.cc/150?img=19",
      content:
        "I use Empirial to track spread telemetry and compare firm rules across multiple prop accounts. Having real trader ratings and multi-firm comparisons in one place gives me complete confidence.",
      rating: 5,
    },
    {
      name: "Sophie Anderson",
      role: "Quantitative Trader",
      avatar: "https://i.pravatar.cc/150?img=21",
      content:
        "The challenge filter on Empirial allowed me to sort prop firms by 1-step vs. 2-step evaluation rules, scaling plans, and payout speed. It's the ultimate resource for serious funded traders.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Funded Commodity Trader",
      avatar: "https://i.pravatar.cc/150?img=23",
      content:
        "Empirial's trading community and verified firm reviews made it easy to compare multi-firm options. Finding exclusive discount codes and event giveaways right on the platform is incredible.",
      rating: 5,
    },
    {
      name: "Elena Petrov",
      role: "Forex Risk Manager",
      avatar: "https://i.pravatar.cc/150?img=25",
      content:
        "Navigating prop firm evaluation rules used to be overwhelming. Empirial breaks down every parameter—from daily drawdown to profit targets—making it simple to choose the best challenge.",
      rating: 5,
    },
    {
      name: "Michael Chang",
      role: "Multi-Account Funded Trader",
      avatar: "https://i.pravatar.cc/150?img=27",
      content:
        "Thanks to Empirial's multi-firm comparative tools, I built a diversified portfolio of funded accounts across three top-tier firms. The community insights and unbiased ratings are invaluable.",
      rating: 5,
    },
  ];

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
          <div className="columns-2 gap-3 space-y-3 sm:gap-8 sm:space-y-8 md:columns-2 lg:columns-3">
            {(showAll ? testimonials : testimonials.slice(0, visibleCount)).map(
              (testimonial, index) => (
                <motion.div
                  key={index}
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
                  <div className="rounded-lg border border-zinc-200/80 dark:border-border bg-white/60 dark:bg-card backdrop-blur-md p-3 transition-colors duration-300 sm:rounded-xl sm:p-6">
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
              ),
            )}
          </div>

          {!showAll && testimonials.length > visibleCount && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-background via-background/90 to-transparent" />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl px-5 font-semibold text-xs sm:text-sm border-border"
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
