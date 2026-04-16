import React from "react";
import { Compass, Lightbulb, Medal, Sparkles, Trophy } from "lucide-react";

import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";
import { getExecutiveSummary } from "../../lib/presentationInsights";

const ui = presentationTheme.classes;
const toneMap = presentationTheme.tones;
const themeIcons = [Trophy, Medal, Compass];

export default function ResultsSnapshotSlide() {
  const summary = getExecutiveSummary(presentationData);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        <section className={`${ui.panelStrong} rounded-[32px] p-8 space-y-8`}>
          <div className="space-y-3">
            <p className={`text-sm uppercase tracking-[0.18em] ${ui.textSoft}`}>
              Slide 7
            </p>
            <h2 className={`text-4xl font-semibold tracking-tight ${ui.text}`}>
              {summary.title}
            </h2>
            <p className={`text-lg ${ui.textMuted}`}>{summary.headline}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {summary.topThemes.map((theme, index) => (
              <div
                key={theme.id}
                className={`rounded-[24px] border p-6 space-y-4 ${toneMap[theme.color]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {React.createElement(themeIcons[index] || Trophy, {
                      size: 15,
                      className: "text-[var(--presentation-text-soft)]",
                    })}
                  </div>
                  <span className="text-sm font-medium text-[var(--presentation-text-soft)]">
                    {theme.percentage}%
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className={`text-xl font-semibold ${ui.text}`}>
                    {theme.title}
                  </h3>
                  <p className={`text-sm ${ui.textMuted}`}>{theme.description}</p>
                </div>
                <p className={`text-sm font-medium ${ui.text}`}>
                  {theme.count} responses
                </p>
              </div>
            ))}
          </div>

          <div className={`${ui.mutedPanel} rounded-[24px] p-6 space-y-2`}>
            <div className="flex items-center gap-2">
              <Sparkles size={15} className={ui.textSoft} />
            </div>
            <p className={`text-xl font-semibold leading-relaxed ${ui.text}`}>
              {summary.recommendation}
            </p>
          </div>
        </section>

        <aside className={`${ui.panelStrong} rounded-[32px] p-8 space-y-6`}>
          <div className="space-y-2">
            <p className={`text-sm uppercase tracking-[0.16em] ${ui.textSoft}`}>
              Top takeaways
            </p>
            <h3 className={`text-2xl font-semibold ${ui.text}`}>
              Keep it crisp
            </h3>
          </div>

          <div className="space-y-4">
            {summary.takeaways.map((takeaway, index) => (
              <div
                key={takeaway}
                className={`${ui.surface} ${ui.border} border rounded-[24px] p-5`}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb size={15} className={ui.textSoft} />
                </div>
                <p className={`mt-2 text-lg font-medium leading-relaxed ${ui.text}`}>
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
