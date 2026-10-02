#!/usr/bin/env python3
from pathlib import Path
from importlib.util import spec_from_file_location,module_from_spec
import sys
root=Path(__file__).resolve().parents[1]
errors=[]
def need(rel,*phrases):
    s=(root/rel).read_text('utf-8',errors='ignore')
    for p in phrases:
        if p.lower() not in s.lower(): errors.append(f'{rel}: missing {p}')

need('references/owner-context-diagnostic.md','No-invention gate','Restore before ask','Materiality test','Diagnostic interview','Personal profile write-back','Target audience is also evidence')
need('references/owner-context-diagnostic.md','не имеет права заполнять пробелы','ПОДТВЕРЖДЕНО / ДОПУЩЕНИЕ / НЕИЗВЕСТНО')
need('references/owner-workspace-architecture.md','Workspace friction scan','Derived-view rule','Executive Cockpit','Content Cockpit','Commercial Architecture Map','Audience & Demand Map','Knowledge Capital Library','Demo-business route')
need('SKILL.md','OWNER CONTEXT / NO-INVENTION','OWNER WORKSPACE ARCHITECT','ARCHITECTURE COMPLETENESS / WHAT IS MISSING')
need('scripts/context_gap_resolver.py','ASK_OWNER_DIAGNOSTIC','RETRIEVE_SOURCE','FRESH_RESEARCH','PROCEED_WITH_LABELED_ASSUMPTION')

sp=spec_from_file_location('c',root/'scripts/context_gap_resolver.py');m=module_from_spec(sp);sp.loader.exec_module(m)
needs=[
    m.FactNeed('owner_speaking_confidence',personal=True,material=True),
    m.FactNeed('current_goal',personal=True,material=True,known_current=True),
    m.FactNeed('channel_metrics',dynamic_external=True,material=True,source_available=True),
    m.FactNeed('minor_visual_preference',personal=True,material=False),
]
a={x['key']:x['action'] for x in m.resolve_fact_needs(needs)}
expected={
 'owner_speaking_confidence':'ASK_OWNER_DIAGNOSTIC',
 'current_goal':'USE_CONFIRMED',
 'channel_metrics':'RETRIEVE_SOURCE',
 'minor_visual_preference':'PROCEED_WITH_LABELED_ASSUMPTION',
}
if a!=expected:errors.append(f'context resolver mismatch {a}')
if errors:
    print('НЕ ПРОЙДЕНО');[print('-',e) for e in errors];sys.exit(1)
print('ПРОВЕРКА ПРОЙДЕНА')
print('no-invention / diagnostic / owner workspace architecture')
