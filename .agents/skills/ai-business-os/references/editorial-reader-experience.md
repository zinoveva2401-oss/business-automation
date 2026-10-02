# Editorial / Human Language / Reader Experience Contract

## Purpose

This module protects DOKRUTI content from the common failure mode `correct information → AI-shaped fragments → poor reading experience`.
It applies to all customer-facing/public copy, with depth adapted to the writing mode: books, long articles, short posts, landing/product copy, lessons, product instructions, scripts, presentations, UI/microcopy and substantial explanatory text.

The goal is not to make text "literary" for its own sake. The goal is comprehension, trust, momentum and useful action appropriate to the format.

## 0. Writing-mode classifier

Before writing, classify the text:
- `LONG-FORM` — book/article/guide/report: continuity, narrative spine, transitions and sustained reading matter;
- `SHORT POST / SOCIAL` — one clear point, natural paragraphing, channel-native rhythm, no one-sentence-per-line AI spam;
- `LANDING / PRODUCT / COMMERCIAL COPY` — concrete audience/problem/value/proof/action, no generic hype;
- `INSTRUCTION / CHECKLIST / SOP` — precision, order, trigger/action/exception; concise language is correct here;
- `PRESENTATION COPY` — scannable takeaway + support; slides do not carry essay paragraphs;
- `UI / MICROCOPY` — shortest clear action/state language, consistent verbs, errors explain what happened and what to do;
- `EMAIL / MESSAGE / SUPPORT` — purpose in the first screen, human tone, clear request/next step, no bureaucratic or AI filler;
- `LEGAL / HIGH-STAKES` — domain precision overrides stylistic simplification; readability may improve, legal meaning may not change.

Apply only the rules that fit the mode. Human language does not mean making every artifact conversational or long.

## 1. Separate information from prose

Research notes, requirement ledgers, checklists and internal schemas may be blocky. Customer-facing long-form text may not simply expose that internal structure.

Before final writing, convert:
`facts/methods/tools → reader problem → narrative sequence → coherent prose → examples → action → transition`.

A customer-facing book/article is not a formatted database of headings.

## 2. Human-language standard

Default prose rules:
- complete natural sentences; sentence fragments are reserved for deliberate headings, captions, labels, dialogue or controlled emphasis;
- one main thought per paragraph, but not one sentence per paragraph by default;
- varied sentence and paragraph rhythm;
- concrete verbs and operational nouns instead of abstract corporate filler;
- explain professional terms at first meaningful use or replace them with normal Russian;
- examples must contain a situation, observable facts, decision and consequence;
- transitions answer `why are we moving to the next point now?`;
- avoid repetitive scaffolds such as `Проблема / Методика / Пример / Вывод` in every section;
- avoid synthetic motivational filler, fake certainty, empty intensifiers and generic "важно понимать" language;
- avoid excessive colon-led micro-lists when normal prose would be clearer;
- do not turn every idea into a numbered list, table or card.

## 3. Long-form narrative architecture

Before full writing define:
- `READER START STATE` — what the reader believes/does now;
- `READER END STATE` — what they should understand/do after the product;
- `NARRATIVE SPINE` — one causal line through the whole work;
- `CHAPTER DEPENDENCY` — why chapter N must precede N+1;
- `TENSION / QUESTION` for each major section;
- `PAYOFF` — what becomes clearer or possible;
- `TRANSITION` — what naturally opens the next section;
- recurring case/story when useful;
- action cadence so practice appears after understanding, not as random worksheets.

A chapter is a unit of thought, not a container for a fixed template.

## 4. Continuity / read-through gate

Run a separate full read-through pass after content is complete and before final layout.

Check:
- can the reader move from beginning to end without feeling they are jumping between disconnected cards;
- does every major section have a clear reason to exist;
- do chapter openings orient the reader without repeating the table of contents;
- do chapter endings close the current idea and create a natural next step;
- are examples distributed where comprehension needs them;
- are instructions preceded by enough understanding to make them meaningful;
- does the tone remain one human voice;
- are there abrupt changes from conversational prose to bureaucratic instruction;
- are repeated definitions, conclusions or frameworks consolidated.

## 5. Fragmentation heuristics

These are warning signals, not blind numeric laws:
- repeated runs of one-sentence body paragraphs;
- three or more consecutive tiny sections that each contain only a few sentences;
- long-form prose with a heading every ~100 words across sustained stretches;
- repeated identical section labels across most chapters;
- more bullets than narrative where the reader is supposed to learn/understand rather than reference;
- "card language" in plain text: every thought reduced to title + two lines + CTA.

When these signals appear, an editor must inspect and merge/rewrite rather than automatically preserve the source structure.

## 6. AI-smell lint

Before release actively search for:
- repeated opening formulas;
- repeated `Важно / Итог / Что делать / Вывод` cadence;
- symmetrical three-item lists created without semantic need;
- generic examples that could belong to any company;
- abstract claims without scene/evidence;
- excessive em dashes, colons, labels and bold fragments;
- identical paragraph length and sentence rhythm;
- abrupt slogan-like fragments inside explanatory chapters;
- obvious paraphrase loops where the same point is said three times.

If the text feels generated from a template, Human Language PASS = FAIL.

## 7. Read-aloud / spoken-Russian pass

For important owner-facing or customer-facing prose, perform a silent read-aloud simulation:
- would a competent Russian speaker naturally say this sentence;
- is the grammar complete;
- does the emphasis fall in the right place;
- is there a breath/pause where punctuation claims one exists;
- does the sentence become clearer if split or merged;
- does the paragraph sound like a person explaining something, not a prompt artifact.

## 8. Article-specific contract

A strong article normally has:
`real question/tension → useful answer with evidence → distinction/diagnosis → example → practical consequence → next step`.

Do not force all articles into the same exact skeleton. The content logic determines structure.

## 9. Book-specific contract

A premium e-book must additionally pass:
- coherent table of contents based on reader transformation;
- stable voice across chapters;
- chapter-level narrative arc;
- visible escalation of understanding/skill;
- recurring examples/cases only when they add continuity;
- no duplicate teaching between neighboring chapters;
- implementation ending: what the reader does after finishing the book.

The narrative editor is allowed to reorder, merge or rewrite sections when this improves the reader path, unless the current task explicitly freezes text/content.

## 10. Editorial verifier

The person/pass that wrote the text cannot be the only Human Language verifier for substantial long-form output.
The independent editorial verifier receives the final text, not the writer's outline, and returns:
`PASS / FAIL / UNKNOWN` for continuity, natural Russian, narrative logic, redundancy, reader payoff and AI-smell.


## 11. Short-form / post contract

For meaningful posts:
- one primary idea/tension per post;
- first visible lines earn attention without promising a payoff the body does not deliver;
- paragraphs and line breaks follow meaning, not an AI template;
- avoid strings of slogan fragments unless deliberately used once for emphasis;
- examples/details make the point specific to the audience;
- CTA follows funnel role and is omitted when it adds no value;
- platform adaptation may change length/structure but not factual meaning.

## 12. Landing / product / commercial copy contract

Check:
`who this is for / problem / promised result / mechanism / proof / contents or scope / boundary or who-not-for when useful / next action`.

Do not hide weak value behind adjectives such as “уникальный”, “мощный”, “инновационный”, “премиальный”. Claims must be supportable.

## 13. UI / instruction / presentation language contract

- UI labels use consistent action verbs and specific states;
- error/help copy explains the next recoverable step;
- instructions use complete enough sentences to remove ambiguity but do not add narrative filler;
- presentation titles/headlines carry a takeaway, while body text supports it rather than duplicating the speaker;
- final proofreading checks grammar, punctuation, factual names/numbers/links and consistency of terminology.

## 14. Russian owner/customer/public language gate

Before owner/customer/public handoff, replace unnecessary internal English/service jargon with normal Russian. Examples:
`PASS → проверка пройдена`; `FAIL → проверка не пройдена`; `gate → условие допуска/проверка`; `first cut → первый монтаж`; `handoff → передача исполнителю`; `workflow → рабочий процесс`; `dispatcher → диспетчер исполнения`; `owner gate → решение Светланы`.

Do not translate brand names, product names, commands, code, API terms or professional terms whose Russian replacement would reduce precision. But internal convenience is not a reason to make Svetlana decode our vocabulary.

For substantial text, `scripts/russian_language_gate.py` is a blocking reference lint. Passing the lint does not prove excellent prose; failing it requires repair.

## 15. Value-density / AHA pass for paid long-form

For paid long-form, Human Language PASS is insufficient. Check each major section for at least one material contribution beyond restatement: new distinction, non-obvious causal link, worked example, decision rule, tool, failure mode, boundary, implementation move or evidence-backed insight.

Flag stretches whose function is only introduction, recap or paraphrase. A compelling book can breathe, but it cannot use atmosphere to hide missing value.
