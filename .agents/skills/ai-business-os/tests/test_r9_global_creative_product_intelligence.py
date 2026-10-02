#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]

def text(rel): return (root/rel).read_text('utf-8',errors='ignore')
def need(rel,*phrases):
    t=text(rel)
    missing=[p for p in phrases if p not in t]
    assert not missing, f"{rel}: missing {missing}"

need('SKILL.md',
     '2026-09-23 global-creative-product-intelligence-r9',
     'GLOBAL CREATIVE & PRODUCT INTELLIGENCE',
     '100+ наблюдений',
     'PRODUCT / OFFER / CONTENT / FORMAT / HOOK / BUSINESS MODEL / DISTRIBUTION',
     'GLOBAL TRACTION → RU GAP → TRANSFER FIT → TESTABILITY',
     '10–30',
     'global-creative-product-intelligence.md')
need('references/global-creative-product-intelligence.md',
     'Source Universe', 'Global Scouting', '100+ RAW OBSERVATIONS',
     'DONOR PRODUCT','DONOR OFFER','DONOR CONTENT','DONOR FORMAT','DONOR HOOK','DONOR BUSINESS MODEL','DONOR DISTRIBUTION',
     'Viral-content mining','Trend Velocity','Localization Arbitrage','Audience-Language Mining',
     'Creative Mechanics Library + Swipe Bank','Competitive Whitespace','Cross-Industry Transfer Pass',
     'Trend → DOKRUTI Generator','10–30 materially different applications','Trend → Money Translator',
     'Experiment Portfolio','1–3 high-information tests per week','Learning Loop',
     'Do not create a parallel Radar / Signals / Ideas database')
need('references/global-intelligence-radar.md',
     'Global Creative & Product Intelligence engine',
     '100+ observations',
     'trend velocity + evidence window',
     'explicit RU-gap status',
     'SIGNAL → MECHANIC → RU GAP → DOKRUTI ADAPTATION → TEST')
need('MANIFEST.md','Release refinement r8 — Unified Content Owner Transaction','Release refinement r9 — Global Creative & Product Intelligence','preserving the entire r8 Unified Content Owner Transaction and r7 Completion Integrity contracts')
need('UPGRADE_v2.0.10.md','r8 unified-content-growth hardening','r9 global-creative-product-intelligence hardening','No duplicate truth')
need('QA_v2.0.10_r9.md','15. **Learning + no duplicate SOT:**')
need('references/content-owner-transaction.md','ONE REQUEST → ONE READY PACKAGE → ONE OWNER DECISION')
need('references/learning-promotion-loop.md','candidate learning')
print('PASS r9 global creative & product intelligence')
