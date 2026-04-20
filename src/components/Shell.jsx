import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Maximize,
  Copy,
  Share2,
  X,
} from "lucide-react";
import { presentationTheme } from "../lib/presentationTheme";

const ui = presentationTheme.classes;

export const TopBar = ({
  title,
  activeView,
  onViewChange,
  canvasLink,
  reportLink,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareView, setShareView] = useState(activeView === "report" ? "report" : "canvas");
  const [copiedTarget, setCopiedTarget] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isShareOpen) {
      setShareView(activeView === "report" ? "report" : "canvas");
      setCopiedTarget(null);
    }
  }, [activeView, isShareOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsShareOpen(false);
      }
    };

    if (isShareOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isShareOpen]);

  const activeShareLink = shareView === "report" ? reportLink : canvasLink;
  const activeShareLabel = shareView === "report" ? "Report link" : "Canvas link";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeShareLink);
      setCopiedTarget(shareView);
      setTimeout(() => setCopiedTarget(null), 2000);
    } catch {
      setCopiedTarget(null);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 h-16 bg-[color:rgb(255_255_255_/_0.86)] backdrop-blur-md ${ui.border} border-b px-8 flex items-center justify-between z-50`}
      >
        <div className="flex items-center gap-4">
          <h1 className={`text-sm font-medium ${ui.text}`}>{title}</h1>
        </div>

        <div
          className={`absolute left-1/2 -translate-x-1/2 h-10 p-1 rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface)] flex items-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]`}
          role="tablist"
          aria-label="Presentation view selector"
        >
          {[
            { id: "canvas", label: "Canvas" },
            { id: "report", label: "Report" },
          ].map((option) => {
            const isActive = activeView === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewChange(option.id)}
                className={`h-8 px-4 rounded-full text-sm font-medium transition-all ${ui.focusRing} ${
                  isActive
                    ? "bg-[var(--presentation-text)] text-white shadow-[0_2px_8px_rgba(17,24,39,0.22)]"
                    : `${ui.textMuted} hover:text-[var(--presentation-text)]`
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className={`h-10 px-5 rounded-full flex items-center text-sm font-semibold bg-[var(--presentation-text)] text-white hover:opacity-90 transition-opacity ${ui.focusRing}`}
          >
            Share
          </button>
        </div>
      </div>

      {isShareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] bg-[var(--presentation-overlay)] backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setIsShareOpen(false)}
        >
          <div
            ref={modalRef}
            className={`${ui.panelStrong} w-full max-w-xl rounded-[28px] p-6 shadow-[0_28px_80px_rgba(31,41,55,0.2)]`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-semibold ${ui.text}`}>Share</h2>
                <p className={`text-sm ${ui.textMuted} mt-1`}>
                  Choose what you want to share.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className={`h-9 w-9 rounded-full border ${ui.border} ${ui.controlHover} ${ui.focusRing} flex items-center justify-center ${ui.textMuted}`}
                aria-label="Close share modal"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className={`mt-6 h-11 p-1 rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface-elevated)] flex items-center`}
              role="tablist"
              aria-label="Share type selector"
            >
              {[
                { id: "canvas", label: "Canvas" },
                { id: "report", label: "Report" },
              ].map((option) => {
                const isActive = shareView === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setShareView(option.id)}
                    className={`h-9 flex-1 rounded-full text-sm font-medium transition-all ${ui.focusRing} ${
                      isActive
                        ? "bg-[var(--presentation-text)] text-white"
                        : `${ui.textMuted} hover:text-[var(--presentation-text)]`
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <label className={`block text-sm font-medium ${ui.text} mb-2`}>
                {activeShareLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeShareLink}
                  className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.text} bg-[var(--presentation-surface-elevated)] border ${ui.border} focus:outline-none`}
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`h-11 px-4 rounded-xl border ${ui.border} ${ui.controlHover} ${ui.focusRing} flex items-center gap-2 text-sm font-medium ${ui.text}`}
                >
                  {copiedTarget === shareView ? <Check size={16} /> : <Copy size={16} />}
                  {copiedTarget === shareView ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const BottomBar = ({
  currentSlide,
  currentSlideId,
  totalSlides,
  slides,
  onPrev,
  onNext,
  onJump,
  slideTitle,
  votingEnabled,
  onToggleVoting,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
      <div className="absolute left-8">
        <button
          type="button"
          onClick={onToggleVoting}
          aria-pressed={votingEnabled}
          className={`h-[44px] px-3 pr-4 rounded-full flex items-center gap-3 text-sm font-medium transition-all shadow-[0_1px_2px_rgba(31,41,55,0.06)] ${
            votingEnabled
              ? "bg-[#fffffe] text-[var(--presentation-text)]"
              : `bg-[#fffffe] ${ui.textMuted} hover:text-[var(--presentation-text)]`
          } ${ui.focusRing}`}
        >
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              votingEnabled
                ? "bg-[var(--presentation-text)]"
                : "bg-[var(--presentation-border)]"
            }`}
            aria-hidden="true"
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(31,41,55,0.18)] transition-transform ${
                votingEnabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </span>
          Prioritize themes
        </button>
      </div>

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
                {slides.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onJump(s.id);
                      setShowMenu(false);
                    }}
                    className={`w-full px-5 h-[44px] text-left text-sm flex items-center justify-between transition-colors ${
                      currentSlideId === s.id
                        ? "bg-[var(--mantine-color-blue-0)] text-[var(--presentation-text)] font-medium"
                        : "text-[var(--presentation-text-muted)] hover:bg-[var(--presentation-surface-muted)]"
                    }`}
                  >
                    <span className="truncate">
                      {index + 1}. {s.title}
                    </span>
                    {currentSlideId === s.id && (
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
