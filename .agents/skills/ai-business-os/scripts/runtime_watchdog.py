#!/usr/bin/env python3
"""Portable DOKRUTI Business OS watchdog/event core.

This module is intentionally transport-neutral. ChatGPT Scheduled Tasks, Work,
Make/Activepieces, OpenClaw/Hermes, Apps Script, n8n or another orchestrator can
feed one JSON event at a time. The core enforces replay safety and produces a
small JSON decision/result that an outer adapter may write back to the canonical
Business System.

It does NOT contain credentials and does NOT call external services itself.
"""
from __future__ import annotations

import argparse
import json
import os
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any

DEFAULT_MAX_RETRY = 3
MAX_PROCESSED_EVENTS = 2000
SAFE_CHECKPOINT_STATUSES = {
    'ПРИНЯТО', 'КОНТЕКСТ ВОССТАНОВЛЕН', 'МАРШРУТ СОБРАН', 'ТЗ ПРОШЛО ПРОВЕРКУ',
    'В РАБОТЕ', 'НА ПРОВЕРКЕ', 'НА ИСПРАВЛЕНИИ'
}
OWNER_GATE_CLASSES = {
    'STRATEGY_POSITIONING', 'MATERIAL_PRICE_SPEND', 'LEGAL_REPUTATION_DATA_RISK',
    'IRREVERSIBLE_HIGH_IMPACT', 'SENSITIVE_ACCESS', 'PUBLIC_PROMISE_BRAND',
    'EQUIVALENT_STRATEGIC_OPTIONS', 'PORTFOLIO_CLOSURE'
}
PROTECTED_STATUSES = {'ПРОВЕРЕНО', 'VERIFIED', 'ЗАПИСАНО/ЗАКРЫТО', 'READY', 'READY FOR LAUNCH'}


@dataclass
class RuntimeState:
    run_id: str = ""
    stage_id: str = ""
    status: str = "ПРИНЯТО"
    state_version: int = 0
    last_event_id: str | None = None
    processed_event_ids: list[str] = field(default_factory=list)
    failure_signature: str | None = None
    same_failure_count: int = 0
    retry_count: int = 0
    next_action: str = ""
    blocker: str = ""
    owner_decision_required: bool = False
    last_evidence: str = ""

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "RuntimeState":
        fields = cls.__dataclass_fields__
        return cls(**{k: value[k] for k in fields if k in value})


class LockError(RuntimeError):
    pass


class FileLease:
    def __init__(self, path: Path, stale_seconds: int = 300):
        self.path = path
        self.stale_seconds = stale_seconds
        self.fd: int | None = None

    def __enter__(self):
        try:
            self.fd = os.open(self.path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            os.write(self.fd, f"pid={os.getpid()} ts={int(time.time())}\n".encode())
            return self
        except FileExistsError:
            try:
                age = time.time() - self.path.stat().st_mtime
            except FileNotFoundError:
                return self.__enter__()
            if age > self.stale_seconds:
                self.path.unlink(missing_ok=True)
                return self.__enter__()
            raise LockError(f"active lease exists: {self.path}")

    def __exit__(self, exc_type, exc, tb):
        if self.fd is not None:
            os.close(self.fd)
        self.path.unlink(missing_ok=True)


def load_state(path: Path) -> RuntimeState:
    if not path.exists():
        return RuntimeState()
    return RuntimeState.from_dict(json.loads(path.read_text('utf-8')))


def atomic_json_write(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    data = (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode('utf-8')
    with open(tmp, 'wb') as fh:
        fh.write(data)
        fh.flush()
        os.fsync(fh.fileno())
    os.replace(tmp, path)


def _remember_event(state: RuntimeState, event_id: str) -> None:
    state.processed_event_ids.append(event_id)
    if len(state.processed_event_ids) > MAX_PROCESSED_EVENTS:
        state.processed_event_ids = state.processed_event_ids[-MAX_PROCESSED_EVENTS:]
    state.last_event_id = event_id


def process_event(state: RuntimeState, event: dict[str, Any], max_retry: int = DEFAULT_MAX_RETRY) -> dict[str, Any]:
    required = ['event_id', 'run_id', 'stage_id', 'type']
    missing = [k for k in required if not event.get(k)]
    if missing:
        return {'decision': 'REJECT', 'reason': 'missing fields: ' + ', '.join(missing), 'state_changed': False}

    event_id = str(event['event_id'])
    if event_id in state.processed_event_ids or event_id == state.last_event_id:
        return {'decision': 'NO-OP', 'reason': 'duplicate event', 'state_changed': False}

    # Optimistic concurrency: a delayed/stale event may not overwrite a newer state.
    if 'expected_state_version' not in event:
        return {'decision': 'REJECT', 'reason': 'missing expected_state_version', 'state_changed': False}
    try:
        expected_version = int(event['expected_state_version'])
    except (TypeError, ValueError):
        return {'decision': 'REJECT', 'reason': 'invalid expected_state_version', 'state_changed': False}
    if expected_version != state.state_version:
        return {'decision': 'REJECT', 'reason': f'stale state version: expected={expected_version} actual={state.state_version}', 'state_changed': False}

    # One state file represents one parent RUN. Reject cross-run contamination.
    incoming_run = str(event['run_id'])
    incoming_stage = str(event['stage_id'])
    if state.run_id and incoming_run != state.run_id:
        return {'decision': 'REJECT', 'reason': f'run_id mismatch: state={state.run_id} event={incoming_run}', 'state_changed': False}

    # Loop guard: our own committed write-back must not recursively become new work.
    if event.get('origin') == 'business-os' and event['type'] in {'writeback_committed', 'watchdog_checkpoint'}:
        _remember_event(state, event_id)
        return {'decision': 'NO-OP', 'reason': 'self-generated commit/event', 'state_changed': True}

    payload = event.get('payload') or {}
    event_type = event['type']

    # Stage changes are explicit. Ordinary events may not silently jump to another stage.
    if state.stage_id and incoming_stage != state.stage_id and event_type != 'stage_started':
        return {'decision': 'REJECT', 'reason': f'stage_id mismatch without stage_started: state={state.stage_id} event={incoming_stage}', 'state_changed': False}

    state.run_id = incoming_run
    if not state.stage_id and event_type != 'stage_started':
        state.stage_id = incoming_stage

    if event_type == 'stage_started':
        # A new EVENT-ID must not restart the same logical stage accidentally.
        if state.stage_id == incoming_stage:
            _remember_event(state, event_id)
            return {'decision': 'NO-OP', 'reason': 'stage already started; explicit repair/reroute event required', 'state_changed': True}
        if state.stage_id and incoming_stage != state.stage_id and state.status != 'ПРОВЕРЕНО':
            return {'decision': 'REJECT', 'reason': 'cannot advance stage before previous stage is ПРОВЕРЕНО', 'state_changed': False}
        state.stage_id = incoming_stage
        state.status = 'В РАБОТЕ'
        state.blocker = ''
        state.owner_decision_required = False
        state.next_action = str(payload.get('next_action') or 'execute current stage')
        state.retry_count = 0
        state.same_failure_count = 0
        state.failure_signature = None

    elif event_type == 'writeback_incomplete':
        state.status = 'WRITE-BACK INCOMPLETE'
        state.blocker = str(payload.get('blocker') or 'partial state-transition commit')
        state.owner_decision_required = False
        state.next_action = str(payload.get('next_action') or 'reconcile write-back and read back all affected sources')

    elif event_type == 'executor_failed':
        state.owner_decision_required = False
        state.blocker = ''
        signature = str(payload.get('failure_signature') or 'UNSPECIFIED')
        state.retry_count += 1
        if signature == state.failure_signature:
            state.same_failure_count += 1
        else:
            state.failure_signature = signature
            state.same_failure_count = 1

        if state.retry_count >= max_retry:
            state.status = 'ЗАБЛОКИРОВАНО'
            state.blocker = f'max retry reached for {signature}'
            state.next_action = str(payload.get('blocked_action') or 'dead-letter / capability review / owner only if a true owner decision is required')
        elif state.same_failure_count >= 2:
            state.status = 'RE-SPEC / REROUTE'
            state.next_action = str(payload.get('reroute_action') or 'recompile spec, reduce granularity or change executor/tool')
        else:
            state.status = 'НА ИСПРАВЛЕНИИ'
            state.next_action = str(payload.get('repair_action') or 'repair current stage with consolidated defect list')

    elif event_type == 'stage_verified':
        if state.status != 'НА ПРОВЕРКЕ':
            return {'decision': 'REJECT', 'reason': f'stage_verified requires НА ПРОВЕРКЕ state, got {state.status}', 'state_changed': False}
        evidence = str(payload.get('evidence') or '').strip()
        if not evidence:
            return {'decision': 'REJECT', 'reason': 'stage_verified requires explicit evidence', 'state_changed': False}
        owner_gate = bool(payload.get('owner_gate'))
        blocker = str(payload.get('blocker') or '').strip()
        if owner_gate and blocker:
            return {'decision': 'REJECT', 'reason': 'stage_verified cannot set owner_gate and blocker simultaneously', 'state_changed': False}
        if owner_gate:
            gate_class = str(payload.get('owner_gate_class') or '').strip()
            if gate_class not in OWNER_GATE_CLASSES:
                return {'decision': 'REJECT', 'reason': 'owner_gate requires a permitted owner_gate_class', 'state_changed': False}
        state.last_evidence = evidence
        state.blocker = ''
        state.owner_decision_required = False
        if owner_gate:
            state.status = 'ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ'
            state.owner_decision_required = True
            state.next_action = str(payload.get('next_action') or 'await material owner decision')
        elif blocker:
            state.status = 'ЗАБЛОКИРОВАНО'
            state.blocker = blocker
            state.next_action = str(payload.get('next_action') or 'resolve blocker')
        else:
            state.status = 'ПРОВЕРЕНО'
            state.next_action = str(payload.get('next_action') or 'advance to next dependent stage')
            state.retry_count = 0
            state.same_failure_count = 0
            state.failure_signature = None

    elif event_type == 'owner_decision_required':
        question = str(payload.get('question') or '').strip()
        gate_class = str(payload.get('owner_gate_class') or '').strip()
        if not question or gate_class not in OWNER_GATE_CLASSES:
            return {'decision': 'REJECT', 'reason': 'owner_decision_required requires question + permitted owner_gate_class', 'state_changed': False}
        state.status = 'ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ'
        state.owner_decision_required = True
        state.blocker = ''
        state.next_action = question

    elif event_type == 'owner_decision_resolved':
        if not state.owner_decision_required or state.status != 'ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ':
            return {'decision': 'REJECT', 'reason': 'no active owner decision to resolve', 'state_changed': False}
        decision_evidence = str(payload.get('evidence') or '').strip()
        if not decision_evidence:
            return {'decision': 'REJECT', 'reason': 'owner_decision_resolved requires evidence', 'state_changed': False}
        state.status = 'В РАБОТЕ'
        state.owner_decision_required = False
        state.blocker = ''
        state.last_evidence = decision_evidence
        state.next_action = str(payload.get('next_action') or 'continue current stage under resolved owner decision')

    elif event_type == 'stage_blocked':
        blocker = str(payload.get('blocker') or '').strip()
        if not blocker:
            return {'decision': 'REJECT', 'reason': 'stage_blocked requires explicit blocker', 'state_changed': False}
        state.status = 'ЗАБЛОКИРОВАНО'
        state.blocker = blocker
        state.owner_decision_required = False
        state.next_action = str(payload.get('next_action') or 'resolve blocker or reroute capability')

    elif event_type == 'checkpoint':
        # Checkpoint may update progress, but it may not bypass verification/closure gates.
        requested_status = str(payload.get('status') or state.status)
        if requested_status in PROTECTED_STATUSES or requested_status not in SAFE_CHECKPOINT_STATUSES:
            return {'decision': 'REJECT', 'reason': f'checkpoint cannot assign status: {requested_status}', 'state_changed': False}
        state.status = requested_status
        state.next_action = str(payload.get('next_action') or state.next_action)
        state.last_evidence = str(payload.get('evidence') or state.last_evidence)

    else:
        return {'decision': 'REJECT', 'reason': f'unsupported event type: {event_type}', 'state_changed': False}

    state.state_version += 1
    _remember_event(state, event_id)
    return {
        'decision': 'COMMIT',
        'reason': event_type,
        'state_changed': True,
        'run_id': state.run_id,
        'stage_id': state.stage_id,
        'status': state.status,
        'state_version': state.state_version,
        'next_action': state.next_action,
        'blocker': state.blocker,
        'owner_decision_required': state.owner_decision_required,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description='DOKRUTI portable watchdog/event core')
    parser.add_argument('--event', required=True, type=Path)
    parser.add_argument('--state', required=True, type=Path)
    parser.add_argument('--result', required=True, type=Path)
    parser.add_argument('--max-retry', type=int, default=DEFAULT_MAX_RETRY)
    args = parser.parse_args()

    event = json.loads(args.event.read_text('utf-8'))
    lock_path = args.state.with_suffix(args.state.suffix + '.lock')
    try:
        with FileLease(lock_path):
            state = load_state(args.state)
            result = process_event(state, event, max_retry=max(1, args.max_retry))
            if result.get('state_changed'):
                atomic_json_write(args.state, asdict(state))
            atomic_json_write(args.result, result)
    except LockError as exc:
        atomic_json_write(args.result, {'decision': 'LOCKED', 'reason': str(exc), 'state_changed': False})
        return 2
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
