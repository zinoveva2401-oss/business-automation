#!/usr/bin/env python3
"""Deterministic reference helper for no-invention / diagnose-before-personalize routing."""
from dataclasses import dataclass
from typing import Iterable

@dataclass(frozen=True)
class FactNeed:
    key: str
    material: bool = True
    personal: bool = False
    dynamic_external: bool = False
    source_available: bool = False
    known_current: bool = False
    stale: bool = False


def resolve_fact_needs(needs: Iterable[FactNeed]):
    actions = []
    for n in needs:
        if n.known_current and not n.stale:
            action = "USE_CONFIRMED"
        elif n.source_available:
            action = "RETRIEVE_SOURCE"
        elif n.dynamic_external:
            action = "FRESH_RESEARCH"
        elif n.personal and n.material:
            action = "ASK_OWNER_DIAGNOSTIC"
        elif n.material:
            action = "MARK_UNKNOWN_AND_GET_EVIDENCE"
        else:
            action = "PROCEED_WITH_LABELED_ASSUMPTION"
        actions.append({"key": n.key, "action": action})
    return actions


if __name__ == "__main__":
    demo = [
        FactNeed("public_speaking_confidence", personal=True),
        FactNeed("current_channel_metrics", dynamic_external=True, source_available=True),
    ]
    print(resolve_fact_needs(demo))
