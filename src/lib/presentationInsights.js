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
  const respondentCount = getRespondentCount(data);
  const messageCount = parseMetricNumber(
    data.metrics.find((metric) => metric.label === "Messages sent")?.value,
    data.quotes.length,
  );
  const leadTheme = topThemes[0];
  const secondTheme = topThemes[1];
  const thirdTheme = topThemes[2];

  return {
    title: "What the canvas is telling us",
    topThemes,
    headline: leadTheme
      ? `${respondentCount} respondents surfaced a clear signal: ${leadTheme.title.toLowerCase()} is leading the conversation, with ${secondTheme?.title.toLowerCase() ?? "execution discipline"} and ${thirdTheme?.title.toLowerCase() ?? "cross-team coordination"} shaping the rest of the canvas.`
      : `${respondentCount} respondents surfaced a concentrated set of themes across the canvas.`,
    takeaways: [
      leadTheme
        ? `${leadTheme.title} is the strongest signal at ${leadTheme.percentage}% of coded responses, pointing to a need for ${leadTheme.subthemes.slice(0, 2).join(" and ").toLowerCase()}.`
        : "The canvas points to a concentrated set of recurring strategic concerns.",
      secondTheme
        ? `${secondTheme.title} follows closely, suggesting the main gap is not motivation but turning strategy into a smaller set of visible priorities.`
        : "Execution signals point to a need for clearer prioritization.",
      thirdTheme
        ? `${thirdTheme.title} remains a positive asset, but the volume of comments suggests teams need better operating support to make that strength reliable at scale.`
        : `Across ${messageCount} messages, the discussion consistently links direction with day-to-day operating friction.`,
    ],
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
