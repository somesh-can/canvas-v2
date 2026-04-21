import React from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Layers3,
  ListChecks,
} from "lucide-react";
import { presentationTheme, presentationToneCardClasses } from "../lib/presentationTheme";

const ui = presentationTheme.classes;
const STORAGE_PREFIX = "participant-session:";

function getStorageKey(sessionId) {
  return `${STORAGE_PREFIX}${sessionId}`;
}

function getDefaultState(themeCount) {
  return {
    hasJoined: false,
    activeTab: "prioritization",
    selectedThemeIds: [],
    hasSubmitted: false,
    activeInsightIndex: 0,
    themeCount,
  };
}

function readStoredState(sessionId, themeCount) {
  if (typeof window === "undefined") {
    return getDefaultState(themeCount);
  }

  try {
    const rawState = window.sessionStorage.getItem(getStorageKey(sessionId));

    if (!rawState) {
      return getDefaultState(themeCount);
    }

    const parsedState = JSON.parse(rawState);
    return {
      ...getDefaultState(themeCount),
      ...parsedState,
      activeInsightIndex: Math.min(
        Math.max(Number(parsedState.activeInsightIndex) || 0, 0),
        Math.max(themeCount - 1, 0),
      ),
      selectedThemeIds: Array.isArray(parsedState.selectedThemeIds)
        ? parsedState.selectedThemeIds
        : [],
    };
  } catch {
    return getDefaultState(themeCount);
  }
}

function ThemeTone({ theme }) {
  return presentationToneCardClasses[theme.color] || presentationToneCardClasses.lavender;
}

function SegmentedTabs({ activeTab, onChange }) {
  const tabs = [
    { id: "prioritization", label: "Prioritization", icon: ListChecks },
    { id: "insights", label: "Insights", icon: Layers3 },
  ];

  return (
    <div
      className={`flex h-10 items-center rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface)] p-0.5`}
      role="tablist"
      aria-label="Participant sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-semibold transition-all ${ui.focusRing} ${
              isActive
                ? "bg-[var(--presentation-text)] text-white shadow-[0_8px_20px_rgba(31,41,55,0.16)]"
                : `${ui.textMuted} hover:text-[var(--presentation-text)]`
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function JoinScreen({ session }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,154,255,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(147,197,253,0.24),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(254,215,170,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(190,242,100,0.16),transparent_28%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-[32px] border border-[var(--presentation-border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(249,249,246,0.97)_100%)] p-6 backdrop-blur-sm">
          {session.logo && (
            <div className="flex h-11 items-center">
              <img
                src={session.logo}
                alt="Company Logo"
                className="h-full object-contain opacity-85"
              />
            </div>
          )}
          <h1 className={`mt-6 text-3xl font-semibold leading-tight ${ui.text}`}>
            {session.goal}
          </h1>
          <p className={`mt-4 text-sm leading-relaxed ${ui.textMuted}`}>
            Review the live prompt, pick your themes, and submit your vote. Tap
            {" "}
            <span className="font-semibold text-[var(--presentation-text)]">Join session</span>
            {" "}
            to begin.
          </p>
        </div>
      </div>
    </main>
  );
}

function ConfirmationView({ selectedThemes }) {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--presentation-text)] text-white shadow-[0_12px_30px_rgba(31,41,55,0.18)]">
          <Check size={24} />
        </div>
        <p className={`mt-5 text-base font-semibold uppercase tracking-[0.22em] ${ui.textSoft}`}>
          Submitted
        </p>
        <h2 className={`mt-2 text-[1.9rem] font-semibold leading-tight ${ui.text}`}>
          Thanks for prioritizing.
        </h2>
      </section>

      <section>
        <p className={`text-sm font-semibold ${ui.text}`}>Submitted themes</p>
        <div className="mt-4 space-y-3">
          {selectedThemes.map((theme) => (
            <div
              key={theme.id}
              className={`rounded-[24px] border p-4 ${ThemeTone({ theme })}`}
            >
              <p className={`text-base font-semibold ${ui.text}`}>{theme.title}</p>
              <p className={`mt-1 text-sm leading-relaxed ${ui.textMuted}`}>
                {theme.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PrioritizationView({
  session,
  selectedThemeIds,
  onToggleSelection,
  onSubmit,
}) {
  const selectedCount = selectedThemeIds.length;
  const selectionLimitReached = selectedCount >= session.votesPerPerson;

  return (
    <div className="space-y-5">
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${ui.textSoft}`}>
              Question
            </p>
            <h2 className={`mt-3 text-[1.6rem] font-semibold leading-tight ${ui.text}`}>
              {session.question}
            </h2>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${ui.surfaceElevated} ${ui.textMuted}`}>
            {selectedCount}/{session.votesPerPerson} votes
          </span>
        </div>
        <p className={`mt-4 text-sm leading-relaxed ${ui.textMuted}`}>
          Pick up to {session.votesPerPerson} themes, then submit.
        </p>

        <div className="mt-5 space-y-3">
          {session.themes.map((theme) => {
            const isSelected = selectedThemeIds.includes(theme.id);
            const isDisabled = !isSelected && selectionLimitReached;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onToggleSelection(theme.id)}
                disabled={isDisabled}
                className={`w-full rounded-[24px] border p-4 text-left transition-all ${ui.focusRing} ${
                  isSelected
                    ? `${ThemeTone({ theme })} shadow-[0_10px_20px_rgba(31,41,55,0.08)]`
                    : `bg-[var(--presentation-surface)] ${ui.border} hover:border-[var(--presentation-border-strong)]`
                } ${isDisabled ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-[var(--presentation-text)] bg-[var(--presentation-text)] text-white"
                        : "border-[var(--presentation-border-strong)] text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-base font-semibold ${ui.text}`}>{theme.title}</p>
                    <p className={`mt-1 text-sm leading-relaxed ${ui.textMuted}`}>
                      {theme.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={onSubmit}
            disabled={selectedCount === 0}
            className={`h-12 w-full rounded-full bg-[var(--presentation-text)] text-sm font-semibold text-white transition-opacity ${ui.focusRing} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            Submit priorities
          </button>
        </div>
      </section>
    </div>
  );
}

function InsightsView({ session, activeInsightIndex }) {
  const activeTheme = session.themes[activeInsightIndex] || session.themes[0];

  return (
    <div className="space-y-5">
      <section className={`rounded-[28px] border ${ui.borderStrong} bg-[var(--presentation-surface)] p-5 shadow-[0_10px_28px_rgba(31,41,55,0.08)]`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${ui.textSoft}`}>
              Theme {activeInsightIndex + 1} of {session.themes.length}
            </p>
            <h2 className={`mt-2 text-[1.7rem] font-semibold leading-tight ${ui.text}`}>
              {activeTheme.title}
            </h2>
          </div>
          <div className={`rounded-[20px] px-4 py-3 ${ThemeTone({ theme: activeTheme })}`}>
            <p className="text-2xl font-semibold">{activeTheme.percentage}%</p>
            <p className="text-xs font-medium opacity-80">{activeTheme.count} mentions</p>
          </div>
        </div>
        <p className={`mt-4 text-base leading-relaxed ${ui.textMuted}`}>
          {activeTheme.description}
        </p>
      </section>

      <section className={`rounded-[28px] border ${ui.borderStrong} bg-[var(--presentation-surface)] p-5`}>
        <p className={`text-sm font-semibold ${ui.text}`}>Signals</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {activeTheme.subthemes.map((subtheme) => (
            <span
              key={subtheme}
              className={`rounded-full border ${ui.border} bg-[var(--presentation-surface-elevated)] px-3 py-2 text-sm font-medium ${ui.text}`}
            >
              {subtheme}
            </span>
          ))}
        </div>
      </section>

      <section className={`rounded-[28px] border ${ui.borderStrong} bg-[var(--presentation-surface)] p-5`}>
        <p className={`text-sm font-semibold ${ui.text}`}>What people said</p>
        <div className="mt-4 space-y-3">
          {activeTheme.quotes.map((quote, index) => (
            <blockquote
              key={quote.id}
              className={`rounded-[24px] border p-4 ${index % 2 === 0 ? ThemeTone({ theme: activeTheme }) : `bg-[var(--presentation-surface-elevated)] ${ui.border}`}`}
            >
              <p className={`text-sm leading-relaxed ${ui.text}`}>“{quote.text}”</p>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

function InsightsBottomBar({ activeInsightIndex, totalThemes, onPrev, onNext }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--presentation-border)] bg-[color:rgb(255_255_255_/_0.92)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={activeInsightIndex === 0}
          className={`flex h-11 w-11 items-center justify-center rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface)] ${ui.textMuted} ${ui.focusRing} disabled:pointer-events-none disabled:opacity-35`}
          aria-label="Previous theme"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          className={`flex h-11 min-w-[220px] items-center justify-center rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface)] px-4 text-sm font-semibold ${ui.text}`}
        >
          Theme {activeInsightIndex + 1} of {totalThemes}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={activeInsightIndex === totalThemes - 1}
          className={`flex h-11 w-11 items-center justify-center rounded-full border ${ui.borderStrong} bg-[var(--presentation-surface)] ${ui.textMuted} ${ui.focusRing} disabled:pointer-events-none disabled:opacity-35`}
          aria-label="Next theme"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ParticipantMobileView({ session }) {
  const [state, setState] = React.useState(() =>
    readStoredState(session.sessionId, session.themes.length),
  );

  React.useEffect(() => {
    setState((currentState) => ({
      ...readStoredState(session.sessionId, session.themes.length),
      activeTab: currentState.activeTab,
    }));
  }, [session.sessionId, session.themes.length]);

  React.useEffect(() => {
    window.sessionStorage.setItem(getStorageKey(session.sessionId), JSON.stringify(state));
  }, [session.sessionId, state]);

  const activeInsightIndex = Math.min(
    state.activeInsightIndex,
    Math.max(session.themes.length - 1, 0),
  );
  const selectedThemes = session.themes.filter((theme) =>
    state.selectedThemeIds.includes(theme.id),
  );

  const handleJoin = () => {
    setState((currentState) => ({
      ...currentState,
      hasJoined: true,
    }));
  };

  const handleToggleSelection = (themeId) => {
    setState((currentState) => {
      const isSelected = currentState.selectedThemeIds.includes(themeId);

      if (isSelected) {
        return {
          ...currentState,
          selectedThemeIds: currentState.selectedThemeIds.filter((id) => id !== themeId),
        };
      }

      if (currentState.selectedThemeIds.length >= session.votesPerPerson) {
        return currentState;
      }

      return {
        ...currentState,
        selectedThemeIds: [...currentState.selectedThemeIds, themeId],
      };
    });
  };

  const handleSubmit = () => {
    setState((currentState) => ({
      ...currentState,
      hasSubmitted: true,
    }));
  };

  const handleResetSubmission = () => {
    setState((currentState) => ({
      ...currentState,
      hasSubmitted: false,
    }));
  };

  if (!state.hasJoined) {
    return (
      <div className={`${presentationTheme.classes.pageShell} min-h-screen font-['DM_Sans']`}>
        <JoinScreen session={session} />
        <div className="fixed inset-x-0 bottom-0 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="mx-auto w-full max-w-md">
            <button
              type="button"
              onClick={handleJoin}
              className={`h-12 w-full rounded-full bg-[var(--presentation-text)] text-sm font-semibold text-white shadow-[0_16px_40px_rgba(31,41,55,0.18)] ${ui.focusRing}`}
            >
              Join session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${presentationTheme.classes.pageShell} min-h-screen font-['DM_Sans']`}>
      {!state.hasSubmitted && (
        <header className="sticky top-0 z-30 border-b border-[var(--presentation-border)] bg-[color:rgb(252_252_248_/_0.92)] px-4 pb-2.5 pt-2.5 backdrop-blur-md">
          <div className="mx-auto max-w-md">
            <SegmentedTabs
              activeTab={state.activeTab}
              onChange={(tab) =>
                setState((currentState) => ({
                  ...currentState,
                  activeTab: tab,
                }))
              }
            />
          </div>
        </header>
      )}

      <main className={`mx-auto max-w-md px-4 py-5 ${state.activeTab === "insights" && !state.hasSubmitted ? "pb-28" : "pb-8"}`}>
        {state.activeTab === "prioritization" && state.hasSubmitted ? (
          <ConfirmationView
            selectedThemes={selectedThemes}
          />
        ) : state.activeTab === "prioritization" ? (
          <PrioritizationView
            session={session}
            selectedThemeIds={state.selectedThemeIds}
            onToggleSelection={handleToggleSelection}
            onSubmit={handleSubmit}
          />
        ) : (
          <InsightsView
            session={session}
            activeInsightIndex={activeInsightIndex}
          />
        )}
      </main>

      {state.activeTab === "insights" && !state.hasSubmitted && (
        <InsightsBottomBar
          activeInsightIndex={activeInsightIndex}
          totalThemes={session.themes.length}
          onPrev={() =>
            setState((currentState) => ({
              ...currentState,
              activeInsightIndex: Math.max(currentState.activeInsightIndex - 1, 0),
            }))
          }
          onNext={() =>
            setState((currentState) => ({
              ...currentState,
              activeInsightIndex: Math.min(
                currentState.activeInsightIndex + 1,
                session.themes.length - 1,
              ),
            }))
          }
        />
      )}
    </div>
  );
}
