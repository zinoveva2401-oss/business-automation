#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
checks={
'SKILL.md':['global-creative-product-intelligence-r9','PRE-DELEGATION GO/NO-GO','Авто-start/continue/fork/new-chat запрещены','1/3/10/20-step','наследуй'],
'references/task-specification-delegation.md':['one visible Codex chat','manual owner submit','actually accessible','visible chats / spawned threads / restarts','20-step'],
'references/multi-agent-orchestration.md':['Default = single-session sequential review','Never auto-create a new chat/fork/clean task','Default concurrency budget is zero extra spawned threads'],
'references/production-dispatcher-runtime.md':['one owner-submitted visible chat','do not create a parallel GitHub branch/PR/issue'],
'references/model-economics-routing.md':['По умолчанию дочерний/критический проход наследует текущую доказанную parent model+reasoning'],
'templates/codex-task.md':['ONE OWNER-SUBMITTED CODEX CHAT','MODEL POLICY: inherit active session','DOMAIN PRODUCTION ROUTE','PRE-PRODUCTION PROOF','SEMANTIC / VALUE / VISUAL / MEDIA ACCEPTANCE'],
'references/task-specification-delegation.md':['Production-quality route before expensive execution','Website / visual system','Paid product','Video/media','Public content/marketing'],
'agents/openai.yaml':['- CHAT','один видимый Codex-чат']
}
errors=[]
for rel,phrases in checks.items():
    text=(root/rel).read_text('utf-8',errors='ignore')
    for phrase in phrases:
        if phrase.lower() not in text.lower(): errors.append(f'{rel}: missing {phrase}')
yaml=(root/'agents/openai.yaml').read_text('utf-8',errors='ignore').lower()
for bad in ['- codex','- api','- atlas','- chatgpt']:
    if bad in yaml: errors.append('openai.yaml forbidden '+bad)
if errors:
    print('FAIL')
    [print('-',e) for e in errors]
    sys.exit(1)
print('PASS r6 delegation governance')
