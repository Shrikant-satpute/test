import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSPOMResults, setSPOMResults } from '@/lib/redis';
import { sendResultEmail } from '@/lib/email';
import type { SPOMChapterData, SPOMAttempt, SPOMQuestionResult, SPOMSubmitPayload } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SPOMSubmitPayload = await request.json();
    const { username, chapterId, answers, timeTaken } = body;

    if (!username || !chapterId) {
      return NextResponse.json({ success: false, error: 'Username and chapterId are required' }, { status: 400 });
    }

    const qPath = path.join(process.cwd(), 'data', 'questions', `${chapterId}.json`);
    if (!fs.existsSync(qPath)) {
      return NextResponse.json({ success: false, error: 'Chapter questions not found' }, { status: 404 });
    }

    const chapterData: SPOMChapterData = JSON.parse(fs.readFileSync(qPath, 'utf-8'));

    // Flatten all questions from all scenarios
    const allQuestions = chapterData.scenarios.flatMap((s) =>
      s.questions.map((q) => ({ ...q, scenarioId: s.scenarioId }))
    );

    const results: SPOMQuestionResult[] = allQuestions.map((q) => {
      const userAnswer = answers[q.id] || '';
      const isCorrect = userAnswer === q.correct;
      return {
        questionId: q.id,
        scenarioId: q.scenarioId,
        userAnswer,
        correctAnswer: q.correct,
        isCorrect,
        marksAwarded: isCorrect ? 2 : 0,
        explanation: q.explanation,
        section: q.section,
      };
    });

    const score = results.filter((r) => r.isCorrect).length;
    const totalQuestions = allQuestions.length;
    const marksObtained = score * 2;
    const totalMarks = totalQuestions * 2;
    const percentage = Math.round((marksObtained / totalMarks) * 100 * 10) / 10;
    const passed = percentage >= 50;

    const allResults = await getSPOMResults();
    const userResults = allResults[username] || {};
    const chapterAttempts = userResults[chapterId] || [];
    const attemptId = randomUUID();

    const attempt: SPOMAttempt = {
      attemptId,
      chapterId,
      chapterName: chapterData.chapterName,
      attemptNumber: chapterAttempts.length + 1,
      submittedAt: new Date().toISOString(),
      timeTaken,
      answers,
      results,
      score,
      totalQuestions,
      marksObtained,
      totalMarks,
      percentage,
      passed,
    };

    allResults[username] = {
      ...userResults,
      [chapterId]: [...chapterAttempts, attempt],
    };
    await setSPOMResults(allResults);

    // Send result email to admin (non-blocking — don't fail submission if email fails)
    const correctCount = results.filter((r) => r.isCorrect).length;
    const wrongCount = results.filter((r) => !r.isCorrect && r.userAnswer !== '').length;
    const skippedCount = results.filter((r) => r.userAnswer === '').length;

    sendResultEmail({
      username,
      chapterName: chapterData.chapterName,
      chapterId,
      attemptNumber: chapterAttempts.length + 1,
      score,
      totalQuestions,
      marksObtained,
      totalMarks,
      percentage,
      passed,
      timeTaken,
      submittedAt: attempt.submittedAt,
      correctCount,
      wrongCount,
      skippedCount,
      sectionBreakdown: results.map((r) => ({
        section: r.section,
        correct: r.isCorrect,
        userAnswer: r.userAnswer,
        correctAnswer: r.correctAnswer,
      })),
    }).catch((err) => console.error('Failed to send result email:', err));

    return NextResponse.json({
      success: true,
      attemptId,
      score,
      totalQuestions,
      marksObtained,
      totalMarks,
      percentage,
      passed,
    });
  } catch (error) {
    console.error('SPOM submit error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
