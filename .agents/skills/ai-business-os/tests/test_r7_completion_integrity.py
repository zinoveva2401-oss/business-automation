from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def need(path,*phrases):
    t=(ROOT/path).read_text(encoding='utf-8')
    for p in phrases:
        assert p in t, f'{path}: missing {p}'

need('SKILL.md','global-creative-product-intelligence-r9','REPORT ≠ EVIDENCE / ARTIFACT TRUTH','REQUIREMENT→LOCATION→EVIDENCE / FIDELITY','COMPLETION INTEGRITY FAIL')
need('references/task-specification-delegation.md','Output Diff + Artifact Truth','REQ-ID → EXPECTED OBSERVABLE DELTA → TARGET LOCATION/SCREEN/FILE → VERIFY METHOD → REQUIRED EVIDENCE','CLAIM/REQ-ID → ACTUAL ARTIFACT LOCATION → EVIDENCE/MEASUREMENT → PASS / FAIL / UNKNOWN','COMPLETION INTEGRITY FAIL')
need('references/qa-redteam-release.md','Artifact Truth / Completion Integrity Gate','BEFORE → APPROVED REFERENCE → AFTER','COMPLETION INTEGRITY FAIL')
need('references/work-production-controller.md','A Work/Codex report is not the work product','COMPLETION INTEGRITY FAIL')
need('templates/codex-task.md','TRANSFORMATION MAP: CURRENT → TARGET','REQUIREMENT TRACE: REQ-ID → EXPECTED OBSERVABLE DELTA','FINAL CLAIM LEDGER: CLAIM/REQ-ID → ACTUAL LOCATION → EVIDENCE → PASS/FAIL/UNKNOWN')
need('agents/openai.yaml','Отчёт исполнителя не является evidence','STOPPED_INCOMPLETE')
print('PASS r7 completion integrity')
