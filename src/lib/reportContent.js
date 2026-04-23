function normalizeGoalToTopic(goal) {
  return String(goal ?? "")
    .trim()
    .replace(/\.$/, "")
    .replace(/^(align on|clarify|define|understand|explore)\s+/i, "");
}

export function getReportHero(data) {
  const topic = String(data.goal ?? "").trim().replace(/\.$/, "") || "the current workshop topic";
  const workshopDate = String(data.workshopDate ?? "").trim();
  const datePhrase = workshopDate ? `held on ${workshopDate}` : "held on the workshop date";

  return {
    eyebrow: "Collective Discovery report",
    title: topic,
    description:
      `This report translates the workshop ${datePhrase} into a clear summary of the signals, themes, and priorities that emerged.`,
  };
}

export function getReportSections() {
  return [
    { id: "goal-metrics", title: "Workshop setup", eyebrow: "Section 01" },
    { id: "questions", title: "Questions asked", eyebrow: "Section 02" },
    { id: "signal-quotes", title: "Highlighted quotes", eyebrow: "Section 03" },
    { id: "theme-analysis", title: "Thematic analysis", eyebrow: "Section 04" },
    { id: "recommended-actions", title: "Prioritized themes", eyebrow: "Section 05" },
    {
      id: "growth-loop",
      title: "Be curious",
      eyebrow: "Section 06",
    },
  ];
}
