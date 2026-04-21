import React, { useState } from "react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;
const colorMap = {
  lavender: presentationTheme.tones.lavender,
  blue: presentationTheme.tones.blue,
  sage: presentationTheme.tones.sage,
  peach: presentationTheme.tones.peach,
  butter: presentationTheme.tones.butter,
  blush: presentationTheme.tones.blush,
};

export default function ThemesSlide() {
  const [selectedThemeId, setSelectedThemeId] = useState(
    presentationData.themes[0].id,
  );

  const { themes, metrics } = presentationData;
  const totalResponses =
    metrics.find((metric) => metric.label === "Respondents")?.value || "124";
  const selectedTheme =
    themes.find((theme) => theme.id === selectedThemeId) || themes[0];

  const fontStyles = [
    "font-noto-sans",
    "font-noto-serif",
    "font-noto-sans-mono",
  ];
  const getRandomFont = (index) => fontStyles[index % fontStyles.length];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="mb-12 space-y-2">
        <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
          Everything you said in {themes.length} areas
        </h2>
        <p className={`text-base ${ui.textMuted}`}>
          Each theme expands into the strongest signals, sub-themes, and message excerpts.
        </p>
      </div>

      <div
        className={`flex flex-col lg:flex-row ${ui.panelStrong} rounded-[32px] overflow-hidden shadow-soft-md min-h-[600px] animate-in slide-in-from-bottom-4 duration-500`}
      >
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
              <p className={`text-lg ${ui.textMuted} max-w-2xl leading-relaxed`}>
                {selectedTheme.description}
              </p>
            </div>
            <div className="rounded-full border border-[var(--presentation-border)] bg-[var(--presentation-surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--presentation-text)]">
              {selectedTheme.percentage}% impact
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
              Supporting messages
            </h4>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedTheme.quotes.map((q, index) => (
                <article
                  key={q.id}
                  className={`rounded-[24px] border p-7 transition-all ${colorMap[selectedTheme.color] || colorMap.lavender}`}
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--presentation-text-soft)]">
                      Message {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--presentation-text)] opacity-30" />
                  </div>
                  <p
                    className={`text-lg leading-relaxed font-medium text-[var(--presentation-text)] ${getRandomFont(index)}`}
                  >
                    {q.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
