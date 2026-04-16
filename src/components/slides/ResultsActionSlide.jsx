import React from "react";
import {
  FileDown,
  Flag,
  Lightbulb,
  Radar,
  Target,
  Wrench,
} from "lucide-react";

import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";
import { getActionSummary } from "../../lib/presentationInsights";

const ui = presentationTheme.classes;
const themeIcons = [Radar, Flag, Lightbulb];

export default function ResultsActionSlide({ onDownloadReport }) {
  const summary = getActionSummary(presentationData);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <section className={`${ui.panelStrong} rounded-[32px] p-8 space-y-8`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3">
            <p className={`text-sm uppercase tracking-[0.18em] ${ui.textSoft}`}>
              Slide 8
            </p>
            <h2 className={`text-4xl font-semibold tracking-tight ${ui.text}`}>
              {summary.title}
            </h2>
            <p className={`text-lg ${ui.textMuted}`}>
              Turn the signal into a small set of concrete moves.
            </p>
          </div>

          {onDownloadReport && (
            <button
              type="button"
              onClick={onDownloadReport}
              className={`h-12 px-5 rounded-full bg-[var(--presentation-text)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${ui.focusRing}`}
            >
              <FileDown size={16} />
              Download PDF report
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {summary.rows.map((row, index) => (
            <div
              key={row.themeTitle}
              className={`${ui.surface} ${ui.border} border rounded-[28px] p-6 space-y-5`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {React.createElement(themeIcons[index] || Radar, {
                    size: 15,
                    className: ui.textSoft,
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radar size={14} className={ui.textSoft} />
                  </div>
                  <p className={`mt-2 text-base font-medium leading-relaxed ${ui.text}`}>
                    {row.signal}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Lightbulb size={14} className={ui.textSoft} />
                  </div>
                  <p className={`mt-2 text-base font-medium leading-relaxed ${ui.text}`}>
                    {row.meaning}
                  </p>
                </div>

                <div className={`${ui.mutedPanel} rounded-[20px] p-4`}>
                  <div className="flex items-center gap-2">
                    <Wrench size={14} className={ui.textSoft} />
                  </div>
                  <p className={`mt-2 text-base font-semibold leading-relaxed ${ui.text}`}>
                    {row.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${ui.mutedPanel} rounded-[24px] p-6`}>
          <div className="flex items-center gap-2">
            <Target size={15} className={ui.textSoft} />
          </div>
          <p className={`mt-2 text-xl font-semibold leading-relaxed ${ui.text}`}>
            {summary.recommendation}
          </p>
        </div>
      </section>
    </div>
  );
}
