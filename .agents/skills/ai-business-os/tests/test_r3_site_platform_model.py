#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]; errors=[]
def need(rel,*phrases):
    s=(root/rel).read_text('utf-8',errors='ignore')
    for p in phrases:
        if p.lower() not in s.lower(): errors.append(f'{rel}: missing {p}')
need('references/site-studio-grade-standard.md','Studio-grade test','Motion architecture','About / founder page = trust utility, not biography dump','5 посетительских вопросов','Conversion completion states','FAQ / objection architecture','Trust evidence layer','Performance and search','Portfolio consequence','prefers-reduced-motion')
need('references/platform-intelligence-operations.md','Platform card','Algorithm truth hierarchy','Full setup scan','Channel data hub','Scan → Decide → Test → Learn','Trends` vs `Threads')
need('references/model-economics-routing.md','Baseline-then-downshift','Split thinking from rendering','Reasoning budget','Context cost','Usage feedback loop','Current model names are dynamic')
need('references/execution-memory.md','Context engineering / high-signal memory','just-in-time retrieval','compaction')
need('references/multi-agent-orchestration.md','Evals and layered guardrails')
need('SKILL.md','STUDIO-GRADE WEBSITE','MODEL ECONOMICS','PLATFORM INTELLIGENCE')
if errors:
    print('НЕ ПРОЙДЕНО');[print('-',e) for e in errors];sys.exit(1)
print('ПРОВЕРКА ПРОЙДЕНА')
print('premium site / platform intelligence / model economics / context engineering')
