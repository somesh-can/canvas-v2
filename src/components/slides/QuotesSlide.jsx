import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;
const colorMap = presentationTheme.tones;

export default function QuotesSlide() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { quotes } = presentationData;

  const fontOptions = [
    "font-noto-sans",
    "font-noto-sans-mono",
    "font-noto-serif",
  ];
  const getRandomFont = (index) => fontOptions[index % fontOptions.length];

  const openQuote = (quote) => setSelectedQuote(quote);
  const closeQuote = () => setSelectedQuote(null);

  const navigateQuote = (direction) => {
    const currentIndex = quotes.findIndex((q) => q.id === selectedQuote.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = quotes.length - 1;
    if (nextIndex >= quotes.length) nextIndex = 0;
    setSelectedQuote(quotes[nextIndex]);
  };

  useEffect(() => {
    if (!selectedQuote) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeQuote();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateQuote(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateQuote(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedQuote]);

  const selectedQuoteIndex = selectedQuote
    ? quotes.findIndex((q) => q.id === selectedQuote.id)
    : -1;
  const selectedQuoteFontClass =
    selectedQuoteIndex >= 0 ? getRandomFont(selectedQuoteIndex) : "";

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      {!selectedQuote && (
        <div className="mb-12">
          <h2 className={`text-3xl font-semibold ${ui.text} tracking-tight`}>
            What you said from {quotes.length} responses
          </h2>
          <p className={`mt-2 text-base ${ui.textMuted}`}>
            Click a card to focus on one quote and read it in full.
          </p>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {quotes.map((quote, index) => (
          <button
            key={quote.id}
            onClick={() => openQuote(quote)}
            className={`break-inside-avoid w-full p-8 rounded-[24px] border cursor-pointer hover:scale-[1.02] hover:shadow-[0_10px_24px_rgba(31,41,55,0.08)] transition-all duration-300 text-left ${ui.focusRing} mb-8 ${
              colorMap[quote.color] || colorMap.lavender
            } ${getRandomFont(index)}`}
            aria-label={`Read full quote: ${quote.text.substring(0, 50)}...`}
          >
            <p className="text-lg leading-relaxed font-medium">
              "{quote.text}"
            </p>
          </button>
        ))}
      </div>

      {selectedQuote && (
        <div
          data-quote-overlay="true"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[var(--presentation-overlay)] backdrop-blur-xl"
          onClick={closeQuote}
        >
          <div
            className="flex items-center gap-8 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => navigateQuote(-1)}
              className={`p-4 bg-[color:rgb(255_255_255_/_0.88)] ${ui.border} rounded-full hover:bg-white transition-all shadow-sm active:scale-90 ${ui.focusRing}`}
              aria-label="Previous quote"
            >
              <ChevronLeft size={32} className={ui.text} />
            </button>

            <div className="relative flex-1">
              <button
                onClick={closeQuote}
                className={`absolute -top-16 left-1/2 -translate-x-1/2 p-3 ${ui.surface} ${ui.border} rounded-full hover:bg-[var(--presentation-surface-muted)] transition-colors shadow-lg ${ui.focusRing} z-10`}
                aria-label="Close quote detail"
              >
                <X size={24} className={ui.text} />
              </button>

              <div
                className={`p-16 rounded-[40px] border-2 shadow-xl ${
                  colorMap[selectedQuote.color]
                } ${selectedQuoteFontClass}`}
              >
                <p className="text-3xl md:text-4xl font-medium leading-[1.35] tracking-tight">
                  "{selectedQuote.text}"
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateQuote(1)}
              className={`p-4 bg-[color:rgb(255_255_255_/_0.88)] ${ui.border} rounded-full hover:bg-white transition-all shadow-sm active:scale-90 ${ui.focusRing}`}
              aria-label="Next quote"
            >
              <ChevronRight size={32} className={ui.text} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
