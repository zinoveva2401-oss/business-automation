#!/usr/bin/env python3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
a=(root/'references/expert-council.md').read_text('utf-8')
b=(root/'references/product-factory.md').read_text('utf-8')
for phrase in ['Semantic-Preservation Auditor','Value-Density/AHA Reviewer','Skeptical Buyer/Free-AI Challenger','independent Editorial verifier']:
    assert phrase in a, phrase
for phrase in ['Product subagent / council contract','Domain Methodologist','Semantic-Preservation Auditor','actual assembled artifact','Cross-stage loss is a defect']:
    assert phrase in b, phrase
print('ПРОВЕРКА ПРОЙДЕНА')
print('продуктовый консилиум: методология / рынок / покупатель / деньги / право / UX / книга / сохранение смысла / ценность / арт / Red Team')
