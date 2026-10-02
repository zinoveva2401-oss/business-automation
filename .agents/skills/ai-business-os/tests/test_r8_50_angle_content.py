from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def has(rel, phrase):
    return phrase in (ROOT/rel).read_text('utf-8',errors='ignore')

checks=[
('identity','SKILL.md','2026-09-23 global-creative-product-intelligence-r9'),
('single front door','SKILL.md','SINGLE FRONT DOOR'),
('one transaction','references/content-owner-transaction.md','ONE REQUEST → ONE READY PACKAGE → ONE OWNER DECISION'),
('radar separate upstream','references/content-owner-transaction.md','Radar may remain a separate scheduled research process'),
('short command','references/content-owner-transaction.md','Подготовь на завтра пост для Telegram'),
('existing queue first','references/content-owner-transaction.md','Existing queue first'),
('selection current instruction','references/content-owner-transaction.md','current owner instruction'),
('selection content queue','references/content-owner-transaction.md','active Content System calendar/queue'),
('new signal not automatic','references/global-intelligence-radar.md','does not automatically displace an existing planned content topic'),
('dedupe','references/content-owner-transaction.md','duplicate output check'),
('pain balance','references/content-owner-transaction.md','seven-pain balance'),
('editorial balance','references/content-owner-transaction.md','editorial-role balance'),
('format repetition','references/content-owner-transaction.md','recent format/hook/visual repetition'),
('analytics selection','references/content-owner-transaction.md','existing analytics and prior learning'),
('fresh current intelligence','references/content-owner-transaction.md','Current Creative Intelligence Gate'),
('russia','references/content-owner-transaction.md','Russia and the target local market'),
('europe us','references/content-owner-transaction.md','Europe and the US'),
('china asia','references/content-owner-transaction.md','China / wider Asia'),
('official platform','references/content-owner-transaction.md','official platform product/creator guidance'),
('creator pattern signal','references/content-owner-transaction.md','current winning creator/brand patterns'),
('donor card','references/content-owner-transaction.md','SOURCE + DATE → OBSERVED MECHANIC'),
('ip no copy','references/content-owner-transaction.md','Never copy protected expression 1:1'),
('original adaptation','references/content-owner-transaction.md','DOKRUTI must add its own Russian context'),
('primary behavior','references/content-owner-transaction.md','one primary intended behavior'),
('virality no promise','references/content-owner-transaction.md','Virality is a hypothesis, never a promise'),
('anti boring','references/content-owner-transaction.md','Anti-boring / anti-template gate'),
('generic ai check','references/content-owner-transaction.md','interchangeable with 100 generic AI expert posts'),
('portrait repetition','references/content-owner-transaction.md','portrait + big title'),
('actual media','references/content-owner-transaction.md','complete platform asset'),
('text first','references/content-owner-transaction.md','text-first Telegram post'),
('actual image','references/content-owner-transaction.md','image post → final text + actual image asset/preview'),
('carousel actual','references/content-owner-transaction.md','carousel → final copy + actual slide/card set'),
('video distinction','references/content-owner-transaction.md','do not call a script a finished video'),
('longform media','references/content-owner-transaction.md','long-form/article → final article + required hero/inline visual assets'),
('visual brief not final','references/content-owner-transaction.md','A `VISUAL BRIEF` is an internal production instruction'),
('no visual if unnecessary','references/content-owner-transaction.md','Визуал: не нужен — текстовый формат сильнее'),
('native adaptation','references/content-owner-transaction.md','Do not copy the same text across Telegram'),
('proposed time','references/content-owner-transaction.md','Content Factory proposes the publication date/time'),
('own analytics time','references/content-owner-transaction.md',"DOKRUTI's own platform analytics"),
('time hypothesis','references/content-owner-transaction.md','working hypothesis'),
('owner not defect finder','references/content-owner-transaction.md','approval owner, not a defect finder'),
('internal legal qa','references/content-owner-transaction.md','legal/IP/privacy/advertising disclosure'),
('one package fields','references/content-owner-transaction.md','EXACT FINAL COPY OR SCRIPT'),
('before approval status','references/content-owner-transaction.md','Content System status: `На утверждении`'),
('publisher ignores','references/content-owner-transaction.md','Publisher must ignore the row'),
('repair same id','references/content-owner-transaction.md','reuse the same output ID'),
('approval freeze','references/content-owner-transaction.md','freeze the exact approved public payload'),
('scheduled only complete','references/content-owner-transaction.md','set status `Запланировано` only after the row is publication-complete'),
('publisher no owner command','references/content-owner-transaction.md','No bot needs a separate owner instruction'),
('analytics collector hidden','references/content-owner-transaction.md','not another owner-facing content agent'),
]
assert len(checks)==50, len(checks)
failed=[]
for name,rel,phrase in checks:
    if not has(rel,phrase): failed.append((name,rel,phrase))
assert not failed, failed
print('ПРОВЕРКА ПРОЙДЕНА: 50/50 ракурсов r8 unified content')
