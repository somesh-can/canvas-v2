import React, { useMemo, useState } from "react";
import { TopBar, BottomBar } from "../components/Shell";
import OverviewSlide from "../components/slides/OverviewSlide";
import QuestionsSlide from "../components/slides/QuestionsSlide";
import QuotesSlide from "../components/slides/QuotesSlide";
import ThemesSlide from "../components/slides/ThemesSlide";
import ThemeDetailsSlide from "../components/slides/ThemeDetailsSlide";
import VotingSlide from "../components/slides/VotingSlide";
import ResultsSnapshotSlide from "../components/slides/ResultsSnapshotSlide";
import ResultsActionSlide from "../components/slides/ResultsActionSlide";
import { presentationData as initialData } from "../data/mockData";
import { presentationTheme } from "../lib/presentationTheme";
import { downloadDetailedReportPdf } from "../lib/reportPdf";

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

export default function PresentationPage() {
  const [currentSlideId, setCurrentSlideId] = useState("overview");
  const [presentationData, setPresentationData] = useState(initialData);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [votingSession, setVotingSession] = useState(() => createVotingSession(initialData));
  const [showDeleteVotingResultsConfirm, setShowDeleteVotingResultsConfirm] = useState(false);

  const handleDownloadReport = () => {
    downloadDetailedReportPdf(presentationData);
  };

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
        title: "Voting",
        component: (
          <VotingSlide
            presentationData={presentationData}
            votingSession={votingSession}
            onVotingSessionChange={setVotingSession}
          />
        ),
      });
    }

    baseSlides.push(
      {
        id: "results-snapshot",
        title: "Results Snapshot",
        component: (
          <ResultsSnapshotSlide
            presentationData={presentationData}
            votingSession={votingSession}
          />
        ),
      },
      {
        id: "insight-to-action",
        title: "Insight To Action",
        component: <ResultsActionSlide onDownloadReport={handleDownloadReport} />,
      },
    );

    return baseSlides;
  }, [handleDownloadReport, presentationData, votingEnabled, votingSession]);

  const totalSlides = slides.length;
  const currentSlideIndex = slides.findIndex((slide) => slide.id === currentSlideId);
  const safeCurrentSlideIndex = currentSlideIndex >= 0 ? currentSlideIndex : 0;
  const activeSlide = slides[safeCurrentSlideIndex];

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
  }, [handleNext, handlePrev]);

  return (
    <div
      className={`${presentationTheme.classes.pageShell} min-h-screen pb-32 font-['DM Sans'] ${isFullscreen ? "pt-0" : "pt-16"}`}
    >
      {/* Global CSS for DM Sans and smooth scroll */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          margin: 0;
          min-height: 100vh;
          overflow-y: scroll;
          scrollbar-gutter: stable;
          -webkit-font-smoothing: antialiased;
        }

        /* Custom Scrollbar for a premium feel */
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

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .slide-in {
          animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      {!isFullscreen && (
        <TopBar
          title={presentationData.title}
          onDownloadReport={handleDownloadReport}
        />
      )}

      <main className="min-h-[calc(100vh-9rem)] animate-fade-in">
        {activeSlide?.component}
      </main>

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
                Delete voting results?
              </h3>
              <p className={`text-base leading-relaxed ${presentationTheme.classes.textMuted}`}>
                Are you sure to delete the voting results?
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
    </div>
  );
}
