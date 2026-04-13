import React, { useState, useEffect, useRef } from "react";
import {
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Maximize,
} from "lucide-react";

export const TopBar = ({ title, onTitleChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-[#E7E9E1] px-8 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-medium text-[#1F2937]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#F7F7F2] rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#93C5FD]"
        >
          {copied ? (
            <Check size={16} className="text-[#86C58F]" />
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
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-t border-[#E7E9E1] px-8 flex items-center justify-center z-50">
      {/* Center: Navigation with Slide Selector in between */}
      <div className="flex items-center justify-center gap-3">
        <button
          disabled={currentSlide === 0}
          onClick={onPrev}
          className="p-2.5 text-[#6B7280] hover:text-[#1F2937] bg-white border border-[#E7E9E1] rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Slide Dropdown Selector */}
        <div
          ref={buttonRef}
          className="relative bg-[#FCFCF9] border border-[#E7E9E1] rounded-full"
          style={{
            boxShadow:
              "inset 4px 4px 10px rgba(15, 23, 42, 0.06), inset -4px -4px 10px rgba(255, 255, 255, 0.9)",
          }}
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-5 py-2.5 h-[44px] flex items-center gap-2 text-sm font-medium text-[#1F2937] hover:bg-white/50 rounded-full transition-all min-w-[320px]"
          >
            <span className="truncate flex-1 text-left">{slideTitle}</span>
            <span className="text-[#9CA3AF] text-xs font-normal flex-shrink-0">
              {currentSlide + 1} of {totalSlides}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 flex-shrink-0 text-[#6B7280] ${showMenu ? "rotate-180" : ""}`}
            />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-[320px] bg-white border border-[#E7E9E1] rounded-[24px] shadow-[0_10px_24px_rgba(15,23,42,0.06)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
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
                        ? "bg-[#E8F1FF] text-[#1F2937] font-medium"
                        : "text-[#6B7280] hover:bg-[#F8F8F4]"
                    }`}
                  >
                    <span className="truncate">
                      {s.id + 1}. {s.title}
                    </span>
                    {currentSlide === s.id && (
                      <Check
                        size={14}
                        className="text-[#93C5FD] flex-shrink-0 ml-2"
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
          className="p-2.5 text-[#6B7280] hover:text-[#1F2937] bg-white border border-[#E7E9E1] rounded-full disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Right Section: Fullscreen Button */}
      <div className="absolute right-8">
        <button
          onClick={handleFullscreen}
          className="p-2.5 text-[#6B7280] hover:text-[#1F2937] bg-white border border-[#E7E9E1] rounded-full transition-all h-[44px] w-[44px] flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <Maximize size={20} />
        </button>
      </div>
    </div>
  );
};
