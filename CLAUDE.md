# CLAUDE.md — CA Mock Test: Question Generation Master Guide

> This file governs ALL question generation for this project.
> Read this fully before generating or reviewing any question set.

---

## 1. PROJECT CONTEXT

This is a **SPOM Set A** (Self-Paced Online Module) mock test platform for CA students appearing in the ICAI Corporate & Economic Laws exam during their 2-year articleship. The real ICAI exam is:

- **50 MCQs × 2 marks = 100 marks**
- **Pass threshold: 50%** (26+ correct)
- **100% Case Scenario-Based MCQs** — every question is embedded in a factual legal scenario
- **Computer-Based Test, 3 hours, no negative marking**
- **Unlimited attempts** at ICAI centres (₹500/attempt in India)

**App-specific exam pattern per chapter:**
- Questions: 25 MCQs (standard chapters) or 55 MCQs (Ch5, Ch6)
- Marks: 2 per question
- Pass: 50% of total marks
- Duration: 45 min (standard) or 90 min (Ch5, Ch6)

**The philosophy:** Our mock tests must be HARDER than the real ICAI exam. When students sit the actual ICAI test, it should feel easy in comparison.

---

## 2. THE CORE PROBLEM WITH CURRENT QUESTIONS

The existing questions (ca-ch4.json, ca-ch5.json, ca-ch6.json) have correct structure but suffer from these weaknesses that must be ELIMINATED:

### 2.1 "Read the question, skip the scenario" problem
Many current questions can be answered purely from the question text without reading the scenario paragraph. Example: "Under Section 206(1), the time allowed to respond is ___" — a student who memorised Section 206(1) can answer this without engaging with the scenario context at all.

**Fix:** The correct answer must depend on facts established ONLY in the scenario. If a student skips the scenario, they should be unable to answer correctly or be led to a wrong answer.

### 2.2 Superficial option design
Current distractors are often obviously wrong. Options should be plausible — wrong answers should represent real misconceptions (e.g., pre-amendment figures, similar provisions from different sections, "whichever is higher" vs "whichever is lower" traps).

### 2.3 Straightforward application of single section
Current questions mostly test one section directly. Hard questions test the interplay of two or more provisions, require multi-step reasoning, or test the boundary/exception rather than the main rule.

### 2.4 Insufficient coverage of tricky distinctions and numerical thresholds
The current question pool under-tests the specific numbers, time limits, and "or/and" distinctions that the ICAI exam heavily focuses on.

---

## 3. QUESTION GENERATION RULES (MANDATORY)

### Rule 1 — Scenario Must Drive the Answer

Every scenario must include specific facts (numbers, percentages, dates, relationships, actions taken) that are **essential** to selecting the correct answer. The student MUST read and understand the scenario to answer correctly.

**Weak scenario (BAD):**
> ABC Ltd. received a notice from the ROC. What is the time to respond under Section 206(1)?

**Strong scenario (GOOD):**
> ABC Ltd., a company with paid-up capital of ₹8 crore, received a notice from the ROC directing it to furnish information within a period not specified in the notice. The directors assumed they had 30 days since that is the standard default. The MD called the company secretary and asked whether they must respond immediately or could wait. Meanwhile, the ROC found the company's inter-company loans suspicious and decided to conduct direct scrutiny.

The "time as specified in the notice" answer is now meaningful because the scenario specifically mentions the ROC did NOT specify a period — creating a real legal question.

---

### Rule 2 — Scenarios Must Be Complex, Multi-Layered, and Business-Realistic

Scenarios must read like real corporate situations with:
- Named companies with specific financial details (paid-up capital, turnover, number of members/shareholders, percentage holdings)
- Named persons (directors, MD, auditor, creditors) with specific roles and actions taken
- A sequence of events where one event leads to another
- A legal issue that emerges from the combination of facts
- At least one "red herring" fact that seems legally relevant but is not (to test precision)

Each scenario should support **4–6 questions** that drill into different aspects.

---

### Rule 3 — Anti-Memorisation Design

Questions must NOT be answerable by rote recall alone. Use these techniques:

**Technique A — Reverse/Negative framing (use 30–40% of questions):**
- "Which of the following is NOT a valid ground..."
- "Which statement is INCORRECT..."
- "Which of the following would NOT trigger..."
- "In which of the following situations would the obligation NOT arise..."

**Technique B — "Apply to the given facts" framing:**
- Force students to apply a rule to specific numbers/conditions given in the scenario
- Example: "Given that XYZ Ltd. has 1,200 members and Group A has 95 members holding 11% share capital, which group satisfies the eligibility threshold under Section 244(1)(a)?"

**Technique C — Best/Closest answer:**
- All 4 options contain partially correct statements; only one is fully accurate
- Requires deep reading to distinguish subtle differences

**Technique D — Exception testing:**
- Frame the scenario so the main rule does NOT apply; test whether the student knows the exception
- Example: A holding company that appears to violate Section 185 but the exception for WOS applies

**Technique E — Cross-provision confusion:**
- Options include correct numbers/rules from different-but-related sections
- Example: Mixing Section 213 threshold (investigation) with Section 244 threshold (oppression) — same numbers, different context

**Technique F — Timeline/sequence questions:**
- "What is the FIRST step the company must take?" or "In what sequence did the events create legal obligations?"
- Tests procedural knowledge, not just static rule knowledge

---

### Rule 4 — Option Quality Standards

Every set of 4 options must meet these standards:

1. **All options must be plausible** — no obviously absurd distractors
2. **Exactly one option is unambiguously correct** based on the law as it stands
3. **Distractors must represent real misconceptions:**
   - Pre-amendment figures (e.g., old 75% CoC vote vs current 66%)
   - Similar provisions from adjacent sections
   - "Whichever is higher/lower" reversals
   - Correct rule applied to wrong context
   - Numbers from related but different laws (e.g., IBC ₹1 crore vs Companies Act ₹1 lakh for inability to pay)
4. **One distractor should be the "obvious but wrong" answer** — something a student who half-studied would pick
5. **One distractor should be the "close but not quite" answer** — something a well-studied student might pick if they confuse two similar provisions

---

### Rule 5 — Mandatory Coverage Across All Sub-Sections

**Each chapter's question set must cover ALL major sub-sections, not just the "famous" ones.** Use the per-chapter coverage grids in Section 5 below. Every section listed under "Must Cover" must appear in at least one question.

---

### Rule 6 — Difficulty Distribution

Within each chapter's question set, maintain this approximate difficulty split:

| Difficulty | % of Questions | Description |
|------------|---------------|-------------|
| Hard | 60% | Multi-step reasoning, exception testing, cross-provision, anti-memorisation techniques |
| Very Hard | 30% | Specific numerical thresholds, boundary cases, conflicting facts in scenario, "which is INCORRECT" formats |
| Medium-Hard | 10% | Scenario-driven direct application but with a meaningful twist |

**Zero "easy" or "recall" questions.** Students can read the bare Act for those. This platform is for deeper preparation.

---

### Rule 7 — Explanation Quality

Every explanation must include:
1. The exact statutory provision (e.g., "Section 232(2)(e)")
2. Why the correct answer is correct (not just restate the rule)
3. Why the most tempting wrong answer is wrong (the "trap")
4. The specific fact from the scenario that determined the answer

---

### Rule 8 — Scenario Variety

Do NOT repeat the same company/fact pattern across scenarios. Each scenario must have a distinct:
- Industry (pharma, steel, tech, real estate, NBFC, infrastructure, etc.)
- Legal issue angle (investigation, merger, winding up, insider trading, CIRP, etc.)
- Character setup (minority vs majority, FC vs OC, promoter vs public, regulator vs company)

---

## 4. THE QUESTION FORMAT (JSON STRUCTURE)

All questions follow this exact JSON schema. Do not deviate.

```json
{
  "chapterId": "ca-chX",
  "chapterName": "Chapter Name",
  "law": "Companies Act, 2013",
  "category": "companies-act",
  "scenarios": [
    {
      "scenarioId": "s1",
      "scenarioText": "FULL SCENARIO PARAGRAPH — minimum 80 words, rich with specific facts",
      "questions": [
        {
          "id": 1,
          "question": "PRECISE LEGAL QUESTION that references scenario facts",
          "options": {
            "A": "Option text",
            "B": "Option text",
            "C": "Option text",
            "D": "Option text"
          },
          "correct": "A",
          "explanation": "DETAILED explanation: correct answer reasoning + why the trap option is wrong + which scenario fact determined the answer",
          "section": "Section X(Y)"
        }
      ]
    }
  ]
}
```

**IDs must be sequential across all scenarios in the file** (s1 has Q1–Q5, s2 has Q6–Q10, etc.)

---

## 5. CHAPTER-BY-CHAPTER COVERAGE GUIDE

---

### CHAPTER 1 — Appointment and Qualification of Directors (ca-ch1)
**Sections: 149–169**

#### Must Cover (every question set):
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 149 | Board composition, women director, IDs | Min 3 (public) / 2 (private) / 1 (OPC); IDs: 1/3 (non-exec chair) vs 1/2 (exec chair); max 15 needs SR |
| Sec 149(6) | ID criteria | Cannot hold >2% voting power; no material pecuniary relationship in past 2 FYs |
| Sec 149(10)-(11) | ID tenure | 5+5 years max = 2 consecutive terms; 3-year cooling-off after 2 terms; during cooling-off CANNOT serve in ANY capacity |
| Sec 150 | Databank, proficiency test | Min 60% score; unlimited attempts |
| Sec 152 | Appointment process | 2/3 of public company directors retire by rotation; Additional Director vs permanent |
| Sec 153 | DIN | Mandatory before appointment; lifetime validity |
| Sec 161 | Additional/alternate/nominee directors | Additional Director holds till next AGM |
| Sec 164 | Disqualifications | Convicted 6+ months; 3 consecutive years non-filing; 1 year default on deposits/debentures/dividend |
| Sec 165 | Number of directorships | Max 20 companies; max 10 public companies |
| Sec 168 | Resignation | Company: Form DIR-12 within 30 days; Director: Form DIR-11 within 30 days |
| Sec 169 | Removal | Ordinary resolution after special notice; Director has right to speak at meeting |

#### Top Traps to Include:
- 182 days for **resident director** = calendar year (NOT financial year) — distinguish from FEMA 182 days (financial year)
- "Whichever is less" for independent director count — NOT "whichever is more"
- ID cannot be reappointed after 2 terms even with SR for 3 years
- Alternate director cannot be appointed if the alternate is already a director of the same company
- Sitting fees are NOT subject to 11% managerial remuneration cap
- Nominee director appointed by institution is NOT counted as "independent"

#### Hard Scenario Ideas:
- A listed company where the chairman is non-executive (retired executive promoted to non-exec chair) — tests the exact 1/3 vs 1/2 ID threshold
- An ID nearing end of second term who is offered a "consulting" role — test whether cooling-off prohibition covers this
- A director disqualified under Sec 164(2) in Company A — does this disqualify him from all boards? Test ripple effect.
- A company wants to appoint a 71-year-old as MD — test if SR suffices or CG approval needed

---

### CHAPTER 2 — Appointment and Remuneration of Managerial Personnel (ca-ch2)
**Sections: 196–205, Schedule V**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 196 | Appointment of MD/WTD/Manager | Max 5-year term; min 21 / max 70 years (SR for 70+); only one of MD/Manager at a time |
| Sec 197 | Overall remuneration limits | 11% aggregate; 5% single MD; 10% multiple MDs; 1% non-exec (with MD) / 3% (without MD); sitting fees excluded |
| Sec 198 | Net profits computation | Different from P&L profit — specific computation; non-cash items excluded |
| Sec 200 | Central Government approval | No longer needed post-2017 for exceeding limits; SR suffices |
| Sec 201 | Provisions relating to SR | Filing requirements |
| Sec 202 | Compensation for loss of office | No compensation for MD removed by CG or on grounds of misconduct |
| Sec 203 | Whole-time KMPs | CEO/MD, CFO, CS, WTD — mandatory for prescribed companies; same person cannot be MD+CS |
| Sec 204 | Secretarial audit | Mandatory for listed + unlisted public with paid-up capital ≥ ₹50 crore OR turnover ≥ ₹250 crore |
| Schedule V | Remuneration in loss/inadequate profit years | Slabs: <₹5 cr: ₹30L; ₹5-100 cr: ₹42L; ₹100-250 cr: ₹60L; >₹250 cr: ₹84L; SR doubles limits |

#### Top Traps:
- Net profits under Sec 198 ≠ P&L net profit — capital gains, subsidies, write-backs excluded
- Schedule V slabs are based on "effective capital" not "paid-up capital"
- When company is in loss: Schedule V limits apply, NOT Sec 197 percentage
- Both 5% (single) and 10% (multiple) must fit within the 11% aggregate cap
- Sitting fees are NOT remuneration for Sec 197 cap purposes
- Manager cannot be MD simultaneously; can appoint Manager OR MD, not both
- A 69-year-old MD can be reappointed for 5 more years (would cross 70) — requires SR, not CG approval

#### Hard Scenario Ideas:
- Company with negative profits wanting to retain MD at ₹55 lakh — compute which Schedule V slab applies, whether SR gives double
- Company with 3 WTDs + 1 non-exec chairman — compute max remuneration to each category given specific profit figure
- MD removed by CG — can he claim compensation? Test Sec 202 exception.
- Listed company without an MD — does secretarial audit threshold change for the 3% non-exec cap?

---

### CHAPTER 3 — Meetings of Board and Its Powers (ca-ch3)
**Sections: 173–189**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 173 | Board meetings | 4 meetings/year; first within 30 days of incorporation; gap ≤ 120 days; 7 days notice; OPC/small/dormant: 1 meeting per half-year, gap ≥ 90 days |
| Sec 174 | Quorum | 1/3 of total strength OR 2 directors, whichever is HIGHER; adjournment if no quorum within 30 min |
| Sec 175 | Resolution by circulation | Majority of directors entitled to vote; must be circulated to ALL directors |
| Sec 177 | Audit Committee | Listed + prescribed companies; min 3 directors; majority IDs; chairperson must be ID |
| Sec 178 | NRC | Non-exec directors only; majority IDs; chairperson must be ID |
| Sec 179 | Powers of Board | Specific powers only at board meeting: calls, buyback, issue securities, borrow, invest |
| Sec 180 | Restrictions | Sale of whole undertaking: SR; Borrowing beyond paid-up + free reserves: SR |
| Sec 184 | Director's interest disclosure | Form MBP-1 at first board meeting each FY; updated whenever interest changes |
| Sec 185 | Loans to directors | Prohibition; exception for MD/WTD in ordinary course of employment conditions |
| Sec 186 | Company's loans/investments | Limit: 60% (paid-up + free reserves + securities premium) OR 100% (free reserves + securities premium), whichever HIGHER; beyond: SR |
| Sec 188 | RPT | Board approval first; SR for certain thresholds; related party cannot vote |
| Sec 189 | Register of contracts | Must maintain register of all contracts/arrangements in which directors are interested |

#### Top Traps:
- Board meeting notice: 7 days (NOT 21 days — students confuse with AGM notice)
- Board quorum: "whichever is HIGHER" (NOT lower)
- After adjournment due to lack of quorum: members present at adjourned meeting constitute quorum
- Section 186 limit: take HIGHER of two computations — students often apply the lower
- Borrowing under Sec 180 uses "paid-up capital + free reserves" — excludes securities premium
- Resolution by circulation CANNOT be used for matters required to be transacted at board meetings (Sec 179 powers)
- Section 185 prohibition: includes guarantees, not just loans

#### Hard Scenario Ideas:
- Board with 9 directors, 3 of whom are interested in a transaction — does quorum calculation change? (Yes, quorum computed excluding interested directors per Sec 174(3))
- Company wants to borrow ₹120 crore; paid-up = ₹50 cr, free reserves = ₹60 cr, securities premium = ₹20 cr — is SR needed? (Total = ₹130 cr > ₹120 cr = No SR needed for borrowing; but compute correctly)
- Small company with 2 directors — board meeting frequency exception applies? What is quorum?
- NRC chairperson is also the MD's close relative — does this disqualify the chairperson under LODR?

---

### CHAPTER 4 — Inspection, Inquiry and Investigation (ca-ch4)
**Sections: 206–227**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 206 | Power to call for information | ROC specifies time in notice; no fixed default period |
| Sec 207 | Conduct of inspection | Inspector can retain books: 180 days initially; extension of further 180 days with authority approval |
| Sec 208 | Inspector's report | Admissible as evidence; submitted to CG |
| Sec 209 | Search and seizure | Requires court order (Magistrate); can seal premises |
| Sec 210 | CG investigation order | 3 triggers: SR by company; Tribunal order; CG's own opinion |
| Sec 212 | SFIO investigation | Exclusive jurisdiction once assigned; other agencies must transfer records; cognizable + non-bailable offences; arrest power without warrant |
| Sec 213 | Tribunal-ordered investigation | Applicant: 100 members OR 1/10 of total (whichever less); security deposit ₹25,000 |
| Sec 214 | Security for payment | ₹25,000 deposit mandatory |
| Sec 216 | Ownership investigation | CG can appoint inspector to investigate beneficial ownership |
| Sec 217 | Powers of Inspector | Civil court powers; all persons (auditor, banker, legal advisor, employee) must cooperate |
| Sec 219 | Related company investigation | Inspector can investigate related companies simultaneously |
| Sec 223 | Inspector's report | Interim and final report; CG may share with court |
| Sec 226 | Expenses of investigation | Payable by company unless the investigation reveals no fraud |
| Sec 227 | Legal advisor and banker privilege | Legal advisor: full privilege; Banker: protected UNLESS Tribunal directs disclosure |

#### Top Traps:
- Sec 210 grounds: 3, not 2 — "company's own special resolution" is one trigger (students forget this)
- SFIO vs CG-appointed inspector: SFIO has EXCLUSIVE jurisdiction — other agencies (even state govt) must stop
- Sec 212 offences: cognizable AND non-bailable (both together — students often say only one)
- Sec 213 threshold: 100 members OR 1/10 (whichever LESS) — identical to Sec 244 but different context
- Document retention: 180 + 180 = max 360 days; NOT unlimited
- Banker privilege: can be overridden by TRIBUNAL direction (not CG direction, not Inspector's own authority)
- Legal advisor privilege: ABSOLUTE — no override even by Tribunal

#### Hard Scenario Ideas (build on existing scenarios):
- SFIO investigation ongoing; state police also investigating same person for same transactions — who has priority?
- Inspector retains books for 170 days; company requests return — can the Inspector extend without seeking approval?
- A company's legal advisor AND banker both refuse to cooperate — different outcomes under Sec 227
- 100 members apply for Tribunal investigation vs 95 members holding 15% share capital — which group qualifies?
- Search and seizure order — company claims documents are covered by attorney-client privilege; can Inspector seize them?

---

### CHAPTER 5 — Compromises, Arrangements and Amalgamations (ca-ch5)
**Sections: 230–237**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 230 | Compromise/arrangement | 3/4 value present+voting; applicants: company/creditor/member/liquidator; notice: 30 days on website; proxy: 48 hours before; waiver of meeting: 90% affidavit consent; regulatory body response: 30 days |
| Sec 230(4) | Objection threshold | Shareholders: 10% of share capital; Creditors: 5% of total outstanding debt |
| Sec 232 | Merger/amalgamation | Supplementary accounts if last FY ended >6 months before first meeting; certified copy to RoC within 30 days; transferee cannot hold own shares — must cancel; annual compliance within 210 days of FY end |
| Sec 232(6) | Appointed date | Scheme effective from appointed date (can be retrospective) |
| Sec 233 | Fast-track merger | Eligible: small companies + small company; holding + WOS; startup + startup; startup + small company; approval: 90% members (number) + 9/10 creditors (value); 21 days notice to creditors; filed with Regional Director; if no CG objection in 60 days → scheme registered |
| Sec 234 | Cross-border merger | RBI + NCLT approval; specific jurisdictions only |
| Sec 235 | Squeeze-out (dissenting shareholders) | 90% acceptance → can acquire remaining 10%; must acquire within 4 months |
| Sec 236 | Minority purchase | 90% holding already → can compulsorily acquire remaining minority; price by registered valuer |

#### Top Traps:
- Sec 230: threshold is 3/4 of VALUE of those PRESENT AND VOTING — not total members/creditors
- Meeting waiver: 90% in value via affidavit (Sec 230(9)) — NOT 3/4
- Fast-track: 90% of MEMBERS IN NUMBER — not value; creditors need 9/10 in VALUE
- Sec 235 (squeeze-out): 90% of those who accepted the offer; Sec 236: 90% already held
- Supplementary accounts trigger: >6 months since last FY end (students often say 3 months)
- Transferee holding shares of transferor post-merger: MUST be cancelled (Sec 232(3)(h)) — cannot be treasury shares
- Sec 233 does NOT need NCLT approval order — only notification to NCLT; scheme registered by RD
- Cross-border merger (Sec 234): needs prior RBI approval before NCLT can sanction

#### Hard Scenario Ideas (build on existing scenarios):
- Fast-track merger attempt between an NBFC and a small company — does Sec 233 apply? (NBFCs excluded from Sec 233)
- Creditors with 88% in value sign affidavits — can meeting be waived? (No — needs 90%, not 88%)
- Cross-border merger: Indian company merging INTO a foreign company (outbound) vs foreign company merging INTO Indian company (inbound) — different RBI approval requirements
- Squeeze-out after takeover: acquirer has 91% acceptance; remaining 9% holds strategic shares — can they be forced out? Compute the timeline.
- Scheme sanctioned but RoC filing done after 42 days — what is the consequence?
- Supplementary accounts required but company files 5-month-old accounts claiming it's within 6 months — borderline scenario

---

### CHAPTER 6 — Prevention of Oppression and Mismanagement (ca-ch6)
**Sections: 241–245**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 241 | Application to Tribunal | "Oppression": prejudicial to member/public interest; "Mismanagement": prejudicial to company/public interest — different ground, same remedy |
| Sec 242 | Powers of Tribunal | Can regulate affairs; appoint directors/MD; alter AoA; order buyback; restrict transfer; even wind up |
| Sec 243 | Effect of Tribunal orders | Terminated agreement → no compensation payable by company |
| Sec 244 | Eligibility to apply | Share capital company: 100 OR 1/10 (whichever LESS); no share capital company: 1/5 of total members; Tribunal can waive on application |
| Sec 245 | Class action | Against: company, directors, auditors, experts; 100 members OR 10% of total membership; ALSO 5% of issued share capital (additional alternative) |

#### Top Traps:
- Sec 244 "whichever is LESS" — students frequently apply "whichever is more"
- No-share-capital company threshold: 1/5 (not 1/10)
- Sec 244 eligibility can be WAIVED by Tribunal on application — Sec 245 cannot be waived similarly
- Class action (Sec 245) can be brought against AUDITOR — not just directors or company
- Sec 242 power to "wind up" is a remedy NCLT can give in oppression petition — does NOT require separate winding up petition
- Sec 243: Tribunal's order terminating a contract → company does NOT owe compensation to the director for losing that contract
- Sec 241 can be filed even where oppression doesn't directly harm the applicant member if it is prejudicial to "public interest"
- Different threshold for Sec 245 (class action): adds "5% of issued share capital" as a third alternative

#### Hard Scenario Ideas (build on existing scenarios):
- Company with no share capital: religious trust with 200 members; 35 members apply — do they meet the threshold? (200 × 1/5 = 40; 35 < 40 → NO)
- Tribunal waives eligibility threshold — under what grounds? Subsequent filing by rival shareholder challenging the waiver
- Class action filed against auditor for signing off on manipulated accounts — is the auditor a proper respondent?
- NCLT orders winding up as remedy in oppression petition — can dissenting shareholders appeal that winding up order to NCLAT?
- Director's 5-year employment contract terminated by Tribunal order — director claims ₹1.5 crore compensation for remaining term — valid?
- Sec 241 application filed by member holding 0.5% shares: NCLT waives eligibility; company challenges the waiver itself — is the waiver order appealable?

---

### CHAPTER 7 — Winding Up (ca-ch7)
**Sections: 270–310**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 270 | Two modes | Compulsory (Tribunal); Voluntary |
| Sec 271 | Grounds for compulsory | 6 grounds: unable to pay debts (demand >₹1 lakh for 21 days); SR by company; sovereignty/security; fraudulent/unlawful; 5 consecutive years non-filing; just and equitable |
| Sec 272 | Petition | Petitioners: company, creditor, contributory, ROC, authorized person; RoC cannot petition on grounds (b)&(d) of Sec 271 |
| Sec 274 | Powers on hearing | Dismiss, adjourn, interim orders, or pass winding-up order |
| Sec 275 | Liquidator | NCLT appoints Official Liquidator or Insolvency Professional |
| Sec 302 | Dissolution | NCLT orders dissolution after winding up complete |
| Sec 304 | Declaration of solvency | Required for Members' Voluntary Winding Up; debts payable within 3 years; made by majority of directors at board meeting; sworn before Magistrate/Notary |
| Sec 305 | Meeting of members | In Members' VWU: members pass SR for winding up within 5 weeks of Declaration of Solvency |
| Sec 306 | Creditors' meeting | In Creditors' VWU: creditors meeting held same day or next day as members meeting |
| Sec 308 | Appointment of liquidator | Members appoint in VWU; if Directors cannot make declaration, creditors appoint in CVW |

#### Top Traps:
- Inability to pay debts threshold: ₹1 lakh (Companies Act) vs ₹1 crore (IBC) — biggest numerical trap
- Non-filing for winding up: 5 consecutive years (Companies Act) vs IBC has different threshold
- Members' VWU requires Declaration of Solvency — if solvency cannot be declared, must proceed as Creditors' VWU
- ROC as petitioner: can petition on grounds (a), (c), (e), (f) of Sec 271; CANNOT petition on grounds (b) and (d)
- Declaration of Solvency: "debts payable within 3 years" — students often say 1 year
- Companies Act winding up vs IBC CIRP: once IBC threshold met, IBC overrides but Companies Act winding up can still apply for specific Sec 271(e) defaults

#### Hard Scenario Ideas:
- Creditor's demand: ₹80,000 unpaid for 25 days — does this meet the threshold for inability to pay under Sec 271(a)? (NO — threshold is >₹1 lakh)
- Director makes Declaration of Solvency; company's external auditor subsequently refuses to sign accounts — can winding up proceed as Members' VWU?
- ROC wants to file winding-up petition claiming the company conducted business fraudulently — is the ROC a valid petitioner? (NO — Sec 272 bars ROC from petitioning on that ground)
- Company in CIRP under IBC + simultaneously ROC files Sec 271(e) petition — which takes precedence?
- Declaration of Solvency states debts will be paid within 3.5 years — is this valid? (NO — must be 3 years or less)

---

### CHAPTER 8 — Miscellaneous Provisions (ca-ch8)
**Sections: 379–390**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 379 | Application to foreign companies | Sec 380-386 + 392-393 apply to ALL foreign companies; full Act applies if 50%+ paid-up held by Indians |
| Sec 380 | Documents to file | Charter, MoA, AoA, directors list, principal officer — within 30 days of establishing place of business |
| Sec 381 | Accounts | Foreign company must prepare and file accounts in prescribed form |
| Sec 384 | Debentures | Foreign company debenture rules |
| Sec 386 | "Foreign company" definition | Incorporated outside India + has a place of business in India |

#### Top Traps:
- Not all Companies Act provisions apply to foreign companies — only Sec 380-386 and 392-393 automatically apply; rest applies only if Indians hold 50%+
- "Place of business" definition: physical presence in India triggers the 30-day filing obligation — not merely doing business online
- Foreign company filing: 30 days (NOT 60 days — students confuse with RoC annual return deadlines)

#### Hard Scenario Ideas:
- A foreign company with 40% Indian shareholding operating through a liaison office — which sections apply?
- Foreign company that has stopped its Indian operations but has not formally closed its place of business — still obligated to file accounts?
- US company opens a project office in India for a specific infrastructure project — does this constitute a "place of business" triggering Sec 380?

---

### CHAPTER 9 — NCLT, NCLAT and Adjudication (ca-ch9)
**Sections: 408–434**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 408 | NCLT constitution | President + Judicial Members + Technical Members; constituted by CG |
| Sec 410 | NCLAT constitution | Appellate authority over NCLT |
| Sec 412 | Qualification of members | President must be/have been High Court judge; Judicial Member: High Court judge or eligible; Technical Member: IAS or equivalent + 25 years expertise |
| Sec 421 | Appeal from NCLT | To NCLAT within 45 days; NCLAT may condone delay up to further 45 days = max 90 days |
| Sec 422 | Expeditious disposal | NCLT + NCLAT: endeavour to dispose within 3 months |
| Sec 423 | Appeal from NCLAT | To Supreme Court on QUESTION OF LAW only |
| Sec 430 | Civil court jurisdiction barred | No civil court jurisdiction over NCLT/NCLAT matters |
| Sec 431 | Contempt | NCLT/NCLAT have power to punish for contempt |
| Sec 434 | Transfer of proceedings | CLB pending proceedings transferred to NCLT |

#### Top Traps:
- Appeal from NCLT → NCLAT (NOT High Court)
- Appeal from NCLAT → Supreme Court on QUESTION OF LAW only (not on facts)
- 45 days + 45 days condoned = 90 days MAXIMUM to file appeal at NCLAT
- Section 422: 3 months is an endeavour/target, not a hard cutoff for disposal
- Civil courts are completely barred — parties CANNOT go to civil court as parallel remedy

#### Hard Scenario Ideas:
- Party appeals to High Court instead of NCLAT — High Court's jurisdiction?
- NCLAT decision appealed to Supreme Court on "mixed question of law and fact" — is it maintainable?
- NCLT decides a winding-up application after 5 months — is the order valid? (Yes — 3 months is not mandatory)
- Order passed 50 days ago; aggrieved party missed 45-day limit due to genuine medical emergency — can NCLAT condone? Up to how many additional days?

---

### CHAPTER 10 — e-Filing (ca-ch10)
**Sections: 396–407**

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 396 | Registration offices | CG establishes; appoints Registrars |
| Sec 397 | Admissibility of electronic documents | RoC-authenticated electronic records admissible as evidence without further proof |
| Sec 398 | Electronic filing | CG can prescribe electronic maintenance; applies from 1 April 2014 |
| Sec 403 | Fee and additional fee | Prescribed fee; additional fee for late filing; no waiver |
| Sec 405 | Statistical information | CG can require companies to furnish statistical information by order |

#### Hard Scenario Ideas:
- Company claims electronic record from MCA portal is not authentic — burden of proof?
- Late filing of form — company argues "additional fee" is punitive tax — constitutional challenge?

---

## 6. SECURITIES LAWS — COVERAGE GUIDE

---

### SEBI Act 1992

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 11 | Functions of SEBI | Protect investors; develop + regulate market; make regulations |
| Sec 11A | Prospectus regulation | SEBI can regulate issue-related matters |
| Sec 11B | Direction power | Issue directions; order disgorgement; SEBI's strongest enforcement tool |
| Sec 11C | Investigation | SEBI appoints Investigating Authority; all must cooperate; examination on oath |
| Sec 12 | Registration of intermediaries | All intermediaries must register; SEBI can suspend/cancel |
| Sec 15A | Penalty — failure to furnish information | Up to ₹1 lakh/day (max ₹1 crore) |
| Sec 15G | Insider trading penalty | Higher of ₹25 crore OR 3x profit |
| Sec 15H | Non-disclosure under takeover | Higher of ₹25 crore OR 3x profit |
| Sec 15HA | Fraudulent/unfair trade practices | Higher of ₹25 crore OR 3x profit |
| Sec 15HB | Other contraventions | Up to ₹1 crore |
| Sec 15I | Adjudicating Officer | Not below Division Chief rank; opportunity of hearing mandatory |
| Sec 24 | Criminal prosecution | Imprisonment up to 10 years OR fine up to ₹25 crore OR both |

#### Top Traps:
- Sec 15G/15H/15HA: penalty is "HIGHER of ₹25 crore OR 3x" — students often say "up to ₹25 crore" (ignoring the 3x alternative)
- Sec 15A: PER DAY penalty, subject to ₹1 crore maximum
- Sec 11B disgorgement: this is SEBI's own civil remedy; separate from Sec 24 criminal prosecution
- Adjudicating Officer: minimum "Division Chief" rank — not any SEBI officer

---

### SEBI LODR 2015

#### Must Cover:
| Regulation | Topic | Key Tricky Points |
|------------|-------|-------------------|
| Reg 17 | Board composition | 50% non-exec; IDs: 1/3 (non-exec chair) / 1/2 (exec chair); min 4 meetings; ≤120 day gap |
| Reg 18 | Audit Committee | Min 3 directors; majority IDs; chairperson = ID; quorum: 2 or 1/3, whichever greater, min 2 IDs |
| Reg 19 | NRC | Min 3; all non-exec; majority IDs; chairperson = ID |
| Reg 20 | Stakeholders Relationship Committee | Investor grievances |
| Reg 21 | Risk Management Committee | Top 1000 listed entities by market cap — mandatory |
| Reg 23 | RPT | Material RPT = lower of ₹1000 crore OR 10% of consolidated turnover; audit committee approval; SR for material RPT; related party cannot vote |
| Reg 27 | Corporate governance report | Within 21 days from end of each quarter |
| Reg 33 | Financial results | Quarterly: within 45 days; Annual: within 60 days |
| Reg 34 | Annual report | Within 21 working days of AGM |

#### Top Traps:
- Material RPT: LOWER of ₹1000 crore OR 10% turnover (students apply "higher")
- Royalty/brand payments: material if >5% of turnover (different threshold for RPT)
- Reg 21 Risk Management Committee: top 1000 by market cap — not all listed entities
- Quarterly financial results: 45 days; Annual: 60 days (students confuse these)

---

### SEBI ICDR 2018

#### Must Cover:
| Topic | Key Points |
|-------|-----------|
| IPO eligibility | 3 years operating history; net tangible assets ≥ ₹3 crore each year for 3 years; pre-tax operating profit ≥ ₹15 crore in at least 3 of preceding 5 years; net worth ≥ ₹1 crore each year for 3 years |
| MPC lock-in | 20% of post-issue capital; lock-in: 18 months from allotment |
| Promoter excess holding lock-in | 6 months from allotment |
| Pre-IPO shares (non-promoter) | 6 months lock-in post-listing |
| Price band | Max = Floor × 120% (not Floor + 120%) |
| QIB reservation | Min 50% (book-built); NII min 15%; RII min 35% |
| Rights issue | 15–30 days subscription period |

#### Top Traps:
- Lock-in: OLD = 3 years; NEW = 18 months for MPC; 6 months for excess — most students cite old rule
- Price band: Floor × 1.2 = cap; students do Floor + 1.2 which is wrong
- NII = 15%; QIB = 50% (NOT reversed)

---

### SEBI SAST 2011

#### Must Cover:
| Regulation | Topic | Key Tricky Points |
|------------|-------|-------------------|
| Reg 3 | Open offer trigger | 25% or more shares/voting rights triggers mandatory open offer |
| Reg 3(2) | Creeping acquisition | 25–75% holding: can acquire up to 5% MORE per financial year (April–March) without open offer |
| Reg 4 | Control trigger | Acquiring "control" regardless of % also triggers open offer |
| Reg 7 | Open offer size | Minimum 26% of total shares |
| Reg 8 | Offer price | Highest of: negotiated price; 52-week VWAP; 26-week VWAP; highest price in last 26 weeks |
| Reg 13 | Public announcement | Within 4 WORKING DAYS of trigger event |
| Disclosure | Crossing 5%; each 2% change | Disclose to company and stock exchange within 2 working days |

#### Top Traps:
- OLD trigger: 15% (1997 code); NEW trigger: 25% (2011 regulations)
- Open offer size: 26% (NOT 20%)
- Creeping: applies ONLY between 25% and 75%; financial year is April–March (NOT calendar year)
- No non-compete fee under 2011 regulations — all shareholders treated equally

---

### SEBI PIT 2015

#### Must Cover:
| Regulation | Topic | Key Tricky Points |
|------------|-------|-------------------|
| Reg 2(g) | "Insider" definition | Connected person OR person in possession of UPSI |
| Reg 2(n) | UPSI | Not generally available; materially price-sensitive if disclosed; examples: results, dividends, mergers, KMP changes |
| Reg 3 | No communication of UPSI | Except in ordinary course of business/profession |
| Reg 4 | No trading in possession of UPSI | Complete prohibition |
| Trading window | Closure mandatory | Mandatorily closed from end of each financial quarter until 48 hours after financial results declared |
| Trading plan | Pre-approved plan | Cooling-off: 120 calendar days from public disclosure before trading begins |
| Reg 7 | Initial disclosure | At 5% or more shareholding/voting rights |
| Reg 7 | Continual disclosure | At 5% crossing and every 2% change thereafter |

#### Top Traps:
- Trading window reopens: 48 hours AFTER RESULTS DECLARED (not after board meeting; not 24 hours)
- Trading plan cooling-off: 120 CALENDAR DAYS (not trading days; not business days)
- UPSI: "likely to materially affect price" — speculative future events that are not yet decided may or may not be UPSI depending on specificity
- Insider includes person who POSSESSED UPSI even if not "connected" — two routes to being an insider

---

## 7. ECONOMIC LAWS — COVERAGE GUIDE

---

### FEMA 1999

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 2(v) | Person Resident in India | Stayed in India for more than 182 days in preceding **FINANCIAL YEAR** (April–March) — not calendar year |
| Sec 2(e) | Capital account transaction | Alters assets/liabilities outside India (resident) or inside India (non-resident) |
| Sec 2(j) | Current account transaction | Everything except capital account |
| Sec 3 | Prohibition on dealing | Must deal through authorised person |
| Sec 4 | No holding outside India | Without RBI permission |
| Sec 5 | Current account | Generally permitted; CG may restrict |
| Sec 6 | Capital account | Prohibited unless permitted by RBI |
| Sec 7 | Export proceeds | Must be realised and repatriated within prescribed time |
| Sec 13 | Penalties | Up to 3x of sum (if quantifiable); up to ₹2 lakh (if not quantifiable); continuing default: ₹5,000/day |
| LRS | Remittance scheme | USD 2,50,000 per person per financial year |

#### Top Traps:
- FEMA residential status: 182 days in FINANCIAL year (April–March) — BUT Companies Act resident director: 182 days in CALENDAR year — both 182 days but different year types!
- Current account: PERMITTED unless prohibited; Capital account: PROHIBITED unless permitted — students reverse this
- Person can be resident under FEMA but NRI under Income Tax, and vice versa
- Penalty for non-quantifiable violation: ₹2 lakh flat (NOT 3x of sum)

#### Hard Scenario Ideas:
- Person lived in India from April 1 to September 30 (183 days) in FY 2024-25, then moved abroad — are they "Person Resident in India" for FY 2025-26? (NO — preceding year they completed 183 days but FEMA looks at the preceding financial year to determine status for current year — test the transitional year scenarios)
- Indian company wants to invest in shares of a foreign company — current account or capital account transaction?
- Employee deputed abroad for 2 years — FEMA residential status and property ownership implications

---

### FCRA 2010

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 2 | Definitions | Foreign contribution = article/currency/security from foreign source |
| Sec 3 | Prohibited persons | Political parties, candidates, government servants, judges, legislators, editors of newspapers — cannot receive FC |
| Sec 6 | Registration | Must register with MHA; organisation must be 3+ years old + spent ≥₹15 lakh in 3 years |
| Sec 8 | Management of FC | Designated account: SBI New Delhi Main Branch (post-2020); admin expense cap: 20% of FC received |
| Sec 11 | Prior permission | Alternative to registration for specific purpose |
| Sec 18 | Intimation of receipt | Within 3 months of receipt |
| Relative threshold | ≥₹10 lakh from foreign source | Must report to CG within 3 months in Form FC-1 |

#### Top Traps:
- Registration eligibility: ₹15 lakh spent in 3 years (not received; not ₹10 lakh)
- Relative report: >₹10 lakh received from foreign source → report within 3 months (a different ₹10 lakh threshold)
- Admin expense cap: 20% (post-2020 amendment; old cap was 50% — students cite old figure)
- SBI New Delhi Main Branch only — any branch of SBI is NOT sufficient (post-2020 amendment)
- Editor of a registered newspaper CANNOT receive foreign contribution — often considered "journalist" rather than prohibited person

---

### IBC 2016

#### Must Cover:
| Section | Topic | Key Tricky Points |
|---------|-------|-------------------|
| Sec 4 | Minimum default threshold | ₹1 crore (raised from ₹1 lakh in 2020) |
| Sec 7 | Financial creditor application | No demand notice required; NCLT must admit/reject within 14 days |
| Sec 8 | Demand notice by operational creditor | 21 days before filing application; corporate debtor must reply or pay within 21 days |
| Sec 9 | Operational creditor application | After 21-day period; same ₹1 crore threshold |
| Sec 13 | Moratorium declaration | By NCLT simultaneously with admission |
| Sec 14 | Effects of moratorium | No suits; no transfer of assets; no enforcement of security interest; no property recovery by owner/lessor |
| Sec 16 | IRP appointment | Along with moratorium; IRP takes over management |
| Sec 21 | CoC | All financial creditors; OC with >10% of total claims may attend but NOT vote; CoC decisions: 66% voting share |
| Sec 12 | CIRP timeline | 180 days; 1 extension of up to 90 days = 270 days; including litigation time = max 330 days |
| Sec 29A | Ineligible resolution applicants | Promoters who caused default; wilful defaulters; NPA borrowers (1+ year); guarantors; convicted persons |
| Sec 30/31 | Resolution plan | CoC approval: 66% voting; then NCLT sanction |
| Sec 33 | Liquidation | Triggered if no plan, CoC decides to liquidate, plan rejected by NCLT, plan violated |
| Sec 53 | Waterfall/priority | CIRP costs → workmen dues 24 months + secured creditors → employee wages 12 months → unsecured FCs → government dues → preference shares → equity |
| Sec 60 | Adjudicating authority | NCLT |

#### Top Traps:
- Default threshold: ₹1 crore (post-2020); old threshold was ₹1 lakh — BIGGEST numerical trap in Economic Laws
- OC with >10% aggregate: can ATTEND CoC meetings but CANNOT VOTE (unless no financial creditors exist)
- CoC approval: 66% voting (NOT 75% — changed in 2019 amendment; students cite old rule)
- Demand notice: mandatory for OC (Sec 8/9); NOT required for FC (Sec 7)
- NCLT must decide FC/OC application within 14 days
- Moratorium is declared simultaneously with NCLT admission (not separately)
- Workmen's dues: 24 months priority; Employee wages: 12 months priority (different periods)
- Sec 29A: guarantors of the corporate debtor are also ineligible — students forget the guarantor exclusion

#### Hard Scenario Ideas:
- FC (bank) and OC (supplier) file simultaneously — who gets priority in CoC voting?
- Resolution plan approved by 60% of CoC — can NCLT still sanction it? (NO — 66% threshold not met)
- Promoter who owns 45% shares of corporate debtor wants to submit resolution plan — Sec 29A bars him; can he form a consortium with an external party where he holds 49%? (Yes if consortium entity is eligible — Sec 29A tests the resolution applicant entity, not promoter individually, but with various nuances)
- CIRP has been running for 290 days; court stays proceedings for 50 days — total excluding stay = 240 days → is CIRP still within 330-day limit?
- Moratorium declared; a landlord wants to terminate lease of the corporate debtor's factory — is he barred? (Yes — Sec 14 bars property recovery by lessor)

---

## 8. COMMON QUESTION DESIGN PATTERNS (READY TEMPLATES)

### Pattern 1 — The Threshold Trap
> [Scenario establishes specific numbers] → Question asks whether a threshold is met → Correct answer requires computing whether the facts clear the threshold → Distractors include adjacent thresholds from related provisions

### Pattern 2 — The "And/Or" Confusion
> Rule states "A OR B" → Scenario gives facts where A is met but B is not → Students who misread as "A AND B" choose wrong answer
> Also reverse: rule says "A AND B" → students think either is sufficient

### Pattern 3 — The Amendment Trap
> Current law differs from pre-amendment position → Scenario facts trigger the amended provision → Distractors include pre-amendment figures as options → Tests whether student is current on law

### Pattern 4 — The Exception to the Rule
> Main rule clearly applies on surface → Scenario contains specific facts that trigger an exception → Students who apply main rule without checking for exceptions get it wrong

### Pattern 5 — The Cross-Law Confusion
> Same number appears in two different laws with different meanings → Scenario implicates one law → Distractors use the same number in the other law's context
> Example: 182 days (FEMA financial year vs Companies Act calendar year); ₹1 lakh (Companies Act inability to pay) vs ₹1 crore (IBC default threshold)

### Pattern 6 — The Sequential Procedure Question
> Scenario describes a transaction that requires multiple steps in a specific order → Question asks which step should have come FIRST or NEXT → Tests procedural knowledge

### Pattern 7 — The Negative Knowledge Test
> 4 options are all "this section covers X" type → 3 correctly identify what the section covers → 1 distractor attributes something to the section that it does NOT cover → "Which is NOT covered by Section X"

### Pattern 8 — The Multi-Party Scenario
> Multiple parties (A, B, C, D) are involved in a transaction → Different rules apply to each party → Question identifies which party is in compliance or which party has an obligation → Cannot be answered without tracking all parties

---

## 9. QUALITY CHECKLIST BEFORE FINALISING A QUESTION SET

Before submitting any JSON question set, verify:

- [ ] Every scenario is at least 80 words and rich with named parties, specific numbers, and a sequence of events
- [ ] Every question requires reading the scenario (not just the question text) to answer
- [ ] No two questions in the same scenario test the exact same sub-provision
- [ ] All four options are plausible — no obviously absurd distractors
- [ ] At least one distractor represents a pre-amendment rule, adjacent section number, or "higher/lower" reversal
- [ ] The explanation identifies: correct provision → correct reasoning → which trap answer is most tempting → which scenario fact is determinative
- [ ] At least 60% of questions use negative framing, apply-to-facts framing, or exception testing
- [ ] All sections listed in "Must Cover" for the chapter appear in at least one question
- [ ] Question IDs are sequential across all scenarios in the file
- [ ] No duplicate question text across the entire question set
- [ ] Questions that ask about numerical thresholds include that specific threshold in the scenario (students must apply it, not just recall it)

---

## 10. EXAMPLES OF QUESTION HARDNESS LEVELS

### Same Topic — Three Hardness Levels:

**EASY (DO NOT GENERATE THIS):**
> Q: What is the minimum number of members required to apply under Section 244 for a company having share capital?
> A: 100 or 1/10 of total, whichever is less

**MEDIUM-HARD (acceptable occasionally):**
> Scenario: Spectrum Telecom Ltd. has 1,500 members. Group A has 90 members. Can they apply under Section 241?
> Q: Can Group A apply?
> A: Yes/No based on calculation (90 < 100 AND 90 < 1/10 of 1500=150 → NO)

**HARD (target):**
> Scenario: Spectrum Telecom Ltd. has 1,500 members total; 600 are institutional investors who have entered a Deed of Waiver not to participate in management proceedings. Group A consists of 105 retail members holding 8% of issued share capital who have filed under Section 241. Group B consists of 45 members (all institutional) holding 14% of issued share capital who also want to join the petition. The company's lawyer argues that the 600 institutional investors who signed the Deed of Waiver must be excluded from total membership count for threshold purposes.
>
> Q1: Treating total membership as 1,500, does Group A independently satisfy the Section 244(1)(a) threshold? (105 > 100 ✓ → YES)
> Q2: Does Group B independently satisfy the Section 244(1)(a) threshold? (45 < 100; 14% > 10% → YES on share capital limb)
> Q3: If the company's argument about excluding 600 institutional investors is accepted, reducing effective total to 900, what is the new minimum member count threshold? (1/10 of 900 = 90; 90 < 100 → threshold becomes 90)
> Q4: Can the Tribunal waive the threshold for Group A if they fail to qualify? (YES — Sec 244(1) proviso allows Tribunal to waive; but Sec 245 class action does not have this waiver)

---

## 11. WHAT THE REAL ICAI EXAM TESTS (MEMORY-BASED ANALYSIS)

Based on memory-based question analysis from actual SPOM Set A attempts, these are the highest-frequency tested areas:

**Companies Act:**
- Managerial remuneration calculations (especially in loss years, Schedule V slabs)
- Director appointment, reappointment, disqualification procedures
- Winding-up grounds and petition eligibility
- NCLT/NCLAT appeal timelines (45+45 = 90 days; SC appeal on question of law only)
- Fast-track merger vs regular merger (Section 233 vs 232 eligibility and process)
- SFIO exclusive jurisdiction
- Section 186 loan/investment computation

**Securities Laws:**
- SEBI penalties (Sec 15G/15H: higher of ₹25 crore or 3x)
- SAST: open offer trigger (25%), open offer size (26%), creeping acquisition (5% per FY)
- PIT: UPSI definition, trading window closure (48 hours post-results), trading plan cooling-off (120 days)
- LODR: material RPT threshold (lower of ₹1000 crore or 10%)
- ICDR: lock-in periods (18 months MPC; 6 months excess)

**Economic Laws:**
- FEMA: current vs capital account; residential status (182 days, financial year)
- IBC: default threshold (₹1 crore); CoC voting (66%); CIRP timeline (180+90+60 days litigation = 330); waterfall priority (workmen 24 months vs employees 12 months); Sec 29A ineligibility
- FCRA: admin expense cap (20%); SBI New Delhi Main Branch requirement; registration threshold (₹15 lakh)

**These topics MUST be covered in every chapter question set that they appear in.**

---

*Last updated: April 2026 | This file governs all question generation for this project.*
