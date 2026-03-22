'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type HistoryItem = {
  type: 'spom' | 'ca-inter';
  attemptId: string;
  chapterId: string;
  chapterName: string;
  attemptNumber: number;
  submittedAt: string;
  timeTaken: number | null;
  score: number;
  totalQuestions: number;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  // legacy only
  mcqScore?: number;
  shortScore?: number;
  caseScore?: number;
};

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') as 'all' | 'pass' | 'fail' | null;

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail'>(initialFilter || 'all');
  const [filterType, setFilterType] = useState<'all' | 'spom' | 'ca-inter'>('all');

  useEffect(() => {
    const raw = localStorage.getItem('ca_session');
    if (!raw) { router.push('/'); return; }
    const session = JSON.parse(raw);
    if (!session.loggedIn || session.role === 'admin') { router.push('/'); return; }

    fetch(`/api/spom/history?username=${encodeURIComponent(session.username)}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setHistory(data.history); })
      .finally(() => setLoading(false));
  }, [router]);

  const filtered = history.filter((h) => {
    if (filterStatus === 'pass' && !h.passed) return false;
    if (filterStatus === 'fail' && h.passed) return false;
    if (filterType === 'spom' && h.type !== 'spom') return false;
    if (filterType === 'ca-inter' && h.type !== 'ca-inter') return false;
    return true;
  });

  const spomCount = history.filter(h => h.type === 'spom').length;
  const legacyCount = history.filter(h => h.type === 'ca-inter').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid">
      {/* Navbar */}
      <header className="glass border-b border-[#1e1e2e] px-4 md:px-8 h-14 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-[#94a3b8] hover:text-[#f1f5f9] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Dashboard
          </button>
          <span className="text-[#1e1e2e]">|</span>
          <span className="font-bold text-sm text-[#f1f5f9]">Attempt History</span>
        </div>
        <span className="text-xs text-[#4a5568]">{filtered.length} records</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="fade-in mb-6">
          <h1 className="text-2xl font-black text-[#f1f5f9]">My Attempts</h1>
          <div className="flex gap-4 mt-2 text-xs text-[#94a3b8]">
            <span><strong className="text-[#6366f1]">{spomCount}</strong> SPOM attempts</span>
            {legacyCount > 0 && <span><strong className="text-[#f59e0b]">{legacyCount}</strong> CA Inter attempts</span>}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 fade-in stagger-1">
          {/* Pass/Fail filter */}
          <div className="flex gap-1.5">
            {(['all', 'pass', 'fail'] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  filterStatus === s
                    ? s === 'pass' ? 'bg-[#10b981] text-white' : s === 'fail' ? 'bg-[#ef4444] text-white' : 'bg-[#6366f1] text-white'
                    : 'border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9]'
                }`}>{s}</button>
            ))}
          </div>

          {/* Type filter — only show if both types exist */}
          {legacyCount > 0 && (
            <div className="flex gap-1.5 ml-2 pl-2 border-l border-[#1e1e2e]">
              {([
                { key: 'all', label: 'All Exams' },
                { key: 'spom', label: 'SPOM' },
                { key: 'ca-inter', label: 'CA Inter' },
              ] as const).map(({ key, label }) => (
                <button key={key} onClick={() => setFilterType(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterType === key ? 'bg-[#f59e0b] text-black' : 'border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9]'
                  }`}>{label}</button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-[#1e1e2e] fade-in">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-[#94a3b8] font-medium">No attempts found</p>
            <p className="text-[#4a5568] text-sm mt-1 mb-6">
              {history.length === 0 ? 'Start an exam from the dashboard' : 'Try adjusting the filters'}
            </p>
            <button onClick={() => router.push('/dashboard')} className="btn-primary px-6 py-2.5 rounded-xl text-white font-bold text-sm">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3 fade-in stagger-2">
            {filtered.map((item) => {
              const isLegacy = item.type === 'ca-inter';
              const accentColor = item.passed ? '#10b981' : '#ef4444';

              return (
                <div
                  key={item.attemptId}
                  onClick={() => {
                    if (isLegacy) {
                      // Legacy — redirect to old result page
                      localStorage.setItem('ca_last_attempt', item.attemptId);
                      router.push('/result');
                    } else {
                      router.push(`/spom-result?attemptId=${item.attemptId}`);
                    }
                  }}
                  className="glass rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] overflow-hidden"
                  style={{ borderColor: item.passed ? 'rgba(16,185,129,0.2)' : 'rgba(30,30,46,1)' }}
                >
                  <div className="h-0.5" style={{ background: accentColor }} />
                  <div className="p-4 flex items-center gap-4">
                    {/* Score circle */}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2"
                      style={{ borderColor: accentColor, background: `${accentColor}15` }}>
                      <div className="text-center">
                        <div className="text-sm font-black leading-none" style={{ color: accentColor }}>
                          {item.percentage.toFixed(0)}
                        </div>
                        <div className="text-xs text-[#4a5568]">%</div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-bold text-[#f1f5f9] truncate">{item.chapterName}</p>
                        {/* Type badge */}
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          isLegacy
                            ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                            : 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'
                        }`}>
                          {isLegacy ? 'CA Inter' : 'SPOM'}
                        </span>
                        {/* Pass/Fail badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          item.passed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                        }`}>
                          {item.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8]">
                        <span>Attempt #{item.attemptNumber}</span>
                        <span className="font-semibold text-[#f1f5f9]">
                          {item.marksObtained}/{item.totalMarks} marks
                        </span>
                        {/* SPOM: show correct count | CA Inter: show section breakdown */}
                        {isLegacy ? (
                          <span>MCQ: {item.mcqScore}/20 · Short: {item.shortScore}/20 · Case: {item.caseScore}/15</span>
                        ) : (
                          <span>{item.score}/{item.totalQuestions} correct</span>
                        )}
                        <span>{new Date(item.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <svg className="w-4 h-4 text-[#4a5568] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}
