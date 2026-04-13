import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { presentationData } from "../../data/mockData";

export default function QuotesSlide() {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const { quotes } = presentationData;

  const colorMap = {
    lavender: "bg-[#F1ECFF] border-[#DDD2FF] text-[#1F2937]",
    blue: "bg-[#ECF5FF] border-[#D6E8FF] text-[#1F2937]",
    sage: "bg-[#EFF8F1] border-[#D8EEDC] text-[#1F2937]",
    peach: "bg-[#FFF2EC] border-[#FFDCCF] text-[#1F2937]",
    butter: "bg-[#FFFBEA] border-[#F6EDBF] text-[#1F2937]",
    blush: "bg-[#FFF0F4] border-[#FFD9E4] text-[#1F2937]",
  };

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
          <h2 className="text-3xl font-semibold text-[#1F2937] tracking-tight">
            What you said from {quotes.length} responses
          </h2>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {quotes.map((quote, index) => (
          <button
            key={quote.id}
            onClick={() => openQuote(quote)}
            className={`break-inside-avoid w-full p-8 rounded-[24px] border cursor-pointer hover:scale-[1.02] transition-all duration-300 text-left focus-visible:outline-2 focus-visible:outline-[#93C5FD] mb-8 ${
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/40 backdrop-blur-xl"
          onClick={closeQuote}
        >
          <div
            className="flex items-center gap-8 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => navigateQuote(-1)}
              className="p-4 bg-white/80 border border-[#E7E9E1] rounded-full hover:bg-white transition-all shadow-sm active:scale-90 focus-visible:outline-2 focus-visible:outline-[#93C5FD]"
              aria-label="Previous quote"
            >
              <ChevronLeft size={32} className="text-[#1F2937]" />
            </button>

            <div className="relative flex-1">
              <button
                onClick={closeQuote}
                className="absolute -top-16 left-1/2 -translate-x-1/2 p-3 bg-white border border-[#E7E9E1] rounded-full hover:bg-[#F8F8F4] transition-colors shadow-lg focus-visible:outline-2 focus-visible:outline-[#93C5FD] z-10"
                aria-label="Close quote detail"
              >
                <X size={24} className="text-[#1F2937]" />
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
              className="p-4 bg-white/80 border border-[#E7E9E1] rounded-full hover:bg-white transition-all shadow-sm active:scale-90 focus-visible:outline-2 focus-visible:outline-[#93C5FD]"
              aria-label="Next quote"
            >
              <ChevronRight size={32} className="text-[#1F2937]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}