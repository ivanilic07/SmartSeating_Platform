const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox = { roomShape: 'rectangle' };
sandbox.current = () => ({ venueShape: sandbox.roomShape });
vm.createContext(sandbox);
for (const name of ['tableExtent', 'clampTablePosition', 'moveTableByDrag', 'clampPan']) {
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing ${name} in application`);
  const next = script.indexOf('\nfunction ', start + 1);
  vm.runInContext(script.slice(start, next < 0 ? undefined : next), sandbox);
}

function table(shape = 'round', rotation = 0, x = 50, y = 50) {
  return { id: 't1', shape, rotation, x, y, _dragX: x, _dragY: y };
}

test('a table stays put when pressed, including when grabbed at its edge', () => {
  for (const zoom of [0.5, 0.75, 1, 1.25, 1.5]) {
    const t = table('rect', 0, 47, 38);
    sandbox.moveTableByDrag(t, { clientWidth: 800, clientHeight: 500 }, 0, 0, zoom);
    assert.equal(t.x, 47);
    assert.equal(t.y, 38);
  }
});

test('drag deltas map to the same venue position at every supported zoom', () => {
  const expected = { x: 50, y: 50 };
  for (const zoom of [0.5, 0.75, 1, 1.25, 1.5]) {
    const t = table('round', 0, 90, 80);
    const dx = (expected.x - t._dragX) / 100 * 800 * zoom;
    const dy = (expected.y - t._dragY) / 100 * 500 * zoom;
    sandbox.moveTableByDrag(t, { clientWidth: 800, clientHeight: 500 }, dx, dy, zoom);
    assert.ok(Math.abs(t.x - expected.x) < 1e-9);
    assert.ok(Math.abs(t.y - expected.y) < 1e-9);
  }
});

test('rotated rectangular tables stay inside the venue', () => {
  const t = table('rect', 90, 0, 100);
  const bounds = sandbox.tableExtent(t);
  sandbox.clampTablePosition(t, { clientWidth: 600, clientHeight: 400 }, 0, 400);
  assert.ok(Math.abs(t.x / 100 * 600 - bounds.w) < 1e-9);
  assert.ok(Math.abs(t.y / 100 * 400 - (400 - bounds.h)) < 1e-9);
});

test('numeric X/Y coordinates use venue-local pixels', () => {
  const t = table('round', 0, 50, 50);
  sandbox.clampTablePosition(t, { clientWidth: 800, clientHeight: 500 }, 350, 220);
  assert.ok(Math.abs(t.x / 100 * 800 - 350) < 1e-9);
  assert.ok(Math.abs(t.y / 100 * 500 - 220) < 1e-9);
});

test('tables cannot be placed in the clipped-out corner of an L-shaped venue', () => {
  sandbox.roomShape = 'lshape';
  const t = table('round', 0, 80, 80);
  sandbox.clampTablePosition(t, { clientWidth: 800, clientHeight: 600 }, 640, 480);
  assert.ok(t.x <= 58 || t.y <= 58);
  sandbox.roomShape = 'rectangle';
});

test('pan is clamped so the venue remains connected to the canvas viewport', () => {
  for (const zoom of [0.5, 0.75, 1, 1.25, 1.5]) {
    const pan = sandbox.clampPan(800, 500, 700, 600, zoom, 10000, -10000);
    assert.equal(pan.x, Math.abs(800 * zoom - 700) / 2);
    assert.equal(pan.y, -Math.abs(500 * zoom - 600) / 2);
  }
});

test('a prior canvas pan does not change a table drag delta', () => {
  const zoom = 1.5, start = { x: 520, y: 310 }, release = { x: 700, y: 220 };
  for (const pan of [-250, 0, 175]) {
    const t = table('rect', 0, 50, 50);
    const dx = (release.x + pan) - (start.x + pan);
    const dy = (release.y + pan) - (start.y + pan);
    sandbox.moveTableByDrag(t, { clientWidth: 800, clientHeight: 500 }, dx, dy, zoom);
    assert.ok(Math.abs(t.x - 65) < 1e-9);
    assert.ok(Math.abs(t.y - 38) < 1e-9);
  }
});
