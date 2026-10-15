import assert from 'node:assert/strict';
import test from 'node:test';
import { addCheckpoint, createContentRun, routeRequest, transitionRun } from '../runtime/content-factory-runtime.mjs';

test('selected output channel routes to its native lane and requires owner approval', () => {
  const request = { selectedOutput: { channel: 'Telegram' } };
  const route = routeRequest(request);
  assert.deepEqual(route.channels, ['telegram']);
  assert.equal(route.owner_gate_required, true);
  assert.ok(route.lanes.includes('channel_adaptation'));
  assert.ok(route.lanes.includes('owner_gate'));
  assert.ok(route.lanes.includes('publishing'));
  const run = createContentRun({ runId: 'route-regression', requestFingerprint: 'sha256:route', request, now: '2026-10-15T12:00:00.000Z' });
  assert.deepEqual(run.channels, ['telegram']);
  assert.equal(run.owner_gate_required, true);
});

test('content QA can reach owner approval, but cannot continue to publication without scoped authorization', () => {
  const request = { selectedOutput: { channel: 'Telegram' } };
  const run = { ...createContentRun({ runId: 'approval-boundary', requestFingerprint: 'sha256:approval', request, now: '2026-10-15T12:00:00.000Z' }), stage: 'qa' };
  const waiting = transitionRun(run, 'approval', { now: '2026-10-15T12:01:00.000Z' });
  assert.equal(waiting.stage, 'approval');
  assert.throws(() => transitionRun(waiting, 'publication', { idempotencyKey: 'must-not-publish' }), /Valid scoped owner authorization required/);
});

test('selected output with no channel fails closed', () => {
  assert.throws(() => routeRequest({ selectedOutput: { channel: '' }, channels: ['telegram'] }), /missing its required channel/);
});
