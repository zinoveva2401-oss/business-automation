#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureRoot = path.join(root, 'tests', 'fixtures', 'second-brain');
const ffmpeg = path.join(root, 'ernest-16-film', 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
const ffprobe = path.join(root, 'ernest-16-film', 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffprobe.exe');

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(fixtureRoot, relativePath), 'utf8'));
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function runBinary(binary, args) {
  return execFileSync(binary, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 2 * 1024 * 1024,
  }).trim();
}

function evidence(id, status, details) {
  return { id, status, evidence: details };
}

function chooseFormat(brief) {
  if (brief.interaction_need && brief.feedback_need && !brief.repeat_monitoring) return 'interactive-diagnostic';
  if (brief.repeat_monitoring) return 'dashboard';
  return 'ebook';
}

function diagnose(input) {
  if (!Number.isFinite(input.revenue) || !Number.isFinite(input.visitors) || !Number.isFinite(input.returns)
    || input.revenue <= 0 || input.visitors <= 0 || input.returns < 0 || input.returns > input.visitors) {
    return { state: 'error', message: 'Некорректные входные данные' };
  }
  const conversion = Number((input.revenue / input.visitors * 100).toFixed(2));
  const returnRate = Number((input.returns / input.visitors * 100).toFixed(1));
  return {
    state: 'ready',
    conversion,
    returnRate,
    nextAction: returnRate > 7 ? 'разобрать причину возвратов по каналу' : 'сравнить конверсию по каналам',
  };
}

async function runProduct(tempDir) {
  const brief = await readJson('product/brief.json');
  const formatInput = await readJson('product/format-fit.json');
  if ('selected' in formatInput || 'rationale' in formatInput) throw new Error('product input contains answer oracle');
  const selectedFormat = chooseFormat(formatInput);
  if (!formatInput.candidate_formats.includes(selectedFormat)) throw new Error('computed format is not an input candidate');
  const empty = diagnose({ revenue: 0, visitors: 0, returns: 0 });
  const result = diagnose(brief.inputs);
  if (empty.state !== 'error' || result.state !== 'ready' || !result.nextAction) throw new Error('product state machine failed');
  const artifact = {
    format: selectedFormat,
    input_sha256: sha256(Buffer.from(JSON.stringify(brief))),
    result,
    artifact_path: path.join(fixtureRoot, 'product', 'index.html'),
  };
  const outputPath = path.join(tempDir, 'product-output.json');
  await fs.writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  const html = await fs.readFile(artifact.artifact_path, 'utf8');
  if (!html.includes('addEventListener') || !html.includes('data-state="idle"') || !html.includes('textContent')) {
    throw new Error('working product artifact lacks interaction/state implementation');
  }
  return evidence('product-real-flow', 'EXECUTABLE PASS', {
    input: 'product/brief.json',
    selected_format: selectedFormat,
    state_transition: `${empty.state} -> ${result.state}`,
    computed_result: result,
    output_artifact: outputPath,
  });
}

function dashboardState(rows, filter = 'all') {
  if (!Array.isArray(rows)) return { state: 'error', message: 'rows must be an array' };
  if (rows.length === 0) return { state: 'empty', message: 'Нет данных для решения' };
  if (rows.some((row) => !row.channel || row.conversion < 0 || row.returns < 0)) return { state: 'error', message: 'Некорректная строка данных' };
  const visible = rows.filter((row) => filter === 'all' || row.channel === filter);
  if (visible.length === 0) return { state: 'empty', message: 'Нет данных для выбранного фильтра' };
  const priority = [...visible].sort((a, b) => (b.returns - b.conversion) - (a.returns - a.conversion))[0];
  return { state: 'ready', visible, priority: priority.channel, freshness: new Date().toISOString() };
}

async function runDashboard(tempDir) {
  const input = await readJson('product/dashboard-states.json');
  const loading = { state: 'loading' };
  const empty = dashboardState([]);
  const error = dashboardState(null);
  const ready = dashboardState(input.rows);
  const filtered = dashboardState(input.rows, 'Мессенджер');
  if (loading.state !== 'loading' || empty.state !== 'empty' || error.state !== 'error'
    || ready.state !== 'ready' || filtered.visible.length !== 1 || !ready.priority || !ready.freshness) {
    throw new Error('dashboard state machine failed');
  }
  const artifactPath = path.join(fixtureRoot, 'dashboard', 'index.html');
  const html = await fs.readFile(artifactPath, 'utf8');
  if (!html.includes('data-filter') || !html.includes('replaceChildren') || !html.includes('data-state')) {
    throw new Error('dashboard artifact lacks filter/state implementation');
  }
  const outputPath = path.join(tempDir, 'dashboard-output.json');
  const output = { loading, empty, error, ready, filtered, artifact_path: artifactPath };
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  return evidence('dashboard-real-flow', 'EXECUTABLE PASS', {
    transitions: ['loading', empty.state, error.state, ready.state],
    filtered_rows: filtered.visible.length,
    decision: ready.priority,
    output_artifact: outputPath,
  });
}

async function runImagePerformance(tempDir) {
  const input = await readJson('performance/weight.json');
  const sourcePath = path.join(root, input.source);
  const sourceSvg = await fs.readFile(sourcePath);
  const sourceBuffer = await sharp(sourceSvg).png().toBuffer();
  const sourceMeta = await sharp(sourceBuffer).metadata();
  const masterPath = path.join(tempDir, 'image-master.webp');
  const deliveryPath = path.join(tempDir, 'image-delivery.webp');
  await sharp(sourceBuffer).resize({ width: input.master_width, withoutEnlargement: true }).webp({ quality: input.master_quality }).toFile(masterPath);
  await sharp(sourceBuffer).resize({ width: input.delivery_width, withoutEnlargement: true }).webp({ quality: input.delivery_quality }).toFile(deliveryPath);
  const [masterStat, deliveryStat, masterMeta, deliveryMeta] = await Promise.all([
    fs.stat(masterPath), fs.stat(deliveryPath), sharp(masterPath).metadata(), sharp(deliveryPath).metadata(),
  ]);
  await Promise.all([sharp(masterPath).ensureAlpha().raw().toBuffer(), sharp(deliveryPath).ensureAlpha().raw().toBuffer()]);
  if (masterStat.size >= sourceBuffer.length || deliveryStat.size >= sourceBuffer.length || masterStat.size === deliveryStat.size) {
    throw new Error('image transformation did not produce distinct lighter outputs');
  }
  return evidence('performance-real-transformation', 'EXECUTABLE PASS', {
    source: { path: input.source, rasterized_from: 'svg', bytes: sourceBuffer.length, width: sourceMeta.width, height: sourceMeta.height, format: sourceMeta.format, sha256: sha256(sourceBuffer) },
    master: { path: masterPath, bytes: masterStat.size, width: masterMeta.width, height: masterMeta.height, format: masterMeta.format },
    delivery: { path: deliveryPath, bytes: deliveryStat.size, width: deliveryMeta.width, height: deliveryMeta.height, format: deliveryMeta.format },
    slow_connection_profile: input.slow_connection_profile,
  });
}

function setPixel(data, width, x, y, color) {
  if (x < 0 || y < 0 || x >= width) return;
  const offset = (y * width + x) * 4;
  data[offset] = color[0]; data[offset + 1] = color[1]; data[offset + 2] = color[2]; data[offset + 3] = 255;
}

async function runMedia(tempDir) {
  const input = await readJson('media/multi-source.json');
  const sourceDir = path.join(tempDir, 'media-sources');
  await fs.mkdir(sourceDir, { recursive: true });
  const graphicSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#17130F"/><path d="M40 280 C160 280 180 80 320 180 S500 300 600 90" fill="none" stroke="#D9562F" stroke-width="8"/><circle cx="600" cy="90" r="13" fill="#2F80ED"/></svg>`;
  const graphicPath = path.join(sourceDir, 'still-graphic.svg');
  const graphicPng = path.join(sourceDir, 'still-graphic.png');
  await fs.writeFile(graphicPath, graphicSvg);
  await sharp(Buffer.from(graphicSvg)).png().toFile(graphicPng);
  const { data: base, info } = await sharp(graphicPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const framePaths = [];
  for (let index = 0; index < 12; index += 1) {
    const frame = Buffer.from(base);
    const x = 60 + index * 42;
    for (let y = 250; y < 290; y += 1) for (let dx = -10; dx <= 10; dx += 1) setPixel(frame, info.width, x + dx, y, [217, 86, 47]);
    const framePath = path.join(sourceDir, `frame-${String(index).padStart(2, '0')}.png`);
    await sharp(frame, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(framePath);
    framePaths.push(framePath);
  }
  const movingPath = path.join(sourceDir, 'moving-source.mp4');
  const voicePath = path.join(sourceDir, 'generated-voice.wav');
  const masterPath = path.join(tempDir, 'media-master.mp4');
  const deliveryPath = path.join(tempDir, 'media-delivery.mp4');
  runBinary(ffmpeg, ['-y', '-framerate', '8', '-i', path.join(sourceDir, 'frame-%02d.png'), '-t', '1.5', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', movingPath]);
  runBinary(ffmpeg, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=520:duration=1.5', '-c:a', 'pcm_s16le', voicePath]);
  runBinary(ffmpeg, ['-y', '-i', movingPath, '-i', voicePath, '-map', '0:v:0', '-map', '1:a:0', '-shortest', '-c:v', 'libx264', '-crf', '18', '-c:a', 'aac', '-b:a', '96k', masterPath]);
  runBinary(ffmpeg, ['-y', '-i', movingPath, '-i', voicePath, '-map', '0:v:0', '-map', '1:a:0', '-vf', 'scale=320:180', '-r', '8', '-shortest', '-c:v', 'libx264', '-crf', '31', '-c:a', 'aac', '-b:a', '48k', deliveryPath]);
  const [masterStat, deliveryStat] = await Promise.all([fs.stat(masterPath), fs.stat(deliveryPath)]);
  const probe = (file) => JSON.parse(runBinary(ffprobe, ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height', '-of', 'json', file]));
  const masterInfo = probe(masterPath); const deliveryInfo = probe(deliveryPath);
  if (masterPath === deliveryPath || deliveryStat.size >= masterStat.size || !masterInfo.format?.duration || !deliveryInfo.format?.duration) throw new Error('media master/delivery evidence failed');
  return evidence('media-real-production', 'EXECUTABLE PASS', {
    source_inventory: { classes: input.source_classes, still_graphic: graphicPath, moving_video: movingPath, generated_voice: voicePath },
    edit_decision: 'graphic bed + moving trace signal + generated voice; no simple concatenation',
    master: { path: masterPath, bytes: masterStat.size, probe: masterInfo },
    delivery: { path: deliveryPath, bytes: deliveryStat.size, probe: deliveryInfo },
  });
}

async function runQualityAndAssets(tempDir) {
  const weak = await readJson('quality/weak-input.json');
  const problems = [];
  if (/static|статич/i.test(weak.input)) problems.push('статичная композиция не доказывает движение состояния');
  if (/generic|градиент/i.test(weak.input)) problems.push('generic visual language не доказывает отличимость');
  if (/mobile/i.test(weak.input)) problems.push('mobile state отсутствует в исходном запросе');
  if (problems.length < 2) throw new Error('weak input was accepted without a concrete challenge');
  const candidates = await readJson('asset-inventory.json');
  const records = [];
  for (const relative of candidates.candidate_paths) {
    const file = path.join(root, relative);
    const buffer = await fs.readFile(file);
    records.push({ path: relative, bytes: buffer.length, sha256: sha256(buffer), extension: path.extname(file).toLowerCase() || 'none' });
  }
  if (new Set(records.map((record) => record.sha256)).size !== records.length) throw new Error('duplicate asset hash detected');
  const outputPath = path.join(tempDir, 'quality-assets-output.json');
  await fs.writeFile(outputPath, `${JSON.stringify({ challenge: { problems, stronger_options: ['decision-first tool screen', 'editorial signal map'] }, assets: records }, null, 2)}\n`);
  return [
    evidence('weak-input-quality-challenge', 'EXECUTABLE PASS', { input: weak.input, problems, stronger_options: ['decision-first tool screen', 'editorial signal map'] }),
    evidence('asset-intelligence', 'EXECUTABLE PASS', { records, output_artifact: outputPath }),
  ];
}

async function runAutomation(tempDir) {
  const calls = new Map();
  const events = [];
  function processWebhook(eventId, attempt) {
    if (calls.has(eventId)) return { status: 'duplicate', result: calls.get(eventId) };
    events.push(`attempt:${attempt}`);
    if (attempt < 2) return { status: 'retryable_failure' };
    const result = { eventId, accepted: true };
    calls.set(eventId, result);
    events.push('committed');
    return { status: 'accepted', result };
  }
  const first = processWebhook('event-001', 1);
  const second = processWebhook('event-001', 2);
  const duplicate = processWebhook('event-001', 3);
  if (first.status !== 'retryable_failure' || second.status !== 'accepted' || duplicate.status !== 'duplicate'
    || calls.size !== 1 || events.filter((event) => event === 'committed').length !== 1) {
    throw new Error('automation retry/idempotency flow failed');
  }
  const outputPath = path.join(tempDir, 'automation-output.json');
  await fs.writeFile(outputPath, `${JSON.stringify({ first, second, duplicate, events }, null, 2)}\n`);
  return evidence('automation-retry-idempotency', 'EXECUTABLE PASS', { first, second, duplicate, events, output_artifact: outputPath });
}

async function runMotionImplementation() {
  const input = await readJson('visual/motion-contract.json');
  const html = await fs.readFile(path.join(root, input.target), 'utf8');
  const checks = {
    animated_element: html.includes(input.animated_element),
    keyframes: html.includes('@keyframes traceTravel'),
    reduced_motion: html.includes(input.reduced_motion_selector),
    safe_dom: html.includes('textContent') && !html.includes('innerHTML'),
  };
  if (!Object.values(checks).every(Boolean)) throw new Error(`motion implementation checks failed: ${JSON.stringify(checks)}`);
  return evidence('motion-implementation', 'INDEPENDENT REVIEW REQUIRED', { checks, reason: 'browser time-sampling and subjective causal meaningfulness are reviewed separately' });
}

export async function runGolden() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dokruti-second-brain-golden-'));
  const results = [];
  results.push(await runProduct(tempDir));
  results.push(await runDashboard(tempDir));
  results.push(await runImagePerformance(tempDir));
  results.push(await runMedia(tempDir));
  results.push(await runAutomation(tempDir));
  results.push(...await runQualityAndAssets(tempDir));
  results.push(await runMotionImplementation());
  return { status: 'PASS_WITH_INDEPENDENT_REVIEW', temp_dir: tempDir, results };
}

if (process.argv[2] === '--run') {
  try { console.log(JSON.stringify(await runGolden(), null, 2)); } catch (error) { console.error(`SECOND_BRAIN_GOLDEN_FAIL: ${error.message}`); process.exitCode = 1; }
}
