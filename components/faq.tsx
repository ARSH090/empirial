"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  const accordionItems = [
    {
      title: "What is EMPIRIAL?",
      content: (
        <div className="text-muted-foreground">
          EMPIRIAL is a prop trading intelligence platform that helps traders compare prop firms, evaluate drawdown & payout rules, aggregate verified discount codes, and access real-time spread telemetry.
        </div>
      ),
    },
    {
      title: "Are the discount codes and offers verified?",
      content: (
        <div className="text-muted-foreground">
          Yes! Every promo code, coupon, and exclusive deal listed on EMPIRIAL is verified directly with partner prop firms and updated daily.
        </div>
      ),
    },
    {
      title: "How do I compare prop firm rules & drawdown models?",
      content: (
        <div className="text-muted-foreground">
          You can use our Compare tool to inspect profit splits, trailing vs. static drawdowns, scaling plans, maximum lot sizes, and news trading rules side by side.
        </div>
      ),
    },
    {
      title: "Is EMPIRIAL free to use for traders?",
      content: (
        <div className="text-muted-foreground">
          Yes, accessing our firm comparison tools, telemetry data, discount codes, and community resources is completely free for all traders.
        </div>
      ),
    },
    {
      title: "How do I join the EMPIRIAL trader community?",
      content: (
        <div className="text-muted-foreground">
          You can join our Discord community to connect with funded traders, share strategy insights, and get real-time payout alerts.
        </div>
      ),
    },
  ];

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5, type: "spring", bounce: 0 }}
      className="relative w-full max-w-7xl mx-auto px-4 py-24 gap-5 md:px-8 flex flex-col justify-center items-center bg-transparent"
    >
      <div className="flex flex-col gap-3 justify-center items-center">
        <h4 className="text-xl font-semibold sm:text-2xl bg-gradient-to-b from-foreground to-muted-foreground text-transparent bg-clip-text">
          FAQ
        </h4>
        <p className="max-w-xl text-muted-foreground text-center text-sm sm:text-base">
          Here are some of our frequently asked questions for traders.
        </p>
      </div>
      <div className="flex w-full max-w-lg">
        <Accordion type="multiple" className="w-full">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="text-muted-foreground"
            >
              <AccordionTrigger className="text-left font-medium text-foreground">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.section>
  );
}
