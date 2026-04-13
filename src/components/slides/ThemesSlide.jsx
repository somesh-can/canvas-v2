import React, { useState } from "react";
import { presentationData } from "../../data/mockData";

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

  const colorMap = {
    lavender: "bg-[#d1c1f7] border-[#c5b5eb] text-[#1F2937] accent-[#A78BFA]",
    blue: "bg-[#b8d9fc] border-[#a8c9ec] text-[#1F2937] accent-[#93C5FD]",
    sage: "bg-[#f0bfcd] border-[#e5afbd] text-[#1F2937] accent-[#86C58F]",
  };

  // SVG patterns for cards
  const patterns = {
    lavender: (
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lavender-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "white", stopOpacity: 0.4 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
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
            {/* Concentric diamonds */}
            <rect x="40" y="40" width="0" height="0" fill="none" />
            <path
              d="M40 10 L70 40 L40 70 L10 40 Z"
              stroke="#A78BFA"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M40 20 L60 40 L40 60 L20 40 Z"
              stroke="#A78BFA"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="40"
              cy="40"
              r="8"
              stroke="#A78BFA"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
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
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blue-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "white", stopOpacity: 0.4 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
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
            {/* Concentric circles */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#93C5FD"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="40"
              cy="40"
              r="20"
              stroke="#93C5FD"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <circle
              cx="40"
              cy="40"
              r="10"
              stroke="#93C5FD"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <circle cx="40" cy="40" r="3" fill="#93C5FD" opacity="0.6" />
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
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sage-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "white", stopOpacity: 0.4 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "white", stopOpacity: 0 }}
            />
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
            {/* Chevron pattern */}
            <path
              d="M10 20 L30 40 L50 20"
              stroke="#86C58F"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M10 35 L30 55 L50 35"
              stroke="#86C58F"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
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

  // Font styles for quotes
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
          <h2 className="text-3xl font-semibold text-[#1F2937] tracking-tight">
            Everything you said in {themes.length} areas
          </h2>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-[#F7F7F2] border border-[#EEF0EA] rounded-full">
          <button
            onClick={() => setMode("overview")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "overview" ? "bg-white shadow-sm text-[#1F2937]" : "text-[#6B7280] hover:text-[#1F2937]"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setMode("details")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === "details" ? "bg-white shadow-sm text-[#1F2937]" : "text-[#6B7280] hover:text-[#1F2937]"}`}
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
              className="relative bg-white border border-[#EEF0EA] rounded-[28px] p-8 shadow-soft-sm hover:shadow-soft-md transition-all cursor-pointer group text-left focus-visible:outline-2 focus-visible:outline-[#93C5FD] overflow-hidden"
              aria-label={`View ${theme.title} details`}
            >
              {/* SVG Pattern Background */}
              {patterns[theme.color]}

              <div className="relative z-10 space-y-4 pt-16">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#1F2937]">
                    {theme.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed line-clamp-3">
                    {theme.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row bg-white border border-[#EEF0EA] rounded-[32px] overflow-hidden shadow-soft-md min-h-[600px] animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-full lg:w-[320px] border-r border-[#EEF0EA] bg-[#FCFCF9]">
            <div className="divide-y divide-[#EEF0EA]">
              {themes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                const statsLabel = `${theme.count}/${totalResponses} responses • ${theme.percentage}%`;
                const buttonClassName = isSelected
                  ? "relative w-full px-6 py-6 text-left border-r-4 border-r-[#1F2937] bg-white text-[#1F2937] transition-all"
                  : "relative w-full px-6 py-6 text-left text-[#6B7280] hover:bg-white hover:text-[#1F2937] transition-all";
                const titleClassName = isSelected
                  ? "text-base font-semibold text-[#1F2937]"
                  : "text-base font-medium text-current";

                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={buttonClassName}
                  >
                    <div className="space-y-2">
                      <div className={titleClassName}>{theme.title}</div>
                      <div className="text-sm text-[#9CA3AF] leading-relaxed">
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
                <h3 className="text-3xl font-semibold text-[#1F2937]">
                  {selectedTheme.title}
                </h3>
                <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed">
                  {selectedTheme.description}
                </p>
              </div>
              {/* Metrics widget hidden for strategic clarity */}
            </div>

            <div className="space-y-6">
              <h4 className="text-base font-semibold text-[#1F2937]">
                Key sub-themes
              </h4>
              <div className="flex flex-wrap gap-3">
                {selectedTheme.subthemes.map((st, i) => (
                  <div
                    key={i}
                    className="px-5 py-2.5 bg-white border border-[#E7E9E1] rounded-full text-sm font-medium text-[#4B5563]"
                  >
                    {st}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-base font-semibold text-[#1F2937]">
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
