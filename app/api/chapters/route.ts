import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSPOMResults } from '@/lib/redis';
import type { ChaptersData, ChapterProgress } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    const chaptersRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'chapters.json'), 'utf-8');
    const chaptersData: ChaptersData = JSON.parse(chaptersRaw);

    if (!username) {
      return NextResponse.json({ success: true, chapters: chaptersData.chapters, progress: {} });
    }

    const allResults = await getSPOMResults();
    const userResults = allResults[username] || {};

    const progress: Record<string, ChapterProgress> = {};
    for (const chapter of chaptersData.chapters) {
      const attempts = userResults[chapter.id] || [];
      const passed = attempts.some((a) => a.passed);
      const bestAttempt = attempts.reduce(
        (best, a) => (!best || a.percentage > best.percentage ? a : best),
        null as (typeof attempts)[0] | null
      );
      progress[chapter.id] = {
        chapterId: chapter.id,
        attempted: attempts.length > 0,
        passed,
        attempts: attempts.length,
        bestScore: bestAttempt?.score ?? 0,
        bestPercentage: bestAttempt?.percentage ?? 0,
        lastAttemptedAt: attempts.length > 0 ? attempts[attempts.length - 1].submittedAt : null,
      };
    }

    return NextResponse.json({ success: true, chapters: chaptersData.chapters, progress });
  } catch (error) {
    console.error('Chapters fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load chapters' }, { status: 500 });
  }
}
