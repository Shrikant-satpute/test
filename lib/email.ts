import { Resend } from 'resend';

const ADMIN_EMAIL = 'onlinemandai7581@gmail.com';

// Map student usernames to their email addresses
const STUDENT_EMAILS: Record<string, string> = {
  shadow: 'savalimisal09@gmail.com',
  test: 'satpute.connect@gmail.com',
};

function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const MOTIVATION_LINES = [
  "Every expert was once a beginner. Keep revising, keep improving — your CA journey is a marathon, not a sprint.",
  "The sections you missed today are the sections you'll never forget tomorrow. That's how mastery works.",
  "Failure is not the opposite of success — it's part of it. Every wrong answer is a lesson learned.",
  "Rome wasn't built in a day, and neither is a Chartered Accountant. You're closer than you think.",
  "Don't count the marks you lost. Count the concepts you gained. Next attempt will be different.",
  "The Companies Act has 470 sections. You don't need to memorise them all — just understand the ones that matter. Try again.",
  "A setback is a setup for a comeback. Review the explanations, note the traps, and come back stronger.",
  "The best CA students aren't the ones who never fail — they're the ones who fail, learn, and try again.",
  "Today's wrong answers are tomorrow's right answers. Read the explanations carefully and give it another shot.",
  "You're preparing harder than the actual exam requires. When you sit the real ICAI test, this practice will pay off.",
  "Every mock test you take — pass or fail — builds your exam temperament. That's invaluable on exam day.",
  "The provisions you confused today? They're now flagged in your mind. That confusion won't happen again.",
  "Think of this as debugging your legal knowledge. Every failed test helps you find and fix the gaps.",
  "CA is tough. But so are you. Review the sections you missed and try again — you've got unlimited attempts.",
  "The difference between 49% and 51% is just one more correct answer. You're that close.",
  "Your future self will thank you for every mock test you took today — even the ones you didn't pass.",
  "Hard work beats talent when talent doesn't work hard. Keep at it — the results will follow.",
  "The real exam won't be this hard. If you can handle these questions, the ICAI paper will feel like revision.",
  "Don't let one bad attempt define your preparation. Learn from it, adapt, and move forward.",
  "Success is not final, failure is not fatal — it is the courage to continue that counts. Try again.",
];

interface ResultEmailData {
  username: string;
  chapterName: string;
  chapterId: string;
  attemptNumber: number;
  score: number;
  totalQuestions: number;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  submittedAt: string;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  sectionBreakdown: { section: string; correct: boolean; userAnswer: string; correctAnswer: string }[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function buildEmailHtml(data: ResultEmailData): string {
  const statusColor = data.passed ? '#16a34a' : '#dc2626';
  const statusText = data.passed ? 'PASSED' : 'FAILED';
  const statusEmoji = data.passed ? '&#9989;' : '&#10060;';

  const sectionRows = data.sectionBreakdown
    .map(
      (item, i) =>
        `<tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${i + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${item.section}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.userAnswer || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.correctAnswer}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.correct ? '&#9989;' : item.userAnswer ? '&#10060;' : '&#11036;'}</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:640px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a5f,#2563eb);padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px">CA Mock Test - Result Notification</h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px">SPOM Set A - Exam Submission Report</p>
    </div>

    <!-- Status Badge -->
    <div style="text-align:center;padding:24px 0 8px">
      <span style="display:inline-block;background:${statusColor};color:#fff;font-size:18px;font-weight:bold;padding:10px 32px;border-radius:50px">
        ${statusEmoji} ${statusText}
      </span>
    </div>

    <!-- Student & Exam Info -->
    <div style="padding:16px 32px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px;width:40%">Student</td>
          <td style="padding:8px 0;font-weight:bold;font-size:14px">${data.username}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px">Chapter</td>
          <td style="padding:8px 0;font-weight:bold;font-size:14px">${data.chapterName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px">Chapter ID</td>
          <td style="padding:8px 0;font-size:14px">${data.chapterId}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px">Attempt #</td>
          <td style="padding:8px 0;font-size:14px">${data.attemptNumber}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px">Submitted At</td>
          <td style="padding:8px 0;font-size:14px">${new Date(data.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6b7280;font-size:14px">Time Taken</td>
          <td style="padding:8px 0;font-size:14px">${formatTime(data.timeTaken)}</td>
        </tr>
      </table>
    </div>

    <!-- Score Cards -->
    <div style="padding:8px 32px 24px;display:flex;gap:12px">
      <table style="width:100%;border-collapse:separate;border-spacing:12px 0">
        <tr>
          <td style="background:#eff6ff;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#2563eb">${data.marksObtained}/${data.totalMarks}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">MARKS</div>
          </td>
          <td style="background:#f0fdf4;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#16a34a">${data.percentage}%</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">PERCENTAGE</div>
          </td>
          <td style="background:#fef3c7;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#d97706">${data.correctCount}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">CORRECT</div>
          </td>
          <td style="background:#fef2f2;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#dc2626">${data.wrongCount}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">WRONG</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Summary Bar -->
    <div style="padding:0 32px 24px">
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden">
        <tr>
          <td style="padding:12px 16px;text-align:center;font-size:13px">
            <span style="color:#6b7280">Total Questions:</span> <strong>${data.totalQuestions}</strong>
          </td>
          <td style="padding:12px 16px;text-align:center;font-size:13px">
            <span style="color:#6b7280">Attempted:</span> <strong>${data.correctCount + data.wrongCount}</strong>
          </td>
          <td style="padding:12px 16px;text-align:center;font-size:13px">
            <span style="color:#6b7280">Skipped:</span> <strong>${data.skippedCount}</strong>
          </td>
          <td style="padding:12px 16px;text-align:center;font-size:13px">
            <span style="color:#6b7280">Pass Mark:</span> <strong>50%</strong>
          </td>
        </tr>
      </table>
    </div>

    <!-- Question-wise Breakdown -->
    <div style="padding:0 32px 24px">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1f2937">Question-wise Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#1e3a5f;color:#ffffff">
            <th style="padding:10px 12px;font-size:12px;text-align:left">Q#</th>
            <th style="padding:10px 12px;font-size:12px;text-align:left">Section</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Given</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Correct</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Result</th>
          </tr>
        </thead>
        <tbody>
          ${sectionRows}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:12px;color:#9ca3af">This is an automated notification from CA Mock Test Platform.</p>
    </div>
  </div>
</body>
</html>`;
}

function getRandomMotivation(): string {
  return MOTIVATION_LINES[Math.floor(Math.random() * MOTIVATION_LINES.length)];
}

function buildStudentEmailHtml(data: ResultEmailData): string {
  const statusColor = data.passed ? '#16a34a' : '#dc2626';
  const statusText = data.passed ? 'PASSED' : 'FAILED';
  const statusEmoji = data.passed ? '&#9989;' : '&#10060;';

  const messageSection = data.passed
    ? `<div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:4px solid #16a34a;padding:20px 24px;margin:0 32px 24px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:16px;font-weight:bold;color:#15803d">Congratulations, ${data.username}! &#127881;</p>
        <p style="margin:8px 0 0;font-size:14px;color:#166534">You cleared <strong>${data.chapterName}</strong> with <strong>${data.percentage}%</strong>! Your hard work is paying off. Keep this momentum going — you're building a strong foundation for the ICAI exam.</p>
      </div>`
    : `<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-left:4px solid #d97706;padding:20px 24px;margin:0 32px 24px;border-radius:0 8px 8px 0">
        <p style="margin:0;font-size:16px;font-weight:bold;color:#92400e">Don't worry, ${data.username}! &#128170;</p>
        <p style="margin:8px 0 0;font-size:14px;color:#78350f">You scored <strong>${data.percentage}%</strong> on <strong>${data.chapterName}</strong>. The pass mark is 50% — you'll get there.</p>
        <p style="margin:12px 0 0;font-size:14px;font-style:italic;color:#92400e">"${getRandomMotivation()}"</p>
      </div>`;

  const sectionRows = data.sectionBreakdown
    .map(
      (item, i) =>
        `<tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${i + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${item.section}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.userAnswer || '-'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.correctAnswer}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center">${item.correct ? '&#9989;' : item.userAnswer ? '&#10060;' : '&#11036;'}</td>
        </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:640px;margin:20px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,${data.passed ? '#065f46,#10b981' : '#7c2d12,#f97316'});padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px">Your Mock Test Result</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px">${data.chapterName}</p>
    </div>

    <!-- Status Badge -->
    <div style="text-align:center;padding:24px 0 16px">
      <span style="display:inline-block;background:${statusColor};color:#fff;font-size:20px;font-weight:bold;padding:12px 36px;border-radius:50px">
        ${statusEmoji} ${statusText} — ${data.percentage}%
      </span>
    </div>

    <!-- Congratulations / Motivation Message -->
    ${messageSection}

    <!-- Score Cards -->
    <div style="padding:8px 32px 24px">
      <table style="width:100%;border-collapse:separate;border-spacing:12px 0">
        <tr>
          <td style="background:#eff6ff;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#2563eb">${data.marksObtained}/${data.totalMarks}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">MARKS</div>
          </td>
          <td style="background:#f0fdf4;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#16a34a">${data.correctCount}/${data.totalQuestions}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">CORRECT</div>
          </td>
          <td style="background:#fef2f2;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#dc2626">${data.wrongCount}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">WRONG</div>
          </td>
          <td style="background:#f5f3ff;border-radius:10px;padding:16px;text-align:center;width:25%">
            <div style="font-size:24px;font-weight:bold;color:#7c3aed">${data.skippedCount}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:4px">SKIPPED</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Exam Details -->
    <div style="padding:0 32px 16px">
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden">
        <tr>
          <td style="padding:10px 16px;font-size:13px"><span style="color:#6b7280">Attempt:</span> <strong>#${data.attemptNumber}</strong></td>
          <td style="padding:10px 16px;font-size:13px"><span style="color:#6b7280">Time:</span> <strong>${formatTime(data.timeTaken)}</strong></td>
          <td style="padding:10px 16px;font-size:13px"><span style="color:#6b7280">Pass Mark:</span> <strong>50%</strong></td>
        </tr>
      </table>
    </div>

    <!-- Question-wise Breakdown -->
    <div style="padding:8px 32px 24px">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1f2937">Question-wise Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#1e3a5f;color:#ffffff">
            <th style="padding:10px 12px;font-size:12px;text-align:left">Q#</th>
            <th style="padding:10px 12px;font-size:12px;text-align:left">Section</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Your Ans</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Correct</th>
            <th style="padding:10px 12px;font-size:12px;text-align:center">Result</th>
          </tr>
        </thead>
        <tbody>
          ${sectionRows}
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="margin:0;font-size:13px;color:#6b7280">Keep practicing on the <strong>CA Mock Test Platform</strong></p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af">This is an automated result notification.</p>
    </div>
  </div>
</body>
</html>`;
}

export async function sendResultEmail(data: ResultEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();

    // Send admin email
    const adminPromise = resend.emails.send({
      from: 'CA Mock Test <onboarding@resend.dev>',
      to: [ADMIN_EMAIL],
      subject: `${data.passed ? 'PASSED' : 'FAILED'} | ${data.username} | ${data.chapterName} | ${data.percentage}%`,
      html: buildEmailHtml(data),
    });

    // Send student email if their email is mapped
    const studentEmail = STUDENT_EMAILS[data.username];
    const studentPromise = studentEmail
      ? resend.emails.send({
          from: 'CA Mock Test <onboarding@resend.dev>',
          to: [studentEmail],
          subject: data.passed
            ? `Congratulations! You passed ${data.chapterName} with ${data.percentage}%`
            : `Your result: ${data.chapterName} — ${data.percentage}% | Keep going!`,
          html: buildStudentEmailHtml(data),
        })
      : Promise.resolve({ error: null });

    const [adminResult, studentResult] = await Promise.all([adminPromise, studentPromise]);

    if (adminResult.error) {
      console.error('Admin email error:', adminResult.error);
    }
    if (studentResult.error) {
      console.error('Student email error:', studentResult.error);
    }

    return { success: !adminResult.error };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
