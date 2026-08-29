"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/firebase/services";
import { EmpirialLogo } from "@/components/ui/empirial-logo";

const Footer = () => {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadFooter() {
      try {
        const data = await getSiteSettings();
        if (data && data.footer) {
          setSettings(data.footer);
        }
      } catch (err) {
        console.error("Failed to load footer settings:", err);
      }
    }
    loadFooter();
  }, []);

  const brandName = settings?.brandName || "EMPIRIAL";
  const tagline = settings?.tagline || "Prop Trading Intelligence & Evaluation Platform.";
  const copyrightText = settings?.copyrightText || `© ${year} EMPIRIAL. All rights reserved.`;

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://x.com/empirial",
      icon: TwitterLogoIcon,
    },
    {
      name: "GitHub",
      href: "https://github.com/empirial",
      icon: GitHubLogoIcon,
    },
  ];

  const footerLinks = [
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Get Started", href: "#" },
  ];

  return (
    <footer className="w-full border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            <div className="space-y-3">
              <EmpirialLogo height={32} />
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {tagline}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {footerLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Social</h3>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
            <span>{copyrightText}</span>
            <span className="font-medium">#BuildingEmpires</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
