import React from "react";
import {
  Sparkles,
} from "lucide-react";

import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";
import { getExecutiveSummary } from "../../lib/presentationInsights";

const ui = presentationTheme.classes;

export default function ResultsActionSlide({ onDownloadReport }) {
  const summary = getExecutiveSummary(presentationData);
  const cards = summary.topThemes.map((theme, index) => ({
    themeTitle: theme.title,
    description: theme.description,
    takeaway: summary.takeaways[index],
    percentage: theme.percentage,
    count: theme.count,
  }));
  const footerTakeaways = summary.takeaways.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <section className={`${ui.panelStrong} rounded-[32px] p-8 space-y-8`}>
        <div className="space-y-3">
          <h2 className={`text-4xl font-semibold tracking-tight ${ui.text}`}>
            Conclusion
          </h2>
        </div>

        <div className="space-y-2">
          <h3 className={`text-2xl font-semibold ${ui.text}`}>Top themes</h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={card.themeTitle}
              className={`${ui.surface} ${ui.border} border rounded-[28px] p-6 flex flex-col gap-5`}
            >
              <div className="space-y-3">
                <h4 className={`text-2xl font-semibold ${ui.text} leading-tight`}>
                  {card.themeTitle}
                </h4>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className={`${ui.textMuted}`}>{card.percentage}% of responses</p>
                  <p className={`${ui.textMuted}`}>{card.count} responses</p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <div>
                  <p className={`text-base font-medium leading-relaxed ${ui.text}`}>
                    {card.description}
                  </p>
                </div>

                <div className={`${ui.mutedPanel} rounded-[20px] p-4 mt-auto`}>
                  <p className={`text-base font-medium leading-relaxed ${ui.text}`}>
                    {card.takeaway}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${ui.mutedPanel} rounded-[24px] p-6`}>
          <div className="flex items-center gap-2">
            <Sparkles size={15} className={ui.textSoft} />
          </div>
          <p className={`mt-2 text-xl font-semibold leading-relaxed ${ui.text}`}>
            {footerTakeaways.join(" ")}
          </p>
        </div>
      </section>
    </div>
  );
}
