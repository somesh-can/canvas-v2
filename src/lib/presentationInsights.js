function parseMetricNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getRespondentCount(data) {
  return parseMetricNumber(
    data.metrics.find((metric) => metric.label === "Respondents")?.value,
    124,
  );
}

export function getRankedThemes(data) {
  return [...data.themes].sort(
    (a, b) => b.count - a.count || b.percentage - a.percentage,
  );
}

export function getRankedVotingThemes(data, voteCounts = {}) {
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);

  return data.themes
    .map((theme) => {
      const votes = voteCounts[theme.id] || 0;
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

      return {
        ...theme,
        votes,
        percentage,
      };
    })
    .sort((a, b) => b.votes - a.votes || b.count - a.count);
}

export function getExecutiveSummary(data) {
  const rankedThemes = getRankedThemes(data);
  const topThemes = rankedThemes.slice(0, 3);

  return {
    title: "Top themes",
    topThemes,
    takeaways: [
      "People want clearer strategic reasoning behind key decisions.",
      "Focus and prioritization are the main execution gap.",
      "Cross-team collaboration is a strength, but systems lag behind it.",
      "Teams respond well to shared direction when it is explicit and repeated.",
      "Operational friction shows up less as resistance and more as overload.",
    ],
    recommendation:
      "Recommended first move: align on one strategic narrative and cascade it into team priorities.",
  };
}

export function getResultsSnapshotSummary(data, votingState = {}) {
  const {
    isComplete = false,
    voteCounts = {},
    participantsCompleted = 0,
  } = votingState;

  if (!isComplete) {
    return {
      title: "Top themes",
      topThemes: getRankedThemes(data).slice(0, 6),
      takeaways: [],
      showTakeaways: false,
    };
  }

  const rankedThemes = getRankedVotingThemes(data, voteCounts).slice(0, 3);
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  const topTheme = rankedThemes[0] || getRankedThemes(data)[0];

  return {
    title: "Top themes",
    topThemes: rankedThemes,
    takeaways: [
      `${topTheme?.title} leads the live prioritization with ${topTheme?.percentage}% of votes.`,
      `${participantsCompleted} participants completed voting with ${totalVotes} total votes cast.`,
      `${topTheme?.subthemes?.[0]} is the strongest recurring signal behind the leading theme.`,
    ],
    showTakeaways: true,
  };
}

export function getActionSummary(data) {
  const rankedThemes = getRankedThemes(data).slice(0, 3);

  return {
    title: "What We Heard, What To Do",
    rows: rankedThemes.map((theme) => {
      if (theme.title === "Strategic Clarity") {
        return {
          themeTitle: theme.title,
          signal: "Need for clearer vision and decision transparency.",
          meaning: "Teams lack a consistent north star for daily tradeoffs.",
          action: "Clarify strategy narrative and make decisions legible.",
        };
      }

      if (theme.title === "Operational Focus") {
        return {
          themeTitle: theme.title,
          signal: "Too many parallel priorities dilute execution.",
          meaning: "Work feels fragmented and urgency is not clearly ranked.",
          action: "Reduce active priorities and tighten prioritization rules.",
        };
      }

      return {
        themeTitle: theme.title,
        signal: "Silos slow collaboration despite strong team intent.",
        meaning: "Culture is healthy, but knowledge flow depends on individuals.",
        action: "Improve cross-team visibility, tooling, and shared rituals.",
      };
    }),
    recommendation:
      "Recommended first move: align on one strategic narrative and cascade it into team priorities.",
  };
}
