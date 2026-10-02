#!/usr/bin/env python3
from pathlib import Path
import importlib.util
import json
import subprocess
import tempfile
import sys

root=Path(__file__).resolve().parents[1]
path=root/'scripts/runtime_watchdog.py'
spec=importlib.util.spec_from_file_location('runtime_watchdog', path)
mod=importlib.util.module_from_spec(spec); sys.modules[spec.name]=mod; spec.loader.exec_module(mod)

def ev(state, eid, run='R1', stage='S1', typ='checkpoint', payload=None, **extra):
    out={'event_id':eid,'run_id':run,'stage_id':stage,'type':typ,
         'expected_state_version':state.state_version,'payload':payload or {}}
    out.update(extra)
    return out

# 1) duplicate event is NO-OP
s=mod.RuntimeState()
e=ev(s,'E1',typ='checkpoint',payload={'status':'В РАБОТЕ'})
r1=mod.process_event(s,e); v=s.state_version
r2=mod.process_event(s,e)
assert r1['decision']=='COMMIT' and r2['decision']=='NO-OP' and s.state_version==v

# 2) self-generated writeback cannot recursively trigger work
s=mod.RuntimeState()
r=mod.process_event(s,ev(s,'E2',typ='writeback_committed',origin='business-os'))
assert r['decision']=='NO-OP' and s.state_version==0 and s.last_event_id=='E2'

# 3) same failure twice reroutes, not blind third retry
s=mod.RuntimeState()
def fail(state,eid): return ev(state,eid,typ='executor_failed',payload={'failure_signature':'HTTP_403'})
assert mod.process_event(s,fail(s,'E3'))['status']=='НА ИСПРАВЛЕНИИ'
assert mod.process_event(s,fail(s,'E4'))['status']=='RE-SPEC / REROUTE'

# 4) bounded retry reaches BLOCKED/dead-letter semantics
r=mod.process_event(s,fail(s,'E5'), max_retry=3)
assert r['status']=='ЗАБЛОКИРОВАНО' and 'max retry' in r['blocker']

# 5) verified stage requires review state, resets repair counters and advances by next_action
s=mod.RuntimeState(run_id='R1',stage_id='S1',status='НА ПРОВЕРКЕ',retry_count=2,same_failure_count=2,failure_signature='X')
r=mod.process_event(s,ev(s,'E6',typ='stage_verified',payload={'evidence':'ok','next_action':'S2'}))
assert r['status']=='ПРОВЕРЕНО' and s.retry_count==0 and s.same_failure_count==0 and s.next_action=='S2'

# 6) partial writeback remains explicit blocker
s=mod.RuntimeState()
r=mod.process_event(s,ev(s,'E7',typ='writeback_incomplete'))
assert r['status']=='WRITE-BACK INCOMPLETE'

# 7) actual CLI persists state/result atomically and replay stays NO-OP
with tempfile.TemporaryDirectory() as td:
    td=Path(td); event=td/'event.json'; state=td/'state.json'; result=td/'result.json'
    event.write_text(json.dumps({'event_id':'E8','run_id':'R2','stage_id':'S9','type':'checkpoint','expected_state_version':0,'payload':{'status':'В РАБОТЕ','next_action':'test'}}), 'utf-8')
    subprocess.run([sys.executable,str(path),'--event',str(event),'--state',str(state),'--result',str(result)],check=True)
    a=json.loads(result.read_text('utf-8')); st=json.loads(state.read_text('utf-8'))
    assert a['decision']=='COMMIT' and st['last_event_id']=='E8'
    subprocess.run([sys.executable,str(path),'--event',str(event),'--state',str(state),'--result',str(result)],check=True)
    b=json.loads(result.read_text('utf-8'))
    assert b['decision']=='NO-OP'

# 8) cross-run contamination is rejected
st=mod.RuntimeState(run_id='R1', stage_id='S1', status='В РАБОТЕ')
r=mod.process_event(st, ev(st,'E9',run='R2',typ='checkpoint',payload={'status':'В РАБОТЕ'}))
assert r['decision']=='REJECT' and 'run_id mismatch' in r['reason'] and st.run_id=='R1'

# 9) checkpoint cannot bypass verification
st=mod.RuntimeState(run_id='R1', stage_id='S1', status='В РАБОТЕ')
r=mod.process_event(st, ev(st,'E10',typ='checkpoint',payload={'status':'ПРОВЕРЕНО'}))
assert r['decision']=='REJECT' and st.status=='В РАБОТЕ'

# 10) stage verification requires evidence
st=mod.RuntimeState(run_id='R1', stage_id='S1', status='НА ПРОВЕРКЕ')
r=mod.process_event(st, ev(st,'E11',typ='stage_verified'))
assert r['decision']=='REJECT' and st.status=='НА ПРОВЕРКЕ'

# 11) owner gate can be resolved explicitly and stale flag clears
st=mod.RuntimeState(run_id='R1', stage_id='S1', status='ЖДЁТ РЕШЕНИЯ СВЕТЛАНЫ', owner_decision_required=True)
r=mod.process_event(st, ev(st,'E12',typ='owner_decision_resolved',payload={'evidence':'DEC-XYZ','next_action':'continue'}))
assert r['decision']=='COMMIT' and not st.owner_decision_required and st.status=='В РАБОТЕ' and st.last_evidence=='DEC-XYZ'

# 12) stage jump requires explicit stage_started after previous PASS
st=mod.RuntimeState(run_id='R1', stage_id='S1', status='В РАБОТЕ')
r=mod.process_event(st, ev(st,'E13',stage='S2',typ='checkpoint',payload={'status':'В РАБОТЕ'}))
assert r['decision']=='REJECT'
st.status='ПРОВЕРЕНО'
r=mod.process_event(st, ev(st,'E14',stage='S2',typ='stage_started',payload={'next_action':'do S2'}))
assert r['decision']=='COMMIT' and st.stage_id=='S2' and st.status=='В РАБОТЕ'

# 13) stale/out-of-order event cannot overwrite newer state
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ',state_version=3)
e=ev(st,'E15',typ='checkpoint',payload={'status':'НА ПРОВЕРКЕ'}); e['expected_state_version']=2
r=mod.process_event(st,e)
assert r['decision']=='REJECT' and 'stale state version' in r['reason'] and st.state_version==3 and st.status=='В РАБОТЕ'

# 14) same logical stage_started with a fresh event id is NO-OP, not a restart
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ',state_version=4,retry_count=1)
r=mod.process_event(st,ev(st,'E16',typ='stage_started',payload={'next_action':'duplicate'}))
assert r['decision']=='NO-OP' and st.status=='В РАБОТЕ' and st.retry_count==1 and st.last_event_id=='E16'

# 15) owner decision cannot be raised without a permitted material gate class
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ')
r=mod.process_event(st,ev(st,'E17',typ='owner_decision_required',payload={'question':'approve routine QA?'}))
assert r['decision']=='REJECT' and not st.owner_decision_required
r=mod.process_event(st,ev(st,'E18',typ='owner_decision_required',payload={'question':'Change public promise?','owner_gate_class':'PUBLIC_PROMISE_BRAND'}))
assert r['decision']=='COMMIT' and st.owner_decision_required

# 16) stage_verified cannot skip explicit review state
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ')
r=mod.process_event(st,ev(st,'E19',typ='stage_verified',payload={'evidence':'self-pass'}))
assert r['decision']=='REJECT' and 'НА ПРОВЕРКЕ' in r['reason']

# 17) generic checkpoint cannot assign BLOCKED; dedicated block event requires reason
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ')
r=mod.process_event(st,ev(st,'E20',typ='checkpoint',payload={'status':'ЗАБЛОКИРОВАНО'}))
assert r['decision']=='REJECT'
r=mod.process_event(st,ev(st,'E21',typ='stage_blocked',payload={}))
assert r['decision']=='REJECT'
r=mod.process_event(st,ev(st,'E22',typ='stage_blocked',payload={'blocker':'permission denied','next_action':'capability review'}))
assert r['decision']=='COMMIT' and st.status=='ЗАБЛОКИРОВАНО' and st.blocker=='permission denied'

# 18) owner resolution cannot be fabricated when no owner gate is active
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ')
r=mod.process_event(st,ev(st,'E23',typ='owner_decision_resolved',payload={'evidence':'DEC-X'}))
assert r['decision']=='REJECT' and st.status=='В РАБОТЕ'

# 19) verification event cannot be both owner-gated and blocked
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='НА ПРОВЕРКЕ')
r=mod.process_event(st,ev(st,'E24',typ='stage_verified',payload={'evidence':'qa','owner_gate':True,'owner_gate_class':'STRATEGY_POSITIONING','blocker':'legal'}))
assert r['decision']=='REJECT'

# 20) missing expected state version is rejected (except exact duplicate is already safely NO-OP)
st=mod.RuntimeState(run_id='R1',stage_id='S1',status='В РАБОТЕ')
r=mod.process_event(st,{'event_id':'E25','run_id':'R1','stage_id':'S1','type':'checkpoint','payload':{'status':'НА ПРОВЕРКЕ'}})
assert r['decision']=='REJECT' and 'expected_state_version' in r['reason']

print('PASS')
print('runtime watchdog: duplicate/logical-restart/stale-event/self-loop/run-stage isolation/verification-gates/material-owner-gates/owner-resolution/repair-reroute/max-retry/writeback/atomic persistence')
