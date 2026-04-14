import React from "react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;

export default function QuestionsSlide() {
  const { questions } = presentationData;

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-12">
        <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
          Questions
        </h2>

        <div className="w-full grid md:grid-cols-2 gap-8 text-left">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`${ui.panelStrong} rounded-[24px] p-8 space-y-4`}
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--mantine-color-grape-1)] border border-[var(--mantine-color-grape-3)] text-[var(--mantine-color-grape-8)] text-sm font-bold">
                {i + 1}
              </span>
              <h3 className={`text-lg font-medium ${ui.text} leading-snug`}>
                {q.text}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
