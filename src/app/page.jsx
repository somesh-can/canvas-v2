import React, { useState } from "react";
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

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationData, setPresentationData] = useState(initialData);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownloadReport = () => {
    downloadDetailedReportPdf(presentationData);
  };

  const slides = [
    { id: 0, title: "Overview", component: <OverviewSlide /> },
    { id: 1, title: "Questions", component: <QuestionsSlide /> },
    { id: 2, title: "Quotes", component: <QuotesSlide /> },
    { id: 3, title: "Themes", component: <ThemesSlide /> },
    { id: 4, title: "Theme Details", component: <ThemeDetailsSlide /> },
    { id: 5, title: "Voting", component: <VotingSlide /> },
    { id: 6, title: "Results Snapshot", component: <ResultsSnapshotSlide /> },
    {
      id: 7,
      title: "Insight To Action",
      component: <ResultsActionSlide onDownloadReport={handleDownloadReport} />,
    },
  ];

  const totalSlides = slides.length;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJump = (index) => {
    setCurrentSlide(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      if (isTypingField || isQuoteOverlayOpen) {
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
  }, [currentSlide]);

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
        {slides[currentSlide].component}
      </main>

      <BottomBar
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrev={handlePrev}
        onNext={handleNext}
        onJump={handleJump}
        slideTitle={slides[currentSlide].title}
      />
    </div>
  );
}
