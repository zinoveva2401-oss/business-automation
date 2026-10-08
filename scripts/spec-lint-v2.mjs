#!/usr/bin/env node

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const VALID_TASK_CLASSES = new Set([
  'PATCH',
  'INTEGRATION',
  'DEVELOPMENT',
  'SYSTEM',
  'RELEASE',
]);

const DELIVERY_CHAIN = [
  'git_diff_status',
  'tests_checks',
  'commit',
  'push',
  'remote_readback',
  'sha_match',
];

const VISUAL_GATES = [
  'real_render',
  'desktop',
  'mobile',
  'visual_review',
];

const PERFORMANCE_GATES = [
  'formats',
  'dimensions',
  'compression',
  'weight_before_after',
  'slow_connection',
];

const ARCHITECTURE_TASK_CLASSES = new Set(['INTEGRATION', 'DEVELOPMENT', 'SYSTEM', 'RELEASE']);
const SOURCE_AUTHORITY = Object.freeze({
  DIRECT_OWNER_INTENT: 100,
  LIVE_BUSINESS_SYSTEM: 80,
  APPROVED_SOURCE: 70,
  REPOSITORY_IMPLEMENTATION: 50,
  HISTORICAL_REFERENCE: 20,
  OPERATIONAL_ASSUMPTION: 10,
});
const CLIENT_FORBIDDEN_INHERITANCE = [
  'DOKRUTI_BRAND',
  'DOKRUTI_CREDENTIALS',
  'DOKRUTI_COMMERCIAL_DATA',
  'DOKRUTI_CUSTOMER_DATA',
  'DOKRUTI_UNPUBLISHED_MATERIAL',
  'OTHER_CLIENT_DATA',
];

function issue(code, message) {
  return { code, message };
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function normalizedPath(value) {
  const parts = String(value)
    .replaceAll('\\', '/')
    .replace(/\/+/g, '/')
    .split('/')
    .filter((part) => part !== '' && part !== '.');
  const resolved = [];
  for (const part of parts) {
    if (part === '..') resolved.pop();
    else resolved.push(part);
  }
  return resolved.join('/').replace(/\/$/, '');
}

function hasText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function hasGate(gates, id) {
  return list(gates).some((gate) => (
    typeof gate === 'string' ? gate === id : gate?.id === id
  ));
}

function isSameOrWithin(child, parent) {
  return child === parent || child.startsWith(`${parent}/`);
}

function checkRepositoryCore(verifiedCoreSha, core, issues) {
  const git = (args) => execFileSync('git', ['-c', `safe.directory=${REPO_ROOT}`, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
  const corePath = '.agents/skills/ai-business-os';
  try {
    git(['cat-file', '-e', `${verifiedCoreSha}^{commit}`]);
  } catch {
    issues.push(issue('core.sha_unavailable', `Verified Core commit is not present in this repository: ${verifiedCoreSha}`));
    return;
  }
  try {
    git(['merge-base', '--is-ancestor', verifiedCoreSha, 'HEAD']);
  } catch {
    issues.push(issue('core.ancestry_unverified', 'The current HEAD does not descend from the verified Core commit'));
  }
  try {
    git(['cat-file', '-e', `${core.branch_core_sha}^{commit}`]);
    git(['merge-base', '--is-ancestor', verifiedCoreSha, core.branch_core_sha]);
    git(['merge-base', '--is-ancestor', core.branch_core_sha, 'HEAD']);
  } catch {
    issues.push(issue('core.branch_sha_unverified', 'The declared branch Core SHA is missing or is not in the current verified lineage'));
  }
  let changedPaths = [];
  try {
    changedPaths = git(['diff', '--name-only', verifiedCoreSha, '--', corePath]).split(/\r?\n/).filter(Boolean).sort();
  } catch {
    issues.push(issue('core.repository_check_failed', 'Could not compare current shared Core with its verified commit'));
  }
  const expectedChanges = list(core.expected_core_changes).map((change) => ({
    path: normalizedPath(change?.path),
    blob_sha: String(change?.blob_sha || ''),
  }));
  const expectedPaths = expectedChanges.map((change) => change.path).sort();
  if (changedPaths.join('\n') !== expectedPaths.join('\n')) {
    issues.push(issue('core.blob_drift', `Shared Core changes do not match the reviewed allowlist. Expected: ${expectedPaths.join(', ') || '(none)'}; actual: ${changedPaths.join(', ') || '(none)'}`));
  }
  for (const change of expectedChanges) {
    if (!change.path || !/^[0-9a-f]{40}$/i.test(change.blob_sha)) {
      issues.push(issue('core.allowlist_invalid', `Expected Core change needs a path and full blob SHA: ${change.path || '(missing path)'}`));
      continue;
    }
    try {
      const actualBlob = git(['hash-object', change.path]);
      if (actualBlob.toLowerCase() !== change.blob_sha.toLowerCase()) {
        issues.push(issue('core.blob_drift', `Shared Core blob differs from the reviewed SHA: ${change.path}`));
      }
    } catch {
      issues.push(issue('core.blob_unavailable', `Could not hash the reviewed shared-Core file: ${change.path}`));
    }
  }
  if (expectedPaths.length > 0 && core.candidate_change_approved !== true) {
    issues.push(issue('core.candidate_not_approved', 'Core delta requires explicit approval and an exact path allowlist'));
  }
  try {
    const untrackedCore = git(['ls-files', '--others', '--exclude-standard', '--', corePath]);
    if (untrackedCore) issues.push(issue('core.untracked_files', `Untracked files exist inside shared Core: ${untrackedCore}`));
  } catch {
    issues.push(issue('core.repository_check_failed', 'Could not inspect untracked shared-Core files'));
  }
}

function hasArchitectureReview(review, issues, verifyRepository = false) {
  const objectKinds = new Set(['project', 'root', 'folder', 'worktree', 'branch', 'repository', 'skill_copy', 'business_os_copy']);
  const ownerDecisions = new Set(['NOT_REQUIRED', 'REQUIRED', 'APPROVED']);
  if (!review || typeof review !== 'object' || Array.isArray(review)) {
    issues.push(issue('architecture.review_missing', 'SYSTEM/DEVELOPMENT/INTEGRATION/RELEASE requires an architecture_review before execution'));
    return;
  }
  if (!Array.isArray(review.canonical_objects_checked) || review.canonical_objects_checked.length === 0
    || !review.canonical_objects_checked.every((entry) => hasText(entry?.name) && typeof entry?.present === 'boolean' && hasText(entry?.evidence))) {
    issues.push(issue('architecture.canonical_object_missing', 'Check and identify the existing canonical object before creating another root'));
  }
  if (!Array.isArray(review.requested_objects)
    || review.requested_objects.some((kind) => !objectKinds.has(kind))) {
    issues.push(issue('architecture.requested_objects_invalid', 'Declare only supported architecture objects, or use an empty array'));
  }
  if (!ownerDecisions.has(review.owner_decision)) {
    issues.push(issue('architecture.owner_decision_missing', 'Record owner_decision as NOT_REQUIRED, REQUIRED or APPROVED'));
  }
  if (review.reuse_assessed !== true) {
    issues.push(issue('architecture.reuse_unchecked', 'Explicitly determine whether the existing object can be reused'));
  }
  if (typeof review.new_object_required !== 'boolean' || typeof review.reuse_possible !== 'boolean') {
    issues.push(issue('architecture.reuse_decision_missing', 'Record reuse_possible and new_object_required as booleans'));
  } else if (review.new_object_required && review.reuse_possible) {
    issues.push(issue('architecture.reuse_conflict', 'A new object cannot be approved while the existing canonical object is reusable'));
  }
  if (list(review.requested_objects).length > 0 && review.new_object_required !== true) {
    issues.push(issue('architecture.object_request_not_justified', 'A requested architecture object must be explicitly justified as required'));
  }
  if (review.new_object_required) {
    if (list(review.requested_objects).length === 0) {
      issues.push(issue('architecture.requested_object_type_missing', 'Name the new object whose necessity is being justified'));
    }
    if (!hasText(review.new_object_justification) || !Array.isArray(review.reuse_blockers)
      || review.reuse_blockers.length === 0 || !review.reuse_blockers.every(hasText)) {
      issues.push(issue('architecture.new_object_unproven', 'A new project/root/worktree/branch/repository/Skill copy requires evidence that reuse is blocked'));
    }
    const largeObject = list(review.requested_objects).some((kind) => (
      ['project', 'folder', 'repository', 'skill_copy', 'business_os_copy'].includes(kind)
    ));
    if (largeObject && review.owner_decision !== 'APPROVED') {
      issues.push(issue('architecture.owner_gate', 'New project/folder/repository/Skill-copy requires explicit owner approval'));
    }
    if (review.owner_decision === 'REQUIRED') {
      issues.push(issue('architecture.owner_gate', 'Owner decision is unresolved; do not create the requested architecture object'));
    }
  }
  if (!Array.isArray(review.evidence) || review.evidence.length === 0 || !review.evidence.every(hasText)) {
    issues.push(issue('architecture.evidence_missing', 'Architecture review needs inspectable evidence, not an unsupported assertion'));
  }

  const core = review.shared_core;
  if (!core || typeof core !== 'object') {
    issues.push(issue('core.review_missing', 'Record verified Core lineage and the update path'));
  } else {
    const sha = /^[0-9a-f]{40}$/i;
    if (!sha.test(String(core.verified_core_sha || '')) || !sha.test(String(core.branch_core_sha || ''))) {
      issues.push(issue('core.sha_missing', 'Verified Core SHA and current branch Core SHA must be full commit IDs'));
    }
    if (core.ancestry_verified !== true) {
      issues.push(issue('core.ancestry_unverified', 'Current branch must prove ancestry from the verified Core before implementation'));
    }
    if (core.blob_parity !== 'PASS') {
      issues.push(issue('core.blob_drift', 'Shared Core blobs differ or have not been checked; reconcile before implementation'));
    }
    if (!hasText(core.update_path)) {
      issues.push(issue('core.update_path_missing', 'State how accepted Core changes reach active domain branches'));
    }
    if (!Array.isArray(core.expected_core_changes) || core.expected_core_changes.some((change) => (
      !change || typeof change !== 'object' || !hasText(change.path) || !/^[0-9a-f]{40}$/i.test(String(change.blob_sha || ''))
    ))) {
      issues.push(issue('core.allowlist_invalid', 'Declare exact shared-Core paths and blob SHAs, or use an empty array'));
    }
    if (typeof core.candidate_change_approved !== 'boolean') {
      issues.push(issue('core.candidate_approval_missing', 'Record whether the exact shared-Core delta has owner approval'));
    }
    if (verifyRepository && sha.test(String(core.verified_core_sha || ''))) {
      checkRepositoryCore(core.verified_core_sha, core, issues);
    }
  }
}

function resolveSourceConflict(evidence) {
  if (!Array.isArray(evidence) || evidence.length === 0) return null;
  return [...evidence].sort((a, b) => {
    const rank = (SOURCE_AUTHORITY[b?.authority] ?? -1) - (SOURCE_AUTHORITY[a?.authority] ?? -1);
    if (rank !== 0) return rank;
    return Date.parse(b?.verified_at || '') - Date.parse(a?.verified_at || '');
  })[0];
}

function checkSourceConflicts(conflicts, issues) {
  list(conflicts).forEach((conflict, index) => {
    const evidence = list(conflict?.evidence);
    if (evidence.some((item) => !Object.hasOwn(SOURCE_AUTHORITY, item?.authority)
      || !hasText(item?.source_id) || !hasText(item?.verified_at)
      || !Number.isFinite(Date.parse(item.verified_at)))) {
      issues.push(issue('source.conflict_rank_invalid', `Source conflict ${index + 1} has unclassified or undated evidence`));
      return;
    }
    const winner = resolveSourceConflict(conflict?.evidence);
    if (!winner || !hasText(winner.source_id)) {
      issues.push(issue('source.conflict_evidence_missing', `Source conflict ${index + 1} has no ranked evidence`));
      return;
    }
    if (conflict?.resolution?.source_id !== winner.source_id || conflict?.resolution?.value !== winner.value) {
      issues.push(issue('source.conflict_wrong_winner', `Source conflict ${index + 1} follows a lower-priority or stale source`));
    }
  });
}

function checkClientContext(mode, context, issues) {
  if (!['DOKRUTI_INTERNAL', 'CLIENT_WORK'].includes(mode)) {
    issues.push(issue('context.mode_missing', 'Select exactly one context_mode: DOKRUTI_INTERNAL or CLIENT_WORK'));
    return;
  }
  if (mode === 'DOKRUTI_INTERNAL') {
    if (context && typeof context === 'object') {
      issues.push(issue('context.mode_conflict', 'DOKRUTI_INTERNAL cannot carry a CLIENT_WORK context'));
    }
    return;
  }
  const client = context;
  if (!client || typeof client !== 'object') {
    issues.push(issue('client.context_missing', 'CLIENT_WORK requires a bound client and order context'));
    return;
  }
  for (const [key, label] of [
    ['client_id', 'client ID'], ['order_id', 'specific order ID'], ['brand_id', 'client brand ID'],
    ['brand_guide_source', 'client brand guide'], ['color_source', 'client color source'],
    ['font_source', 'client font source'], ['separate_storage_scope', 'separate client storage'],
    ['credential_scope', 'client-scoped credentials'],
  ]) {
    if (!hasText(client[key])) issues.push(issue('client.field_missing', `CLIENT_WORK is missing ${label}`));
  }
  for (const key of ['authorized_sources', 'shared_expertise', 'private_source_ids', 'forbidden_inheritance']) {
    if (!Array.isArray(client[key]) || client[key].length === 0) {
      issues.push(issue('client.list_missing', `CLIENT_WORK requires ${key}`));
    }
  }
  if (client.inherit_dokruti_brand !== false || client.inherit_dokruti_secrets !== false || client.mix_client_data !== false) {
    issues.push(issue('client.isolation_failed', 'CLIENT_WORK must explicitly forbid DOKRUTI inheritance and client-data mixing'));
  }
  const denied = new Set(list(client.forbidden_inheritance));
  for (const item of CLIENT_FORBIDDEN_INHERITANCE) {
    if (!denied.has(item)) issues.push(issue('client.inheritance_not_denied', `CLIENT_WORK must forbid ${item}`));
  }
}

function checkClientPairIsolation(contexts) {
  const issues = [];
  if (!Array.isArray(contexts) || contexts.length !== 2) {
    return { status: 'FAIL', issues: [issue('client.pair_fixture_invalid', 'Pair isolation check requires exactly two synthetic client contexts')] };
  }
  const [a, b] = contexts;
  for (const context of contexts) checkClientContext('CLIENT_WORK', context, issues);
  for (const [key, label] of [
    ['client_id', 'client identity'], ['order_id', 'order'], ['brand_id', 'brand'],
    ['brand_guide_source', 'brand guide'],
    ['separate_storage_scope', 'storage'], ['credential_scope', 'credentials'],
  ]) {
    if (!hasText(a?.[key]) || !hasText(b?.[key]) || a[key] === b[key]) {
      issues.push(issue('client.pair_collision', `Two clients share or omit their ${label} boundary`));
    }
  }
  const privateA = new Set(list(a?.private_source_ids));
  const privateB = new Set(list(b?.private_source_ids));
  const authorizedA = new Set(list(a?.authorized_sources));
  const authorizedB = new Set(list(b?.authorized_sources));
  if ([...privateA].some((source) => privateB.has(source) || authorizedB.has(source))
    || [...privateB].some((source) => authorizedA.has(source))) {
    issues.push(issue('client.private_source_collision', 'Private sources must not cross client boundaries'));
  }
  const skillsA = new Set(list(a?.shared_expertise));
  if (list(b?.shared_expertise).some((skill) => !skillsA.has(skill))) {
    issues.push(issue('client.shared_core_drift', 'Both client contexts must draw from the shared professional Core'));
  }
  return { status: issues.length === 0 ? 'PASS' : 'FAIL', issues };
}

function pathConflicts(requiredPaths, forbiddenPaths) {
  const conflicts = [];
  for (const required of requiredPaths) {
    for (const forbidden of forbiddenPaths) {
      if (isSameOrWithin(required, forbidden) || isSameOrWithin(forbidden, required)) {
        conflicts.push({ required, forbidden });
      }
    }
  }
  return conflicts;
}

function checkTaskPacket(packet, { verifyRepository = false } = {}) {
  const issues = [];
  if (!packet || typeof packet !== 'object') {
    return { status: 'FAIL', issues: [issue('packet.missing', 'Task packet is missing')] };
  }

  if (!hasText(packet.task_class) || !VALID_TASK_CLASSES.has(packet.task_class)) {
    issues.push(issue('packet.task_class', 'Valid task_class is required'));
  }

  if (ARCHITECTURE_TASK_CLASSES.has(packet.task_class)) {
    hasArchitectureReview(packet.architecture_review, issues, verifyRepository);
  }
  checkClientContext(packet.context_mode, packet.client_context, issues);
  checkSourceConflicts(packet.source_conflicts, issues);

  const requiredPaths = list(packet.required_paths).map(normalizedPath);
  const forbiddenPaths = list(packet.forbidden_paths).map(normalizedPath);
  const conflicts = pathConflicts(requiredPaths, forbiddenPaths);
  if (conflicts.length > 0) {
    issues.push(issue(
      'constraints.path_scope_conflict',
      `Required and forbidden paths overlap or nest: ${conflicts.map(({ required, forbidden }) => `${required} <> ${forbidden}`).join(', ')}`,
    ));
  }

  if (list(packet.contradictory_constraints).length > 0) {
    issues.push(issue('constraints.contradiction', 'Contradictory constraints are unresolved'));
  }

  if (!list(packet.source_of_truth).some(hasText)) {
    issues.push(issue('source.missing', 'At least one source_of_truth is required'));
  }

  const acceptance = list(packet.acceptance);
  if (acceptance.length === 0) {
    issues.push(issue('acceptance.missing', 'Acceptance criteria are required'));
  } else {
    acceptance.forEach((criterion, index) => {
      if (!hasText(criterion?.id)) {
        issues.push(issue('acceptance.id', `Acceptance criterion ${index + 1} has no id`));
      }
      if (!hasText(criterion?.evidence)) {
        issues.push(issue('evidence.missing', `Acceptance criterion ${index + 1} has no evidence requirement`));
      }
    });
  }

  const capabilities = list(packet.required_capabilities);
  capabilities.forEach((capability) => {
    if (!hasText(capability?.name)) {
      issues.push(issue('capability.name', 'Required capability has no name'));
    } else if (capability.status !== 'VERIFIED') {
      issues.push(issue(
        'capability.unverified',
        `Required capability is not VERIFIED: ${capability.name}`,
      ));
    }
  });

  const readOnly = packet.read_only === true || packet.no_delivery === true;
  const externalWriteProhibited = packet.external_write_prohibited === true;
  const trackedDelta = packet.tracked_file_delta === true;
  if (packet.production_changes_allowed === false) {
    const productionRoots = list(packet.production_roots).map(normalizedPath);
    for (const required of requiredPaths) {
      if (productionRoots.some((root) => isSameOrWithin(required, root))) {
        issues.push(issue(
          'semantic.production_scope_conflict',
          `Production changes are forbidden but required path is inside production root: ${required}`,
        ));
      }
    }
  }
  if (packet.installation_allowed === false) {
    for (const dependency of list(packet.required_dependencies)) {
      const alternatives = list(dependency?.alternatives);
      const hasVerifiedAlternative = alternatives.some((alternative) => alternative?.status === 'VERIFIED');
      if (dependency?.status === 'MISSING' && !hasVerifiedAlternative) {
        issues.push(issue(
          'semantic.installation_conflict',
          `Installation is forbidden and unavailable dependency has no VERIFIED alternative: ${dependency.name || 'unnamed'}`,
        ));
      }
    }
  }
  if (externalWriteProhibited && trackedDelta && packet.delivery_required === true) {
    issues.push(issue(
      'semantic.external_delivery_conflict',
      'External write is prohibited while tracked delivery is required',
    ));
  }
  if (trackedDelta && !readOnly && !externalWriteProhibited) {
    if (packet.delivery_required === false) {
      issues.push(issue('delivery.disabled', 'Tracked-file delivery cannot be disabled for a non-read-only delta'));
    }
    const delivery = list(packet.delivery_chain);
    DELIVERY_CHAIN.forEach((gate) => {
      if (!delivery.includes(gate)) {
        issues.push(issue('delivery.missing', `Tracked-file delivery is missing gate: ${gate}`));
      }
    });
  }

  if (packet.visual_required === true) {
    VISUAL_GATES.forEach((gate) => {
      if (!hasGate(packet.visual_qa, gate)) {
        issues.push(issue('visual.missing', `Visual task is missing gate: ${gate}`));
      }
    });
  }

  if (packet.performance_sensitive === true) {
    PERFORMANCE_GATES.forEach((gate) => {
      if (!hasGate(packet.performance_gate, gate)) {
        issues.push(issue('performance.missing', `Performance task is missing gate: ${gate}`));
      }
    });
  }

  if (list(packet.paid_dependencies).length > 0) {
    if (packet.owner_gate?.paid_approved !== true) {
      issues.push(issue('owner_gate.paid', 'Paid dependency requires explicit owner approval'));
    }
  }

  const irreversible = list(packet.irreversible_external_actions);
  if (irreversible.length > 0 && packet.owner_gate?.external_actions_approved !== true) {
    issues.push(issue(
      'owner_gate.external',
      'Irreversible external action requires explicit owner approval',
    ));
  }

  if (packet.quality_challenge_required === true && packet.quality_challenge?.status !== 'PASS') {
    issues.push(issue('quality_challenge.missing', 'Weak-input quality challenge is not evidenced'));
  }

  return { status: issues.length === 0 ? 'PASS' : 'FAIL', issues };
}

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function expectFail(label, packet) {
  const result = checkTaskPacket(packet);
  if (result.status !== 'FAIL') {
    throw new Error(`SPEC_LINT_SELF_TEST_FAIL: ${label} was accepted`);
  }
}

function expectIssue(label, packet, code) {
  const result = checkTaskPacket(packet);
  if (result.status !== 'FAIL' || !result.issues.some((entry) => entry.code === code)) {
    throw new Error(`SPEC_LINT_SELF_TEST_FAIL: ${label} did not raise ${code}`);
  }
}

function validPacket() {
  return {
    task_class: 'SYSTEM',
    context_mode: 'DOKRUTI_INTERNAL',
    architecture_review: {
      canonical_objects_checked: [{ name: 'business-automation', present: true, evidence: 'git worktree list --porcelain' }],
      reuse_assessed: true,
      reuse_possible: true,
      new_object_required: false,
      requested_objects: [],
      owner_decision: 'NOT_REQUIRED',
      evidence: ['live Business System verified Core SHA', 'git merge-base and shared Core blob hashes'],
      shared_core: {
        verified_core_sha: '415b4634b6600c7657c60feee1f798f65889debf',
        branch_core_sha: 'e0ac9c53e20b9f2f08a766ce3e6559f73bb7d067',
        ancestry_verified: true,
        blob_parity: 'PASS',
        expected_core_changes: [
          { path: '.agents/skills/ai-business-os/references/architect-supervisor-gate.md', blob_sha: '4878d519b38d7da7e26b7de96d1d99b7e4f10cc4' },
          { path: '.agents/skills/ai-business-os/references/client-work-boundary.md', blob_sha: 'c3df97ffd2dad9fd3fe95af058a9db4480518316' },
          { path: '.agents/skills/ai-business-os/references/task-specification-delegation.md', blob_sha: '91e2db8b2b0b41d637cba6793602947c333df602' },
          { path: '.agents/skills/ai-business-os/tests/test_v211_core_gates.py', blob_sha: '08e4d53bbeaac4fe5cbbe5f44829dcb7844a14d4' },
        ],
        candidate_change_approved: true,
        update_path: 'scoped changes through canonical trunk, then tested merges into domain branches',
      },
    },
    required_paths: ['scripts/spec-lint-v2.mjs'],
    forbidden_paths: ['src/', 'public/'],
    source_of_truth: ['owner task packet', 'AGENTS.md'],
    acceptance: [{ id: 'scope', evidence: 'post-work diff and status' }],
    required_capabilities: [{ name: 'node', status: 'VERIFIED' }],
    tracked_file_delta: true,
    delivery_required: true,
    delivery_chain: DELIVERY_CHAIN,
    visual_required: false,
    performance_sensitive: false,
    paid_dependencies: [],
    irreversible_external_actions: [],
    owner_gate: {},
    quality_challenge_required: false,
  };
}

function selfTest() {
  const valid = validPacket();
  if (checkTaskPacket(valid).status !== 'PASS') {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: valid fixture was blocked');
  }
  if (checkTaskPacket(valid, { verifyRepository: true }).status !== 'PASS') {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: actual shared-Core blob allowlist did not match this checkout');
  }
  if (checkTaskPacket({ ...valid, delivery_required: undefined }).status !== 'PASS') {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: omitted delivery_required was not defaulted to mandatory');
  }
  expectFail('explicitly disabled delivery', { ...valid, delivery_required: false });

  expectFail('required/forbidden overlap', {
    ...valid,
    required_paths: ['src\\index.astro'],
    forbidden_paths: ['./src/index.astro'],
  });
  expectFail('forbidden parent and required child', {
    ...valid,
    required_paths: ['src/a.ts'],
    forbidden_paths: ['src/'],
  });
  expectFail('required parent and forbidden child', {
    ...valid,
    required_paths: ['src/'],
    forbidden_paths: ['src/a.ts'],
  });
  expectFail('production semantic conflict', {
    ...valid,
    required_paths: ['src/a.ts'],
    production_changes_allowed: false,
    production_roots: ['src/'],
  });
  expectFail('installation semantic conflict', {
    ...valid,
    installation_allowed: false,
    required_dependencies: [{ name: 'missing-tool', status: 'MISSING', alternatives: [] }],
  });
  expectFail('external delivery semantic conflict', {
    ...valid,
    external_write_prohibited: true,
    delivery_required: true,
  });
  expectFail('missing source of truth', { ...valid, source_of_truth: [] });
  expectFail('missing capability', {
    ...valid,
    required_capabilities: [{ name: 'ffmpeg', status: 'MISSING' }],
  });
  expectFail('missing delivery gate', {
    ...valid,
    delivery_chain: DELIVERY_CHAIN.filter((gate) => gate !== 'push'),
  });
  expectFail('visual without mobile', {
    ...valid,
    visual_required: true,
    visual_qa: ['real_render', 'desktop', 'visual_review'],
  });
  expectFail('paid dependency without owner gate', {
    ...valid,
    paid_dependencies: ['paid-service'],
  });
  expectFail('weak input without challenge', {
    ...valid,
    quality_challenge_required: true,
  });

  const badRoot = { ...valid, owner_request: 'Создай ещё одну папку и копию Business OS для Content Factory' };
  delete badRoot.architecture_review;
  expectIssue('new root without reuse review', badRoot, 'architecture.review_missing');
  expectIssue('new project despite reusable canonical object', {
    ...valid,
    architecture_review: {
      ...valid.architecture_review,
      requested_objects: ['project', 'folder'],
      new_object_required: true,
      reuse_possible: true,
      new_object_justification: 'need to mimic Product',
      reuse_blockers: ['not supplied'],
      owner_decision: 'APPROVED',
    },
  }, 'architecture.reuse_conflict');
  expectIssue('new object omitted from required-object decision', {
    ...valid,
    architecture_review: { ...valid.architecture_review, requested_objects: ['folder'] },
  }, 'architecture.object_request_not_justified');
  expectIssue('new project without owner approval', {
    ...valid,
    architecture_review: {
      ...valid.architecture_review,
      requested_objects: ['project'],
      new_object_required: true,
      reuse_possible: false,
      new_object_justification: 'verified platform boundary',
      reuse_blockers: ['verified incompatible permissions'],
      owner_decision: 'REQUIRED',
    },
  }, 'architecture.owner_gate');
  expectIssue('divergent shared Core', {
    ...valid,
    architecture_review: {
      ...valid.architecture_review,
      shared_core: { ...valid.architecture_review.shared_core, branch_core_sha: 'b'.repeat(40), blob_parity: 'MISMATCH' },
    },
  }, 'core.blob_drift');
  const changedCoreHash = structuredClone(valid);
  changedCoreHash.architecture_review.shared_core.expected_core_changes[0].blob_sha = 'f'.repeat(40);
  const actualBlobDrift = checkTaskPacket(changedCoreHash, { verifyRepository: true });
  if (actualBlobDrift.status !== 'FAIL' || !actualBlobDrift.issues.some((entry) => entry.code === 'core.blob_drift')) {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: actual shared-Core blob mismatch was not detected');
  }

  const ownerVsTable = {
    ...valid,
    source_conflicts: [{
      fact: 'reuse existing Content project',
      evidence: [
        { source_id: 'owner-this-run', authority: 'DIRECT_OWNER_INTENT', value: 'reuse-existing', verified_at: '2026-10-08T10:00:00Z' },
        { source_id: 'old-operational-row', authority: 'OPERATIONAL_ASSUMPTION', value: 'create-new-root', verified_at: '2026-10-08T11:00:00Z' },
      ],
      resolution: { source_id: 'owner-this-run', value: 'reuse-existing' },
    }],
  };
  if (checkTaskPacket(ownerVsTable).status !== 'PASS') {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: current owner intent did not override stale operational assumption');
  }
  expectIssue('stale operational assumption wins over owner', {
    ...ownerVsTable,
    source_conflicts: [{ ...ownerVsTable.source_conflicts[0], resolution: { source_id: 'old-operational-row', value: 'create-new-root' } }],
  }, 'source.conflict_wrong_winner');

  const forbiddenInheritance = [
    'DOKRUTI_BRAND', 'DOKRUTI_CREDENTIALS', 'DOKRUTI_COMMERCIAL_DATA',
    'DOKRUTI_CUSTOMER_DATA', 'DOKRUTI_UNPUBLISHED_MATERIAL', 'OTHER_CLIENT_DATA',
  ];
  const clientA = {
    client_id: 'CLIENT-A', order_id: 'ORDER-A', brand_id: 'BRAND-A',
    brand_guide_source: 'A brand guide', color_source: 'A colors', font_source: 'A fonts',
    authorized_sources: ['A brief'], private_source_ids: ['A brief'], shared_expertise: ['marketing', 'legal'],
    separate_storage_scope: 'client-a-vault', credential_scope: 'client-a-credentials',
    inherit_dokruti_brand: false, inherit_dokruti_secrets: false, mix_client_data: false,
    forbidden_inheritance: forbiddenInheritance,
  };
  const clientB = {
    ...clientA, client_id: 'CLIENT-B', order_id: 'ORDER-B', brand_id: 'BRAND-B',
    brand_guide_source: 'B brand guide', color_source: 'B colors', font_source: 'B fonts',
    authorized_sources: ['B brief'], private_source_ids: ['B brief'],
    separate_storage_scope: 'client-b-vault', credential_scope: 'client-b-credentials',
  };
  const clientPacket = { ...valid, context_mode: 'CLIENT_WORK', client_context: clientA };
  if (checkTaskPacket(clientPacket).status !== 'PASS' || checkClientPairIsolation([clientA, clientB]).status !== 'PASS') {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: isolated CLIENT_WORK contexts were rejected');
  }
  const mixedClientB = { ...clientB, separate_storage_scope: clientA.separate_storage_scope, private_source_ids: ['A brief'] };
  const mixed = checkClientPairIsolation([clientA, mixedClientB]);
  if (mixed.status !== 'FAIL' || !mixed.issues.some((entry) => entry.code === 'client.pair_collision')
    || !mixed.issues.some((entry) => entry.code === 'client.private_source_collision')) {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: mixed client data was not rejected');
  }
  const crossAuthorized = checkClientPairIsolation([clientA, { ...clientB, authorized_sources: ['A brief'] }]);
  if (crossAuthorized.status !== 'FAIL' || !crossAuthorized.issues.some((entry) => entry.code === 'client.private_source_collision')) {
    throw new Error('SPEC_LINT_SELF_TEST_FAIL: private source in the other client allowlist was not rejected');
  }

  return 'SPEC_LINT_SELF_TEST_PASS: architecture reuse/core lineage, owner-vs-stale-source, client isolation, contradictions, capabilities and owner gates enforced';
}

if (process.argv[2] === '--self-test') {
  try {
    console.log(selfTest());
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
} else {
  const packetPath = process.argv[2];
  if (!packetPath) {
    console.error('Usage: node scripts/spec-lint-v2.mjs <task-packet.json> | --self-test');
    process.exitCode = 2;
  } else {
    try {
      const result = checkTaskPacket(loadJson(packetPath), { verifyRepository: true });
      console.log(JSON.stringify(result, null, 2));
      if (result.status !== 'PASS') process.exitCode = 1;
    } catch (error) {
      console.error(`SPEC_LINT_ERROR: ${error.message}`);
      process.exitCode = 1;
    }
  }
}

export {
  DELIVERY_CHAIN,
  VISUAL_GATES,
  PERFORMANCE_GATES,
  checkTaskPacket,
  checkClientPairIsolation,
  resolveSourceConflict,
};
