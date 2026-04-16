import React, { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Circle,
  Eye,
  QrCode,
  RotateCcw,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { presentationData } from "../../data/mockData";
import { presentationTheme } from "../../lib/presentationTheme";

const ui = presentationTheme.classes;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseMetricNumber(value, fallback = 124) {
  const parsed = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function VotingSlide() {
  const { goal, themes, metrics, voting } = presentationData;
  const totalParticipants = parseMetricNumber(
    metrics.find((metric) => metric.label === "Respondents")?.value,
    124,
  );
  const initialJoined = totalParticipants;
  const initialCompleted = Math.min(totalParticipants, Math.round(totalParticipants * 0.56));
  const initialVoteCounts = Object.fromEntries(themes.map((theme) => [theme.id, theme.count]));

  const [phase, setPhase] = useState("configure");
  const [question, setQuestion] = useState(voting.question);
  const [votesPerPerson, setVotesPerPerson] = useState(voting.votesPerPerson);
  const [participantsJoined, setParticipantsJoined] = useState(initialJoined);
  const [participantsCompleted, setParticipantsCompleted] = useState(initialCompleted);
  const [isQrOverlayOpen, setIsQrOverlayOpen] = useState(false);
  const [voteCounts, setVoteCounts] = useState(() => ({ ...initialVoteCounts }));

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

  const totalVotesCast = Object.values(voteCounts).reduce((sum, n) => sum + n, 0);
  const topTheme = rankedThemes[0];

  const resetSession = () => {
    setParticipantsJoined(initialJoined);
    setParticipantsCompleted(initialCompleted);
    setVoteCounts({ ...initialVoteCounts });
  };

  const beginVoting = () => {
    resetSession();
    setPhase("live");
  };

  const closeVoting = () => {
    setPhase("results");
  };

  const triggerRevote = () => {
    resetSession();
    setPhase("configure");
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-16 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
        <div className="space-y-2">
          <h2 className={`text-3xl font-semibold tracking-tight ${ui.text}`}>
            Voting
          </h2>
        </div>

        <div
          className={`flex p-1 ${ui.surfaceElevated} border ${ui.border} rounded-full`}
        >
          {[
            { id: "configure", label: "Configure" },
            { id: "live", label: "Live Voting" },
            { id: "results", label: "Results" },
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setPhase(step.id)}
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
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className={`w-full resize-none rounded-xl px-4 py-3 text-base ${ui.control} ${ui.focusRing}`}
                  />
                </div>

                <div className={`rounded-xl p-4 ${ui.mutedPanel} space-y-2`}>
                  <p className={`text-base font-medium ${ui.textMuted}`}>Votes per person</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setVotesPerPerson((v) => clamp(v - 1, 1, 10))}
                      className={`h-9 w-9 rounded-lg ${ui.control} ${ui.controlHover} ${ui.focusRing}`}
                    >
                      -
                    </button>
                    <span className={`text-xl font-semibold ${ui.text}`}>{votesPerPerson}</span>
                    <button
                      onClick={() => setVotesPerPerson((v) => clamp(v + 1, 1, 10))}
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
                  Start Voting
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Users size={16} className={ui.textMuted} />
                  <h3 className={`text-2xl font-semibold ${ui.text}`}>Joining info</h3>
                </div>

                <div className={`${ui.mutedPanel} rounded-xl p-4 space-y-4`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className={`text-sm font-medium ${ui.textMuted}`}>Join url</p>
                      <p className={`text-base md:text-lg font-medium ${ui.text}`}>cd.ai/join</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsQrOverlayOpen(true)}
                      className={`h-9 w-9 rounded-lg ${ui.control} ${ui.controlHover} ${ui.focusRing} flex items-center justify-center`}
                      aria-label="Show QR code"
                    >
                      <QrCode size={16} className={ui.textMuted} />
                    </button>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${ui.textMuted}`}>Join code</p>
                    <p className={`text-[2rem] font-semibold tracking-normal ${ui.text}`}>
                      {voting.joinCode}
                    </p>
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
                  Close Voting
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
                    <p className={`text-2xl font-semibold ${ui.text}`}>Live voting</p>
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
                          {String.fromCharCode(65 + index)}. {theme.title}
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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className={ui.textMuted} />
                  <h3 className={`text-2xl font-semibold ${ui.text}`}>Voting analysis</h3>
                </div>
                <button
                  onClick={triggerRevote}
                  className={`h-11 px-5 rounded-xl bg-[var(--presentation-text)] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${ui.focusRing}`}
                >
                  <RotateCcw size={14} />
                  Trigger Revote
                </button>
              </div>
              <div className={`border-t ${ui.border}`} />
            </div>

            <div className="space-y-6">
              <div className={`${ui.mutedPanel} rounded-2xl p-4`}>
                <p className={`text-base ${ui.text}`}>{goal}</p>
              </div>
              <h3 className={`text-[1.9rem] font-medium leading-tight ${ui.text}`}>{question}</h3>

              <div className="space-y-4">
                <p className={`text-base font-semibold ${ui.text}`}>Voting priority</p>
                {rankedThemes.map((theme, index) => (
                  <div
                    key={theme.id}
                    className="rounded-2xl p-4 border border-[var(--presentation-border)] bg-[linear-gradient(90deg,#f0eff7_0%,#f6f7fb_100%)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`h-7 w-7 rounded-full ${ui.surfaceElevated} ${ui.border} border flex items-center justify-center text-sm font-semibold ${ui.textMuted}`}
                          aria-hidden="true"
                        >
                          {index + 1}
                        </span>
                        <p className={`text-lg font-medium ${ui.text}`}>{theme.title}</p>
                      </div>
                      <p className={`text-sm font-semibold ${ui.text}`}>
                        {theme.percentage}% ({theme.votes} votes)
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${ui.surface} ${ui.border} border rounded-2xl p-6 space-y-3`}>
                <p className={`text-base font-semibold ${ui.text}`}>Key takeaways</p>
                <ul className={`space-y-2 text-base leading-relaxed ${ui.textMuted}`}>
                  <li>{topTheme?.title} currently leads with {topTheme?.percentage}% support.</li>
                  <li>{participantsCompleted} participants completed voting with {totalVotesCast} total votes cast.</li>
                  <li>{topTheme?.subthemes?.[0]} is the strongest recurring signal across responses.</li>
                </ul>
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
              <p className={`text-lg font-medium ${ui.text}`}>cd.ai/join</p>
              <p className={`text-sm font-medium ${ui.textMuted}`}>Join code</p>
              <p className={`text-[2rem] font-semibold ${ui.text}`}>{voting.joinCode}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
