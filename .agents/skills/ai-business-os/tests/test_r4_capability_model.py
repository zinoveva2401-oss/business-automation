#!/usr/bin/env python3
from pathlib import Path
import sys,re
root=Path(__file__).resolve().parents[1]
errors=[]
def need(rel,*phrases):
    s=(root/rel).read_text('utf-8',errors='ignore')
    for p in phrases:
        if p.lower() not in s.lower(): errors.append(f'{rel}: missing {p}')
need('references/capability-expansion-radar.md','Capability-gap first','Search order','Capability registry','Install/recommend gate','Model & reasoning router','Small benchmark before adoption','Opportunity scout','Proactive but not noisy')
need('references/model-economics-routing.md','Per-task model decision card','самый дешёвый ранее доказанный','максимальный reasoning не default','deterministic tool','representative benchmark')
need('references/tool-router.md','Owner-context and workspace route','Capability expansion route')
need('references/strategy-portfolio.md','Market whitespace / do-not-go challenge')
need('references/research-competitive-intelligence.md','Whitespace research','малоконкурентно` не равно `есть спрос')
need('SKILL.md','CAPABILITY EXPANSION RADAR','MODEL/REASONING ECONOMICS BY EVIDENCE','MARKET WHITESPACE / DO-NOT-GO')
# commands
text=(root/'references/quick-command-palette.md').read_text('utf-8')
cmds=set(re.findall(r'^- `(/[^`]+)`',text,re.M))
for c in ['/плагины','/скиллы','/нейросети','/парсер','/модель-экономно','/сравни-модели','/рабочее-место','/бизнес-дашборд','/контент-панель','/карта-аудитории','/куда-не-идти','/белое-пятно']:
    if c not in cmds:errors.append('missing command '+c)
if len(cmds)<200:errors.append(f'command bank too small {len(cmds)}')
if errors:
    print('НЕ ПРОЙДЕНО');[print('-',e) for e in errors];sys.exit(1)
print('ПРОВЕРКА ПРОЙДЕНА')
print('capability radar / model economics / whitespace / commands',len(cmds))
