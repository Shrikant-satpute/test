import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const qPath = path.join(process.cwd(), 'data', 'questions', `${id}.json`);

    if (!fs.existsSync(qPath)) {
      return NextResponse.json({ success: false, error: 'Chapter questions not found' }, { status: 404 });
    }

    const chapterData = JSON.parse(fs.readFileSync(qPath, 'utf-8'));
    return NextResponse.json({ success: true, chapterData });
  } catch (error) {
    console.error('Chapter questions fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load chapter questions' }, { status: 500 });
  }
}
