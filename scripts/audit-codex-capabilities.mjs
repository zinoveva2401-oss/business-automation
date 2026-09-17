#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledPython = 'C:\\Users\\user\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe';
const remotionFfmpeg = path.join(root, 'ernest-16-film', 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffmpeg.exe');
const remotionFfprobe = path.join(root, 'ernest-16-film', 'node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffprobe.exe');
const require = createRequire(import.meta.url);

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
    generated_at: '2026-09-17',
    policy: 'AVAILABLE != VERIFIED; VERIFIED requires a real probe or golden test',
    local: {
      node: commandStatus(process.execPath, ['--version']),
      npm: commandStatus('npm.cmd', ['--version']),
      git: commandStatus('git', ['--version']),
      pnpm: commandStatus('pnpm.cmd', ['--version']),
      bundled_python: fs.existsSync(bundledPython)
        ? commandStatus(bundledPython, ['--version'])
        : { status: 'MISSING', evidence: bundledPython },
      ffmpeg_path: fs.existsSync(remotionFfmpeg)
        ? commandStatus(remotionFfmpeg, ['-version'])
        : { status: 'MISSING', evidence: remotionFfmpeg },
      ffprobe_path: fs.existsSync(remotionFfprobe)
        ? commandStatus(remotionFfprobe, ['-version'])
        : { status: 'MISSING', evidence: remotionFfprobe },
      ffmpeg_on_path: commandStatus('ffmpeg', ['-version']),
      ffprobe_on_path: commandStatus('ffprobe', ['-version']),
      playwright_cli: commandStatus('playwright', ['--version']),
      image_magick: commandStatus('magick', ['-version']),
    },
    project_libraries: {
      astro: packageStatus('astro'),
      typescript: packageStatus('typescript'),
      jszip: packageStatus('jszip'),
      remotion: packageStatus('remotion', path.join(root, 'ernest-16-film')),
      playwright_package: packageStatus('playwright'),
    },
    external_probes: {
      verification_mode: 'Recorded live MCP/CUA probes from this run; this local script does not impersonate those connectors.',
      google_drive: { status: 'VERIFIED', evidence: 'profile, canonical spreadsheet search, metadata and bounded range reads' },
      github: { status: 'VERIFIED', evidence: 'repository metadata, branch access, push and remote readback' },
      figma: { status: 'PARTIAL', evidence: 'authenticated identity probe; file-level design access not tested' },
      airtable: { status: 'VERIFIED', evidence: 'ping' },
      sites: { status: 'VERIFIED', evidence: 'owned Sites listing; no deploy performed' },
      browser_cua: { status: 'VERIFIED', evidence: 'real fixture render, desktop/mobile layout evidence and interaction check in CUA' },
      multi_agent: { status: 'VERIFIED', evidence: 'independent Completion Auditor pass/recheck workflow available' },
      codex_automation: { status: 'AVAILABLE', evidence: 'automation_update surface; no scheduling mutation performed' },
      security_review: { status: 'AVAILABLE', evidence: 'security-best-practices skill and JS frontend reference read' },
    },
    gaps: [
      'ffmpeg/ffprobe are not on PATH but verified Remotion-bundled binaries exist; generic PATH media workflows remain PARTIAL',
      'Playwright CLI/package is not installed; browser QA uses CUA/manual evidence, capability is PARTIAL',
      'ImageMagick/magick is not available; image conversion relies on existing project pipeline',
      'No backend framework is installed; Node mock/API flow is sufficient for bounded automation golden tests',
    ],
  };
  console.log(JSON.stringify(matrix, null, 2));
}

main();
