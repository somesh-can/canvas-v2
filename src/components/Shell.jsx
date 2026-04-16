import React, { useState, useEffect, useRef } from "react";
import {
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Maximize,
} from "lucide-react";
import { presentationTheme } from "../lib/presentationTheme";

const ui = presentationTheme.classes;

export const TopBar = ({ title }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-16 bg-[color:rgb(255_255_255_/_0.86)] backdrop-blur-md ${ui.border} border-b px-8 flex items-center justify-between z-50`}
    >
      <div className="flex items-center gap-4">
        <h1 className={`text-sm font-medium ${ui.text}`}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${ui.textMuted} hover:bg-[var(--presentation-surface-muted)] rounded-full transition-colors ${ui.focusRing}`}
        >
          {copied ? (
            <Check size={16} className="text-[var(--presentation-success)]" />
          ) : (
            <LinkIcon size={16} />
          )}
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
};

export const BottomBar = ({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onJump,
  slideTitle,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const slides = [
    { id: 0, title: "Overview" },
    { id: 1, title: "Questions" },
    { id: 2, title: "Quotes" },
    { id: 3, title: "Themes" },
    { id: 4, title: "Theme Details" },
    { id: 5, title: "Voting" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-20 bg-[color:rgb(255_255_255_/_0.88)] backdrop-blur-md border-t ${ui.border} px-8 flex items-center justify-center z-50`}
    >
      <div className="flex items-center justify-center gap-3">
        <button
          disabled={currentSlide === 0}
          onClick={onPrev}
          className={`p-2.5 ${ui.textMuted} hover:text-[var(--presentation-text)] ${ui.surface} ${ui.borderStrong} border rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(31,41,55,0.06)] ${ui.focusRing}`}
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={buttonRef}
          className={`relative bg-[var(--presentation-bg)] border ${ui.borderStrong} rounded-full`}
          style={{
            boxShadow:
              "inset 4px 4px 10px rgba(31, 41, 55, 0.05), inset -4px -4px 10px rgba(255, 255, 255, 0.88)",
          }}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`px-5 py-2.5 h-[44px] flex items-center gap-2 text-sm font-medium ${ui.text} hover:bg-[var(--presentation-surface-muted)] rounded-full transition-all min-w-[320px] ${ui.focusRing}`}
          >
            <span className="truncate flex-1 text-left">{slideTitle}</span>
            <span className={`${ui.textSoft} text-xs font-normal flex-shrink-0`}>
              {currentSlide + 1} of {totalSlides}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 flex-shrink-0 ${ui.textSoft} ${showMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[320px] ${ui.surface} ${ui.border} rounded-[24px] shadow-[0_12px_28px_rgba(31,41,55,0.08)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200`}
            >
              <div className="py-2">
                {slides.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onJump(s.id);
                      setShowMenu(false);
                    }}
                    className={`w-full px-5 h-[44px] text-left text-sm flex items-center justify-between transition-colors ${
                      currentSlide === s.id
                        ? "bg-[var(--mantine-color-blue-0)] text-[var(--presentation-text)] font-medium"
                        : "text-[var(--presentation-text-muted)] hover:bg-[var(--presentation-surface-muted)]"
                    }`}
                  >
                    <span className="truncate">
                      {s.id + 1}. {s.title}
                    </span>
                    {currentSlide === s.id && (
                      <Check
                        size={14}
                        className="text-[var(--presentation-accent)] flex-shrink-0 ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          disabled={currentSlide === totalSlides - 1}
          onClick={onNext}
          className={`p-2.5 ${ui.textMuted} hover:text-[var(--presentation-text)] ${ui.surface} ${ui.borderStrong} border rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(31,41,55,0.06)] ${ui.focusRing}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="absolute right-8">
        <button
          onClick={handleFullscreen}
          className={`p-2.5 ${ui.textMuted} hover:text-[var(--presentation-text)] ${ui.surface} ${ui.borderStrong} border rounded-full transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(31,41,55,0.06)] ${ui.focusRing}`}
        >
          <Maximize size={20} />
        </button>
      </div>
    </div>
  );
};
