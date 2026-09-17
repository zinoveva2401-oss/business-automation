#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function existingPath(candidate) {
  return typeof candidate === 'string' && candidate.trim() !== '' && fs.existsSync(candidate) ? candidate : null;
}

function pathFromCommand(command) {
  try {
    const locator = process.platform === 'win32' ? 'where.exe' : 'which';
    return execFileSync(locator, [command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/).map((line) => line.trim()).find(Boolean) || null;
  } catch {
    return null;
  }
}

function pathFromPackage(packageName) {
  if (!packageName) return null;
  try {
    const packageExport = require(packageName);
    return existingPath(packageExport?.path);
  } catch {
    return null;
  }
}

export function resolveCapability({ envVar, packageName, command }) {
  const candidates = [
    [process.env[envVar], `env:${envVar}`],
    [pathFromPackage(packageName), `project-package:${packageName}`],
    [pathFromCommand(command), `PATH:${command}`],
  ];
  const selected = candidates.find(([candidate]) => existingPath(candidate));
  return selected ? { status: 'VERIFIED', path: selected[0], source: selected[1] } : { status: 'MISSING', path: null, source: null };
}

export function resolveMediaTools() {
  return {
    ffmpeg: resolveCapability({ envVar: 'FFMPEG_PATH', packageName: '@ffmpeg-installer/ffmpeg', command: 'ffmpeg' }),
    ffprobe: resolveCapability({ envVar: 'FFPROBE_PATH', packageName: '@ffprobe-installer/ffprobe', command: 'ffprobe' }),
  };
}

if (process.argv[2] === '--probe') {
  console.log(JSON.stringify({ generated_at: new Date().toISOString(), media: resolveMediaTools() }, null, 2));
}
