'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SPOMAttempt, SPOMChapterData, SPOMScenario } from '@/lib/types';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start * 10) / 10);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function ScoreArc({ pct, passed }: { pct: number; passed: boolean }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 100) / 100);
  const color = passed ? '#10b981' : '#ef4444';
  return (
    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
    </svg>
  );
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get('attemptId') || '';

  const [attempt, setAttempt] = useState<SPOMAttempt | null>(null);
  const [chapterData, setChapterData] = useState<SPOMChapterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  const animPct = useCountUp(attempt?.percentage || 0);
  const animScore = useCountUp(attempt?.marksObtained || 0);

  useEffect(() => {
    const raw = localStorage.getItem('ca_session');
    if (!raw) { router.push('/'); return; }
    const session = JSON.parse(raw);
    if (!session.loggedIn || session.role === 'admin') { router.push('/'); return; }

    const url = `/api/spom/result?username=${encodeURIComponent(session.username)}&attemptId=${attemptId}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAttempt(data.attempt);
          setChapterData(data.chapterData);
        } else {
          setError(data.error || 'Result not found');
        }
      })
      .catch(() => setError('Failed to load result'))
      .finally(() => setLoading(false));
  }, [attemptId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt || !chapterData) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-sm">
          <p className="text-[#ef4444] font-semibold mb-4">{error || 'Result not found'}</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const resultMap = Object.fromEntries(attempt.results.map((r) => [r.questionId, r]));
  const submittedDate = new Date(attempt.submittedAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const correctCount = attempt.results.filter((r) => r.isCorrect).length;
  const wrongCount = attempt.results.filter((r) => !r.isCorrect && r.userAnswer).length;
  const skippedCount = attempt.results.filter((r) => !r.userAnswer).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid pb-12">
      {/* Navbar */}
      <header className="glass border-b border-[#1e1e2e] px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#f1f5f9] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/exam/${attempt.chapterId}`)}
            className="btn-primary px-3 py-1.5 rounded-lg text-white font-bold text-xs"
          >
            Retake
          </button>
          <button
            onClick={() => router.push('/history')}
            className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium transition-colors"
          >
            History
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8">
        {/* Hero score */}
        <div className="fade-in glass rounded-2xl p-8 border border-[#1e1e2e] mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{
            background: attempt.passed
              ? 'radial-gradient(circle at center, #10b981, transparent)'
              : 'radial-gradient(circle at center, #ef4444, transparent)'
          }} />
          <div className="relative z-10">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-4">{attempt.chapterName}</div>

            <div className="relative inline-flex items-center justify-center mb-4">
              <ScoreArc pct={attempt.percentage} passed={attempt.passed} />
              <div className="absolute text-center">
                <div className="text-2xl font-black" style={{ color: attempt.passed ? '#10b981' : '#ef4444' }}>
                  {animScore.toFixed(0)}
                </div>
                <div className="text-xs text-[#94a3b8]">/{attempt.totalMarks}</div>
              </div>
            </div>

            <div className="text-4xl font-black text-[#f1f5f9] mb-1">
              {animScore.toFixed(0)} <span className="text-xl text-[#94a3b8] font-normal">/ {attempt.totalMarks}</span>
            </div>
            <div className="text-lg text-[#94a3b8] mb-3">{animPct.toFixed(1)}%</div>

            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-lg ${
              attempt.passed ? 'bg-[#10b981]/20 text-[#10b981] pass-glow' : 'bg-[#ef4444]/20 text-[#ef4444] fail-glow'
            }`}>
              {attempt.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>

            <div className="mt-4 text-sm text-[#94a3b8]">
              Attempt #{attempt.attemptNumber} · {submittedDate} · {formatTime(attempt.timeTaken)}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 fade-in stagger-2">
          {[
            { label: 'Correct', value: correctCount, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Wrong', value: wrongCount, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
            { label: 'Skipped', value: skippedCount, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="glass rounded-xl p-4 border border-[#1e1e2e] text-center" style={{ borderTop: `2px solid ${color}` }}>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-[#94a3b8] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Scenario-wise review */}
        <div className="fade-in stagger-3">
          <h3 className="text-lg font-bold text-[#f1f5f9] mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#6366f1]/20 text-[#6366f1] text-xs font-bold flex items-center justify-center">✎</span>
            Detailed Review
          </h3>

          <div className="space-y-4">
            {chapterData.scenarios.map((scenario: SPOMScenario, sIdx: number) => {
              const sResults = scenario.questions.map((q) => resultMap[q.id]).filter(Boolean);
              const sCorrect = sResults.filter((r) => r.isCorrect).length;
              const isExpanded = expandedScenario === scenario.scenarioId;

              return (
                <div key={scenario.scenarioId} className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
                  {/* Scenario header */}
                  <button
                    onClick={() => setExpandedScenario(isExpanded ? null : scenario.scenarioId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[#1e1e2e]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="w-7 h-7 rounded-lg bg-[#6366f1]/20 text-[#6366f1] text-xs font-bold flex items-center justify-center shrink-0">
                        {sIdx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#f1f5f9]">Scenario {sIdx + 1}</p>
                        <p className="text-xs text-[#4a5568] mt-0.5">{sCorrect}/{scenario.questions.length} correct</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {scenario.questions.map((q) => {
                          const r = resultMap[q.id];
                          return (
                            <div key={q.id} className={`w-2 h-2 rounded-full ${
                              !r || !r.userAnswer ? 'bg-[#4a5568]' : r.isCorrect ? 'bg-[#10b981]' : 'bg-[#ef4444]'
                            }`} />
                          );
                        })}
                      </div>
                      <svg className={`w-4 h-4 text-[#94a3b8] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#1e1e2e] p-4 space-y-5">
                      {/* Scenario text */}
                      <div className="bg-[#1e1e2e]/40 rounded-xl p-4 border-l-2 border-[#6366f1]">
                        <p className="text-xs font-bold text-[#6366f1] mb-2 uppercase tracking-wider">Case Scenario</p>
                        <p className="text-sm text-[#94a3b8] leading-relaxed">{scenario.scenarioText}</p>
                      </div>

                      {/* Questions */}
                      {scenario.questions.map((q, qIdx) => {
                        const r = resultMap[q.id];
                        if (!r) return null;
                        return (
                          <div key={q.id} className={`rounded-xl border p-4 ${
                            r.isCorrect ? 'border-[#10b981]/30 bg-[#10b981]/5' : 'border-[#ef4444]/30 bg-[#ef4444]/5'
                          }`}>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <p className="text-sm font-medium text-[#f1f5f9] flex-1">
                                <span className="text-[#94a3b8] mr-2">Q{q.id}.</span>
                                {q.question}
                              </p>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                                r.isCorrect ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                              }`}>
                                {r.isCorrect ? '+2' : r.userAnswer ? '0' : 'Skip'}
                              </span>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-1.5 mb-3">
                              {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                                const isUser = r.userAnswer === opt;
                                const isCorrect = r.correctAnswer === opt;
                                let cls = 'border-[#1e1e2e] text-[#4a5568]';
                                if (isCorrect) cls = 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]';
                                else if (isUser && !isCorrect) cls = 'border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]';

                                return (
                                  <div key={opt} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs ${cls}`}>
                                    <span className="font-bold shrink-0">{opt}.</span>
                                    <span>{q.options[opt]}</span>
                                    {isCorrect && <span className="ml-auto font-bold shrink-0">✓</span>}
                                    {isUser && !isCorrect && <span className="ml-auto font-bold shrink-0">✗</span>}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            <div className="bg-[#0a0a0f]/60 rounded-xl p-3 border border-[#1e1e2e]">
                              <p className="text-xs font-bold text-[#6366f1] mb-1 uppercase tracking-wider">
                                {r.section} — Explanation
                              </p>
                              <p className="text-xs text-[#94a3b8] leading-relaxed">{r.explanation}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={() => router.push(`/exam/${attempt.chapterId}`)}
            className="btn-primary px-8 py-3.5 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Retake Exam
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3.5 rounded-xl border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#6366f1]/50 font-semibold transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SPOMResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
