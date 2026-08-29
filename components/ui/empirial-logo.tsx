"use client";

import React from "react";
import Link from "next/link";

interface EmpirialLogoProps {
  height?: number | string; // Height of the logo PNG in pixels or CSS units
  showText?: boolean;
  textSize?: string;
  className?: string;
  href?: string;
}

export const EmpirialLogo: React.FC<EmpirialLogoProps> = ({
  height = 36,
  showText = true,
  textSize = "text-xl md:text-2xl font-bold tracking-tight",
  className = "",
  href = "/",
}) => {
  const hDim = typeof height === "number" ? `${height}px` : height;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Transparent PNG Logo Element - 1st Image (White Trident) for Dark/Black Theme, 2nd Image (Black Trident) for Light/White Theme */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {/* 1st Image PNG Logo (Black Theme: White Trident with Transparent Background) */}
        <img
          src="/logos/empirial-trident-dark.png"
          alt="EMPIRIAL Logo"
          className="hidden dark:block object-contain"
          style={{ height: hDim, width: "auto" }}
        />
        {/* 2nd Image PNG Logo (White Theme: Black Trident with Transparent Background) */}
        <img
          src="/logos/empirial-trident-light.png"
          alt="EMPIRIAL Logo"
          className="block dark:hidden object-contain"
          style={{ height: hDim, width: "auto" }}
        />
      </div>

      {showText && (
        <span className={`text-foreground transition-colors group-hover:opacity-90 ${textSize}`}>
          EMPIRIAL
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="EMPIRIAL Homepage" className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default EmpirialLogo;
