#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const visualFixture = path.join(root, 'tests', 'fixtures', 'second-brain', 'visual', 'index.html');
const evidenceDir = path.join(root, 'tests', 'fixtures', 'second-brain', 'visual', 'evidence');
const outputPath = path.join(root, 'tests', 'fixtures', 'second-brain', 'performance', 'network-evidence.json');

const browserCandidates = [
  ['Chrome', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'],
  ['Chrome x86', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'],
  ['Chrome user', 'C:\\Users\\user\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'],
  ['Edge x86', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'],
  ['Edge', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'],
];

function sha256(buffer) { return createHash('sha256').update(buffer).digest('hex'); }

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function waitFor(check, timeoutMs = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { const value = await check(); if (value) return value; } catch { /* browser is still starting */ }
    await wait(100);
  }
  throw new Error(`timeout after ${timeoutMs}ms`);
}

function startServer() {
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    if (pathname === '/favicon.ico') { response.writeHead(204); response.end(); return; }
    if (pathname !== '/fixture') {
      response.writeHead(404); response.end('not found'); return;
    }
    const body = await fs.readFile(visualFixture);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Length': body.length });
    response.end(body);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

function terminateProcessTree(child) {
  if (!child?.pid) return;
  try {
    if (process.platform === 'win32') execFileSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill('SIGTERM');
  } catch { try { child.kill(); } catch { /* already exited */ } }
}

function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const events = new Map();
  let nextId = 1;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const entry = pending.get(message.id); pending.delete(message.id);
      if (message.error) entry.reject(new Error(`${message.error.code}: ${message.error.message}`));
      else entry.resolve(message.result);
      return;
    }
    if (message.method) for (const handler of events.get(message.method) || []) handler(message.params || {});
  });
  const ready = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('CDP WebSocket error')), { once: true });
  });
  return {
    async command(method, params = {}) {
      await ready;
      const id = nextId++;
      return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
    },
    on(method, handler) { if (!events.has(method)) events.set(method, []); events.get(method).push(handler); },
    async close() { try { socket.close(); } catch { /* already closed */ } },
  };
}

async function launchBrowser(browserName, browserPath, port, profileDir) {
  const args = [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--disable-background-networking', '--remote-allow-origins=*', `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`, 'about:blank',
  ];
  const process = spawn(browserPath, args, { stdio: 'ignore', windowsHide: true });
  try {
    const version = await waitFor(async () => {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      return response.ok ? response.json() : null;
    }, 12000);
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const target = targets.find((item) => item.type === 'page' && item.webSocketDebuggerUrl);
    if (!target) throw new Error('no page target exposed by CDP');
    return { browserName, browserPath, process, version, cdp: connectCdp(target.webSocketDebuggerUrl) };
  } catch (error) {
    terminateProcessTree(process);
    throw new Error(`${browserName}: ${error.message}`);
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result?.value;
}

async function measure(cdp, url, profile, outputFile) {
  const transfer = { bytes: 0, failures: [], consoleErrors: [] };
  const loadPromise = new Promise((resolve) => {
    const timer = setTimeout(() => resolve({ timedOut: true }), 15000);
    cdp.on('Page.loadEventFired', () => { clearTimeout(timer); resolve({ timedOut: false }); });
  });
  cdp.on('Network.loadingFinished', ({ encodedDataLength }) => { transfer.bytes += Number(encodedDataLength || 0); });
  cdp.on('Network.loadingFailed', (event) => { transfer.failures.push({ errorText: event.errorText, canceled: event.canceled === true }); });
  cdp.on('Runtime.exceptionThrown', ({ exceptionDetails }) => { transfer.consoleErrors.push(exceptionDetails?.text || 'runtime exception'); });
  cdp.on('Log.entryAdded', ({ entry }) => { if (entry.level === 'error') transfer.consoleErrors.push(entry.text); });
  await cdp.command('Page.navigate', { url });
  const load = await loadPromise;
  const timing = await evaluate(cdp, `(() => { const n = performance.getEntriesByType('navigation')[0]; return { readyState: document.readyState, domContentLoaded: n?.domContentLoadedEventEnd ?? null, loadEventEnd: n?.loadEventEnd ?? null, responseEnd: n?.responseEnd ?? null, transferSize: n?.transferSize ?? null, htmlBytes: document.documentElement.outerHTML.length, innerWidth: window.innerWidth, innerHeight: window.innerHeight }; })()`);
  const screenshot = await cdp.command('Page.captureScreenshot', { format: 'png', fromSurface: true });
  const image = Buffer.from(screenshot.data, 'base64');
  await fs.writeFile(outputFile, image);
  return { profile, load, timing, transfer_bytes: transfer.bytes, network_failures: transfer.failures, console_errors: transfer.consoleErrors, screenshot: { path: path.relative(root, outputFile).replaceAll('\\', '/'), bytes: image.length, sha256: sha256(image) } };
}

async function main() {
  await fs.access(visualFixture);
  await fs.mkdir(evidenceDir, { recursive: true });
  const { server, port: serverPort } = await startServer();
  const browserAttempts = [];
  let browser = null;
  let profileDir = null;
  try {
    const debugPort = await freePort();
    profileDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dokruti-cdp-profile-'));
    for (const [name, candidate] of browserCandidates) {
      if (!fsSync.existsSync(candidate)) continue;
      try { browser = await launchBrowser(name, candidate, debugPort, profileDir); break; }
      catch (error) { browserAttempts.push(error.message); }
    }
    if (!browser) throw new Error(`no Chromium-family browser could expose CDP: ${browserAttempts.join(' | ') || 'no installed candidate'}`);
    const cdp = browser.cdp;
    await cdp.command('Page.enable');
    await cdp.command('Runtime.enable');
    await cdp.command('Log.enable');
    await cdp.command('Network.enable');
    await cdp.command('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const url = `http://127.0.0.1:${serverPort}/fixture`;
    await cdp.command('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1, connectionType: 'none' });
    const baseline = await measure(cdp, `${url}?run=baseline`, 'baseline', path.join(evidenceDir, 'network-baseline.png'));
    await cdp.command('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 150 * 1024, uploadThroughput: 50 * 1024, connectionType: 'cellular3g' });
    const throttled = await measure(cdp, `${url}?run=throttled`, 'throttled-3g', path.join(evidenceDir, 'network-throttled.png'));
    const delta = {
      load_event_ms: Number((throttled.timing.loadEventEnd - baseline.timing.loadEventEnd).toFixed(2)),
      dom_content_loaded_ms: Number((throttled.timing.domContentLoaded - baseline.timing.domContentLoaded).toFixed(2)),
      transfer_bytes_delta: throttled.transfer_bytes - baseline.transfer_bytes,
    };
    if (!baseline.timing || !throttled.timing || baseline.load.timedOut || throttled.load.timedOut || throttled.timing.loadEventEnd <= baseline.timing.loadEventEnd || baseline.network_failures.length || throttled.network_failures.length || baseline.console_errors.length || throttled.console_errors.length) {
      throw new Error(`network measurement invalid: ${JSON.stringify({ baseline, throttled })}`);
    }
    const evidence = {
      status: 'EXECUTABLE PASS',
      browser: { name: browser.browserName, executable: browser.browserPath, cdp_version: browser.version.Browser },
      fixture_url: url,
      fixture_transport: 'local HTTP server; no filesystem transport',
      ephemeral_profile: { used: true, cleaned_after_run: true },
      throttling: { cdp_method: 'Network.emulateNetworkConditions', latency_ms: 150, download_bytes_per_second: 150 * 1024, upload_bytes_per_second: 50 * 1024 },
      baseline,
      throttled,
      delta,
      measurement: 'real CDP navigation timing, encoded transfer bytes, screenshot, console and network failure collection',
    };
    await fs.writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
    console.log(JSON.stringify(evidence, null, 2));
  } finally {
    if (browser) { await browser.cdp.close(); terminateProcessTree(browser.process); }
    await new Promise((resolve) => server.close(resolve));
    if (profileDir) {
      try { await fs.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
      catch (error) { console.error(`EPHEMERAL_PROFILE_CLEANUP_RETRY_REQUIRED: ${error.code || error.message}`); }
    }
  }
}

main().catch((error) => { console.error(`NETWORK_THROTTLING_PROBE_FAIL: ${error.message}`); process.exitCode = 1; });
