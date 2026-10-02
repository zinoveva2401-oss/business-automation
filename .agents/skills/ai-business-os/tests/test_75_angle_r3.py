#!/usr/bin/env python3
from pathlib import Path
import sys
root=Path(__file__).resolve().parents[1]
checks=[
('dedupe','references/business-system-state-contract.md','ENTITY RESOLUTION / UPDATE-IN-PLACE'),
('idea bank dedupe','references/business-system-state-contract.md','Knowledge-capital write-back / no idea-bank spam'),
('front door','SKILL.md','SINGLE FRONT DOOR'),('intent','SKILL.md','INTENT LOCK'),('spec','SKILL.md','TASK SPECIFICATION COMPILER'),
('director','references/director-brain-foresight.md','Director pass'),('premortem','references/director-brain-foresight.md','premortem'),
('future self','references/founder-future-self-lab.md','Future-Self Card'),('identity calendar','references/founder-future-self-lab.md','Identity-to-calendar rule'),
('speech','references/founder-future-self-lab.md','Speaking & presence academy'),('anti magic','references/founder-future-self-lab.md','Нельзя утверждать, что визуализация сама меняет внешнюю реальность'),
('portfolio','references/live-portfolio-proof.md','Portfolio-grade gate'),('proof teach','references/live-portfolio-proof.md','Proof-before-teach'),('125','references/live-portfolio-proof.md','125% means evidence'),
('knowledge mining','references/knowledge-capital-product-mining.md','Work-to-asset scan'),('capital card','references/knowledge-capital-product-mining.md','Capitalization Card'),
('product value','references/product-value-integrity.md','Value density'),('aha','references/product-value-integrity.md','AHA / surprise'),('free ai','references/product-value-integrity.md','Free-AI replaceability'),('long book','references/product-value-integrity.md','Long-book integrity'),
('product factory','references/product-factory.md','Format challenger'),('product mining','references/product-factory.md','Product mining from our own work'),('own proof','references/product-factory.md','Proof-before-teach / own-use'),
('weak idea','references/creative-content-production.md','Weak-Idea Rescue Ladder'),('creative routes','references/creative-content-production.md','Creative route challenge'),('shoot','references/creative-content-production.md','Founder on-camera direction'),('first cut','references/creative-content-production.md','First-pass is not handoff'),('creative portfolio','references/creative-content-production.md','Live-portfolio creative gate'),
('quick bank','references/quick-command-palette.md','Светлана не обязана помнить команды'),('3d','references/quick-command-palette.md','/3d'),('exploded','references/quick-command-palette.md','/взрыв-схема'),('cutaway','references/quick-command-palette.md','/разрез'),('isometric','references/quick-command-palette.md','/изометрия'),('outdoor','references/quick-command-palette.md','/наружка'),('mindmap','references/quick-command-palette.md','/майндкарта'),('about cmd','references/quick-command-palette.md','/обо-мне'),('thank cmd','references/quick-command-palette.md','/спасибо'),('model cmd','references/quick-command-palette.md','/модель'),
('platform card','references/platform-intelligence-operations.md','Platform card'),('algorithm hierarchy','references/platform-intelligence-operations.md','Algorithm truth hierarchy'),('channel data','references/platform-intelligence-operations.md','Channel data hub'),('ambiguous platform','references/platform-intelligence-operations.md','Trends` vs `Threads'),
('channel packaging','references/channel-experience-packaging.md','Channel Operating Card'),('radar future','references/global-intelligence-radar.md','Novelty / Future Filter'),('radar capital','references/global-intelligence-radar.md','Radar → learning / portfolio / product capital'),
('premium site','references/site-studio-grade-standard.md','Studio-grade test'),('motion','references/site-studio-grade-standard.md','Motion architecture'),('about 5','references/site-studio-grade-standard.md','5 посетительских вопросов'),('completion','references/site-studio-grade-standard.md','Conversion completion states'),('faq','references/site-studio-grade-standard.md','FAQ / objection architecture'),('reduced motion','references/site-studio-grade-standard.md','prefers-reduced-motion'),
('model downshift','references/model-economics-routing.md','Baseline-then-downshift'),('split thinking','references/model-economics-routing.md','Split thinking from rendering'),('reasoning budget','references/model-economics-routing.md','Reasoning budget'),('context cost','references/model-economics-routing.md','Context cost'),('usage feedback','references/model-economics-routing.md','Usage feedback loop'),
('executor history','references/tool-router.md','Executor reliability is a hard routing input'),('video routing','references/tool-router.md','Do not route all video to Codex'),
('context engineering','references/execution-memory.md','Context engineering / high-signal memory'),('jit retrieval','references/execution-memory.md','just-in-time retrieval'),('compaction','references/execution-memory.md','compaction'),
('multiagent','references/multi-agent-orchestration.md','Shared requirement ledger'),('evals','references/multi-agent-orchestration.md','Evals and layered guardrails'),('independent verifier','references/multi-agent-orchestration.md','Independent verifier role'),
('Russian','references/russian-language-gate.md','Что блокируется'),('human text','references/editorial-reader-experience.md','Human-language standard'),('visual','references/design-thinking-visual-system.md','Independent'),('media','references/media-production-quality.md','First cut'),
('finance','references/finance-capital.md','downside'),('legal','references/legal-accounting-ip-ru.md','official legal sources'),('commercial','references/revenue-partnerships-b2b.md','revenue potential'),('ops','references/operations-delivery.md','capacity'),('strategy','references/strategy-portfolio.md','portfolio'),('learning','references/learning-promotion-loop.md','Learning is evidence, not memory magic'),('qa','references/qa-redteam-release.md','independent'),
]
errs=[]
for name,rel,phrase in checks:
    p=root/rel
    if not p.exists() or phrase.lower() not in p.read_text('utf-8',errors='ignore').lower():errs.append(f'{name}: {rel} :: {phrase}')
if errs:
    print('НЕ ПРОЙДЕНО',len(errs),'из',len(checks));[print('-',e) for e in errs];sys.exit(1)
print(f'ПРОВЕРКА ПРОЙДЕНА: {len(checks)}/{len(checks)} ракурсов')
