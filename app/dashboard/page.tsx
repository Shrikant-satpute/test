'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Chapter, ChapterProgress } from '@/lib/types';

const CATEGORY_META = {
  'companies-act':    { label: 'Companies Act, 2013', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.3)'  },
  'securities-laws':  { label: 'Securities Laws',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)'  },
  'economic-laws':    { label: 'Economic Laws',         color: '#a855f7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)'  },
  'full-mock':        { label: 'Full Syllabus Grand Test', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)' },
};

function StatusBadge({ progress }: { progress: ChapterProgress | undefined }) {
  if (!progress || !progress.attempted)
    return <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e1e2e] text-[#4a5568] font-medium">Not Started</span>;
  if (progress.passed)
    return <span className="text-xs px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/30">Passed</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] font-bold border border-[#f59e0b]/30">Attempted</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<Record<string, ChapterProgress>>({});
  const [legacyCount, setLegacyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'companies-act' | 'securities-laws' | 'economic-laws' | 'full-mock'>('all');

  useEffect(() => {
    const raw = localStorage.getItem('ca_session');
    if (!raw) { router.push('/'); return; }
    const session = JSON.parse(raw);
    if (!session.loggedIn) { router.push('/'); return; }
    if (session.role === 'admin') { router.push('/admin'); return; }
    setUsername(session.username);

    Promise.all([
      fetch(`/api/chapters?username=${encodeURIComponent(session.username)}`).then(r => r.json()),
      fetch(`/api/spom/history?username=${encodeURIComponent(session.username)}`).then(r => r.json()),
    ]).then(([chapData, histData]) => {
      if (chapData.success) {
        setChapters(chapData.chapters);
        setProgress(chapData.progress || {});
      }
      if (histData.success) {
        setLegacyCount(histData.history.filter((h: { type: string }) => h.type === 'ca-inter').length);
      }
    }).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ca_session');
    localStorage.removeItem('ca_last_attempt');
    router.push('/');
  };

  // Grand Test (full-syllabus mock) drives the announcement poster
  const grandTest = chapters.find((c) => c.category === 'full-mock' && c.available);

  // Filter by category, then float any Grand Test card to the front so it sits
  // before the first chapter and is easy to spot.
  const filtered = (filter === 'all' ? chapters : chapters.filter((c) => c.category === filter))
    .slice()
    .sort((a, b) => Number(b.category === 'full-mock') - Number(a.category === 'full-mock'));

  const totalPassed = Object.values(progress).filter((p) => p.passed).length;
  const totalAttempted = Object.values(progress).filter((p) => p.attempted).length;
  const overallPct = chapters.length > 0 ? Math.round((totalPassed / chapters.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] bg-grid">
      {/* Navbar */}
      <header className="glass border-b border-[#1e1e2e] px-4 md:px-8 h-14 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm text-[#f1f5f9]">SPOM Set A</span>
            <span className="text-[#4a5568] text-xs ml-2 hidden sm:inline">Corporate & Economic Laws</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/history')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium transition-all hover:border-[#6366f1]/50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            History
          </button>
          <span className="text-xs text-[#94a3b8] hidden sm:block">{username}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Welcome + stats */}
        <div className="fade-in mb-8">
          <h1 className="text-2xl font-black text-[#f1f5f9] mb-1">
            Welcome back, <span className="gradient-text">{username}</span>
          </h1>
          <p className="text-[#94a3b8] text-sm">SPOM Set A — Corporate & Economic Laws · New Scheme 2024</p>
        </div>

        {/* Grand Test announcement poster */}
        {grandTest && (
          <div
            onClick={() => router.push(`/exam/${grandTest.id}`)}
            className="fade-in mb-8 cursor-pointer rounded-2xl border border-[#ef4444]/40 overflow-hidden group relative"
            style={{ background: 'linear-gradient(110deg, rgba(239,68,68,0.20), rgba(168,85,247,0.14) 55%, rgba(99,102,241,0.10))' }}
          >
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
            <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ef4444] text-white tracking-widest animate-pulse">NEW</span>
                  <span className="text-xs font-bold text-[#ef4444] tracking-wide uppercase">Grand Test · Full Syllabus</span>
                </div>
                <h2 className="text-lg md:text-2xl font-black text-[#f1f5f9] mb-1.5 leading-tight">
                  🎯 {grandTest.name}
                </h2>
                <p className="text-[#cbd5e1] text-xs md:text-sm leading-relaxed max-w-2xl">
                  {grandTest.totalQuestions} integrated, multi-chapter MCQs spanning all 18 chapters of Corporate &amp; Economic Laws — exam-pattern, scenario-driven and very hard. Test your full-syllabus readiness in one paper.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] md:text-xs text-[#94a3b8]">
                  <span className="px-2 py-0.5 rounded-md bg-[#ef4444]/15 text-[#fca5a5] font-bold border border-[#ef4444]/25">{grandTest.code}</span>
                  <span>📝 {grandTest.totalQuestions} MCQs</span>
                  <span>⏱ {grandTest.duration} min</span>
                  <span>🏆 {grandTest.totalMarks} marks · Pass 50%</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/exam/${grandTest.id}`); }}
                className="shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white transition-all group-hover:scale-105 shadow-lg whitespace-nowrap"
                style={{ background: 'linear-gradient(90deg,#ef4444,#a855f7)' }}
              >
                Start Grand Test →
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-in stagger-1">
          {[
            { label: 'Chapters Available', value: chapters.filter(c => c.available).length, total: chapters.length, color: '#6366f1', icon: '📚', link: null, sub: null },
            { label: 'Chapters Attempted', value: totalAttempted, total: chapters.length, color: '#f59e0b', icon: '✏️', link: '/history', sub: legacyCount > 0 ? `+${legacyCount} CA Inter` : null },
            { label: 'Chapters Passed', value: totalPassed, total: chapters.length, color: '#10b981', icon: '✅', link: '/history?filter=pass', sub: null },
            { label: 'Overall Progress', value: `${overallPct}%`, total: null, color: '#a855f7', icon: '📊', link: '/history', sub: null },
          ].map(({ label, value, total, color, icon, link, sub }) => (
            <div
              key={label}
              onClick={() => link && router.push(link)}
              className={`glass rounded-xl p-4 border border-[#1e1e2e] transition-all duration-200 ${link ? 'cursor-pointer hover:scale-[1.03] hover:shadow-lg hover:border-[#6366f1]/30' : ''}`}
              style={{ borderTop: `2px solid ${color}` }}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="text-2xl font-bold" style={{ color }}>
                {value}{total !== null && <span className="text-sm text-[#4a5568] font-normal">/{total}</span>}
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-[#94a3b8]">{label}</span>
                {link && <svg className="w-3 h-3 text-[#4a5568]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>}
              </div>
              {sub && <p className="text-xs text-[#f59e0b] mt-1 font-medium">{sub}</p>}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="glass rounded-xl p-4 border border-[#1e1e2e] mb-8 fade-in stagger-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Overall Completion</span>
            <span className="text-xs text-[#6366f1] font-bold">{totalPassed}/{chapters.length} passed</span>
          </div>
          <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6 fade-in stagger-3">
          {[
            { key: 'all', label: 'All Chapters' },
            { key: 'companies-act', label: 'Companies Act' },
            { key: 'securities-laws', label: 'Securities Laws' },
            { key: 'economic-laws', label: 'Economic Laws' },
            { key: 'full-mock', label: 'Grand Test' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === key
                  ? 'bg-[#6366f1] text-white'
                  : 'border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-[#f1f5f9]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Chapter grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 fade-in stagger-4">
          {filtered.map((chapter) => {
            const meta = CATEGORY_META[chapter.category];
            const prog = progress[chapter.id];
            const isAvailable = chapter.available;

            return (
              <div
                key={chapter.id}
                className={`glass rounded-xl border transition-all duration-200 overflow-hidden ${
                  isAvailable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ borderColor: isAvailable ? meta.border : '#1e1e2e' }}
                onClick={() => isAvailable && router.push(`/exam/${chapter.id}`)}
              >
                {/* Color top bar */}
                <div className="h-1" style={{ background: meta.color }} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: meta.bg, color: meta.color }}>
                        {chapter.code}
                      </span>
                    </div>
                    <StatusBadge progress={prog} />
                  </div>

                  <h3 className="text-sm font-bold text-[#f1f5f9] mb-1 leading-snug">{chapter.name}</h3>
                  <p className="text-xs text-[#4a5568] mb-4">{chapter.law}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-[#94a3b8] mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>
                      {chapter.totalQuestions} MCQs
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {chapter.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                      </svg>
                      Pass: 50%
                    </span>
                  </div>

                  {/* Progress if attempted */}
                  {prog?.attempted && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-[#94a3b8] mb-1">
                        <span>Best: {prog.bestScore}/{chapter.totalQuestions} ({prog.bestPercentage}%)</span>
                        <span>{prog.attempts} attempt{prog.attempts !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${prog.bestPercentage}%`,
                            background: prog.passed ? '#10b981' : '#f59e0b',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {isAvailable ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/exam/${chapter.id}`); }}
                      className="w-full py-2 rounded-lg text-xs font-bold text-white transition-all"
                      style={{ background: meta.color }}
                    >
                      {prog?.attempted ? (prog.passed ? 'Retake Exam' : 'Try Again') : 'Start Exam'}
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-lg text-xs font-bold text-center bg-[#1e1e2e] text-[#4a5568]">
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
