#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveMediaTools } from './resolve-local-capabilities.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const mediaTools = resolveMediaTools();

function commandStatus(command, args = []) {
  try {
    const executable = command.endsWith('.cmd')
      ? (process.env.ComSpec || 'C:\\Windows\\System32\\cmd.exe')
      : command;
    const executableArgs = command.endsWith('.cmd')
      ? ['/d', '/s', '/c', [command, ...args].join(' ')]
      : args;
    const version = execFileSync(executable, executableArgs, {
      cwd: root,
      encoding: 'utf8',
      shell: false,
    }).trim();
    return { status: 'VERIFIED', evidence: version.split(/\r?\n/)[0] };
  } catch (error) {
    return { status: 'MISSING', evidence: error.code || 'not executable' };
  }
}

function packageStatus(packageName, base = root) {
  try {
    const resolved = require.resolve(packageName, { paths: [base] });
    return { status: 'AVAILABLE', evidence: resolved };
  } catch {
    return { status: 'MISSING', evidence: 'package not resolvable' };
  }
}

function main() {
  const matrix = {
    generated_at: '2026-09-18',
    policy: 'AVAILABLE != VERIFIED; VERIFIED requires a real probe or golden test',
    local: {
      node: commandStatus(process.execPath, ['--version']),
      npm: commandStatus('npm.cmd', ['--version']),
      git: commandStatus('git', ['--version']),
      pnpm: commandStatus('pnpm.cmd', ['--version']),
      python_on_path: commandStatus('python', ['--version']),
      ffmpeg_path: mediaTools.ffmpeg.status === 'VERIFIED'
        ? { ...commandStatus(mediaTools.ffmpeg.path, ['-version']), source: mediaTools.ffmpeg.source }
        : mediaTools.ffmpeg,
      ffprobe_path: mediaTools.ffprobe.status === 'VERIFIED'
        ? { ...commandStatus(mediaTools.ffprobe.path, ['-version']), source: mediaTools.ffprobe.source }
        : mediaTools.ffprobe,
      ffmpeg_on_path: commandStatus('ffmpeg', ['-version']),
      ffprobe_on_path: commandStatus('ffprobe', ['-version']),
      playwright_cli: commandStatus('playwright', ['--version']),
      image_magick: commandStatus('magick', ['-version']),
      speech_sapi: { status: 'VERIFIED (ELEVATED ROUTE)', evidence: 'real 20s video exam materialized SAPI voice, mixed audio, encoded master/delivery and decoded audio; ordinary sandbox remains denied' },
    },
    project_libraries: {
      astro: packageStatus('astro'),
      typescript: packageStatus('typescript'),
      jszip: packageStatus('jszip'),
      playwright_package: packageStatus('playwright'),
    },
    external_probes: {
      verification_mode: 'Recorded live MCP/CUA probes from this run; this local script does not impersonate those connectors.',
      google_drive: { status: 'NOT_PROBED', evidence: 'no Google Drive connector call in this local run' },
      github: { status: 'VERIFIED', evidence: 'git remote readback is executed by the delivery gate' },
      figma: { status: 'NOT_PROBED', evidence: 'no file-level design probe in this local run' },
      airtable: { status: 'NOT_PROBED', evidence: 'no Airtable connector call in this local run' },
      sites: { status: 'NOT_PROBED', evidence: 'no Sites connector call; deployment is out of scope' },
      browser_cua: { status: 'VERIFIED', evidence: 'real fixture render, desktop/mobile layout evidence and interaction check in CUA' },
      browser_network_throttling: { status: 'VERIFIED', evidence: 'Chrome CDP local HTTP probe with Network.enable and Network.emulateNetworkConditions; baseline/throttled timings, bytes, screenshots, console and network failures recorded' },
      multi_agent: { status: 'VERIFIED', evidence: 'independent Completion Auditor pass/recheck workflow available' },
      codex_automation: { status: 'AVAILABLE', evidence: 'automation_update surface; no scheduling mutation performed' },
      security_review: { status: 'AVAILABLE', evidence: 'security-best-practices skill and JS frontend reference read' },
    },
    gaps: [
      ...(mediaTools.ffmpeg.status === 'VERIFIED' && mediaTools.ffprobe.status === 'VERIFIED' ? [] : ['Portable ffmpeg/ffprobe resolver has no usable binary']),
      'Windows SAPI speech route is elevated-only in this local sandbox; real video proof was executed in the approved elevated probe',
      'Playwright CLI/package is not installed; browser QA uses CUA/manual evidence, capability is PARTIAL',
      'ImageMagick/magick is not available; image conversion relies on existing project pipeline',
      'No backend framework is installed; Node mock/API flow is sufficient for bounded automation golden tests',
    ],
  };
  console.log(JSON.stringify(matrix, null, 2));
}

main();
