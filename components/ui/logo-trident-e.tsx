"use client";

import React from "react";

export type LogoVariant = "v1" | "v2" | "v3" | "v4" | "v5";

interface LogoTridentEProps {
  variant?: LogoVariant;
  className?: string;
  size?: number | string;
  themeMode?: "auto" | "dark" | "light";
  withBackground?: boolean;
}

export const LogoTridentE: React.FC<LogoTridentEProps> = ({
  variant = "v1",
  className = "",
  size = 36,
  themeMode = "auto",
  withBackground = false,
}) => {
  const dim = typeof size === "number" ? `${size}px` : size;

  let colorStyle = "text-foreground";
  let containerBg = "";

  if (themeMode === "dark") {
    colorStyle = "text-white";
    containerBg = "bg-black";
  } else if (themeMode === "light") {
    colorStyle = "text-black";
    containerBg = "bg-white";
  } else if (withBackground) {
    containerBg = "bg-background border border-border/40";
  }

  const renderSvgContent = () => {
    switch (variant) {
      case "v1":
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 20 16 C 20 13.79 21.79 12 24 12 L 34 12 C 36.21 12 38 13.79 38 16 L 38 84 C 38 86.21 36.21 88 34 88 L 24 88 C 21.79 88 20 86.21 20 84 Z" fill="currentColor"/>
            <path d="M 34 12 L 74 12 C 78.5 12 82 15.5 82 20 L 82 28 C 82 30.2 80.2 32 78 32 C 75.8 32 74 30.2 74 28 L 74 24 L 34 24 Z" fill="currentColor"/>
            <path d="M 34 44 L 72 44 L 86 50 L 72 56 L 34 56 Z" fill="currentColor"/>
            <path d="M 34 76 L 74 76 L 74 72 C 74 69.8 75.8 68 78 68 C 80.2 68 82 69.8 82 72 L 82 80 C 82 84.5 78.5 88 74 88 L 34 88 Z" fill="currentColor"/>
            <path d="M 38 47 L 50 50 L 38 53 Z" fill="currentColor" opacity="0.9"/>
          </svg>
        );
      case "v2":
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 22 18 C 22 14.69 24.69 12 28 12 C 48 12 68 14 82 24 C 84.5 25.8 83.5 30 80.2 30 C 77.5 30 75 28.5 72.8 27 C 60 18.5 44 19 36 21 L 36 43 L 70 43 C 73 43 76 40 78 36 L 82 36 L 88 50 L 82 64 L 78 64 C 76 60 73 57 70 57 L 36 57 L 36 79 C 44 81 60 81.5 72.8 73 C 75 71.5 77.5 70 80.2 70 C 83.5 70 84.5 74.2 82 76 C 68 86 48 88 28 88 C 24.69 88 22 85.31 22 82 Z" fill="currentColor"/>
            <path d="M 88 50 L 78 47 L 78 53 Z" fill="currentColor"/>
          </svg>
        );
      case "v3":
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 18 14 C 18 11.79 19.79 10 22 10 L 82 10 C 85 10 86.5 13.5 84.4 15.6 L 72 28 L 34 28 L 34 42 L 76 42 L 88 50 L 76 58 L 34 58 L 34 72 L 72 72 L 84.4 84.4 C 86.5 86.5 85 90 82 90 L 22 90 C 19.79 90 18 88.21 18 86 Z" fill="currentColor"/>
            <circle cx="82" cy="18" r="3" fill="currentColor"/>
            <circle cx="88" cy="50" r="3.5" fill="currentColor"/>
            <circle cx="82" cy="82" r="3" fill="currentColor"/>
          </svg>
        );
      case "v4":
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M 78 18 C 82 18 84 22 80 26 C 70 36 52 24 32 24 C 26 24 24 28 24 34 L 24 66 C 24 72 26 76 32 76 C 52 76 70 64 80 74 C 84 78 82 82 78 82" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 24 50 L 74 50 L 86 50" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
            <path d="M 74 42 L 86 50 L 74 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "v5":
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="20" y="14" width="14" height="72" rx="4" fill="currentColor"/>
            <path d="M 34 14 L 76 14 C 80 14 82 17 80 20 L 72 30 L 64 24 L 34 24 Z" fill="currentColor"/>
            <path d="M 34 43 L 68 43 L 88 50 L 68 57 L 34 57 Z" fill="currentColor"/>
            <path d="M 34 76 L 64 76 L 72 70 L 80 80 C 82 83 80 86 76 86 L 34 86 Z" fill="currentColor"/>
            <line x1="52" y1="14" x2="52" y2="86" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 transition-all duration-300 ${colorStyle} ${containerBg} ${
        withBackground ? "p-2 rounded-xl" : ""
      } ${className}`}
      style={{ width: dim, height: dim }}
      title={`EMPIRIAL Trident E Logo (${variant.toUpperCase()})`}
    >
      {renderSvgContent()}
    </div>
  );
};

export default LogoTridentE;
