#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
errors=[]
def txt(r): return (root/r).read_text('utf-8',errors='ignore')
def need(r,*ps):
    s=txt(r)
    for p in ps:
        if p not in s: errors.append(f'{r}: missing {p}')

need('SKILL.md','DIRECTOR BRAIN / НЕ ПОСЛУШНЫЙ ИСПОЛНИТЕЛЬ','RUSSIAN OWNER/CUSTOMER GATE','PROACTIVE QUICK COMMANDS','PRODUCT VALUE INTEGRITY','DIRECTOR BRAIN / FORESIGHT / PREMORTEM','QUICK COMMAND PALETTE / АВТОПРЕДЛОЖЕНИЕ','PRODUCT VALUE INTEGRITY / LONG-FORM PRESERVATION')
need('references/product-factory.md','Product Value Integrity Gate','SEMANTIC PRESERVATION','VALUE DENSITY','FREE-AI REPLACEABILITY','Long-book production protocol','Calendar challenge rule','200+ page production without owner chunk-management','Светлана must not become the chunk dispatcher')
need('references/creative-content-production.md','Weak-Idea Rescue Ladder','Proactive quick-command suggestions','Нельзя обещать «вирусность»')
need('references/global-intelligence-radar.md','Novelty / Future Filter','СЕЙЧАС / 6 МЕСЯЦЕВ / 12 МЕСЯЦЕВ / 24 МЕСЯЦА')
need('references/tool-router.md','Executor reliability is a hard routing input','owner rescue hours','Work is not a default')
need('references/expert-council.md','Director-mode consortium','what would change our mind')
need('references/quick-command-palette.md','/покажи','/команды','/майндкарта','/3d','/взрыв-схема','/дашборд','/наружка','/раскадровка','/человечески','/что-не-вижу')
need('references/russian-language-gate.md','PASS → проверка пройдена' if False else 'Ненужные служебные англицизмы')
need('references/product-value-integrity.md','Two separate gates','Semantic preservation ledger','Value density','Free-AI replaceability','Long-book integrity')
need('agents/openai.yaml','Светлана не обязана помнить быстрые команды','убирай ненужный служебный английский')
if errors:
    print('FAIL'); [print('-',e) for e in errors]; sys.exit(1)
print('ПРОВЕРКА ПРОЙДЕНА')
print('v2.0.10 r2: director brain / product integrity / Russian gate / proactive quick commands')
