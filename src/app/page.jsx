import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { TopBar, BottomBar } from "../components/Shell";
import ParticipantMobileView from "../components/ParticipantMobileView";
import OverviewSlide from "../components/slides/OverviewSlide";
import QuestionsSlide from "../components/slides/QuestionsSlide";
import QuotesSlide from "../components/slides/QuotesSlide";
import ThemesSlide from "../components/slides/ThemesSlide";
import ThemeDetailsSlide from "../components/slides/ThemeDetailsSlide";
import VotingSlide from "../components/slides/VotingSlide";
import ResultsSnapshotSlide from "../components/slides/ResultsSnapshotSlide";
import ThankYouSlide from "../components/slides/ThankYouSlide";
import { presentationData as initialData } from "../data/mockData";
import { presentationTheme } from "../lib/presentationTheme";
import { downloadDetailedReportPdf } from "../lib/reportPdf";
import {
  getExecutiveSummary,
  getRankedThemes,
  getRespondentCount,
} from "../lib/presentationInsights";
import { getParticipantPath, getPathForRoute, parseAppRoute } from "../lib/appRoutes";
import { createParticipantSessionModel } from "../lib/participantSession";

function parseMetricNumber(value, fallback = 124) {
  const parsed = Number(String(value ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function createVotingSession(data) {
  const respondentCount = parseMetricNumber(
    data.metrics.find((metric) => metric.label === "Respondents")?.value,
    124,
  );

  return {
    phase: "configure",
    question: data.voting.question,
    votesPerPerson: data.voting.votesPerPerson,
    participantsJoined: respondentCount,
    participantsCompleted: Math.min(respondentCount, Math.round(respondentCount * 0.56)),
    voteCounts: Object.fromEntries(data.themes.map((theme) => [theme.id, theme.count])),
  };
}

function SectionPanel({ id, title, eyebrow, children }) {
  return (
    <section
      id={id}
      className="scroll-mt-32 py-14 md:py-20"
    >
      <div className="mx-auto max-w-none">
        {eyebrow && (
          <div className="flex items-center mb-5">
            <p
              className={`text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}
            >
              {eyebrow}
            </p>
          </div>
        )}
        <h2 className="font-serif text-4xl font-medium leading-tight text-[var(--presentation-text)] md:text-5xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function PresentationGlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');

      html {
        scroll-behavior: smooth;
      }

      .font-serif {
        font-family: 'Noto Serif', serif;
      }

      body {
        font-family: 'DM Sans', sans-serif;
        margin: 0;
        min-height: 100vh;
        overflow-y: scroll;
        scrollbar-gutter: stable;
        -webkit-font-smoothing: antialiased;
      }

      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-track {
        background: var(--presentation-bg);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--presentation-border);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--presentation-border-strong);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .animate-in {
        animation: fadeIn 0.4s ease-out forwards;
      }

      .slide-in {
        animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
    `}</style>
  );
}

function ReportView({ presentationData, onDownloadReport }) {
  const [activeSection, setActiveSection] = useState("executive-summary");

  const executiveSummary = useMemo(
    () => getExecutiveSummary(presentationData),
    [presentationData],
  );
  const rankedThemes = useMemo(() => getRankedThemes(presentationData), [presentationData]);
  const respondentCount = useMemo(
    () => getRespondentCount(presentationData),
    [presentationData],
  );
  const prioritizedThemes = useMemo(
    () =>
      rankedThemes.slice(0, 4).map((theme, index) => {
        const rationaleByRank = [
          "Largest share of comments and the clearest signal for near-term alignment.",
          "High-frequency theme that is directly affecting execution speed and focus.",
          "Strong enabling theme that will amplify progress across the rest of the system.",
          "Smaller overall volume, but repeated enough to justify active monitoring.",
        ];

        return {
          ...theme,
          priorityLabel: `Priority ${index + 1}`,
          rationale:
            rationaleByRank[index] ||
            "Recurring signal worth turning into a tracked priority.",
        };
      }),
    [rankedThemes],
  );

  const sections = useMemo(
    () => [
      { id: "executive-summary", title: "Executive Summary", eyebrow: "Section 01" },
      { id: "goal-metrics", title: "Research Frame", eyebrow: "Section 02" },
      { id: "questions", title: "Questions Asked", eyebrow: "Section 03" },
      { id: "signal-quotes", title: "Selected Quotes", eyebrow: "Section 04" },
      { id: "theme-analysis", title: "Theme Analysis", eyebrow: "Section 05" },
      { id: "recommended-actions", title: "Prioritized Themes", eyebrow: "Section 06" },
    ],
    [],
  );

  React.useEffect(() => {
    let rafId = null;
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const updateActiveSection = () => {
      const markerY = window.scrollY + 132;
      let nextActiveId = sections[0].id;

      for (const element of sectionElements) {
        const sectionTop = element.offsetTop;
        if (sectionTop <= markerY) {
          nextActiveId = element.id;
        }
      }

      setActiveSection((current) => (current === nextActiveId ? current : nextActiveId));
    };

    const onScroll = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [sections]);

  return (
    <main className="relative mx-auto flex w-full max-w-[1440px] items-start justify-center gap-8 px-6 py-12 md:px-10 md:py-20 lg:px-12 lg:py-24 xl:gap-12 animate-fade-in">
      <aside className="pointer-events-none sticky top-32 hidden w-60 shrink-0 xl:block">
        <div className="pointer-events-auto w-full pr-8">
          <p className={`mb-6 text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}>
            Contents
          </p>
          <nav className="relative">
            <div
              className="absolute left-[-20px] top-0 w-1 rounded-full bg-[var(--presentation-text)] transition-all duration-300"
              style={{
                height: "36px",
                transform: `translateY(${sections.findIndex((s) => s.id === activeSection) * 36}px)`,
              }}
            />
            <ul className="flex flex-col">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id} className="flex h-9 items-center">
                    <a
                      href={`#${section.id}`}
                      className={`block pl-5 text-sm transition-colors hover:text-[var(--presentation-text)] ${
                        isActive
                          ? "font-medium text-[var(--presentation-text)]"
                          : "text-[var(--presentation-text-muted)]"
                      }`}
                    >
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="w-full min-w-0 flex-1 xl:min-w-[760px] xl:basis-[58%] xl:max-w-[920px]">
        <header className="mb-20 text-left">
          <p
            className={`mb-6 text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}
          >
            Research Narrative
          </p>
          <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-[var(--presentation-text)] md:text-6xl">
            {presentationData.title}
          </h1>
          <p
            className={`mt-8 max-w-3xl text-xl font-light leading-relaxed md:text-2xl ${presentationTheme.classes.textSoft}`}
          >
            This report translates the canvas into a structured narrative: what people
            said, which themes dominate, and which priorities deserve attention next.
          </p>

          <div className="mt-10 flex justify-start">
            <button
              type="button"
              onClick={onDownloadReport}
              className={`flex h-12 items-center gap-2.5 rounded-full bg-[var(--presentation-text)] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${presentationTheme.classes.focusRing}`}
            >
              <Download size={18} />
              Download Report PDF
            </button>
          </div>

          <div className="mt-20 flex max-w-3xl items-center justify-between gap-8 border-t border-[var(--presentation-border)] pt-12 text-left">
            <div className="flex flex-1 flex-col items-start">
              <span className="font-serif text-4xl text-[var(--presentation-text)] md:text-5xl">{respondentCount}</span>
              <span className={`mt-3 text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}>
                Respondents
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="font-serif text-4xl text-[var(--presentation-text)] md:text-5xl">{presentationData.themes.length}</span>
              <span className={`mt-3 text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}>
                Themes
              </span>
            </div>
            <div className="flex flex-1 flex-col items-start">
              <span className="font-serif text-4xl text-[var(--presentation-text)] md:text-5xl">{presentationData.quotes.length}</span>
              <span className={`mt-3 text-[15px] font-semibold uppercase tracking-widest ${presentationTheme.classes.textSoft}`}>
                Messages
              </span>
            </div>
          </div>
        </header>

        <SectionPanel id="executive-summary" title="Executive Summary" eyebrow="Section 01">
          <p className="max-w-4xl text-[22px] font-light leading-relaxed text-[var(--presentation-text)] md:text-[28px]">
            {executiveSummary.headline}
          </p>

          <div className="mb-16 mt-12 space-y-4">
            {executiveSummary.takeaways.map((takeaway, i) => (
              <div key={i} className="flex gap-6 rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] px-6 py-5">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--presentation-border-strong)] text-xs font-semibold text-[var(--presentation-text)]">
                  {i + 1}
                </div>
                <p className="text-lg leading-relaxed text-[var(--presentation-text-muted)]">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>

          <h3 className="mb-8 font-serif text-2xl font-medium text-[var(--presentation-text)]">
            Dominant Themes
          </h3>
          <div className="flex flex-col gap-5">
            {executiveSummary.topThemes.map((theme, index) => (
              <article
                key={theme.id}
                className="rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] p-6 transition-all hover:border-[var(--presentation-border-strong)] hover:shadow-lg"
              >
                <div className="grid gap-5 md:grid-cols-[56px_minmax(0,1fr)_auto] md:items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--presentation-border-strong)] bg-[var(--presentation-surface-muted)] font-serif text-xl text-[var(--presentation-text)]">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium leading-tight text-[var(--presentation-text)]">
                      {theme.title}
                    </h4>
                    <p className={`mt-2 text-sm ${presentationTheme.classes.textSoft}`}>
                      {theme.count} responses across {theme.subthemes.slice(0, 2).join(" and ")}
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-[var(--presentation-border)] bg-[var(--presentation-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--presentation-text-soft)]">
                    {theme.percentage}%
                  </span>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel id="goal-metrics" title="Research Frame" eyebrow="Section 02">
          <p className="max-w-4xl text-xl font-light leading-relaxed text-[var(--presentation-text-muted)]">
            {presentationData.goal}
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {presentationData.metrics.map((metric) => (
              <article key={metric.label} className="flex flex-col border-t border-[var(--presentation-border)] pt-6">
                <span className="font-serif text-4xl text-[var(--presentation-text)]">
                  {metric.value}
                </span>
                <span className={`mt-3 text-xs font-semibold uppercase tracking-wider ${presentationTheme.classes.textSoft}`}>
                  {metric.label}
                </span>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel id="questions" title="Questions Asked" eyebrow="Section 03">
          <div className="space-y-8">
            {presentationData.questions.map((question, index) => (
              <div
                key={question.id}
                className="group relative flex gap-6 rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface-muted)] p-6 md:p-8"
              >
                <span className="inline-flex h-14 min-w-14 items-center justify-center rounded-2xl bg-[var(--presentation-text)] px-3 font-serif text-2xl leading-none text-white shadow-sm transition-colors group-hover:bg-[var(--presentation-text)]/90">
                  Q{index + 1}
                </span>
                <p className="mt-1 text-xl font-medium leading-relaxed text-[var(--presentation-text)] md:text-[22px]">
                  {question.text}
                </p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel id="signal-quotes" title="Selected Quotes" eyebrow="Section 04">
          <div className="grid gap-6 md:grid-cols-2">
            {presentationData.quotes.slice(0, 10).map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] p-6 md:p-7">
                <span className="mb-4 block font-serif text-4xl leading-none text-[var(--presentation-text-soft)] opacity-50">
                  "
                </span>
                <p className="text-lg font-medium leading-relaxed text-[var(--presentation-text)] md:text-[21px]">
                  {quote.text}
                </p>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel id="theme-analysis" title="Theme Analysis" eyebrow="Section 05">
          <div className="space-y-16">
            {rankedThemes.map((theme, idx) => (
              <article key={theme.id} className="relative rounded-[28px] border border-[var(--presentation-border)] bg-[var(--presentation-surface)] p-8 md:p-10">
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-4">
                    <span className={`inline-flex rounded-full bg-[var(--presentation-surface-muted)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${presentationTheme.classes.textSoft}`}>
                      Theme {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-serif text-3xl font-medium leading-tight text-[var(--presentation-text)] md:text-4xl">
                      {theme.title}
                    </h3>
                  </div>
                </div>

                <p className="max-w-4xl text-xl leading-relaxed text-[var(--presentation-text-muted)] md:text-[22px]">
                  {theme.description}
                </p>

                <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <div className="rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface-muted)] p-6">
                    <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] ${presentationTheme.classes.textSoft}`}>
                      Identified Sub-themes
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {theme.subthemes.map((sub, i) => (
                        <span key={i} className="rounded-full bg-[var(--presentation-surface)] px-3 py-1.5 text-sm font-medium text-[var(--presentation-text)]">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-bg)] p-6">
                    <p className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] ${presentationTheme.classes.textSoft}`}>
                      Representative Quotes
                    </p>
                    <div className="space-y-3">
                      {theme.quotes.slice(0, 3).map((quote) => (
                        <blockquote
                          key={quote.id}
                          className="rounded-xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] px-4 py-3 text-sm leading-relaxed text-[var(--presentation-text-muted)]"
                        >
                          {quote.text}
                        </blockquote>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel id="recommended-actions" title="Prioritized Themes" eyebrow="Section 06">
          <div className="mb-12 rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface-muted)] p-8 md:p-10">
            <h3 className="font-serif text-2xl font-medium text-[var(--presentation-text)] md:text-3xl">
              Suggested priority order
            </h3>
            <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[var(--presentation-text-muted)]">
              This view summarizes a follow-up prioritization session held after the canvas review. In this mock round, 38 people participated and cast 114 total votes, giving a directional read on which themes the group wants to move on first.
            </p>
          </div>

          <div className="space-y-6">
            {prioritizedThemes.map((theme) => (
              <article key={theme.id} className="overflow-hidden rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] p-7 md:p-8">
                <div className="grid gap-6 md:grid-cols-[160px_minmax(0,1fr)] md:items-start">
                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${presentationTheme.classes.textSoft}`}>
                      {theme.priorityLabel}
                    </span>
                    <p className="mt-3 font-serif text-3xl text-[var(--presentation-text)]">
                      {theme.percentage}%
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--presentation-text-soft)]">
                      {theme.count} votes
                    </p>
                  </div>

                  <div>
                    <h4 className="text-2xl font-medium text-[var(--presentation-text)]">
                      {theme.title}
                    </h4>
                    <p className="mt-3 text-base leading-relaxed text-[var(--presentation-text-muted)]">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionPanel>

        <footer className="mt-24 py-12 text-center">
          <p className="text-sm font-medium text-[var(--presentation-text-soft)]">
            End of Document
          </p>
        </footer>
      </div>
    </main>
  );
}

export default function PresentationPage() {
  const [currentSlideId, setCurrentSlideId] = useState("overview");
  const [presentationData, setPresentationData] = useState(initialData);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [votingSession, setVotingSession] = useState(() => createVotingSession(initialData));
  const [showDeleteVotingResultsConfirm, setShowDeleteVotingResultsConfirm] = useState(false);
  const [route, setRoute] = useState(() => parseAppRoute(window.location.pathname));

  const handleDownloadReport = () => {
    downloadDetailedReportPdf(presentationData);
  };

  const participantSession = useMemo(
    () => createParticipantSessionModel(presentationData),
    [presentationData],
  );
  const participantPath = useMemo(
    () => getParticipantPath(participantSession.sessionId),
    [participantSession.sessionId],
  );
  const participantShareLink = `${window.location.origin}${participantPath}`;
  const activeView = route.kind === "report" ? "report" : "canvas";
  const openParticipantPreview = React.useCallback(() => {
    const previewWindow = window.open(
      participantPath,
      "participant-preview",
      "popup=yes,width=430,height=900,resizable=yes,scrollbars=yes",
    );

    if (!previewWindow) {
      window.location.href = participantPath;
    }
  }, [participantPath]);

  const slides = useMemo(() => {
    const baseSlides = [
      { id: "overview", title: "Overview", component: <OverviewSlide /> },
      { id: "questions", title: "Questions", component: <QuestionsSlide /> },
      { id: "quotes", title: "Quotes", component: <QuotesSlide /> },
      { id: "themes", title: "Themes", component: <ThemesSlide /> },
      { id: "theme-details", title: "Theme Details", component: <ThemeDetailsSlide /> },
    ];

    if (votingEnabled) {
      baseSlides.push({
        id: "voting",
        title: "Prioritization",
        component: (
          <VotingSlide
            presentationData={presentationData}
            votingSession={votingSession}
            onVotingSessionChange={setVotingSession}
            participantJoinUrl={participantShareLink}
            onOpenParticipantPreview={openParticipantPreview}
          />
        ),
      });
    }

    baseSlides.push({
      id: "results-snapshot",
      title: "Results",
      component: (
        <ResultsSnapshotSlide
          presentationData={presentationData}
          votingSession={votingSession}
        />
      ),
    });

    baseSlides.push({
      id: "thank-you",
      title: "Thank You",
      component: <ThankYouSlide />,
    });

    return baseSlides;
  }, [
    openParticipantPreview,
    participantShareLink,
    presentationData,
    votingEnabled,
    votingSession,
  ]);

  const totalSlides = slides.length;
  const currentSlideIndex = slides.findIndex((slide) => slide.id === currentSlideId);
  const safeCurrentSlideIndex = currentSlideIndex >= 0 ? currentSlideIndex : 0;
  const activeSlide = slides[safeCurrentSlideIndex];

  const canvasShareLink = `${window.location.origin}/canvas`;
  const reportShareLink = `${window.location.origin}/report`;

  const syncPathForView = React.useCallback((view, push = true) => {
    const targetPath = getPathForRoute({ kind: view === "report" ? "report" : "canvas" });
    if (window.location.pathname !== targetPath) {
      if (push) {
        window.history.pushState({}, "", targetPath);
      } else {
        window.history.replaceState({}, "", targetPath);
      }
    }
  }, []);

  const handleViewChange = React.useCallback(
    async (view) => {
      const nextView = view === "report" ? "report" : "canvas";

      if (nextView === "report" && document.fullscreenElement) {
        await document.exitFullscreen();
      }

      setRoute({ kind: nextView });
      syncPathForView(nextView, true);
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [syncPathForView],
  );

  const handleNext = () => {
    if (safeCurrentSlideIndex < totalSlides - 1) {
      setCurrentSlideId(slides[safeCurrentSlideIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (safeCurrentSlideIndex > 0) {
      setCurrentSlideId(slides[safeCurrentSlideIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJump = (slideId) => {
    setCurrentSlideId(slideId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const disableVoting = () => {
    setVotingSession(createVotingSession(presentationData));

    if (currentSlideId === "voting") {
      setCurrentSlideId("results-snapshot");
    }

    setVotingEnabled(false);
  };

  const handleToggleVoting = () => {
    if (votingEnabled) {
      if (votingSession.phase === "results") {
        setShowDeleteVotingResultsConfirm(true);
        return;
      }

      disableVoting();
      return;
    }

    setVotingEnabled(true);
    setCurrentSlideId("voting");
  };

  React.useEffect(() => {
    if (!slides.some((slide) => slide.id === currentSlideId)) {
      setCurrentSlideId(slides[0]?.id ?? "overview");
    }
  }, [currentSlideId, slides]);

  React.useEffect(() => {
    setVotingSession(createVotingSession(presentationData));
  }, [presentationData]);

  React.useEffect(() => {
    if (window.location.pathname === "/") {
      syncPathForView(activeView, false);
    }
  }, [activeView, syncPathForView]);

  React.useEffect(() => {
    const onPopState = () => {
      setRoute(parseAppRoute(window.location.pathname));
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Track fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeView !== "canvas") {
        return;
      }

      const activeTagName = document.activeElement?.tagName;
      const isTypingField =
        activeTagName === "INPUT" ||
        activeTagName === "TEXTAREA" ||
        document.activeElement?.isContentEditable;
      const isQuoteOverlayOpen = Boolean(
        document.querySelector('[data-quote-overlay="true"]'),
      );
      const isVotingDeleteConfirmOpen = Boolean(
        document.querySelector('[data-voting-delete-confirm="true"]'),
      );

      if (isTypingField || isQuoteOverlayOpen || isVotingDeleteConfirmOpen) {
        return;
      }

      // Ignore Shift+Arrow combinations (used for theme navigation on slide 5)
      if (e.shiftKey) {
        return;
      }

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeView, handleNext, handlePrev]);

  const shouldShowTopBar = activeView === "report" || !isFullscreen;

  if (route.kind === "participant") {
    return (
      <>
        <PresentationGlobalStyles />
        <ParticipantMobileView session={participantSession} />
      </>
    );
  }

  return (
    <div
      className={`${presentationTheme.classes.pageShell} min-h-screen font-['DM Sans'] ${
        activeView === "canvas" ? "pb-32" : "pb-12"
      } ${shouldShowTopBar ? "pt-16" : "pt-0"}`}
    >
      <PresentationGlobalStyles />

      {shouldShowTopBar && (
        <TopBar
          title={presentationData.title}
          activeView={activeView}
          onViewChange={handleViewChange}
          canvasLink={canvasShareLink}
          reportLink={reportShareLink}
        />
      )}

      {activeView === "canvas" ? (
        <>
          <main className="min-h-[calc(100vh-9rem)] animate-fade-in">{activeSlide?.component}</main>

          {showDeleteVotingResultsConfirm && (
            <div
              data-voting-delete-confirm="true"
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[var(--presentation-overlay)] backdrop-blur-xl"
              onClick={() => setShowDeleteVotingResultsConfirm(false)}
            >
              <div
                className={`${presentationTheme.classes.panelStrong} w-full max-w-xl rounded-[32px] p-8 shadow-[0_24px_80px_rgba(31,41,55,0.18)]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  <h3 className={`text-2xl font-semibold ${presentationTheme.classes.text}`}>
                    Delete prioritization results?
                  </h3>
                  <p className={`text-base leading-relaxed ${presentationTheme.classes.textMuted}`}>
                    Are you sure to delete the prioritization results?
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteVotingResultsConfirm(false)}
                    className={`h-11 px-5 rounded-xl ${presentationTheme.classes.control} ${presentationTheme.classes.controlHover} ${presentationTheme.classes.focusRing} text-sm font-medium ${presentationTheme.classes.text}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      disableVoting();
                      setShowDeleteVotingResultsConfirm(false);
                    }}
                    className={`h-11 px-5 rounded-xl bg-[var(--presentation-text)] text-white text-sm font-semibold hover:opacity-90 transition-opacity ${presentationTheme.classes.focusRing}`}
                  >
                    Delete results
                  </button>
                </div>
              </div>
            </div>
          )}

          <BottomBar
            currentSlide={safeCurrentSlideIndex}
            currentSlideId={activeSlide?.id}
            totalSlides={totalSlides}
            slides={slides}
            onPrev={handlePrev}
            onNext={handleNext}
            onJump={handleJump}
            slideTitle={activeSlide?.title}
            votingEnabled={votingEnabled}
            onToggleVoting={handleToggleVoting}
          />
        </>
      ) : (
        <ReportView
          presentationData={presentationData}
          onDownloadReport={handleDownloadReport}
        />
      )}
    </div>
  );
}
