# CLAUDE.md — CA Mock Test Question Generation

> Governs ALL question generation. Load chapter coverage files on demand.

## 1. Project

SPOM Set A mock-test platform for ICAI Corporate & Economic Laws. Real exam: 50 MCQs × 2 marks, 50% pass, 3 hrs, fully case-scenario-based. App pattern per chapter: 25 MCQs (standard) or 55 MCQs (Ch5, Ch6), 2 marks each, 50% pass. **Our questions must be HARDER than ICAI's.**

## 2. The 8 Rules (mandatory)

1. **Scenario drives the answer.** The correct option must depend on facts established only in the scenario. If a student skips the scenario, they must be unable to answer correctly.
2. **Scenarios are complex and business-realistic.** Min 80 words; named companies + financial details + named persons + a sequence of events + one red herring. Each scenario supports 4–6 questions.
3. **Anti-memorisation.** Use at least one of these techniques per question: (A) negative framing — "NOT", "INCORRECT"; (B) apply-to-facts; (C) best/closest answer; (D) exception testing; (E) cross-provision confusion; (F) timeline/sequence. Target: 30–40% negative-framed questions overall.
4. **Option quality.** All 4 plausible; exactly one unambiguously correct; distractors = real misconceptions (pre-amendment figures, adjacent sections, higher/lower reversals, wrong-context correct rule). Include one "obvious but wrong" and one "close but not quite".
5. **Cover all must-cover sections.** See `coverage/ch<N>.md`. Every section listed must appear in ≥1 question.
6. **Difficulty mix.** 60% Hard / 30% Very Hard / 10% Medium-Hard. **Zero recall/easy questions.**
7. **Explanation must state:** (a) exact provision cited, (b) why correct is correct, (c) why the trap option is wrong, (d) which scenario fact was determinative.
8. **Scenario variety.** No repeated companies/fact patterns. Vary industry (pharma, steel, tech, NBFC, infra…) and legal angle (investigation, merger, CIRP, insider trading, oppression…).

## 3. JSON Schema

```json
{
  "chapterId": "ca-chX", "chapterName": "...", "law": "...", "category": "...",
  "scenarios": [{
    "scenarioId": "s1",
    "scenarioText": "≥80 words, specific facts",
    "questions": [{
      "id": 1, "question": "...",
      "options": {"A":"...","B":"...","C":"...","D":"..."},
      "correct": "A", "explanation": "...", "section": "Section X(Y)"
    }]
  }]
}
```

IDs sequential across the file (s1 → Q1–Q5, s2 → Q6–Q10, …).

## 4. Coverage Files — Load On Demand

When generating/reviewing a chapter, read the matching file:

| Working on | Load |
|---|---|
| Ch 1 Directors | `coverage/ch1.md` |
| Ch 2 Managerial Remuneration | `coverage/ch2.md` |
| Ch 3 Board Meetings & Powers | `coverage/ch3.md` |
| Ch 4 Inspection/Investigation | `coverage/ch4.md` |
| Ch 5 Compromises/Amalgamations | `coverage/ch5.md` |
| Ch 6 Oppression/Mismanagement | `coverage/ch6.md` |
| Ch 7 Winding Up | `coverage/ch7.md` |
| Ch 8 Foreign Companies | `coverage/ch8.md` |
| Ch 9 NCLT/NCLAT | `coverage/ch9.md` |
| Ch 10 e-Filing | `coverage/ch10.md` |
| SEBI Act / LODR / ICDR / SAST / PIT | `coverage/securities.md` |
| FEMA / FCRA / IBC | `coverage/economic.md` |
| Question design patterns | `coverage/patterns.md` |
| Cross-law trap list (₹1 L vs ₹1 Cr, 182-day variants, etc.) | `coverage/cross-law-traps.md` |

Each coverage file is a single table: **Section | Topic | Tricky Points**, followed by a short "Top Traps" list. No prose padding.

## 5. Pre-submission Checklist

- [ ] Every scenario ≥80 words, named parties, specific numbers, sequence of events
- [ ] Every Q requires the scenario to answer (re-read each Q with scenario hidden — can you still answer? If yes, reject)
- [ ] No two Qs in one scenario test the same sub-provision
- [ ] All 4 options plausible; ≥1 distractor = pre-amendment figure OR adjacent-section number OR higher/lower reversal
- [ ] Explanation cites provision + reasoning + trap + determinative fact
- [ ] ≥60% Qs use negative / apply-to-facts / exception framing
- [ ] Every "Must Cover" section in chapter file appears ≥1 time
- [ ] IDs sequential; no duplicate question text
- [ ] Numerical thresholds present in scenario (not just in options)

## 6. Hardness Target — Blind-Test Rule

**The single test that overrides everything:** hide the scenario, re-read just the question + 4 options. If you can still pick the correct answer, **the question is too easy — reject and rewrite.**

The correct answer must turn on at least one specific fact established only in the scenario: a number, percentage, date, named action, party relationship, or sequence. Recall-style questions ("Under Sec X, the time limit is…") are banned, even if the section is from this chapter.

Two-step minimum: arriving at the correct option must require at least two reasoning hops from scenario facts (e.g. compute X from scenario → compare to threshold → match exception).

## 7. Autonomous Mode (`/goal`)

When the user runs `/goal <chapter>`, the workflow in `.claude/commands/goal.md` takes over and runs end-to-end without prompts: research → generate → validate → commit → push → verify Vercel deploy → report live URL. The user will not respond mid-pipeline; all judgement calls are yours.

Repo: `Shrikant-satpute/test` on GitHub, branch `main`. Linked to Vercel project `test` (auto-deploys on push). Production URL: `https://test-five-liart-torz1lnzrx.vercel.app`.

## 8. Research Requirement

For any new chapter generation, **always use WebSearch / WebFetch** to pull recent ICAI memory-based questions and coaching recaps. Use them to identify (a) topics ICAI repeatedly tests, (b) the trap style they favour, (c) distractor numbers they swap. Never copy verbatim — questions must be original and harder.

---
*Coverage files isolate per-chapter detail. Only the chapter being worked on loads. Keep this index ≤200 lines.*
