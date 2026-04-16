import React, { useState } from "react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;
const colorMap = {
  lavender: presentationTheme.tones.lavender,
  blue: presentationTheme.tones.blue,
  sage: presentationTheme.tones.sage,
};

export default function ThemesSlide({ defaultMode = "overview" }) {
  const [mode, setMode] = useState(defaultMode);
  const [selectedThemeId, setSelectedThemeId] = useState(
    presentationData.themes[0].id,
  );

  const { themes, metrics } = presentationData;
  const totalResponses =
    metrics.find((metric) => metric.label === "Respondents")?.value || "124";
  const selectedTheme =
    themes.find((theme) => theme.id === selectedThemeId) || themes[0];

  const patterns = {
    lavender: (
      <svg
        className="absolute inset-0 w-full h-full"
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
        <rect width="100%" height="100%" fill="url(#lavender-diamonds)" mask="url(#lavender-mask)" />
      </svg>
    ),
    blue: (
      <svg
        className="absolute inset-0 w-full h-full"
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
            <circle cx="40" cy="40" r="30" stroke={presentationTheme.patternColor.blue} strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="40" cy="40" r="20" stroke={presentationTheme.patternColor.blue} strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="40" cy="40" r="10" stroke={presentationTheme.patternColor.blue} strokeWidth="1.5" fill="none" opacity="0.5" />
            <circle cx="40" cy="40" r="3" fill={presentationTheme.patternColor.blue} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blue-circles)" mask="url(#blue-mask)" />
      </svg>
    ),
    sage: (
      <svg
        className="absolute inset-0 w-full h-full"
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
            <path d="M10 20 L30 40 L50 20" stroke={presentationTheme.patternColor.sage} strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M10 35 L30 55 L50 35" stroke={presentationTheme.patternColor.sage} strokeWidth="1.5" fill="none" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sage-chevrons)" mask="url(#sage-mask)" />
      </svg>
    ),
  };

  const fontStyles = [
    "font-noto-sans",
    "font-noto-serif",
    "font-noto-sans-mono",
  ];
  const getRandomFont = (index) => fontStyles[index % fontStyles.length];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-2">
          <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
            Everything you said in {themes.length} areas
          </h2>
          <p className={`text-base ${ui.textMuted}`}>
            Click a card to focus on one theme and see its supporting quotes.
          </p>
        </div>

        <div className={`flex p-1 bg-[var(--presentation-surface-elevated)] border ${ui.border} rounded-full`}>
          <button
            onClick={() => setMode("overview")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "overview" ? "bg-[var(--presentation-surface)] shadow-sm text-[var(--presentation-text)]" : "text-[var(--presentation-text-muted)] hover:text-[var(--presentation-text)]"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setMode("details")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "details" ? "bg-[var(--presentation-surface)] shadow-sm text-[var(--presentation-text)]" : "text-[var(--presentation-text-muted)] hover:text-[var(--presentation-text)]"}`}
          >
            Details
          </button>
        </div>
      </div>

      {mode === "overview" ? (
        <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setSelectedThemeId(theme.id);
                setMode("details");
              }}
              className={`relative ${ui.panelStrong} rounded-[28px] p-8 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group text-left overflow-hidden ${ui.focusRing}`}
              aria-label={`View ${theme.title} details`}
            >
              {patterns[theme.color]}

              <div className="relative z-10 space-y-4 pt-16">
                <div className="space-y-2">
                  <h3 className={`text-xl font-semibold ${ui.text}`}>{theme.title}</h3>
                  <p className={`${ui.textMuted} leading-relaxed line-clamp-3`}>
                    {theme.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={`flex flex-col lg:flex-row ${ui.panelStrong} rounded-[32px] overflow-hidden shadow-soft-md min-h-[600px] animate-in slide-in-from-bottom-4 duration-500`}>
          <div className="w-full lg:w-[320px] border-r border-[var(--presentation-border)] bg-[var(--presentation-bg)]">
            <div className="divide-y divide-[var(--presentation-border)]">
              {themes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                const statsLabel = `${theme.count}/${totalResponses} responses • ${theme.percentage}%`;
                const buttonClassName = isSelected
                  ? "relative w-full px-6 py-6 text-left bg-[var(--presentation-surface)] text-[var(--presentation-text)] transition-all shadow-[inset_3px_0_0_0_var(--presentation-accent)]"
                  : "relative w-full px-6 py-6 text-left text-[var(--presentation-text-muted)] hover:bg-[var(--presentation-surface)] hover:text-[var(--presentation-text)] transition-all";
                const titleClassName = isSelected
                  ? "text-base font-semibold text-[var(--presentation-text)]"
                  : "text-base font-medium text-current";

                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={buttonClassName}
                  >
                    <div className="space-y-2">
                      <div className={titleClassName}>{theme.title}</div>
                      <div className="text-sm text-[var(--presentation-text-soft)] leading-relaxed">
                        {statsLabel}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 p-10 space-y-12 overflow-y-auto">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-3">
                <h3 className={`text-3xl font-semibold ${ui.text}`}>
                  {selectedTheme.title}
                </h3>
                <p className={`text-lg ${ui.textMuted} max-w-xl leading-relaxed`}>
                  {selectedTheme.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className={`text-base font-semibold ${ui.text}`}>Key sub-themes</h4>
              <div className="flex flex-wrap gap-3">
                {selectedTheme.subthemes.map((st, i) => (
                  <div
                    key={i}
                    className={`px-5 py-2.5 ${ui.surface} ${ui.borderStrong} border rounded-full text-sm font-medium ${ui.textMuted}`}
                  >
                    {st}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className={`text-base font-semibold ${ui.text}`}>
                Supporting quotes
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {selectedTheme.quotes.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-8 rounded-[24px] border transition-all ${colorMap[selectedTheme.color]}`}
                  >
                    <p
                      className={`text-lg leading-relaxed font-medium ${getRandomFont(index)}`}
                    >
                      "{q.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
