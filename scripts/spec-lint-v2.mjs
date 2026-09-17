#!/usr/bin/env node

import fs from 'node:fs';

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

function issue(code, message) {
  return { code, message };
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function normalizedPath(value) {
  return String(value).replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '');
}

function hasText(value) {
  return typeof value === 'string' && value.trim() !== '';
}

function hasGate(gates, id) {
  return list(gates).some((gate) => (
    typeof gate === 'string' ? gate === id : gate?.id === id
  ));
}

function checkTaskPacket(packet) {
  const issues = [];
  if (!packet || typeof packet !== 'object') {
    return { status: 'FAIL', issues: [issue('packet.missing', 'Task packet is missing')] };
  }

  if (!hasText(packet.task_class) || !VALID_TASK_CLASSES.has(packet.task_class)) {
    issues.push(issue('packet.task_class', 'Valid task_class is required'));
  }

  const requiredPaths = list(packet.required_paths).map(normalizedPath);
  const forbiddenPaths = list(packet.forbidden_paths).map(normalizedPath);
  const overlap = requiredPaths.filter((path) => forbiddenPaths.includes(path));
  if (overlap.length > 0) {
    issues.push(issue('constraints.overlap', `Required and forbidden paths overlap: ${overlap.join(', ')}`));
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
  if (trackedDelta && !readOnly && !externalWriteProhibited) {
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

function validPacket() {
  return {
    task_class: 'SYSTEM',
    required_paths: ['scripts/spec-lint-v2.mjs'],
    forbidden_paths: ['src/', 'public/'],
    source_of_truth: ['owner task packet', 'AGENTS.md'],
    acceptance: [{ id: 'scope', evidence: 'post-work diff and status' }],
    required_capabilities: [{ name: 'node', status: 'VERIFIED' }],
    tracked_file_delta: true,
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

  expectFail('required/forbidden overlap', {
    ...valid,
    required_paths: ['src\\index.astro'],
    forbidden_paths: ['./src/index.astro'],
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

  return 'SPEC_LINT_SELF_TEST_PASS: contradictions, gates, capability and owner rules enforced';
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
      const result = checkTaskPacket(loadJson(packetPath));
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
};
