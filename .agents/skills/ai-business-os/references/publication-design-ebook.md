# Publication Design / E-book / Long-form Layout Contract

## Purpose

Turn correct content into a reading experience people can actually read for a long time. This is publication design, not decorative styling.

This is the specialized long-form layer. Universal professional presentation for posts, slides, spreadsheets, checklists, proposals and other artifacts is governed by [Universal Output Design](universal-output-design.md). This contract applies to HTML books, PDFs, DOCX manuals, reports, guides, long articles and any product where continuous reading matters.

## 1. Meaning before component

Layout follows content semantics.
Do not map every content unit to the same card.

Examples:
- explanation → continuous prose;
- process → flow / sequence;
- comparison → table only when comparison is genuinely easier by columns;
- checklist → checklist;
- case → editorial case spread/block;
- warning → restrained callout;
- quote/human voice → quote treatment;
- tool → real interface / worksheet preview;
- decision logic → decision map;
- data → chart/table with a clear takeaway.

`CARD` is one component, not the default language of the publication.

## 2. Reading typography

For screen long-form, optimize for sustained reading:
- readable body size, not presentation-scale microtext;
- comfortable line-height;
- body measure normally around 55–80 characters per line;
- strong but limited hierarchy of H1/H2/H3/body/caption;
- clear distinction between navigation labels and reading text;
- enough whitespace around sections without turning each paragraph into an isolated tile;
- serif/sans pairing only when each has a semantic role;
- bold/colour are emphasis tools, not decoration.

Exact sizes depend on font/device, but a final rendered page must be tested at real desktop and mobile dimensions.

## 3. Chapter rhythm

A long publication needs rhythm across many screens/pages:
`chapter opener → reading flow → visual relief → example/tool → return to prose → chapter payoff`.

Do not repeat one composition on every screen.
Do not create visual novelty on every paragraph either.
Use controlled variety.

## 4. Continuous reading mode

For e-books/articles:
- prose column remains visually stable;
- navigation does not compete with text;
- tables do not overflow on mobile;
- images/diagrams are legible without pinch-zoom where possible;
- anchors/TOC/back-navigation are predictable;
- footnotes/sources do not interrupt every paragraph;
- callouts are limited to information that deserves interruption.

## 5. HTML e-book delivery

If HTML is the customer format, verify the real delivery route:
- customer can open it from the promised environment;
- relative assets/links survive download and unzip when offline delivery is promised;
- no raw-source-code experience through an unsuitable Drive preview is presented as the product;
- fonts/images/scripts required for reading are packaged or reliably served;
- internal navigation works;
- desktop/mobile render is checked in real browsers;
- printable/export behavior is defined when promised;
- accessibility basics: semantic headings, contrast, keyboard navigation, alt text where meaningful.

## 6. PDF / DOCX function rule

Do not duplicate the same material into PDF and DOCX merely to increase file count.

Create both only when they perform different customer jobs, for example:
- DOCX = editable working form;
- PDF = fixed print/share/reference edition.

If the user job is identical, choose one canonical format or generate the second only as an explicitly labelled export convenience.
Duplicate formats without a user need are a Product/UX defect.

## 7. Prototype before mass layout

Before laying out an entire book/manual:
- render one representative chapter with real content;
- include prose, example, table/diagram, callout and tool if the product uses them;
- test desktop/mobile/print as applicable;
- run editorial + publication-design critique;
- freeze the publication system only after the representative chapter passes.

This is an internal production gate, not automatically an owner interruption.

## 8. Publication design anti-patterns

Major defects when repeated/material:
- every section inside rounded cards;
- tiny body text to fit more on screen;
- slide-deck composition used for a book;
- decorative gradients/illustrations with no reading role;
- full-width text lines that are tiring to scan;
- identical chapter template regardless of content;
- excessive badges/pills/labels;
- screenshots too small to read;
- tables used for narrative explanation;
- huge heading density that turns prose into an outline;
- mobile as a shrunken desktop page.

## 9. Final publication QA

Inspect actual exported/rendered output, including several continuous pages/screens, not isolated mockups.
Check:
`reading comfort / hierarchy / continuity / semantic component choice / table-image legibility / mobile / navigation / file opening / links/assets / page breaks-print / brand / perceived value`.

A publication can have technically correct HTML/PDF and still FAIL if it is tiring or fragmented to read.
