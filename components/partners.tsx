"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Partners() {
  const verifiedFirms = [
    {
      name: "Alpha Capital",
      logo: "/logos/alpha-capital.png",
    },
    {
      name: "CK Capital",
      logo: "/logos/ck-capital.avif",
    },
    {
      name: "GTF",
      logo: "/logos/gtf.svg",
    },
    {
      name: "NYS Capital",
      logo: "/logos/nys.png",
    },
    {
      name: "Pipstone",
      logo: "/logos/pipstone.png",
    },
    {
      name: "Shark Funded",
      logo: "/logos/shark-funded.webp",
    },
    {
      name: "Sure Leverage Funding",
      logo: "/logos/sure-leverage.jpg",
    },
  ];

  return (
    <section className="max-w-6xl w-full mx-auto px-4 py-16 sm:py-20 gap-10 md:px-8 flex flex-col justify-center items-center text-center bg-transparent">
      <motion.div
        initial={{ y: 20, opacity: 0, filter: "blur(3px)" }}
        whileInView={{
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring", bounce: 0 }}
        className="flex flex-col gap-3"
      >
        <h2 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          Verified Firms
        </h2>
      </motion.div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-6 sm:gap-8 place-items-center items-center justify-center">
        <TooltipProvider>
          {verifiedFirms.map((firm, index) => (
            <Tooltip key={firm.name}>
              <TooltipTrigger asChild>
                <div className="shrink-0 p-1.5 flex items-center justify-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{
                      y: 0,
                      opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.08,
                      type: "spring",
                      bounce: 0,
                    }}
                    className="flex items-center justify-center rounded-md overflow-hidden"
                  >
                    <img
                      src={firm.logo}
                      alt={firm.name}
                      className="h-8 sm:h-10 w-auto max-w-[110px] object-contain rounded-md transition-transform duration-200 hover:scale-105"
                    />
                  </motion.div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="font-semibold text-xs bg-card border border-border text-foreground">
                {firm.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </section>
  );
}
