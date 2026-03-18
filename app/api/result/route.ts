import { NextRequest, NextResponse } from 'next/server';
import { getResults } from '@/lib/redis';
import fs from 'fs';
import path from 'path';
import type { QuestionsData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const attemptId = searchParams.get('attemptId');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    const resultsData = await getResults();
    const userAttempts = resultsData[username] || [];

    if (userAttempts.length === 0) {
      return NextResponse.json({ success: false, error: 'No attempts found' }, { status: 404 });
    }

    const attempt = attemptId
      ? userAttempts.find((a) => a.attemptId === attemptId)
      : userAttempts[userAttempts.length - 1];

    if (!attempt) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    const questionsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'questions.json'), 'utf-8');
    const questions: QuestionsData = JSON.parse(questionsRaw);

    return NextResponse.json({ success: true, attempt, questions, totalAttempts: userAttempts.length });
  } catch (error) {
    console.error('Result error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
