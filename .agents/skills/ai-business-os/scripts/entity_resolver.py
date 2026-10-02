#!/usr/bin/env python3
"""Deterministic reference model for Business OS update-in-place decisions.

This is a regression helper, not a replacement for live semantic judgment or Google Sheets APIs.
It enforces the invariant: resolve/reuse before create.
"""
from __future__ import annotations
from dataclasses import dataclass
from difflib import SequenceMatcher
import re
from typing import Iterable, Optional


def norm(value: str | None) -> str:
    s=(value or '').lower().replace('ё','е')
    s=re.sub(r'[^a-zа-я0-9]+',' ',s,flags=re.I)
    return ' '.join(s.split())


def sim(a: str | None,b: str | None) -> float:
    a,b=norm(a),norm(b)
    if not a or not b: return 0.0
    if a==b: return 1.0
    seq=SequenceMatcher(None,a,b).ratio()
    ta,tb=set(a.split()),set(b.split())
    union=ta|tb
    jaccard=(len(ta&tb)/len(union)) if union else 0.0
    containment=(len(ta&tb)/min(len(ta),len(tb))) if ta and tb else 0.0
    # Word-order changes are common in rephrased task/content titles.
    return max(seq,jaccard,containment)

@dataclass
class Entity:
    object_type: str
    object_id: str=''
    parent_run: str=''
    goal: str=''
    acceptance: str=''
    central_intent: str=''
    status: str=''

@dataclass
class Resolution:
    action: str  # UPDATE_EXISTING / ATTACH_CHILD / CREATE_NEW / REVIEW_AMBIGUOUS
    matched_id: str=''
    reason: str=''
    score: float=0.0


def resolve(candidate: Entity, existing: Iterable[Entity]) -> Resolution:
    rows=list(existing)
    # Stable identity always wins.
    if candidate.object_id:
        for row in rows:
            if row.object_id and norm(row.object_id)==norm(candidate.object_id):
                return Resolution('UPDATE_EXISTING',row.object_id,'same stable object id',1.0)
    # A child/event/format under the same parent stays in the parent lifecycle.
    if candidate.parent_run:
        parent_matches=[r for r in rows if r.parent_run and norm(r.parent_run)==norm(candidate.parent_run)]
        if parent_matches:
            best=max(parent_matches,key=lambda r:max(sim(candidate.goal,r.goal),sim(candidate.central_intent,r.central_intent)))
            return Resolution('ATTACH_CHILD',best.object_id,'same parent RUN; do not create competing parent task',0.99)

    best: Optional[tuple[float,Entity]]=None
    for row in rows:
        if norm(candidate.object_type)!=norm(row.object_type):
            continue
        goal=sim(candidate.goal,row.goal)
        acceptance=sim(candidate.acceptance,row.acceptance)
        intent=sim(candidate.central_intent,row.central_intent)
        # Goal/intent are primary; acceptance confirms same lifecycle.
        score=max(goal,intent)*0.70 + acceptance*0.30
        if best is None or score>best[0]: best=(score,row)

    if best:
        score,row=best
        if score>=0.78:
            return Resolution('UPDATE_EXISTING',row.object_id,'same objective/intent and lifecycle',score)
        if score>=0.62:
            return Resolution('REVIEW_AMBIGUOUS',row.object_id,'possible semantic duplicate; inspect live row before creating',score)
    return Resolution('CREATE_NEW','','materially distinct object after bounded duplicate check',best[0] if best else 0.0)

if __name__=='__main__':
    print('entity_resolver reference model; run tests/test_entity_resolver.py')
