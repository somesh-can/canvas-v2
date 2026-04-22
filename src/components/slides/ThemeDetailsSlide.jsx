import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { presentationData } from "../../data/mockData";
import {
  presentationSubthemePillClass,
  presentationTheme,
} from "../../lib/presentationTheme";

const ui = presentationTheme.classes;
const colorMap = {
  lavender: presentationTheme.tones.lavender,
  blue: presentationTheme.tones.blue,
  sage: presentationTheme.tones.sage,
};

export default function ThemeDetailsSlide() {
  const [selectedThemeId, setSelectedThemeId] = useState(
    presentationData.themes[0].id,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { themes, metrics } = presentationData;
  const totalResponses =
    metrics.find((metric) => metric.label === "Respondents")?.value || "124";
  const selectedTheme =
    themes.find((theme) => theme.id === selectedThemeId) || themes[0];

  const currentThemeIndex = themes.findIndex(
    (theme) => theme.id === selectedThemeId,
  );

  const handlePrevTheme = () => {
    if (currentThemeIndex > 0) {
      setSelectedThemeId(themes[currentThemeIndex - 1].id);
    }
  };

  const handleNextTheme = () => {
    if (currentThemeIndex < themes.length - 1) {
      setSelectedThemeId(themes[currentThemeIndex + 1].id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTagName = document.activeElement?.tagName;
      const isTypingField =
        activeTagName === "INPUT" ||
        activeTagName === "TEXTAREA" ||
        document.activeElement?.isContentEditable;

      if (isTypingField) {
        return;
      }

      if (e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevTheme();
      }
      if (e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleNextTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentThemeIndex]);

  const fontStyles = [
    "font-noto-sans",
    "font-noto-serif",
    "font-noto-sans-mono",
  ];
  const getRandomFont = (index) => fontStyles[index % fontStyles.length];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
            Everything you said in {themes.length} themes
          </h2>
        </div>

        <div className="relative">
          <div className={`flex items-stretch ${ui.surface} ${ui.borderStrong} border rounded-xl shadow-soft-sm hover:shadow-soft-md transition-shadow`}>
            <button
              disabled={currentThemeIndex === 0}
              onClick={handlePrevTheme}
              className={`px-3 py-3 ${ui.textMuted} hover:text-[var(--presentation-text)] hover:bg-[var(--presentation-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all border-r border-[var(--presentation-border-strong)] rounded-l-xl ${ui.focusRing}`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-[var(--presentation-surface-muted)] transition-all text-left w-[250px] border-r border-[var(--presentation-border-strong)] ${ui.focusRing}`}
            >
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${ui.text} truncate`}>
                  {selectedTheme.title}
                </div>
              </div>
              <span className={`${ui.textSoft} text-xs font-normal flex-shrink-0`}>
                {currentThemeIndex + 1} of {themes.length}
              </span>
              <ChevronDown
                size={16}
                className={`${ui.textMuted} transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <button
              disabled={currentThemeIndex === themes.length - 1}
              onClick={handleNextTheme}
              className={`px-3 py-3 ${ui.textMuted} hover:text-[var(--presentation-text)] hover:bg-[var(--presentation-surface-muted)] disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all rounded-r-xl ${ui.focusRing}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

              <div className={`absolute top-full right-0 mt-2 ${ui.surface} ${ui.border} rounded-[24px] shadow-[0_10px_24px_rgba(15,23,42,0.06)] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px]`}>
                <div className="py-2">
                  {themes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setSelectedThemeId(theme.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-5 py-5 text-left transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-[var(--mantine-color-blue-0)] text-[var(--presentation-text)]"
                            : "text-[var(--presentation-text-muted)] hover:bg-[var(--presentation-surface-muted)]"
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div
                            className={`text-base ${isSelected ? "font-semibold" : "font-medium"}`}
                          >
                            {theme.title}
                          </div>
                          <div className={`text-sm ${ui.textSoft}`}>
                            {theme.count}/{totalResponses} responses • {theme.percentage}%
                          </div>
                        </div>
                        {isSelected && (
                          <Check
                            size={14}
                            className="text-[var(--presentation-accent)] flex-shrink-0 ml-2"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`${ui.panelStrong} rounded-[32px] p-10 shadow-soft-md space-y-12 animate-in slide-in-from-bottom-4 duration-500`}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <h3 className={`text-3xl font-semibold ${ui.text}`}>
              {selectedTheme.title}
            </h3>
            <p className={`text-xl ${ui.text} max-w-xl leading-relaxed`}>
              {selectedTheme.description}
            </p>
          </div>

          <div className={`${ui.mutedPanel} flex-shrink-0 rounded-2xl px-8 py-6 space-y-1`}>
            <div className={`text-4xl font-semibold ${ui.text}`}>
              {selectedTheme.percentage}%
            </div>
            <div className={`text-lg ${ui.textMuted}`}>
              {selectedTheme.count} of {totalResponses} responses
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className={`text-base font-semibold ${ui.text}`}>Key sub-themes</h4>
          <div className="flex flex-wrap gap-3">
            {selectedTheme.subthemes.map((st, i) => (
              <div
                key={i}
                className={`${presentationSubthemePillClass} text-lg`}
              >
                {st}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className={`text-base font-semibold ${ui.text}`}>Supporting quotes</h4>
          <div className="grid md:grid-cols-2 gap-6">
            {selectedTheme.quotes.slice(0, 6).map((q, index) => (
              <div
                key={q.id}
                className={`p-6 rounded-[24px] border transition-all ${colorMap[selectedTheme.color]}`}
              >
                <p
                  className={`text-lg leading-relaxed font-medium ${ui.text} ${getRandomFont(index)}`}
                >
                  "{q.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
