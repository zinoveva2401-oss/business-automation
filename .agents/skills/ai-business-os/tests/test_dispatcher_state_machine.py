#!/usr/bin/env python3
"""Reference regression model for v2.0.9 dispatcher invariants.
This does NOT prove ChatGPT/Work/Codex transport. It tests the deterministic state contract only; runtime_watchdog tests enforce transport-event safety and verification bypass prevention.
"""
from dataclasses import dataclass, field
import sys

@dataclass
class Run:
    state: str='ПРИНЯТО'
    stage: str='S0'
    retry: int=0
    state_version: int=0
    last_event: str|None=None
    journal: list[str]=field(default_factory=list)
    writeback_incomplete: bool=False

    def commit(self, event_id:str, child_pass:bool=True, parent_written:bool=True, journal_written:bool=True, readback:bool=True):
        # Idempotency: exact replay is NO-OP.
        if self.last_event == event_id:
            return 'NO-OP'
        # Logical transaction cannot become VERIFIED on partial write.
        if not (child_pass and parent_written and journal_written and readback):
            self.writeback_incomplete=True
            self.state='WRITE-BACK INCOMPLETE'
            return self.state
        self.state_version += 1
        self.last_event=event_id
        self.journal.append(event_id)
        self.writeback_incomplete=False
        self.state='ПРОВЕРЕНО'
        return self.state

    def executor_fail(self, same_failure:bool):
        self.retry += 1
        if same_failure and self.retry >= 2:
            self.state='RE-SPEC / REROUTE'
        else:
            self.state='НА ИСПРАВЛЕНИИ'
        return self.state

    def next_stage(self, owner_gate=False, blocker=False):
        if owner_gate:
            self.state='ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ'; return self.state
        if blocker:
            self.state='ЗАБЛОКИРОВАНО'; return self.state
        if self.state != 'ПРОВЕРЕНО':
            raise RuntimeError('cannot advance without stage PASS')
        n=int(self.stage[1:])+1
        self.stage=f'S{n}'
        self.state='В РАБОТЕ'
        return self.state

errors=[]
# 1 replay / dedupe
r=Run(); assert r.commit('E1')=='ПРОВЕРЕНО'; v=r.state_version
assert r.commit('E1')=='NO-OP' and r.state_version==v and r.journal==['E1']
# 2 partial write never VERIFIED
r=Run(); assert r.commit('E2', journal_written=False)=='WRITE-BACK INCOMPLETE'
assert r.writeback_incomplete and r.state_version==0 and r.last_event is None
# 3 auto-continue only after pass/no gates
r=Run(); r.commit('E3'); assert r.next_stage()=='В РАБОТЕ' and r.stage=='S1'
# 4 owner gate/blocker stop progression
r=Run(); r.commit('E4'); assert r.next_stage(owner_gate=True)=='ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ'
r=Run(); r.commit('E5'); assert r.next_stage(blocker=True)=='ЗАБЛОКИРОВАНО'
# 5 second same executor failure triggers re-spec/reroute, not blind third retry
r=Run(); assert r.executor_fail(True)=='НА ИСПРАВЛЕНИИ'; assert r.executor_fail(True)=='RE-SPEC / REROUTE'
# 6 cannot advance from unverified state
try:
    Run().next_stage()
    errors.append('advanced without PASS')
except RuntimeError:
    pass

if errors:
    print('FAIL'); [print('-',e) for e in errors]; sys.exit(1)
print('PASS')
print('dispatcher state reference model: dedupe / atomic commit / auto-continue / gates / reroute')
