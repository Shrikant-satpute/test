import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { SPOMChapterData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json({ success: false, error: 'chapterId is required' }, { status: 400 });
    }

    // Sanitize chapterId to prevent path traversal
    const safeId = chapterId.replace(/[^a-zA-Z0-9\-]/g, '');
    const qPath = path.join(process.cwd(), 'data', 'questions', `${safeId}.json`);

    if (!fs.existsSync(qPath)) {
      return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
    }

    const chapterData: SPOMChapterData = JSON.parse(fs.readFileSync(qPath, 'utf-8'));

    return NextResponse.json({ success: true, chapterData });
  } catch (error) {
    console.error('SPOM questions error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
