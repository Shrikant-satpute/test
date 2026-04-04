'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminAttemptRow, QuestionsData, MCQQuestion, ShortQuestion, CaseQuestion, SPOMAttempt, SPOMChapterData, SPOMScenario } from '@/lib/types';

const PAGE_SIZE = 10;

type AdminSPOMAttemptRow = SPOMAttempt & { username: string };

// Cache for loaded chapter question data
const chapterDataCache: Record<string, SPOMChapterData> = {};

export default function AdminPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<AdminAttemptRow[]>([]);
  const [spomAttempts, setSpomAttempts] = useState<AdminSPOMAttemptRow[]>([]);
  const [questions, setQuestions] = useState<QuestionsData | null>(null);
  const [stats, setStats] = useState({ totalAttempts: 0, uniqueStudents: 0, spomAttempts: 0, legacyAttempts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'spom' | 'legacy'>('spom');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pass' | 'fail'>('all');
  const [filterDate, setFilterDate] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSpomId, setExpandedSpomId] = useState<string | null>(null);
  const [spomChapterData, setSpomChapterData] = useState<SPOMChapterData | null>(null);
  const [spomDetailLoading, setSpomDetailLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('ca_session');
    if (!raw) { router.push('/'); return; }
    const session = JSON.parse(raw);
    if (!session.loggedIn) { router.push('/'); return; }
    if (session.role !== 'admin') { router.push('/dashboard'); return; }

    fetch('/api/admin/results')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAttempts(data.attempts);
          setSpomAttempts(data.spomAttempts || []);
          setStats(data.stats);
          setQuestions(data.questions);
        } else {
          setError(data.error);
        }
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [router]);

  const filteredSpom = useMemo(() => {
    let arr = [...spomAttempts];
    if (search) arr = arr.filter(a => a.username.toLowerCase().includes(search.toLowerCase()) || a.chapterName.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus === 'pass') arr = arr.filter(a => a.passed);
    if (filterStatus === 'fail') arr = arr.filter(a => !a.passed);
    if (filterDate) {
      const d = new Date(filterDate);
      arr = arr.filter(a => {
        const ad = new Date(a.submittedAt);
        return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth() && ad.getDate() === d.getDate();
      });
    }
    arr.sort((a, b) => {
      const cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return arr;
  }, [spomAttempts, search, filterStatus, filterDate, sortDir]);

  const filteredLegacy = useMemo(() => {
    let arr = [...attempts];
    if (search) arr = arr.filter(a => a.username.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus === 'pass') arr = arr.filter(a => a.passed);
    if (filterStatus === 'fail') arr = arr.filter(a => !a.passed);
    if (filterDate) {
      const d = new Date(filterDate);
      arr = arr.filter(a => {
        const ad = new Date(a.submittedAt);
        return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth() && ad.getDate() === d.getDate();
      });
    }
    arr.sort((a, b) => {
      const cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return arr;
  }, [attempts, search, filterStatus, filterDate, sortDir]);

  const activeFiltered = activeTab === 'spom' ? filteredSpom : filteredLegacy;
  const totalPages = Math.ceil(activeFiltered.length / PAGE_SIZE);
  const paginated = activeFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleLogout = () => {
    localStorage.removeItem('ca_session');
    router.push('/');
  };

  const handleSpomExpand = async (attempt: AdminSPOMAttemptRow) => {
    if (expandedSpomId === attempt.attemptId) {
      setExpandedSpomId(null);
      return;
    }
    setExpandedSpomId(attempt.attemptId);

    // Check cache first
    if (chapterDataCache[attempt.chapterId]) {
      setSpomChapterData(chapterDataCache[attempt.chapterId]);
      return;
    }

    setSpomDetailLoading(true);
    try {
      const res = await fetch(`/api/spom/questions?chapterId=${encodeURIComponent(attempt.chapterId)}`);
      const data = await res.json();
      if (data.success) {
        chapterDataCache[attempt.chapterId] = data.chapterData;
        setSpomChapterData(data.chapterData);
      }
    } catch {
      // silently fail — detail panel just won't show questions
    } finally {
      setSpomDetailLoading(false);
    }
  };

  const handleTabChange = (tab: 'spom' | 'legacy') => {
    setActiveTab(tab);
    setPage(1);
    setExpandedId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#94a3b8] text-sm">Loading dashboard...</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm text-[#f1f5f9]">Admin Panel</span>
            <span className="text-[#4a5568] text-xs ml-2 hidden sm:inline">CA Exam Portal</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9] text-xs font-medium transition-all hover:border-[#6366f1]/50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {error && (
          <div className="mb-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3 text-[#ef4444] text-sm">
            {error}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Attempts', value: stats.totalAttempts, icon: '📝', color: '#6366f1' },
            { label: 'Unique Students', value: stats.uniqueStudents, icon: '👥', color: '#f59e0b' },
            { label: 'SPOM Attempts', value: stats.spomAttempts, icon: '📚', color: '#10b981' },
            { label: 'Legacy Attempts', value: stats.legacyAttempts, icon: '🏆', color: '#a855f7' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="glass rounded-xl p-4 border border-[#1e1e2e] card-hover" style={{ borderTop: `2px solid ${color}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs text-[#94a3b8] bg-[#1e1e2e] px-2 py-0.5 rounded-full">All time</span>
              </div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs text-[#94a3b8] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleTabChange('spom')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'spom' ? 'bg-[#6366f1] text-white' : 'glass border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9]'}`}
          >
            SPOM Attempts
            <span className="ml-2 text-xs opacity-70">({stats.spomAttempts})</span>
          </button>
          <button
            onClick={() => handleTabChange('legacy')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'legacy' ? 'bg-[#6366f1] text-white' : 'glass border border-[#1e1e2e] text-[#94a3b8] hover:text-[#f1f5f9]'}`}
          >
            Legacy CA Inter
            <span className="ml-2 text-xs opacity-70">({stats.legacyAttempts})</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="glass rounded-xl p-4 border border-[#1e1e2e] mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={activeTab === 'spom' ? 'Search by username or chapter...' : 'Search by username...'}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl pl-9 pr-4 py-2 text-sm text-[#f1f5f9] placeholder-[#4a5568] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/20 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as 'all'|'pass'|'fail'); setPage(1); }}
            className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] focus:border-[#6366f1] transition-all"
          >
            <option value="all">All Status</option>
            <option value="pass">Pass Only</option>
            <option value="fail">Fail Only</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={e => { setFilterDate(e.target.value); setPage(1); }}
            className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] focus:border-[#6366f1] transition-all"
          />
          <button
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 rounded-xl border border-[#1e1e2e] text-[#94a3b8] text-xs font-medium hover:border-[#6366f1]/50 transition-all"
          >
            Date {sortDir === 'desc' ? '↓' : '↑'}
          </button>
          {(search || filterStatus !== 'all' || filterDate) && (
            <button
              onClick={() => { setSearch(''); setFilterStatus('all'); setFilterDate(''); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-[#ef4444]/30 text-[#ef4444] text-xs font-medium hover:bg-[#ef4444]/10 transition-all"
            >
              Clear
            </button>
          )}
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#f1f5f9]">
            {activeTab === 'spom' ? 'SPOM Chapter Attempts' : 'Legacy CA Inter Attempts'}
          </h2>
          <span className="text-xs text-[#94a3b8]">{activeFiltered.length} records</span>
        </div>

        {/* SPOM Table */}
        {activeTab === 'spom' && (
          <>
            <div className="hidden md:block glass rounded-xl border border-[#1e1e2e] overflow-hidden mb-4">
              <table className="w-full">
                <thead className="border-b border-[#1e1e2e]">
                  <tr>
                    {['#', 'Username', 'Chapter', 'Attempt', 'Date & Time', 'Marks', '%', 'Time Taken', 'Status'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-12 text-[#4a5568] text-sm">No SPOM attempts found</td></tr>
                  ) : (
                    (paginated as AdminSPOMAttemptRow[]).map((a, idx) => (
                      <>
                        <tr
                          key={a.attemptId}
                          onClick={() => handleSpomExpand(a)}
                          className={`border-b border-[#1e1e2e]/50 cursor-pointer hover:bg-[#1e1e2e]/30 transition-colors ${a.passed ? 'border-l-2 border-l-[#10b981]/40' : 'border-l-2 border-l-[#ef4444]/40'}`}
                        >
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td className="px-4 py-3 text-sm text-[#f1f5f9] font-medium">{a.username}</td>
                          <td className="px-4 py-3 text-sm text-[#94a3b8] max-w-[180px] truncate" title={a.chapterName}>
                            {a.chapterName}
                            {a.chapterId && <span className="ml-1.5 text-xs font-bold text-[#6366f1] bg-[#6366f1]/10 px-1.5 py-0.5 rounded">{a.chapterId.replace('ca-ch', '')}</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">#{a.attemptNumber}</td>
                          <td className="px-4 py-3 text-xs text-[#94a3b8]">
                            {new Date(a.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-[#f1f5f9]">
                            {a.marksObtained}/{a.totalMarks}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">{a.percentage}%</td>
                          <td className="px-4 py-3 text-xs text-[#94a3b8]">
                            {Math.floor(a.timeTaken / 60)}m {a.timeTaken % 60}s
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${a.passed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                              {a.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                        </tr>
                        {expandedSpomId === a.attemptId && (
                          <tr key={`${a.attemptId}-detail`} className="bg-[#0a0a0f]">
                            <td colSpan={9} className="p-0">
                              <SPOMAttemptDetail attempt={a} chapterData={spomChapterData} loading={spomDetailLoading} />
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile SPOM cards */}
            <div className="md:hidden space-y-3 mb-4">
              {paginated.length === 0 ? (
                <div className="text-center py-12 text-[#4a5568] text-sm">No SPOM attempts found</div>
              ) : (
                (paginated as AdminSPOMAttemptRow[]).map(a => (
                  <div key={a.attemptId} className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
                    <div
                      onClick={() => handleSpomExpand(a)}
                      className={`p-4 cursor-pointer border-l-4 ${a.passed ? 'border-l-[#10b981]' : 'border-l-[#ef4444]'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-[#f1f5f9]">{a.username}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${a.passed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                          {a.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6366f1] mb-2 truncate">
                        {a.chapterName}
                        {a.chapterId && <span className="ml-1.5 font-bold bg-[#6366f1]/20 px-1.5 py-0.5 rounded">{a.chapterId.replace('ca-ch', '')}</span>}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                        <span>Attempt #{a.attemptNumber}</span>
                        <span className="font-bold text-[#f1f5f9]">{a.marksObtained}/{a.totalMarks}</span>
                        <span>{a.percentage}%</span>
                      </div>
                      <div className="text-xs text-[#4a5568] mt-1">
                        {new Date(a.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {expandedSpomId === a.attemptId && (
                      <SPOMAttemptDetail attempt={a} chapterData={spomChapterData} loading={spomDetailLoading} />
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Legacy Table */}
        {activeTab === 'legacy' && (
          <>
            <div className="hidden md:block glass rounded-xl border border-[#1e1e2e] overflow-hidden mb-4">
              <table className="w-full">
                <thead className="border-b border-[#1e1e2e]">
                  <tr>
                    {['#', 'Username', 'Attempt', 'Date & Time', 'Sec A', 'Sec B', 'Sec C', 'Total', '%', 'Status'].map(col => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={10} className="text-center py-12 text-[#4a5568] text-sm">No attempts found</td></tr>
                  ) : (
                    (paginated as AdminAttemptRow[]).map((a, idx) => (
                      <>
                        <tr
                          key={a.attemptId}
                          onClick={() => setExpandedId(expandedId === a.attemptId ? null : a.attemptId)}
                          className={`border-b border-[#1e1e2e]/50 cursor-pointer hover:bg-[#1e1e2e]/30 transition-colors ${a.passed ? 'border-l-2 border-l-[#10b981]/40' : 'border-l-2 border-l-[#ef4444]/40'}`}
                        >
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                          <td className="px-4 py-3 text-sm text-[#f1f5f9] font-medium">{a.username}</td>
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">#{a.attemptNumber}</td>
                          <td className="px-4 py-3 text-xs text-[#94a3b8]">
                            {new Date(a.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#6366f1]">{a.mcqScore}/20</td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#f59e0b]">{a.shortScore}/20</td>
                          <td className="px-4 py-3 text-sm font-semibold text-purple-400">{a.caseScore}/15</td>
                          <td className="px-4 py-3 text-sm font-bold text-[#f1f5f9]">{a.totalScore}/55</td>
                          <td className="px-4 py-3 text-sm text-[#94a3b8]">{a.percentage}%</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${a.passed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                              {a.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                        </tr>
                        {expandedId === a.attemptId && questions && (
                          <tr key={`${a.attemptId}-detail`} className="bg-[#0a0a0f]">
                            <td colSpan={10} className="p-0">
                              <AttemptDetail attempt={a} questions={questions} />
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Mobile legacy cards */}
            <div className="md:hidden space-y-3 mb-4">
              {paginated.length === 0 ? (
                <div className="text-center py-12 text-[#4a5568] text-sm">No attempts found</div>
              ) : (
                (paginated as AdminAttemptRow[]).map(a => (
                  <div key={a.attemptId} className="glass rounded-xl border border-[#1e1e2e] overflow-hidden">
                    <div
                      onClick={() => setExpandedId(expandedId === a.attemptId ? null : a.attemptId)}
                      className={`p-4 cursor-pointer border-l-4 ${a.passed ? 'border-l-[#10b981]' : 'border-l-[#ef4444]'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-[#f1f5f9]">{a.username}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${a.passed ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>
                          {a.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                        <span>Attempt #{a.attemptNumber}</span>
                        <span className="font-bold text-[#f1f5f9]">{a.totalScore}/55</span>
                        <span>{a.percentage}%</span>
                      </div>
                      <div className="text-xs text-[#4a5568] mt-1">
                        {new Date(a.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {expandedId === a.attemptId && questions && (
                      <AttemptDetail attempt={a} questions={questions} />
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] text-sm disabled:opacity-40 hover:border-[#6366f1]/50 transition-all"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === p ? 'bg-[#6366f1] text-white' : 'border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#94a3b8] text-sm disabled:opacity-40 hover:border-[#6366f1]/50 transition-all"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ AttemptDetail sub-component ============
function AttemptDetail({ attempt, questions }: { attempt: AdminAttemptRow; questions: QuestionsData }) {
  const qMap = {
    mcq: Object.fromEntries(questions.mcq.map(q => [q.id, q])) as Record<number, MCQQuestion>,
    short: Object.fromEntries(questions.short.map(q => [q.id, q])) as Record<number, ShortQuestion>,
    case: Object.fromEntries(questions.case.map(q => [q.id, q])) as Record<number, CaseQuestion>,
  };

  return (
    <div className="px-4 md:px-6 py-6 border-t border-[#1e1e2e] space-y-6 bg-[#0a0a0f]/60">
      {/* MCQ Results */}
      <div>
        <h4 className="text-sm font-bold text-[#6366f1] mb-3 uppercase tracking-wider">Section A — MCQ ({attempt.mcqScore}/20)</h4>
        <div className="grid gap-2">
          {attempt.mcqResults.map((r, i) => {
            const q = qMap.mcq[r.questionId];
            if (!q) return null;
            return (
              <div key={r.questionId} className={`flex items-start gap-3 p-3 rounded-xl text-xs border ${r.isCorrect ? 'border-[#10b981]/20 bg-[#10b981]/5' : 'border-[#ef4444]/20 bg-[#ef4444]/5'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 ${r.isCorrect ? 'bg-[#10b981]/30 text-[#10b981]' : 'bg-[#ef4444]/30 text-[#ef4444]'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#94a3b8] mb-1 truncate">{q.question}</p>
                  <div className="flex gap-3 flex-wrap">
                    <span>Your: <strong className={r.isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'}>{r.userAnswer || '—'}</strong></span>
                    <span>Correct: <strong className="text-[#10b981]">{r.correctAnswer}</strong></span>
                  </div>
                </div>
                <span className={`font-bold shrink-0 ${r.isCorrect ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}>{r.marksAwarded}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Short Results */}
      <div>
        <h4 className="text-sm font-bold text-[#f59e0b] mb-3 uppercase tracking-wider">Section B — Short Answers ({attempt.shortScore}/20)</h4>
        <div className="space-y-3">
          {attempt.shortResults.map((r, i) => {
            const q = qMap.short[r.questionId];
            if (!q) return null;
            return (
              <div key={r.questionId} className="p-3 rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-[#f1f5f9] font-medium">{i + 1}. {q.question}</p>
                  <span className="text-xs font-bold text-[#f59e0b] shrink-0">{r.marksAwarded}/{r.maxMarks}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0a0a0f] rounded-lg p-2 border border-[#1e1e2e]">
                    <span className="text-[#94a3b8] font-semibold block mb-1">Student Answer</span>
                    <p className="text-[#f1f5f9] whitespace-pre-line">{r.userAnswer || <span className="text-[#4a5568] italic">No answer</span>}</p>
                  </div>
                  <div className="bg-[#10b981]/5 rounded-lg p-2 border border-[#10b981]/20">
                    <span className="text-[#10b981] font-semibold block mb-1">Model Answer</span>
                    <p className="text-[#94a3b8] whitespace-pre-line">{r.modelAnswer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Results */}
      <div>
        <h4 className="text-sm font-bold text-purple-400 mb-3 uppercase tracking-wider">Section C — Case Based ({attempt.caseScore}/15)</h4>
        <div className="space-y-3">
          {attempt.caseResults.map((r, i) => {
            const q = qMap.case[r.questionId];
            if (!q) return null;
            return (
              <div key={r.questionId} className="p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-xs text-[#f1f5f9] font-medium">Case {i + 1}</p>
                  <span className="text-xs font-bold text-purple-400 shrink-0">{r.marksAwarded}/{r.maxMarks}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0a0a0f] rounded-lg p-2 border border-[#1e1e2e]">
                    <span className="text-[#94a3b8] font-semibold block mb-1">Student Answer</span>
                    <p className="text-[#f1f5f9] whitespace-pre-line">{r.userAnswer || <span className="text-[#4a5568] italic">No answer</span>}</p>
                  </div>
                  <div className="bg-[#10b981]/5 rounded-lg p-2 border border-[#10b981]/20">
                    <span className="text-[#10b981] font-semibold block mb-1">Model Answer</span>
                    <p className="text-[#94a3b8] whitespace-pre-line">{r.modelAnswer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ SPOM AttemptDetail sub-component ============
function SPOMAttemptDetail({ attempt, chapterData, loading }: { attempt: AdminSPOMAttemptRow; chapterData: SPOMChapterData | null; loading: boolean }) {
  const resultMap = Object.fromEntries(attempt.results.map(r => [r.questionId, r]));
  const correctCount = attempt.results.filter(r => r.isCorrect).length;
  const wrongCount = attempt.results.filter(r => !r.isCorrect && r.userAnswer).length;
  const skippedCount = attempt.results.filter(r => !r.userAnswer).length;
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="px-4 py-8 border-t border-[#1e1e2e] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-[#94a3b8]">Loading question details...</span>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 border-t border-[#1e1e2e] space-y-4 bg-[#0a0a0f]/60">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color: attempt.passed ? '#10b981' : '#ef4444' }}>
            {attempt.marksObtained}/{attempt.totalMarks}
          </span>
          <span className="text-sm text-[#94a3b8]">marks</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="px-2 py-1 rounded-full bg-[#10b981]/10 text-[#10b981] font-bold">{correctCount} Correct</span>
          <span className="px-2 py-1 rounded-full bg-[#ef4444]/10 text-[#ef4444] font-bold">{wrongCount} Wrong</span>
          <span className="px-2 py-1 rounded-full bg-[#4a5568]/20 text-[#94a3b8] font-bold">{skippedCount} Skipped</span>
        </div>
        <div className="text-xs text-[#4a5568]">
          {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s · {attempt.username} · Attempt #{attempt.attemptNumber}
        </div>
      </div>

      {/* Scenario-wise review */}
      {chapterData ? (
        <div className="space-y-3">
          {chapterData.scenarios.map((scenario: SPOMScenario, sIdx: number) => {
            const sResults = scenario.questions.map(q => resultMap[q.id]).filter(Boolean);
            const sCorrect = sResults.filter(r => r.isCorrect).length;
            const isExpanded = expandedScenario === scenario.scenarioId;

            return (
              <div key={scenario.scenarioId} className="rounded-xl border border-[#1e1e2e] overflow-hidden bg-[#0a0a0f]/40">
                {/* Scenario header */}
                <button
                  onClick={(e) => { e.stopPropagation(); setExpandedScenario(isExpanded ? null : scenario.scenarioId); }}
                  className="w-full flex items-center justify-between p-3 hover:bg-[#1e1e2e]/30 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-6 h-6 rounded-lg bg-[#6366f1]/20 text-[#6366f1] text-xs font-bold flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-[#f1f5f9]">Scenario {sIdx + 1}</p>
                      <p className="text-xs text-[#4a5568]">{sCorrect}/{scenario.questions.length} correct</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {scenario.questions.map(q => {
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
                  <div className="border-t border-[#1e1e2e] p-4 space-y-4">
                    {/* Scenario text */}
                    <div className="bg-[#1e1e2e]/40 rounded-xl p-3 border-l-2 border-[#6366f1]">
                      <p className="text-xs font-bold text-[#6366f1] mb-1 uppercase tracking-wider">Case Scenario</p>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">{scenario.scenarioText}</p>
                    </div>

                    {/* Questions */}
                    {scenario.questions.map(q => {
                      const r = resultMap[q.id];
                      if (!r) return null;
                      return (
                        <div key={q.id} className={`rounded-xl border p-3 ${
                          r.isCorrect ? 'border-[#10b981]/30 bg-[#10b981]/5' : 'border-[#ef4444]/30 bg-[#ef4444]/5'
                        }`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-xs font-medium text-[#f1f5f9] flex-1">
                              <span className="text-[#94a3b8] mr-1">Q{q.id}.</span>
                              {q.question}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                              r.isCorrect ? 'bg-[#10b981]/20 text-[#10b981]' : 'bg-[#ef4444]/20 text-[#ef4444]'
                            }`}>
                              {r.isCorrect ? '+2' : r.userAnswer ? '0' : 'Skip'}
                            </span>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 gap-1 mb-2">
                            {(['A', 'B', 'C', 'D'] as const).map(opt => {
                              const isUser = r.userAnswer === opt;
                              const isCorrect = r.correctAnswer === opt;
                              let cls = 'border-[#1e1e2e] text-[#4a5568]';
                              if (isCorrect) cls = 'border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]';
                              else if (isUser && !isCorrect) cls = 'border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]';

                              return (
                                <div key={opt} className={`flex items-start gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${cls}`}>
                                  <span className="font-bold shrink-0">{opt}.</span>
                                  <span className="flex-1">{q.options[opt]}</span>
                                  {isCorrect && <span className="ml-auto font-bold shrink-0">✓</span>}
                                  {isUser && !isCorrect && <span className="ml-auto font-bold shrink-0">✗</span>}
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          <div className="bg-[#0a0a0f]/60 rounded-lg p-2.5 border border-[#1e1e2e]">
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
      ) : (
        /* Fallback: show results without question text */
        <div className="grid gap-2">
          {attempt.results.map((r, i) => (
            <div key={r.questionId} className={`flex items-center gap-3 p-2.5 rounded-xl text-xs border ${r.isCorrect ? 'border-[#10b981]/20 bg-[#10b981]/5' : 'border-[#ef4444]/20 bg-[#ef4444]/5'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 ${r.isCorrect ? 'bg-[#10b981]/30 text-[#10b981]' : 'bg-[#ef4444]/30 text-[#ef4444]'}`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[#4a5568]">{r.section}</span>
                <div className="flex gap-3 mt-0.5">
                  <span>Selected: <strong className={r.isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'}>{r.userAnswer || '—'}</strong></span>
                  <span>Correct: <strong className="text-[#10b981]">{r.correctAnswer}</strong></span>
                </div>
              </div>
              <span className={`font-bold shrink-0 ${r.isCorrect ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}>{r.marksAwarded}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
