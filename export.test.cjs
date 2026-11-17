const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

test('the editor offers a complete-plan PDF export', () => {
  assert.match(html, /id="exportProject">↓ Preuzmi ceo plan \(PDF\)/);
  assert.match(html, /getElementById\('exportProject'\)\.onclick=\(\)=>exportPlan\('project'\)/);
});

test('the complete PDF contains venue layout, table overview, and the guest list', () => {
  assert.match(html, /if\(mode==='project'\)/);
  assert.match(html, /Raspored sale/);
  assert.match(html, /Pregled stolova/);
  assert.match(html, /Spisak gostiju/);
  assert.match(html, /window\.print\(\)/);
  assert.match(html, /Sačuvaj kao PDF/);
});
