'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { SPOMChapterData, SPOMScenario, SPOMQuestion, Chapter } from '@/lib/types';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.chapterId as string;

  const [username, setUsername] = useState('');
  const [chapterMeta, setChapterMeta] = useState<Chapter | null>(null);
  const [chapterData, setChapterData] = useState<SPOMChapterData | null>(null);
  const [allQuestions, setAllQuestions] = useState<(SPOMQuestion & { scenarioId: string })[]>([]);

  const [phase, setPhase] = useState<'loading' | 'instructions' | 'exam' | 'submitting'>('loading');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    const raw = localStorage.getItem('ca_session');
    if (!raw) { router.push('/'); return; }
    const session = JSON.parse(raw);
    if (!session.loggedIn || session.role === 'admin') { router.push('/'); return; }
    setUsername(session.username);

    // Load chapter meta
    fetch(`/api/chapters`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const meta = data.chapters.find((c: Chapter) => c.id === chapterId);
          if (!meta || !meta.available) { router.push('/dashboard'); return; }
          setChapterMeta(meta);
          setTimeLeft(meta.duration * 60);
        }
      });

    // Load questions
    fetch(`/api/chapters/${chapterId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setChapterData(data.chapterData);
          const flat = data.chapterData.scenarios.flatMap((s: SPOMScenario) =>
            s.questions.map((q: SPOMQuestion) => ({ ...q, scenarioId: s.scenarioId }))
          );
          setAllQuestions(flat);
          setPhase('instructions');
        } else {
          router.push('/dashboard');
        }
      });
  }, [chapterId, router]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('submitting');

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/spom/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, chapterId, answers, timeTaken }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('spom_last_attempt', data.attemptId);
        router.push(`/spom-result?attemptId=${data.attemptId}`);
      } else {
        alert('Submission failed: ' + (data.error || 'Unknown error'));
        submittingRef.current = false;
        setPhase('exam');
      }
    } catch {
      alert('Network error. Please try again.');
      submittingRef.current = false;
      setPhase('exam');
    }
  }, [username, chapterId, answers, router]);

  // Timer
  useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, handleSubmit]);

  const startExam = () => {
    startTimeRef.current = Date.now();
    setPhase('exam');
  };

  const answeredCount = Object.keys(answers).length;
  const totalQ = allQuestions.length;
  const timerColor = timeLeft > 600 ? '#f1f5f9' : timeLeft > 300 ? '#f59e0b' : '#ef4444';
  const timerPulse = timeLeft <= 300;

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Submitting your answers...</p>
        </div>
      </div>
    );
  }

  if (phase === 'instructions' && chapterMeta) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] bg-grid flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl fade-in">
          <div className="glass rounded-2xl p-8 border border-[#1e1e2e]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-[#6366f1] uppercase tracking-wider mb-0.5">{chapterMeta.code} · {chapterMeta.law}</div>
                <h1 className="text-lg font-black text-[#f1f5f9] leading-tight">{chapterMeta.name}</h1>
              </div>
            </div>

            {/* Exam details */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Questions', value: `${chapterMeta.totalQuestions} MCQs`, icon: '📝' },
                { label: 'Total Marks', value: `${chapterMeta.totalMarks} marks`, icon: '🎯' },
                { label: 'Duration', value: `${chapterMeta.duration} minutes`, icon: '⏱️' },
                { label: 'Pass Mark', value: `50% (${chapterMeta.passMarks} marks)`, icon: '✅' },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-[#1e1e2e]/60 rounded-xl p-3 border border-[#1e1e2e]">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-sm font-bold text-[#f1f5f9]">{value}</div>
                  <div className="text-xs text-[#4a5568]">{label}</div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-[#6366f1]/5 border border-[#6366f1]/20 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-bold text-[#6366f1] mb-3 uppercase tracking-wider">Instructions</h3>
              <ul className="space-y-2 text-sm text-[#94a3b8]">
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> All questions are case scenario-based MCQs (2 marks each)</li>
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> Read each scenario carefully before answering the questions below it</li>
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> All {chapterMeta.totalQuestions} questions are compulsory — no optional questions</li>
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> There is NO negative marking for wrong answers</li>
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> Timer starts when you click Start Exam and auto-submits on timeout</li>
                <li className="flex items-start gap-2"><span className="text-[#6366f1] mt-0.5">•</span> You can navigate between scenarios freely during the exam</li>
                <li className="flex items-start gap-2"><span className="text-[#f59e0b] mt-0.5">⚠</span> Do not refresh the page during the exam</li>
              </ul>
            </div>

            {/* Key sections */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#4a5568] uppercase tracking-wider mb-2">Key Sections Covered</p>
              <div className="flex flex-wrap gap-1.5">
                {chapterMeta.keySections.slice(0, 12).map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e2e] text-[#94a3b8] border border-[#1e1e2e]">{s}</span>
                ))}
                {chapterMeta.keySections.length > 12 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e2e] text-[#4a5568]">+{chapterMeta.keySections.length - 12} more</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-5 py-3 rounded-xl border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] font-semibold text-sm transition-colors"
              >
                ← Back
              </button>
              <button onClick={startExam} className="flex-1 btn-primary py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Exam Phase ──────────────────────────────────────────────────────────────
  if (phase !== 'exam' || !chapterData) return null;

  const scenarios = chapterData.scenarios;
  const scenario = scenarios[currentScenarioIdx];

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-[#1e1e2e] px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold text-[#6366f1] shrink-0">{chapterMeta?.code}</span>
          <span className="text-xs text-[#94a3b8] truncate hidden sm:block">{chapterMeta?.name}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8]">
            <div className="w-20 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#6366f1] transition-all" style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
            </div>
            <span>{answeredCount}/{totalQ}</span>
          </div>

          {/* Timer */}
          <div
            className={`font-mono text-sm font-bold px-3 py-1 rounded-lg bg-[#1e1e2e] ${timerPulse ? 'timer-pulse' : ''}`}
            style={{ color: timerColor }}
          >
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={() => setConfirmOpen(true)}
            className="btn-primary px-3 py-1.5 rounded-lg text-white font-bold text-xs"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6 gap-6">
        {/* Scenario navigator sidebar */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="glass rounded-xl p-3 border border-[#1e1e2e] sticky top-20">
            <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-3">Scenarios</p>
            <div className="space-y-1">
              {scenarios.map((s, idx) => {
                const qIds = s.questions.map((q) => q.id);
                const answered = qIds.filter((id) => answers[id]).length;
                const isActive = idx === currentScenarioIdx;
                return (
                  <button
                    key={s.scenarioId}
                    onClick={() => setCurrentScenarioIdx(idx)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                      isActive ? 'bg-[#6366f1] text-white font-bold' : 'text-[#94a3b8] hover:bg-[#1e1e2e] hover:text-[#f1f5f9]'
                    }`}
                  >
                    <div className="font-semibold">Scenario {idx + 1}</div>
                    <div className={`mt-0.5 ${isActive ? 'text-indigo-200' : 'text-[#4a5568]'}`}>
                      {answered}/{qIds.length} answered
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#1e1e2e]">
              <p className="text-xs text-[#4a5568] mb-2">Questions</p>
              <div className="flex flex-wrap gap-1">
                {allQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                      answers[q.id] ? 'bg-[#6366f1] text-white' : 'bg-[#1e1e2e] text-[#4a5568]'
                    }`}
                  >
                    {q.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Scenario card */}
          <div className="glass rounded-xl border border-[#6366f1]/20 p-5 mb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#6366f1]">
                Scenario {currentScenarioIdx + 1} of {scenarios.length}
              </span>
            </div>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{scenario.scenarioText}</p>
          </div>

          {/* Questions */}
          <div className="space-y-5">
            {scenario.questions.map((q, qIdx) => {
              const globalIdx = allQuestions.findIndex((a) => a.id === q.id);
              return (
                <div key={q.id} className="glass rounded-xl border border-[#1e1e2e] p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#6366f1]/20 text-[#6366f1] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {globalIdx + 1}
                    </span>
                    <p className="text-sm text-[#f1f5f9] font-medium leading-relaxed">{q.question}</p>
                  </div>

                  <div className="space-y-2 pl-9">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={`mcq-option w-full flex items-start gap-3 p-3 rounded-xl border text-left ${
                            isSelected ? 'selected border-[#6366f1] bg-[#6366f1]/10' : 'border-[#1e1e2e] bg-transparent'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-[#6366f1] border-[#6366f1] text-white' : 'border-[#1e1e2e] text-[#94a3b8]'
                          }`}>
                            {opt}
                          </span>
                          <span className={`text-sm leading-relaxed ${isSelected ? 'text-[#f1f5f9]' : 'text-[#94a3b8]'}`}>
                            {q.options[opt]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 pl-9">
                    <span className="text-xs text-[#4a5568]">{q.section}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scenario navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentScenarioIdx((i) => Math.max(0, i - 1))}
              disabled={currentScenarioIdx === 0}
              className="px-4 py-2 rounded-xl border border-[#1e1e2e] text-[#94a3b8] text-sm font-medium disabled:opacity-40 hover:border-[#6366f1]/50 transition-all"
            >
              ← Previous Scenario
            </button>
            {currentScenarioIdx < scenarios.length - 1 ? (
              <button
                onClick={() => setCurrentScenarioIdx((i) => i + 1)}
                className="px-4 py-2 rounded-xl bg-[#6366f1] text-white text-sm font-bold hover:bg-indigo-500 transition-colors"
              >
                Next Scenario →
              </button>
            ) : (
              <button
                onClick={() => setConfirmOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#10b981] text-white text-sm font-bold hover:bg-emerald-400 transition-colors"
              >
                Review & Submit ✓
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Confirm submit modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="glass rounded-2xl p-6 border border-[#1e1e2e] w-full max-w-md fade-in">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">Submit Exam?</h3>
            <p className="text-sm text-[#94a3b8] mb-4">
              You have answered <strong className="text-[#f1f5f9]">{answeredCount}</strong> out of{' '}
              <strong className="text-[#f1f5f9]">{totalQ}</strong> questions.
              {answeredCount < totalQ && (
                <span className="text-[#f59e0b]"> {totalQ - answeredCount} question(s) are unanswered.</span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#1e1e2e] text-[#94a3b8] font-semibold text-sm hover:text-[#f1f5f9] transition-colors"
              >
                Continue Exam
              </button>
              <button
                onClick={() => { setConfirmOpen(false); handleSubmit(false); }}
                className="flex-1 py-2.5 rounded-xl bg-[#10b981] text-white font-bold text-sm hover:bg-emerald-400 transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
