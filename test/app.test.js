const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/index');

let server;
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', resolve);
    });
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
});

test('converts rich text and GFM tables to Markdown', async () => {
    const response = await fetch(`${baseUrl}/api/convert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ html: '<h1>Hello</h1><table><tr><th>A</th></tr><tr><td>B</td></tr></table>' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.match(body.markdown, /^# Hello/);
    assert.match(body.markdown, /\| A \|/);
});

test('sanitizes dangerous HTML before converting it', async () => {
    const response = await fetch(`${baseUrl}/api/convert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ html: '<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)">link</a>' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.doesNotMatch(body.markdown, /script|javascript|alert/i);
    assert.match(body.markdown, /Safe/);
});

test('converts Markdown to sanitized HTML', async () => {
    const response = await fetch(`${baseUrl}/api/reverse`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ markdown: '# Hello\n\n[unsafe](javascript:alert(1))' }),
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.match(body.html, /<h1>Hello<\/h1>/);
    assert.doesNotMatch(body.html, /javascript:/i);
});

test('returns JSON errors for invalid and malformed requests', async () => {
    const missingInput = await fetch(`${baseUrl}/api/convert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
    });
    assert.equal(missingInput.status, 400);
    assert.equal((await missingInput.json()).error, 'Invalid input. Expecting HTML string.');

    const malformed = await fetch(`${baseUrl}/api/reverse`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{',
    });
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).error, 'Malformed JSON request body.');
});

test('serves local assets with a strict content security policy', async () => {
    const page = await fetch(`${baseUrl}/`);
    const html = await page.text();
    const csp = page.headers.get('content-security-policy');

    assert.equal(page.status, 200);
    assert.match(html, /styles\.css/);
    assert.doesNotMatch(html, /cdn\.jsdelivr\.net/);
    assert.doesNotMatch(csp, /unsafe-inline/);
    assert.equal(page.headers.get('access-control-allow-origin'), null);

    const stylesheet = await fetch(`${baseUrl}/styles.css`);
    assert.equal(stylesheet.status, 200);
});

test('exposes a health endpoint', async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
});
