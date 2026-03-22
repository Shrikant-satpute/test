import { NextRequest, NextResponse } from 'next/server';
import { getSPOMResults, getResults } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    // ── SPOM attempts ──────────────────────────────────────────────────────────
    const allSPOM = await getSPOMResults();
    const userSPOM = allSPOM[username] || {};

    const spomHistory = Object.entries(userSPOM).flatMap(([chapterId, attempts]) =>
      attempts.map((a) => ({
        type: 'spom' as const,
        attemptId: a.attemptId,
        chapterId,
        chapterName: a.chapterName,
        attemptNumber: a.attemptNumber,
        submittedAt: a.submittedAt,
        timeTaken: a.timeTaken,
        score: a.score,
        totalQuestions: a.totalQuestions,
        marksObtained: a.marksObtained,
        totalMarks: a.totalMarks,
        percentage: a.percentage,
        passed: a.passed,
      }))
    );

    // ── Legacy CA Intermediate attempts ───────────────────────────────────────
    const allLegacy = await getResults();
    const userLegacy = allLegacy[username] || [];

    const legacyHistory = userLegacy.map((a) => ({
      type: 'ca-inter' as const,
      attemptId: a.attemptId,
      chapterId: 'ca-inter-ch3',
      chapterName: 'Remuneration to Directors (CA Inter)',
      attemptNumber: a.attemptNumber,
      submittedAt: a.submittedAt,
      timeTaken: null,
      score: a.mcqScore,
      totalQuestions: 20,
      marksObtained: a.totalScore,
      totalMarks: 55,
      percentage: a.percentage,
      passed: a.passed,
      // extra detail for legacy display
      mcqScore: a.mcqScore,
      shortScore: a.shortScore,
      caseScore: a.caseScore,
    }));

    const history = [...spomHistory, ...legacyHistory].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error('SPOM history error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load history' }, { status: 500 });
  }
}
