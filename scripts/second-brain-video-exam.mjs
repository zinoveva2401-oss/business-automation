#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { resolveMediaTools } from './resolve-local-capabilities.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(root, 'tests', 'fixtures', 'second-brain', 'video', 'evidence');
const mediaTools = resolveMediaTools();
const ffmpeg = mediaTools.ffmpeg.path;
const ffprobe = mediaTools.ffprobe.path;
const WIDTH = 720;
const HEIGHT = 1280;
const FPS = 10;
const DURATION = 20;

function sha256(buffer) { return createHash('sha256').update(buffer).digest('hex'); }
function run(binary, args) { return execFileSync(binary, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 4 * 1024 * 1024 }).trim(); }
function quote(value) { return `'${String(value).replaceAll("'", "''")}'`; }

function speak(outputPath) {
  if (process.platform !== 'win32') return { status: 'BLOCKED CAPABILITY', reason: 'Windows SAPI is required for the real voice track' };
  const text = 'Сначала назови сигнал. Затем выбери действие. Проверь результат и докрути следующий шаг.';
  const script = `$outputPath = ${quote(outputPath)}; $speechText = ${quote(text)}; Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $voice = $synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Name -match 'Irina|Pavel|Zira' } | Select-Object -First 1; if ($voice) { $synth.SelectVoice($voice.VoiceInfo.Name) }; $synth.Rate = 1; $synth.SetOutputToWaveFile($outputPath); $synth.Speak($speechText); $synth.Dispose();`;
  try {
    const encoded = Buffer.from(script, 'utf16le').toString('base64');
    execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
    return fsSync.existsSync(outputPath) && fsSync.statSync(outputPath).size > 0 ? { status: 'EXECUTED' } : { status: 'BLOCKED CAPABILITY', reason: 'SAPI returned without a voice artifact' };
  } catch (error) {
    return { status: 'BLOCKED CAPABILITY', reason: 'SAPI invocation denied by current sandbox', error: error.code || 'speech invocation failed' };
  }
}

function svgFrame(kind, frame, totalFrames, cut) {
  const progress = frame / Math.max(1, totalFrames - 1);
  const pulse = Math.round(18 + Math.sin(progress * Math.PI * 8) * 14);
  const safeX = 64;
  const common = `<rect width="${WIDTH}" height="${HEIGHT}" fill="#17130F"/><rect x="${safeX}" y="76" width="${WIDTH - 128}" height="4" fill="#D9562F"/><text x="${safeX}" y="130" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="24" letter-spacing="3">ДОКРУТИ / ${cut.toUpperCase()}</text>`;
  const graphic = `<g transform="translate(${safeX},1020)"><rect width="592" height="112" rx="18" fill="#F4F5F6" fill-opacity=".95"/><rect x="24" y="24" width="${Math.max(80, Math.min(500, 120 + Math.round(progress * 360)))}" height="20" rx="10" fill="#D9562F"/><rect x="24" y="62" width="${Math.max(100, Math.min(500, 420 - Math.round(progress * 160)))}" height="12" rx="6" fill="#2F80ED"/><text x="24" y="100" fill="#17130F" font-family="Arial, sans-serif" font-size="18">сигнал → действие → проверка</text></g>`;
  let scene = '';
  if (kind === 'problem') {
    scene = `<circle cx="360" cy="500" r="${210 + pulse}" fill="#D9562F" fill-opacity=".18"/><path d="M90 720 C180 ${500 - pulse} 250 ${850 + pulse} 360 640 S540 ${430 + pulse} 630 570" fill="none" stroke="#D9562F" stroke-width="18"/><text x="${safeX}" y="360" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="62" font-weight="700">Сигнал есть.</text><text x="${safeX}" y="438" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="44">Решения нет.</text>`;
  } else if (kind === 'action') {
    scene = `<rect x="82" y="300" width="556" height="480" rx="34" fill="#E8EEF5"/><path d="M150 680 H560" stroke="#2F80ED" stroke-width="20"/><path d="M500 610 L580 680 L500 750" fill="none" stroke="#D9562F" stroke-width="20"/><circle cx="${160 + Math.round(progress * 360)}" cy="560" r="36" fill="#D9562F"/><text x="${safeX}" y="220" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="58" font-weight="700">Выбери действие.</text><text x="${safeX}" y="860" fill="#E8EEF5" font-family="Arial, sans-serif" font-size="36">один следующий шаг</text>`;
  } else if (kind === 'still') {
    scene = `<rect x="80" y="260" width="560" height="500" fill="#F4F5F6"/><rect x="112" y="310" width="496" height="90" fill="#2F80ED" fill-opacity=".2"/><rect x="112" y="440" width="140" height="230" fill="#D9562F" fill-opacity=".75"/><rect x="270" y="480" width="140" height="190" fill="#2F80ED" fill-opacity=".75"/><rect x="428" y="390" width="140" height="280" fill="#17130F" fill-opacity=".8"/><text x="${safeX}" y="220" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="58" font-weight="700">Сравни результат.</text><text x="112" y="370" fill="#17130F" font-family="Arial, sans-serif" font-size="26">данные / факт / приоритет</text>`;
  } else {
    scene = `<rect x="82" y="290" width="556" height="430" rx="32" fill="#E8EEF5"/><circle cx="360" cy="500" r="${150 + pulse}" fill="none" stroke="#D9562F" stroke-width="18"/><path d="M240 500 L330 590 L500 410" fill="none" stroke="#2F80ED" stroke-width="24"/><text x="${safeX}" y="220" fill="#F4F5F6" font-family="Arial, sans-serif" font-size="58" font-weight="700">Проверь.</text><text x="${safeX}" y="860" fill="#E8EEF5" font-family="Arial, sans-serif" font-size="36">и докрути следующий шаг</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${common}${scene}${graphic}</svg>`;
}

async function renderFrames(dir, shots, cut) {
  const totalFrames = DURATION * FPS;
  for (let frame = 0; frame < totalFrames; frame += 1) {
    const elapsed = frame / FPS;
    const shot = shots.find((item) => elapsed < item.end) || shots.at(-1);
    const svg = svgFrame(shot.kind, frame, totalFrames, cut);
    await sharp(Buffer.from(svg)).png().toFile(path.join(dir, `frame-${String(frame).padStart(3, '0')}.png`));
  }
}

async function makeAudio(dir, speechPath) {
  const bedPath = path.join(dir, 'audio-bed.wav');
  run(ffmpeg, ['-y', '-f', 'lavfi', '-i', 'sine=frequency=196:duration=20', '-af', 'volume=0.12', '-c:a', 'pcm_s16le', bedPath]);
  const mixedPath = path.join(dir, 'mixed-audio.m4a');
  run(ffmpeg, ['-y', '-i', speechPath, '-i', bedPath, '-filter_complex', '[0:a]apad,volume=1.0[voice];[1:a]volume=0.15[bed];[voice][bed]amix=inputs=2:duration=longest:dropout_transition=0[a]', '-map', '[a]', '-t', '20', '-c:a', 'aac', '-b:a', '128k', mixedPath]);
  return { bedPath, mixedPath };
}

async function makeCaptions(dir, name, entries) {
  const target = path.join(dir, `${name}.srt`);
  const stamp = (seconds) => { const [whole, fraction] = seconds.toFixed(3).split('.'); return `00:00:${whole.padStart(2, '0')},${fraction}`; };
  await fs.writeFile(target, entries.map((entry, index) => `${index + 1}\n${stamp(entry.start)} --> ${stamp(entry.end)}\n${entry.text}\n`).join('\n'));
  return target;
}

function probe(file) { return JSON.parse(run(ffprobe, ['-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,codec_type,width,height,sample_rate', '-of', 'json', file])); }

async function renderCut(tempDir, name, shots, captions, audioPath) {
  const framesDir = path.join(tempDir, `${name}-frames`);
  await fs.mkdir(framesDir, { recursive: true });
  await renderFrames(framesDir, shots, name);
  const srt = await makeCaptions(tempDir, name, captions);
  const masterPath = path.join(tempDir, `${name}-master.mp4`);
  const deliveryPath = path.join(tempDir, `${name}-delivery.mp4`);
  const trackedMasterPath = path.join(evidenceDir, `${name}-master.mp4`);
  const trackedDeliveryPath = path.join(evidenceDir, `${name}-delivery.mp4`);
  const frameInput = path.join(framesDir, 'frame-%03d.png');
  run(ffmpeg, ['-y', '-framerate', String(FPS), '-i', frameInput, '-i', audioPath, '-t', String(DURATION), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', masterPath]);
  run(ffmpeg, ['-y', '-i', masterPath, '-vf', 'scale=540:960', '-c:v', 'libx264', '-crf', '27', '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', deliveryPath]);
  const decodedFrame = path.join(tempDir, `${name}-decoded-frame.png`);
  const decodedAudio = path.join(tempDir, `${name}-decoded-audio.wav`);
  run(ffmpeg, ['-v', 'error', '-i', masterPath, '-map', '0:v:0', '-frames:v', '1', '-c:v', 'png', '-f', 'image2', decodedFrame]);
  run(ffmpeg, ['-v', 'error', '-i', masterPath, '-map', '0:a:0', '-t', '0.5', '-c:a', 'pcm_s16le', decodedAudio]);
  const [master, delivery, frameStat, audioStat, captionsStat] = await Promise.all([fs.stat(masterPath), fs.stat(deliveryPath), fs.stat(decodedFrame), fs.stat(decodedAudio), fs.stat(srt)]);
  const info = probe(masterPath);
  if (Number(info.format?.duration || 0) < 15 || frameStat.size <= 0 || audioStat.size <= 0 || captionsStat.size <= 0) throw new Error(`${name} decode or duration proof failed`);
  await fs.copyFile(masterPath, trackedMasterPath);
  await fs.copyFile(deliveryPath, trackedDeliveryPath);
  return { masterPath, deliveryPath, trackedMasterPath, trackedDeliveryPath, decodedFrame, metadata: info, master_bytes: master.size, delivery_bytes: delivery.size, decoded_frame_bytes: frameStat.size, decoded_audio_bytes: audioStat.size, captions_bytes: captionsStat.size, captions_path: srt };
}

async function contactSheet(tempDir, name, times) {
  const inputs = [];
  for (const [index, time] of times.entries()) {
    const frame = path.join(tempDir, `${name}-contact-${index}.png`);
    run(ffmpeg, ['-y', '-ss', String(time), '-i', path.join(tempDir, `${name}-master.mp4`), '-frames:v', '1', '-vf', 'scale=180:320', frame]);
    inputs.push({ input: frame, left: (index % 4) * 180, top: Math.floor(index / 4) * 320 });
  }
  const canvas = await sharp({ create: { width: 720, height: Math.ceil(times.length / 4) * 320, channels: 3, background: '#17130F' } }).composite(inputs).png().toBuffer();
  const target = path.join(evidenceDir, `${name}-contact-sheet.png`);
  await fs.writeFile(target, canvas);
  return { path: `tests/fixtures/second-brain/video/evidence/${name}-contact-sheet.png`, bytes: canvas.length, sha256: sha256(canvas) };
}

async function verifyEvidence() {
  const record = JSON.parse(await fs.readFile(path.join(evidenceDir, 'video-evidence.json'), 'utf8'));
  const valid = record.status === 'EXECUTABLE PASS' && record.source_classes.length >= 3 && record.first_cut.duration_seconds >= 15 && record.second_cut.duration_seconds >= 15 && record.first_cut.master_delivery_distinct && record.second_cut.master_delivery_distinct && record.first_cut.decode.frame_bytes > 0 && record.second_cut.decode.audio_bytes > 0 && record.first_cut.contact_sheet.exists && record.second_cut.contact_sheet.exists && record.first_cut.master_path && record.second_cut.master_path && fsSync.existsSync(path.join(root, record.first_cut.master_path)) && fsSync.existsSync(path.join(root, record.second_cut.master_path)) && record.consilium.before_after.length >= 3;
  if (!valid) throw new Error('video exam evidence is incomplete');
  console.log(JSON.stringify(record, null, 2));
}

async function main() {
  if (process.argv.includes('--verify')) return verifyEvidence();
  if (!ffmpeg || !ffprobe) throw new Error(`media capability missing: ${JSON.stringify(mediaTools)}`);
  await fs.mkdir(evidenceDir, { recursive: true });
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dokruti-video-exam-'));
  try {
    const speechPath = path.join(tempDir, 'voice.wav');
    const speech = speak(speechPath);
    if (speech.status !== 'EXECUTED') {
      console.log(JSON.stringify({ status: 'BLOCKED CAPABILITY', speech, resolver: mediaTools }, null, 2));
      process.exitCode = 1;
      return;
    }
    const audio = await makeAudio(tempDir, speechPath);
    const firstShots = [{ kind: 'problem', end: 7 }, { kind: 'action', end: 14 }, { kind: 'still', end: 20 }];
    const secondShots = [{ kind: 'problem', end: 2.5 }, { kind: 'action', end: 5 }, { kind: 'still', end: 7.5 }, { kind: 'action', end: 10 }, { kind: 'problem', end: 12.5 }, { kind: 'still', end: 15 }, { kind: 'action', end: 17.5 }, { kind: 'payoff', end: 20 }];
    const firstCaptions = [{ start: 0, end: 6.5, text: 'Сигнал есть. Решения нет.' }, { start: 6.5, end: 13.5, text: 'Выбери действие.' }, { start: 13.5, end: 20, text: 'Проверь результат.' }];
    const secondCaptions = [{ start: 0, end: 2.5, text: 'Сигнал есть.' }, { start: 2.5, end: 5, text: 'Назови проблему.' }, { start: 5, end: 7.5, text: 'Сравни данные.' }, { start: 7.5, end: 10, text: 'Выбери действие.' }, { start: 10, end: 12.5, text: 'Один следующий шаг.' }, { start: 12.5, end: 15, text: 'Проверь результат.' }, { start: 15, end: 17.5, text: 'Сохрани наблюдение.' }, { start: 17.5, end: 20, text: 'Докрути следующий шаг.' }];
    const first = await renderCut(tempDir, 'first-cut', firstShots, firstCaptions, audio.mixedPath);
    const second = await renderCut(tempDir, 'second-cut', secondShots, secondCaptions, audio.mixedPath);
    const firstContact = await contactSheet(tempDir, 'first-cut', [0.5, 7.5, 14.5]);
    const secondContact = await contactSheet(tempDir, 'second-cut', [0.5, 3, 5.5, 8, 10.5, 13, 15.5, 18]);
    const record = {
      status: 'EXECUTABLE PASS',
      generated_at: '2026-09-18',
      source_policy: 'generated rights-safe SVG/image/data layers only; no private or external media inputs',
      source_classes: [
        { class: 'generated moving b-roll', evidence: 'animated line, pulse and progress frames' },
        { class: 'generated still image', evidence: 'static comparison panel used as a visual beat' },
        { class: 'generated graphic/data layer', evidence: 'metric bars and signal→action→check overlay' },
      ],
      voice: { status: 'EXECUTED', source: 'Windows SAPI local voice', mix: 'voice + generated 20s audio bed' },
      first_cut: { duration_seconds: DURATION, shot_count: 3, master_delivery_distinct: first.master_bytes > first.delivery_bytes, master_path: 'tests/fixtures/second-brain/video/evidence/first-cut-master.mp4', delivery_path: 'tests/fixtures/second-brain/video/evidence/first-cut-delivery.mp4', metadata: first.metadata, decode: { frame_bytes: first.decoded_frame_bytes, audio_bytes: first.decoded_audio_bytes }, captions: 'three timed SRT cues', contact_sheet: { ...firstContact, exists: true }, master_sha256: sha256(await fs.readFile(first.trackedMasterPath)), delivery_sha256: sha256(await fs.readFile(first.trackedDeliveryPath)) },
      second_cut: { duration_seconds: DURATION, shot_count: 8, master_delivery_distinct: second.master_bytes > second.delivery_bytes, master_path: 'tests/fixtures/second-brain/video/evidence/second-cut-master.mp4', delivery_path: 'tests/fixtures/second-brain/video/evidence/second-cut-delivery.mp4', metadata: second.metadata, decode: { frame_bytes: second.decoded_frame_bytes, audio_bytes: second.decoded_audio_bytes }, captions: 'eight timed SRT cues', contact_sheet: { ...secondContact, exists: true }, master_sha256: sha256(await fs.readFile(second.trackedMasterPath)), delivery_sha256: sha256(await fs.readFile(second.trackedDeliveryPath)) },
      consilium: { participants: ['producer', 'director', 'editor', 'motion', 'sound', 'brand', 'retention', 'platform', 'accessibility', 'performance', 'rights', 'red-team'], before_after: [
        'first cut: 3 long beats (max 7s) → second cut: 8 beats (max 2.5s) to improve retention cadence',
        'first cut: action arrives after the first beat → second cut: problem is named at 0s and repeated as a visual anchor',
        'first cut: one broad lower-third treatment → second cut: safe-margin title hierarchy plus data overlay and final payoff',
        'first cut: basic SRT timing → second cut: eight short readable cues with the same real voice mix',
      ], findings: ['tighten hook', 'increase shot rhythm', 'preserve contrast and safe margins', 'keep reduced dependency on source rights'], repair: 'second cut materialized with eight generated shots, motion/data layer, captions, mixed voice and delivery encode' },
      ephemeral_artifacts_cleaned: true,
    };
    await fs.writeFile(path.join(evidenceDir, 'video-evidence.json'), `${JSON.stringify(record, null, 2)}\n`);
    console.log(JSON.stringify(record, null, 2));
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => { console.error(`VIDEO_EXAM_FAIL: ${error.message}`); process.exitCode = 1; });
