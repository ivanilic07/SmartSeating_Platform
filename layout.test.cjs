const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox = {
  document: { getElementById: () => ({ clientWidth: 700, clientHeight: 640 }) },
  current: () => ({ venueShape: 'rectangle' }),
};
vm.createContext(sandbox);
for (const name of ['tableExtent', 'placeNewTableInGrid']) {
  const start = script.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing ${name} in application`);
  const next = script.indexOf('\nfunction ', start + 1);
  vm.runInContext(script.slice(start, next < 0 ? undefined : next), sandbox);
}

test('new tables are distributed with clear spacing in 10, 20, 30 and 50 table plans', () => {
  for (const count of [10, 20, 30, 50]) {
    const plan = { roomWidth: 20, roomHeight: 14, tables: [] };
    for (let i = 0; i < count; i++) {
      const table = { id: `t${i}`, shape: 'round', rotation: 0, x: 50, y: 50 };
      plan.tables.push(table);
      sandbox.placeNewTableInGrid(table, plan);
    }
    const cols = count > 12 ? Math.min(7, Math.ceil(Math.sqrt(count * 1.2))) : Math.min(4, count);
    const rows = Math.ceil(count / cols);
    const canvas = { clientWidth: 700, clientHeight: 640 };
    const ratio = Math.min((700 - 100) / 20, (640 - 100) / 14);
    const vw = Math.max(Math.min(658, 20 * ratio), cols * 150 + 40);
    const vh = Math.max(Math.min(598, 14 * ratio), rows * 130 + 40);
    assert.equal(plan.tables.length, count);
    for (let i = 0; i < count; i++) {
      const a = plan.tables[i], ax = a.x / 100 * vw, ay = a.y / 100 * vh;
      assert.ok(ax > 0 && ax < vw && ay > 0 && ay < vh, `table ${i} is inside expanded venue`);
      for (let j = i + 1; j < count; j++) {
        const b = plan.tables[j], bx = b.x / 100 * vw, by = b.y / 100 * vh;
        const extA = sandbox.tableExtent(a), extB = sandbox.tableExtent(b);
        assert.ok(Math.abs(ax - bx) >= extA.w + extB.w + 24 || Math.abs(ay - by) >= extA.h + extB.h + 24,
          `${count} table plan overlaps at ${i} and ${j}`);
      }
    }
  }
});

test('Mladenački sto is available as a distinct horizontal element', () => {
  assert.match(html, /'Mladenački sto'/);
  assert.match(html, /type==='Mladenački sto'\?190:110/);
  assert.match(html, /data-type="Mladenački sto"/);
});

test('initial bulk table positions survive the table setup wizard step', () => {
  const tables = Array.from({ length: 25 }, (_, i) => ({
    id: `bulk-${i + 1}`, name: `Sto ${i + 1}`, shape: 'round', capacity: 10,
    x: 8 + (i % 7) * 14, y: 12 + Math.floor(i / 7) * 20,
    initialX: 8 + (i % 7) * 14, initialY: 12 + Math.floor(i / 7) * 20,
    rotation: 0, autoGrid: true,
  }));
  sandbox.step = 3;
  sandbox.createDraft = { tables };
  sandbox.document = {
    querySelectorAll: selector => selector === '[data-tname]'
      ? tables.map((t, i) => ({ value: t.name, index: i }))
      : [],
    querySelector: selector => {
      return { value: selector.includes('data-tshape') ? 'round' : '10' };
    },
  };
  const start = script.indexOf('function saveWizardStep(');
  const next = script.indexOf('\nfunction ', start + 1);
  vm.runInContext(script.slice(start, next), sandbox);
  assert.equal(sandbox.saveWizardStep(), true);
  assert.equal(sandbox.createDraft.tables.length, 25);
  for (let i = 0; i < 25; i++) {
    assert.equal(sandbox.createDraft.tables[i].id, `bulk-${i + 1}`);
    assert.equal(sandbox.createDraft.tables[i].autoGrid, true);
    assert.equal(sandbox.createDraft.tables[i].x, tables[i].x);
    assert.equal(sandbox.createDraft.tables[i].y, tables[i].y);
  }
});
