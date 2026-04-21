import { getSessionIdFromPresentationData } from "./appRoutes.js";

export function createParticipantSessionModel(presentationData) {
  const sessionId = getSessionIdFromPresentationData(presentationData);

  return {
    sessionId,
    title: presentationData.title,
    logo: presentationData.logo,
    goal: presentationData.goal,
    joinCode: presentationData.voting.joinCode,
    question: presentationData.voting.question,
    votesPerPerson: presentationData.voting.votesPerPerson,
    themes: presentationData.themes.map((theme) => ({
      id: theme.id,
      title: theme.title,
      description: theme.description,
      percentage: theme.percentage,
      count: theme.count,
      color: theme.color,
      subthemes: [...theme.subthemes],
      quotes: theme.quotes.slice(0, 3).map((quote) => ({
        id: quote.id,
        text: quote.text,
      })),
    })),
  };
}
