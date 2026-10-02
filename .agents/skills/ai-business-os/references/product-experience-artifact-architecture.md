# Product Experience / Artifact Architecture / Format-Follows-Function Contract

## Purpose

Prevent "more files = more value" production. A paid product is a customer result and a usable path, not a folder full of PDFs, DOCX and spreadsheets.

## 1. Start from customer jobs

Before file production map:
`customer problem → decision/action → information/tool needed → artifact/interface → first useful result → next step`.

Every artifact must have one explicit customer job.
If its job cannot be stated in one sentence, it is not ready to be produced.

## 2. Minimum sufficient artifact set

Default to the smallest set that delivers the full promised result.

Before release ask:
- can two files be one clearer file/tool;
- is one format merely a duplicate export;
- does the customer know which file is primary;
- is there one obvious START HERE;
- does the package expose internal production artifacts that the customer should never see.

Duplicate or redundant artifacts are a UX defect, not a sign of completeness.

## 3. One primary working environment

For operational products, prefer one main workspace/tool when possible.
Auxiliary templates should support exceptional situations, not recreate the same data/process in parallel.

A workbook should not contain multiple sheets that separately ask for the same operational fact unless one is a clearly labelled derived view.

## 4. Workbook / dashboard contract

Before building a spreadsheet define:
- user decisions it supports;
- manual inputs;
- calculated fields;
- source/owner of each input;
- outputs/alerts;
- relationships between sheets/tables;
- first-use scenario;
- negative/invalid/empty scenarios;
- what must be protected from accidental editing;
- what appears on the top dashboard and why.

First screen must answer within seconds:
`what do I enter / what updates automatically / what do I learn / what should I do next`.

Test with realistic positive, negative, boundary, empty and incorrect inputs. A formula existing is not evidence that the workbook is useful.

## 5. DEMO / CLEAN / platform variants

DEMO and CLEAN are variants of one system, not separate products.
Excel and Google Sheets are platform variants, not four different deliverables.

Create multiple variants only when:
- the promise explicitly requires them;
- they work in their target environment;
- the customer understands which one to choose.

## 6. First Value Moment

For a practical digital product, design an early useful result.
Target: a new customer should understand the route and obtain the first meaningful insight/action in roughly the first 10 minutes when the product type allows it.

If onboarding requires reading dozens of pages before any orientation, Product UX must justify why.

## 7. Customer package hierarchy

A typical package hierarchy:
1. `START HERE` — orientation and choice of path;
2. primary product/tool;
3. supporting references/templates only when needed;
4. license/support/update information;
5. no internal RC/master/audit clutter.

The exact structure may differ, but hierarchy must be obvious.

## 8. Buyer comprehension test

A cold reviewer who did not build the product should be able to answer after opening the package:
- what did I buy;
- what problem does it solve;
- what do I open first;
- what do I fill in / read / do;
- what happens automatically;
- what result should I get;
- what do I do next.

Failure on these questions = Major product UX defect.

## 9. Artifact rationalization gate

Before final production and again before release, produce an internal map:
`artifact → customer job → required format → reason this cannot be merged → source/master → delivery form`.

Anything without a unique job is merged, removed or demoted to an export convenience.
