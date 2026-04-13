import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { presentationData } from "../../data/mockData";

export default function ThemeDetailsSlide() {
  const [selectedThemeId, setSelectedThemeId] = useState(
    presentationData.themes[0].id,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { themes, metrics } = presentationData;
  const totalResponses =
    metrics.find((metric) => metric.label === "Respondents")?.value || "124";
  const selectedTheme =
    themes.find((theme) => theme.id === selectedThemeId) || themes[0];

  // Get current theme index
  const currentThemeIndex = themes.findIndex(
    (theme) => theme.id === selectedThemeId,
  );

  // Navigation functions
  const handlePrevTheme = () => {
    if (currentThemeIndex > 0) {
      setSelectedThemeId(themes[currentThemeIndex - 1].id);
    }
  };

  const handleNextTheme = () => {
    if (currentThemeIndex < themes.length - 1) {
      setSelectedThemeId(themes[currentThemeIndex + 1].id);
    }
  };

  // Keyboard navigation for Shift + Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTagName = document.activeElement?.tagName;
      const isTypingField =
        activeTagName === "INPUT" ||
        activeTagName === "TEXTAREA" ||
        document.activeElement?.isContentEditable;

      if (isTypingField) {
        return;
      }

      // Shift + Left Arrow = Previous Theme
      if (e.shiftKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevTheme();
      }
      // Shift + Right Arrow = Next Theme
      if (e.shiftKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleNextTheme();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentThemeIndex]);

  const colorMap = {
    lavender: "bg-[#F6F3FF] border-[#EFEAFF] text-[#1F2937] accent-[#A78BFA]",
    blue: "bg-[#F2F8FF] border-[#E8F1FF] text-[#1F2937] accent-[#93C5FD]",
    sage: "bg-[#F4FAF5] border-[#ECF7EE] text-[#1F2937] accent-[#86C58F]",
  };

  // Font styles for quotes
  const fontStyles = [
    "font-noto-sans",
    "font-noto-serif",
    "font-noto-sans-mono",
  ];
  const getRandomFont = (index) => fontStyles[index % fontStyles.length];

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-[#1F2937] tracking-tight">
            Everything you said in {themes.length} areas
          </h2>
        </div>

        {/* Compact Theme Navigation - Single Rectangle */}
        <div className="relative">
          <div className="flex items-stretch bg-white border border-[#E7E9E1] rounded-xl shadow-soft-sm hover:shadow-soft-md transition-shadow">
            {/* Left Chevron */}
            <button
              disabled={currentThemeIndex === 0}
              onClick={handlePrevTheme}
              className="px-3 py-3 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F8F4] disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all border-r border-[#E7E9E1] rounded-l-xl"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Theme Dropdown Selector */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#F8F8F4] transition-all text-left w-[250px] border-r border-[#E7E9E1]"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#1F2937] truncate">
                  {selectedTheme.title}
                </div>
              </div>
              <span className="text-[#9CA3AF] text-xs font-normal flex-shrink-0">
                {currentThemeIndex + 1} of {themes.length}
              </span>
              <ChevronDown
                size={16}
                className={`text-[#6B7280] transition-transform flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Right Chevron */}
            <button
              disabled={currentThemeIndex === themes.length - 1}
              onClick={handleNextTheme}
              className="px-3 py-3 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F8F4] disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all rounded-r-xl"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 bg-white border border-[#E7E9E1] rounded-[24px] shadow-[0_10px_24px_rgba(15,23,42,0.06)] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px]">
                <div className="py-2">
                  {themes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setSelectedThemeId(theme.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full px-5 py-5 text-left transition-colors flex items-center justify-between ${
                          isSelected
                            ? "bg-[#E8F1FF] text-[#1F2937]"
                            : "text-[#6B7280] hover:bg-[#F8F8F4]"
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div
                            className={`text-base ${isSelected ? "font-semibold" : "font-medium"}`}
                          >
                            {theme.title}
                          </div>
                          <div className="text-sm text-[#9CA3AF]">
                            {theme.count}/{totalResponses} responses •{" "}
                            {theme.percentage}%
                          </div>
                        </div>
                        {isSelected && (
                          <Check
                            size={14}
                            className="text-[#93C5FD] flex-shrink-0 ml-2"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Theme Details Content */}
      <div className="bg-white border border-[#EEF0EA] rounded-[32px] p-10 shadow-soft-md space-y-12 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-3xl font-semibold text-[#1F2937]">
              {selectedTheme.title}
            </h3>
            <p className="text-xl text-[#1F2937] max-w-xl leading-relaxed">
              {selectedTheme.description}
            </p>
          </div>

          {/* Quantitative Data Card */}
          <div className="flex-shrink-0 bg-[#F7F7F2] border border-[#EEF0EA] rounded-2xl px-8 py-6 space-y-1">
            <div className="text-4xl font-semibold text-[#1F2937]">
              {selectedTheme.percentage}%
            </div>
            <div className="text-lg text-[#6B7280]">
              {selectedTheme.count} of {totalResponses} responses
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-base font-semibold text-[#1F2937]">
            Key sub-themes
          </h4>
          <div className="flex flex-wrap gap-3">
            {selectedTheme.subthemes.map((st, i) => (
              <div
                key={i}
                className="px-5 py-2.5 bg-white border border-[#E7E9E1] rounded-full text-lg font-medium text-[#4B5563]"
              >
                {st}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-base font-semibold text-[#1F2937]">
            Supporting quotes
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            {selectedTheme.quotes.map((q, index) => (
              <div
                key={q.id}
                className={`p-6 rounded-[24px] border transition-all ${colorMap[selectedTheme.color]}`}
              >
                <p
                  className={`text-lg leading-relaxed font-medium text-[#1F2937] ${getRandomFont(index)}`}
                >
                  "{q.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
