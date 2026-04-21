import React from "react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;

export default function ThemesSlide() {
  const { themes } = presentationData;

  const patterns = {
    lavender: (
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lavender-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </linearGradient>
          <mask id="lavender-mask">
            <rect width="100%" height="100%" fill="url(#lavender-fade)" />
          </mask>
          <pattern
            id="lavender-diamonds"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <rect x="40" y="40" width="0" height="0" fill="none" />
            <path
              d="M40 10 L70 40 L40 70 L10 40 Z"
              stroke={presentationTheme.patternColor.lavender}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M40 20 L60 40 L40 60 L20 40 Z"
              stroke={presentationTheme.patternColor.lavender}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="8"
              stroke={presentationTheme.patternColor.lavender}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#lavender-diamonds)"
          mask="url(#lavender-mask)"
        />
      </svg>
    ),
    blue: (
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blue-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </linearGradient>
          <mask id="blue-mask">
            <rect width="100%" height="100%" fill="url(#blue-fade)" />
          </mask>
          <pattern
            id="blue-circles"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke={presentationTheme.patternColor.blue}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="20"
              stroke={presentationTheme.patternColor.blue}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="10"
              stroke={presentationTheme.patternColor.blue}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <circle
              cx="40"
              cy="40"
              r="3"
              fill={presentationTheme.patternColor.blue}
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#blue-circles)"
          mask="url(#blue-mask)"
        />
      </svg>
    ),
    sage: (
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sage-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0 }} />
          </linearGradient>
          <mask id="sage-mask">
            <rect width="100%" height="100%" fill="url(#sage-fade)" />
          </mask>
          <pattern
            id="sage-chevrons"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 20 L30 40 L50 20"
              stroke={presentationTheme.patternColor.sage}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M10 35 L30 55 L50 35"
              stroke={presentationTheme.patternColor.sage}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#sage-chevrons)"
          mask="url(#sage-mask)"
        />
      </svg>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="mb-12 space-y-2">
        <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
          Everything you said in {themes.length} areas
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2 animate-in slide-in-from-bottom-4 duration-500">
        {themes.map((theme) => (
          <article
            key={theme.id}
            className={`relative ${ui.panelStrong} overflow-hidden rounded-[28px] p-8 shadow-soft-sm transition-all`}
          >
            {patterns[theme.color] || patterns.lavender}

            <div className="relative z-10 space-y-4 pt-16">
              <div className="space-y-2">
                <h3 className={`text-xl font-semibold ${ui.text}`}>{theme.title}</h3>
                <p className={`${ui.textMuted} leading-relaxed line-clamp-3`}>
                  {theme.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
