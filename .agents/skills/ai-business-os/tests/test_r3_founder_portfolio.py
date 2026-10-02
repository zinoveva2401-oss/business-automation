#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
errors=[]
def need(rel,*phrases):
    s=(root/rel).read_text('utf-8',errors='ignore')
    for p in phrases:
        if p.lower() not in s.lower(): errors.append(f'{rel}: missing {p}')
need('references/founder-future-self-lab.md','Grounded future-self simulation','Future-Self Card','Professional persona, not fake personality','Blind-spot scan','Speaking & presence academy','Identity-to-calendar rule','No forced 7-day magic','Learning coach behavior')
need('references/founder-future-self-lab.md','Не требуй менять естественные черты лица','не «магически перейти в другую реальность»')
need('references/live-portfolio-proof.md','Proof-before-teach','Portfolio-grade gate','125% means evidence, not endless polishing','Public proof map','Trust mismatch detector')
need('references/knowledge-capital-product-mining.md','Work-to-asset scan','Dedupe-first capitalization','Capitalization Card','Evidence flywheel','Knowledge base write-back')
need('references/business-system-state-contract.md','Knowledge-capital write-back / no idea-bank spam','A useful observation is not automatically a new task')
need('SKILL.md','FOUNDER DEVELOPMENT / FUTURE SELF','LIVE PORTFOLIO / PROOF-BEFORE-TEACH','KNOWLEDGE CAPITAL MINING','PROACTIVE TEACHING')
if errors:
    print('НЕ ПРОЙДЕНО'); [print('-',e) for e in errors]; sys.exit(1)
print('ПРОВЕРКА ПРОЙДЕНА')
print('future-self / portfolio-proof / knowledge-capital / proactive teaching')
