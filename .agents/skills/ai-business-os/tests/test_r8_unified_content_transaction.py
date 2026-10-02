from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def read(rel):
    return (ROOT/rel).read_text('utf-8',errors='ignore')

def need(rel,*phrases):
    s=read(rel)
    missing=[p for p in phrases if p not in s]
    assert not missing, f"{rel}: missing {missing}"

need('SKILL.md','2026-09-23 global-creative-product-intelligence-r9','ONE owner-ready package','Короткая команда = полный production contract','Public owner gate','content-owner-transaction.md')
need('references/content-owner-transaction.md',
     'ONE REQUEST → ONE READY PACKAGE → ONE OWNER DECISION',
     'Подготовь на завтра пост для Telegram',
     'Existing queue first',
     'Current Creative Intelligence Gate',
     'Never copy protected expression 1:1',
     'Editorial depth / product boundary',
     'one strong idea + one micro-value',
     'no more than 2 are direct how-to/diagnostic pieces',
     'Anti-boring / anti-template gate',
     'A `VISUAL BRIEF` is an internal production instruction',
     'Public-content approval state machine',
     '`На утверждении`',
     '`Запланировано`',
     'Publisher automation',
     'Analytics Collector can be a separate **technical service**, but not another owner-facing content agent')
need('references/marketing-content-engine.md','Unified Content Owner Transaction','A `VISUAL BRIEF` is not a finished visual','explicit owner approval')
need('references/creative-content-production.md','one owner-facing creative transaction','Do not expose copywriter → art director → Visual Factory → approval as separate owner handoffs')
need('references/growth-distribution.md','primary intended behavior','virality is a hypothesis, not a promise','Missing metrics remain UNKNOWN')
need('references/global-intelligence-radar.md','donor-mechanics bridge to Content Factory','does not automatically displace an existing planned content topic')
need('agents/openai.yaml','один интегрированный Контент-завод','не выноси Visual Factory или approval в отдельный owner-facing чат')
need('MANIFEST.md','Release refinement r8 — Unified Content Owner Transaction','2026-09-23 global-creative-product-intelligence-r9')
need('UPGRADE_v2.0.10.md','r8 unified-content-growth hardening','Short command','No separate Visual/Approval chats')
need('references/INDEX.md','content-owner-transaction.md')
print('PASS r8 unified content transaction')
