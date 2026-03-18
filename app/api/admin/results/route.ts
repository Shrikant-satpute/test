import { NextRequest, NextResponse } from 'next/server';
import { getResults } from '@/lib/redis';
import type { AdminAttemptRow } from '@/lib/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const resultsData = await getResults();

    const allAttempts: AdminAttemptRow[] = [];
    for (const [username, attempts] of Object.entries(resultsData)) {
      for (const attempt of attempts) {
        allAttempts.push({ ...attempt, username });
      }
    }

    allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const uniqueStudents = new Set(allAttempts.map((a) => a.username)).size;
    const totalAttempts = allAttempts.length;
    const avgScore = totalAttempts > 0
      ? Math.round((allAttempts.reduce((s, a) => s + a.totalScore, 0) / totalAttempts) * 10) / 10
      : 0;
    const highestScore = totalAttempts > 0 ? Math.max(...allAttempts.map((a) => a.totalScore)) : 0;

    const questionsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'questions.json'), 'utf-8');
    const questions = JSON.parse(questionsRaw);

    return NextResponse.json({
      success: true,
      attempts: allAttempts,
      stats: { totalAttempts, uniqueStudents, avgScore, highestScore },
      questions,
    });
  } catch (error) {
    console.error('Admin results error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
