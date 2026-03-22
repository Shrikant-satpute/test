import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSPOMResults } from '@/lib/redis';
import type { SPOMChapterData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const attemptId = searchParams.get('attemptId');
    const chapterId = searchParams.get('chapterId');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    const allResults = await getSPOMResults();
    const userResults = allResults[username] || {};

    // Find attempt by attemptId across all chapters
    let attempt = null;
    let foundChapterId = chapterId;

    if (attemptId) {
      for (const [cid, attempts] of Object.entries(userResults)) {
        const found = attempts.find((a) => a.attemptId === attemptId);
        if (found) {
          attempt = found;
          foundChapterId = cid;
          break;
        }
      }
    } else if (chapterId) {
      const attempts = userResults[chapterId] || [];
      attempt = attempts[attempts.length - 1] || null;
    }

    if (!attempt || !foundChapterId) {
      return NextResponse.json({ success: false, error: 'Attempt not found' }, { status: 404 });
    }

    // Load chapter question data for review display
    const qPath = path.join(process.cwd(), 'data', 'questions', `${foundChapterId}.json`);
    const chapterData: SPOMChapterData = JSON.parse(fs.readFileSync(qPath, 'utf-8'));

    const chapterAttempts = userResults[foundChapterId] || [];

    return NextResponse.json({
      success: true,
      attempt,
      chapterData,
      totalAttempts: chapterAttempts.length,
    });
  } catch (error) {
    console.error('SPOM result error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
