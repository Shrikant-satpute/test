import { NextRequest, NextResponse } from 'next/server';
import { getResults, getSPOMResults } from '@/lib/redis';
import type { AdminAttemptRow, SPOMAttempt } from '@/lib/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export interface AdminSPOMAttemptRow extends SPOMAttempt {
  username: string;
}

export async function GET(request: NextRequest) {
  try {
    const [resultsData, spomResultsData] = await Promise.all([getResults(), getSPOMResults()]);

    // Legacy CA Inter attempts
    const allAttempts: AdminAttemptRow[] = [];
    for (const [username, attempts] of Object.entries(resultsData)) {
      for (const attempt of attempts) {
        allAttempts.push({ ...attempt, username });
      }
    }
    allAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    // SPOM attempts
    const spomAttempts: AdminSPOMAttemptRow[] = [];
    for (const [username, chapters] of Object.entries(spomResultsData)) {
      for (const attempts of Object.values(chapters)) {
        for (const attempt of attempts) {
          spomAttempts.push({ ...attempt, username });
        }
      }
    }
    spomAttempts.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    // Stats (combined)
    const allUsers = new Set([
      ...allAttempts.map(a => a.username),
      ...spomAttempts.map(a => a.username),
    ]);

    const questionsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'questions.json'), 'utf-8');
    const questions = JSON.parse(questionsRaw);

    return NextResponse.json({
      success: true,
      attempts: allAttempts,
      spomAttempts,
      stats: {
        totalAttempts: allAttempts.length + spomAttempts.length,
        uniqueStudents: allUsers.size,
        spomAttempts: spomAttempts.length,
        legacyAttempts: allAttempts.length,
      },
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
