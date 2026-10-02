#!/usr/bin/env python3
from pathlib import Path
import sys

root=Path(__file__).resolve().parents[1]
errors=[]

def txt(rel): return (root/rel).read_text('utf-8',errors='ignore')
def need(rel,*phrases):
    s=txt(rel)
    for p in phrases:
        if p not in s: errors.append(f'{rel}: missing {p}')
def forbid(rel,*phrases):
    s=txt(rel)
    for p in phrases:
        if p in s: errors.append(f'{rel}: forbidden {p}')

# Historical v2.0.10 lineage remains documented; active identity belongs to v2.0.11 release.
need('SKILL.md','DOKRUTI | BUSINESS OS v2.0.11 RELEASE','PACKAGE VERSION: v2.0.11 RELEASE')
need('MANIFEST.md','Base: exact locally verified v2.0.10 r9 archive','global-creative-product-intelligence-r9','v2.0.10 creative-orchestration hardening')

# Executable reference model for dedupe/update-in-place
need('scripts/entity_resolver.py','UPDATE_EXISTING','ATTACH_CHILD','CREATE_NEW','REVIEW_AMBIGUOUS','same parent RUN')
need('tests/test_entity_resolver.py','same ID must update existing','defect in same RUN must attach','distinct objective should create new object')

# No duplicate-task proliferation
need('SKILL.md','ENTITY RESOLUTION / UPDATE-IN-PLACE','новая мысль, новый дефект, новый инструмент или уточнение владельца **не равны новой строке**')
need('references/business-system-state-contract.md','ENTITY RESOLUTION / UPDATE-IN-PLACE','переиспользовать существующий ID и строку','новую строку создавать только если это действительно новый самостоятельный объект','Content-system dedupe','Decision dedupe')
need('references/business-system-state-contract.md','update the existing rollout/task row in place')

# Creative second brain
need('SKILL.md','CREATIVE SECOND BRAIN','CREATIVE CONTENT PRODUCTION / SECOND CREATIVE BRAIN','SHOOT CARD','FIRST CUT')
need('references/creative-content-production.md','Raw-idea intake','Creative route challenge','Hook architecture','Founder on-camera direction','Stop-scroll visual system','Content → product/service opportunity bridge','45-angle creative graduation checklist')
need('references/marketing-content-engine.md','raw founder input','2–4 materially different creative/format routes','Product/content/service bridge')
need('references/media-production-quality.md','Producer / story / pacing','Founder / on-camera shoot card','Edit grammar','First cut → critique → final export','short synthetic pipeline fixture')
need('references/art-video-visual-futures.md','raw idea/source','founder shoot-card/source plan','Motion-carousel')

# Channel packaging and dynamic platform evidence
need('references/channel-experience-packaging.md','One brand, different channel jobs','Channel Operating Card','Profile packaging','Covers / thumbnails / first frames','Bots and automation','Platform algorithms and myths','Yandex Business/Maps/Direct','Website ↔ video ↔ channel system')
need('references/growth-distribution.md','Channel Experience / Packaging')
need('references/global-intelligence-radar.md','hook structures','DOKRUTI test asset','kill rule')

# Tool routing should be capability-based, not Codex-for-everything
need('references/tool-router.md','Creative / media route','Do not route all video to Codex','direct local-file/app access','repeatable programmatic composition','specialized media/design plugin/app')

# Product/opportunity route
need('references/product-factory.md','Content/Radar → Product Opportunity bridge','configure ChatGPT/AI as a reliable second brain','Format challenger / technical production feedback','FORMAT CHALLENGE')

# Controlled self-learning
need('references/learning-promotion-loop.md','Learning is evidence, not memory magic','Promotion destinations','External self-learning tools','tool proposes learning → Business OS validates','split-layout talking head')
need('references/skill-governance-versioning.md','Learning-promotion boundary','self-learning')
need('references/experiments-analytics.md','Learning Promotion / Self-Improving Business OS')

# Main formula includes reuse, amplifier and learning promotion
need('SKILL.md','ENTITY RESOLUTION (REUSE BEFORE CREATE)','FIRST PASS/CUT','RESULT AMPLIFIER','PROMOTE LEARNING TO THE RIGHT DESTINATION')

# New modules are indexed and linked
need('references/INDEX.md','creative-content-production.md','channel-experience-packaging.md','learning-promotion-loop.md')

# Dynamic trend safety: no universal viral-template rule
forbid('references/creative-content-production.md','always use split-screen Reels','split-screen is always','всегда использовать split')
need('references/creative-content-production.md','never teach one of them as the universal “viral format”')

if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('PASS')
print('v2.0.10 creative/state/channel/learning hardening contracts')
