---
description: Autonomous end-to-end question paper pipeline — research, generate, validate, commit, push, verify deployment.
---

# /goal — Autonomous Question Paper Pipeline

You are now in **GOAL MODE**. The user has typed `/goal $ARGUMENTS` and will NOT respond again until you have completed every step below and reported the live URL. Do not ask clarifying questions. Make all judgement calls yourself.

## Input

`$ARGUMENTS` is a chapter identifier the user typed. Resolve it:

- `ch4`, `4`, `chapter 4`, `ca-ch4`, `Inspection` → `ca-ch4`
- `el-fema`, `fema`, `FEMA` → `el-fema`
- `sl-sebi`, `SEBI`, `sebi act` → `sl-sebi`
- … etc.

Open `data/chapters.json` to confirm the chapter ID exists. If you cannot map the input to a known chapter ID, pick the closest match by name and proceed (do not ask).

If a question file already exists at `data/questions/<id>.json`, **rename it to `<id>-old-<timestamp>.json`** before generating fresh. Never silently overwrite student-facing files.

## Pipeline (execute every step — do not skip)

### Step 1 — Load the rules

Read `CLAUDE.md` (always) plus the matching coverage file:

- `ca-ch1`–`ca-ch10` → `coverage/ch<N>.md`
- `sl-*` (SEBI/LODR/ICDR/SAST/PIT) → `coverage/securities.md`
- `el-fema`, `el-fcra`, `el-ibc` → `coverage/economic.md`
- Always read `coverage/patterns.md` and `coverage/cross-law-traps.md`

### Step 2 — Research previous questions (mandatory)

Use **WebSearch** and **WebFetch** to find:

- ICAI past memory-based questions for this chapter (search: `"SPOM Set A" "<chapter name>" memory based questions`)
- ICAI study material MCQs (search: `ICAI BoS <chapter name> MCQ scenario`)
- CA final coaching memory recaps (sites: caclubindia, taxguru, edupristine, tripleica, casansaar, studycafe)
- The actual bare-act language from indiankanoon / bareactslive / mca.gov.in

Collect ≥ 8 previous-question patterns. **Do NOT copy them.** Use them to:
1. Identify topics ICAI repeatedly tests (cover those)
2. Identify the *style* of trap they use (mimic and harder)
3. Identify numerical thresholds frequently swapped in distractors

If WebSearch/WebFetch returns nothing useful after 3 queries, fall back to the chapter coverage tables and proceed. Log what you searched in a one-line comment in the JSON file's first scenario.

### Step 3 — Generate the question set

Target count from `data/chapters.json` `totalQuestions` field (25 or 55). Group into scenarios of 4–6 questions each.

**Hardness bar (NON-NEGOTIABLE — questions must be HARDER than ICAI's real exam):**

1. **Blind-test rule:** Before finalising each question, re-read JUST the question + options with the scenario hidden. If you can answer correctly, **reject the question** and rewrite it so the answer turns on a specific scenario fact (a number, date, percentage, named action, sequence). No exceptions.
2. **Two-step minimum:** The correct answer must require at least two reasoning steps from scenario facts. One-step recall = reject.
3. **Distractor venom:** At least one distractor must be the pre-amendment figure, the adjacent section's number, or a "higher/lower" reversal. At least one other must be the "obvious but wrong" answer a half-prepared student would pick.
4. **Negative framing ≥ 35%:** "NOT", "INCORRECT", "EXCEPT", "would NOT trigger".
5. **Numerical thresholds appear in the scenario, not just options:** force the student to compute against given numbers.
6. **Cross-law traps:** for every chapter touching a number listed in `coverage/cross-law-traps.md`, use the colliding meaning as a distractor at least once.
7. **Industry/persona variety:** no two scenarios share an industry or character archetype.

If you generate a question that doesn't meet steps 1–3, regenerate it. Do this internally — do not surface drafts.

### Step 4 — Validate the JSON

Run inline node:

```bash
node -e "const d=require('./data/questions/<id>.json');let total=0;const ids=new Set();d.scenarios.forEach(s=>{s.questions.forEach(q=>{if(ids.has(q.id))throw new Error('dup id '+q.id);ids.add(q.id);total++;});});if(total!==<expected>)throw new Error('want <expected> got '+total);console.log('OK',total,'questions',d.scenarios.length,'scenarios');"
```

Where `<expected>` is the chapter's totalQuestions (25 or 55). If validation fails, fix and re-run before proceeding.

Also run `npx tsc --noEmit` to confirm no TS breakage from any chapter availability flag flip.

### Step 5 — Mark chapter available

If `data/chapters.json` has `"available": false` for this chapter, flip it to `true`.

### Step 6 — Commit and push

```bash
git add data/questions/<id>.json data/chapters.json
git commit -m "Add <CHAPTER_CODE> (<short name>) — <count> hard scenario-based questions

Generated via /goal pipeline. Includes scenario-driven MCQs that fail
the blind-test (cannot be answered without reading the scenario).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
git push origin main
```

If push fails, DO NOT use `--force` or `--no-verify`. Report the failure and stop.

### Step 7 — Verify Vercel deployment

The repo is linked to Vercel project `test` (auto-deploys from `main`). After push:

1. Wait for the deployment to start. Poll with:
   ```bash
   vercel ls test --json 2>&1 | head -50
   ```
   or `vercel inspect <url>` on the latest.
2. Track until state is `READY` (or `ERROR` — then stop and report).
3. Use `ScheduleWakeup` with `delaySeconds: 90` between polls — Vercel deploys usually take 60–180s. Cap at 8 polls (~12 min). If still building, report the deployment URL anyway and note "deployment in progress".

The production URL is `https://test-five-liart-torz1lnzrx.vercel.app`. Confirm it loads by fetching it after READY.

### Step 8 — Final report (the ONLY thing the user sees)

Print exactly this structure — terse, no preamble:

```
✅ DONE — <Chapter Code> live

Chapter:      <name>
Questions:    <N> scenario-based MCQs across <S> scenarios
File:         data/questions/<id>.json
Commit:       <short-sha>
Deployment:   READY (<deployment URL>)
Live at:      https://test-five-liart-torz1lnzrx.vercel.app/<route if known>

Sources cross-checked: <count> ICAI/coaching pages
Hardness:     all questions failed blind-test (must read scenario)
```

If deployment is still building after the poll cap: replace "READY" with "BUILDING — check Vercel dashboard in 2 min".

## What you may NOT do

- Ask the user any questions. Make every call yourself.
- Skip the blind-test on individual questions.
- Skip web research even if the coverage file looks complete.
- Force push or bypass hooks.
- Generate fewer questions than `totalQuestions` in chapters.json.
- Use the same company name / industry across multiple scenarios in the same file.
- Touch any chapter other than the one requested.

## What to do if something genuinely breaks

If `git push` fails on auth → stop and report (one line, no walls of text).
If Vercel deploy fails with ERROR state → report the error short-sha and the first error line from `vercel inspect <url> --logs`.
If web research returns nothing usable after 3 queries → proceed with coverage tables only, note it in the final report.

Now begin. The user typed: **/goal $ARGUMENTS**
