from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def read(rel):
    return (ROOT / rel).read_text('utf-8')

skill = read('SKILL.md')
growth = read('references/growth-execution-operating-system.md')
platform = read('references/platform-intelligence-operations.md')
artifact = read('references/artifact-outcome-executor-graduation.md')
obs = read('references/automation-observability-external-capabilities.md')
content = read('references/marketing-content-engine.md')
site = read('references/site-studio-grade-standard.md')

required_skill = [
    'ARTIFACT OUTCOME EVALS / EXECUTOR GRADUATION',
    'GROWTH PROGRAMMING / WINNER-LOSER LOOP',
    'FOUNDER VOICE CORPUS / VOICE DRIFT',
    'AUTOMATION OBSERVABILITY',
    'EXTERNAL CAPABILITY INTEGRATION',
    'AMPLIFY WINNER OR REPAIR FAILED STAGE',
]
for phrase in required_skill:
    assert phrase in skill, phrase

for phrase in [
    'business target → qualified audience target → required discovery/non-follower reach',
    'Winner Amplifier',
    'Loser Repair Loop',
    'Creative portfolio and fatigue memory',
    'Trend half-life / SHIP-BY',
    'Return, retention and reactivation',
    'Community → Content → Product loop',
    'Collaboration / referral / earned distribution',
    'Club / subscription operating loop',
]:
    assert phrase in growth, phrase

for phrase in ['Dynamic Platform Intelligence Updater', 'Platform-production contract compiler', 'UPDATE-IN-PLACE']:
    assert phrase in platform, phrase

for phrase in ['Artifact outcome evals', 'Graduation / demotion rule', 'Design-before-code for premium surfaces', 'IMPLEMENTER-ONLY']:
    assert phrase in artifact, phrase

for phrase in ['Workflow observability', 'Failure classes', 'Capability route, not vendor dependency', 'Figma-class', 'Remotion-class', 'PostHog-class', 'Postiz-class', 'Activepieces-class']:
    assert phrase in obs, phrase

assert 'Founder Voice Corpus / Voice Drift' in content
assert 'Design-before-code visual freeze' in site

# No magic promises / no second brain install.
for bad in ['guarantee 1000 followers', '100000 followers per day', 'install all external skills as authority']:
    assert bad.lower() not in (skill + growth + obs).lower()

print('PASS r9 FINAL growth execution')
