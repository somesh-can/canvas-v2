import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Circle,
  Eye,
  ExternalLink,
  QrCode,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;
const RESULT_BAR_BASE_PERCENT = 12;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseMetricNumber(value, fallback = 124) {
  const parsed = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function VotingSlide({
  presentationData,
  votingSession,
  onVotingSessionChange,
  participantJoinUrl,
  onOpenParticipantPreview,
}) {
  const { goal, themes, metrics, voting } = presentationData;
  const { phase, question, votesPerPerson, participantsJoined, participantsCompleted, voteCounts } =
    votingSession;
  const totalParticipants = parseMetricNumber(
    metrics.find((metric) => metric.label === "Respondents")?.value,
    124,
  );
  const initialJoined = totalParticipants;
  const initialCompleted = Math.min(totalParticipants, Math.round(totalParticipants * 0.56));
  const initialVoteCounts = Object.fromEntries(themes.map((theme) => [theme.id, theme.count]));

  const [isQrOverlayOpen, setIsQrOverlayOpen] = useState(false);

  const rankedThemes = useMemo(() => {
    const totalVotes = Object.values(voteCounts).reduce((sum, n) => sum + n, 0);
    return themes
      .map((theme) => {
        const votes = voteCounts[theme.id] || 0;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        return { ...theme, votes, percentage };
      })
      .sort((a, b) => b.votes - a.votes || b.count - a.count);
  }, [themes, voteCounts]);

  const getResultBarWidth = (percentage) =>
    `${RESULT_BAR_BASE_PERCENT + ((100 - RESULT_BAR_BASE_PERCENT) * percentage) / 100}%`;

  const updateVotingSession = (updates) => {
    onVotingSessionChange((currentState) => ({
      ...currentState,
      ...updates,
    }));
  };

  const resetSession = () => {
    updateVotingSession({
      participantsJoined: initialJoined,
      participantsCompleted: initialCompleted,
      voteCounts: { ...initialVoteCounts },
    });
  };

  const beginVoting = () => {
    resetSession();
    updateVotingSession({ phase: "live" });
  };

  const closeVoting = () => {
    updateVotingSession({ phase: "results" });
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div className="space-y-2">
          <h2 className={`text-3xl font-semibold tracking-tight ${ui.text}`}>
            Prioritization
          </h2>
        </div>

        <div
          className={`flex p-1 ${ui.surfaceElevated} border ${ui.border} rounded-full`}
        >
          {[
            { id: "configure", label: "Configure" },
            { id: "live", label: "Live Prioritization" },
            { id: "results", label: "Results" },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => updateVotingSession({ phase: step.id })}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${phase === step.id ? "bg-[var(--presentation-surface)] shadow-sm text-[var(--presentation-text)]" : "text-[var(--presentation-text-muted)] hover:text-[var(--presentation-text)]"}`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {(phase === "configure" || phase === "live") && (
        <div className="grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          <aside className={`${ui.panelStrong} rounded-[28px] p-6 space-y-6 h-fit self-start`}>
            {phase === "configure" ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className={ui.textMuted} />
                    <h3 className={`text-2xl font-semibold ${ui.text} leading-tight`}>
                      Setup
                    </h3>
                  </div>
                  <div className={`border-t ${ui.border}`} />
                </div>

                <div className="space-y-2">
                  <label className={`text-base font-medium ${ui.textMuted}`}>Question</label>
                  <textarea
                    value={question}
                    onChange={(e) => updateVotingSession({ question: e.target.value })}
                    rows={4}
                    className={`w-full resize-none rounded-xl px-4 py-3 text-base ${ui.control} ${ui.focusRing}`}
                  />
                </div>

                <div className={`rounded-xl p-4 ${ui.mutedPanel} space-y-2`}>
                  <p className={`text-base font-medium ${ui.textMuted}`}>Votes per person</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        updateVotingSession({
                          votesPerPerson: clamp(votesPerPerson - 1, 1, 10),
                        })
                      }
                      className={`h-9 w-9 rounded-lg ${ui.control} ${ui.controlHover} ${ui.focusRing}`}
                    >
                      -
                    </button>
                    <span className={`text-xl font-semibold ${ui.text}`}>{votesPerPerson}</span>
                    <button
                      onClick={() =>
                        updateVotingSession({
                          votesPerPerson: clamp(votesPerPerson + 1, 1, 10),
                        })
                      }
                      className={`h-9 w-9 rounded-lg ${ui.control} ${ui.controlHover} ${ui.focusRing}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={beginVoting}
                  className={`w-full h-11 rounded-xl bg-[var(--presentation-text)] text-white text-sm font-semibold hover:opacity-90 transition-opacity ${ui.focusRing}`}
                >
                  Start Prioritization
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Users size={16} className={ui.textMuted} />
                  <h3 className={`text-2xl font-semibold ${ui.text}`}>Joining info</h3>
                </div>

                <div className={`${ui.mutedPanel} rounded-xl p-4 space-y-4`}>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${ui.textMuted}`}>Join url</p>
                      <p className={`text-base md:text-lg font-medium ${ui.text}`}>
                        {participantJoinUrl}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenParticipantPreview}
                      className={`w-full h-12 rounded-2xl border ${ui.border} ${ui.controlHover} ${ui.focusRing} flex items-center justify-center gap-3 text-sm font-semibold ${ui.text}`}
                    >
                      <ExternalLink size={16} />
                      Open participant preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsQrOverlayOpen(true)}
                      className={`w-full h-14 rounded-2xl ${ui.control} ${ui.controlHover} ${ui.focusRing} flex items-center justify-center gap-3 text-base font-semibold ${ui.text}`}
                      aria-label="Show QR code"
                    >
                      <QrCode size={18} />
                      Show QR
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 border border-[#b9afd8] bg-[linear-gradient(135deg,#d8d0f0_0%,#c8bee8_100%)]">
                    <div className="flex items-center gap-2">
                      <Users size={15} className="text-[#2a3242]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2a3242]">Joined</p>
                    </div>
                    <p className="text-3xl font-semibold text-[#232a36] mt-3">{participantsJoined}</p>
                  </div>
                  <div className="rounded-2xl p-4 border border-[#a6c2df] bg-[linear-gradient(135deg,#c7def4_0%,#b8d2ec_100%)]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-[#243342]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#243342]">Completed</p>
                    </div>
                    <p className="text-3xl font-semibold text-[#1f2f3c] mt-3">{participantsCompleted}</p>
                  </div>
                </div>

                <button
                  onClick={closeVoting}
                  className={`w-full h-11 rounded-xl bg-[var(--presentation-text)] text-white text-sm font-semibold hover:opacity-90 transition-opacity ${ui.focusRing}`}
                >
                  Close Prioritization
                </button>
              </>
            )}
          </aside>

          <section className={`${ui.panelStrong} rounded-[28px] p-8 space-y-6`}>
            <div className="space-y-2">
              {phase === "configure" ? (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className={ui.textMuted} />
                    <p className={`text-2xl font-semibold ${ui.text}`}>Preview</p>
                  </div>
                  <div className={`border-t ${ui.border}`} />
                </div>
              ) : (
                <div className="space-y-4 pb-4">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className={ui.textMuted} />
                    <p className={`text-2xl font-semibold ${ui.text}`}>Live prioritization</p>
                    <span className="relative ml-1 inline-flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/80" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  </div>
                  <div className={`border-t ${ui.border}`} />
                </div>
              )}
              <div className={`${ui.mutedPanel} rounded-2xl p-4 ${phase === "live" ? "mb-8" : ""}`}>
                <p className={`text-base ${ui.text}`}>{goal}</p>
              </div>
              {phase === "configure" && (
                <p className={`text-sm uppercase tracking-[0.16em] pt-4 ${ui.textSoft}`}>
                  Question
                </p>
              )}
              <h3 className={`text-[1.9rem] font-medium leading-tight ${phase === "live" ? "pt-6" : ""} ${ui.text}`}>{question}</h3>
            </div>

            <div className="space-y-4">
              {rankedThemes.map((theme, index) => (
                <div
                  key={theme.id}
                  className={`${phase === "live" ? "rounded-2xl p-4 border border-[var(--presentation-border)] bg-[linear-gradient(90deg,#f0eff7_0%,#f6f7fb_100%)]" : `${ui.surface} ${ui.border} border rounded-2xl p-4`}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {phase === "configure" && (
                        <span className={`mt-0.5 ${ui.textSoft}`} aria-hidden="true">
                          <Circle size={22} />
                        </span>
                      )}
                      {phase === "live" && (
                        <span
                          className={`h-7 w-7 rounded-full ${ui.surfaceElevated} ${ui.border} border flex items-center justify-center text-sm font-semibold ${ui.textMuted}`}
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                      )}
                      <div>
                        <p className={`text-lg font-medium ${ui.text}`}>
                          {theme.title}
                        </p>
                      </div>
                    </div>
                    {phase === "live" && (
                      <div className="text-right">
                        <p className={`text-xl font-semibold ${ui.text}`}>{theme.percentage}%</p>
                        <p className={`text-base font-medium ${ui.textMuted}`}>{theme.votes} votes</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {phase === "results" && (
        <div>
          <section className={`${ui.panelStrong} rounded-[28px] p-8 space-y-6`}>
            <div className="space-y-4 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className={ui.textMuted} />
                <h3 className={`text-2xl font-semibold ${ui.text}`}>Prioritization analysis</h3>
              </div>
              <div className={`border-t ${ui.border}`} />
            </div>

            <div className="space-y-6">
              <div className={`${ui.mutedPanel} rounded-2xl p-4`}>
                <p className={`text-base ${ui.text}`}>{goal}</p>
              </div>
              <h3 className={`text-[1.9rem] font-medium leading-tight ${ui.text}`}>{question}</h3>

              <div className="space-y-4">
                <p className={`text-base font-semibold ${ui.text}`}>Prioritization ranking</p>
                {rankedThemes.map((theme, index) => (
                  <div
                    key={theme.id}
                    className="rounded-2xl p-3 border border-[var(--presentation-border)] bg-white/75"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="relative rounded-2xl bg-white/70 overflow-hidden">
                          <div
                            className="absolute inset-y-1 left-1 rounded-[18px] bg-[linear-gradient(90deg,#d9ccff_0%,#ece2ff_52%,#f7f1ff_100%)] shadow-[0_2px_8px_rgba(124,58,237,0.12)] transition-[width] duration-500 ease-out"
                            style={{ width: getResultBarWidth(theme.percentage) }}
                          />
                          <div className="relative z-10 min-h-[64px] flex items-center px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`h-7 w-7 rounded-full ${ui.surfaceElevated} ${ui.border} border flex items-center justify-center text-sm font-semibold ${ui.textMuted} shrink-0`}
                                aria-hidden="true"
                              >
                                {index + 1}
                              </span>
                              <p className={`text-lg font-medium ${ui.text} truncate whitespace-nowrap`}>
                                {theme.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[132px] text-right shrink-0">
                        <p className={`text-xl font-semibold leading-none ${ui.text}`}>
                          {theme.percentage}%
                        </p>
                        <p className={`mt-2 text-base font-medium leading-none ${ui.textMuted}`}>
                          {theme.votes} votes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {isQrOverlayOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setIsQrOverlayOpen(false)}
        >
          <div
            className={`${ui.panelStrong} rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className={`text-xl font-semibold ${ui.text}`}>Joining info</p>
              <button
                type="button"
                onClick={() => setIsQrOverlayOpen(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${ui.control} ${ui.controlHover} ${ui.focusRing}`}
              >
                Close
              </button>
            </div>
            <div className="rounded-2xl border border-[var(--presentation-border)] bg-[var(--presentation-surface)] p-6 flex items-center justify-center">
              <div className="h-52 w-52 rounded-2xl border border-[var(--presentation-border-strong)] bg-[var(--presentation-surface-elevated)] flex items-center justify-center">
                <QrCode className={ui.textMuted} size={132} />
              </div>
            </div>
            <div className={`${ui.mutedPanel} rounded-xl p-4 space-y-2`}>
              <p className={`text-sm font-medium ${ui.textMuted}`}>Join url</p>
              <p className={`text-lg font-medium ${ui.text}`}>{participantJoinUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
