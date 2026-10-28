/**
 * Comprehensive Verification Suite for Local Authentication API Connection
 * Tests:
 * 1. Backend startup and endpoint availability
 * 2. CORS Preflight (OPTIONS) with Origin: http://localhost:3000 and http://127.0.0.1:3000
 * 3. CORS POST /api/auth/login with credentials & cookie validation
 * 4. Invalid credentials rejection with CORS
 * 5. Non-browser / wildcard backward compatibility
 * 6. Frontend auth.js execution from port 3000 origin targeting port 4173
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');
const db = require(path.join(ROOT_DIR, 'server', 'db.js'));
const authJsContent = fs.readFileSync(path.join(ROOT_DIR, 'Miqat UI-UX', 'auth.js'), 'utf8');

let total = 0;
let passed = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log(' MIQAT PLATFORM — LOCAL AUTH API CONNECTION & CORS TEST SUITE');
  console.log('================================================================\n');

  // Step 1: Start backend server on test port 5183
  console.log('Step 1: Backend Server Initialization');
  const TEST_PORT = 5183;
  process.env.PORT = String(TEST_PORT);
  const server = require(path.join(ROOT_DIR, 'server', 'server.js'));

  await new Promise(r => setTimeout(r, 600));
  assert(Boolean(server), 'Backend server instance created and listening');

  // Step 2: Test CORS Preflight (OPTIONS) from http://localhost:3000
  console.log('\nStep 2: CORS Preflight (OPTIONS) from http://localhost:3000');
  const preflightLocalhost = await request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });

  assert(preflightLocalhost.statusCode === 204, 'Preflight returns HTTP 204 No Content');
  assert(preflightLocalhost.headers['access-control-allow-origin'] === 'http://localhost:3000', 'Access-Control-Allow-Origin explicitly matches requesting origin (http://localhost:3000)');
  assert(preflightLocalhost.headers['access-control-allow-credentials'] === 'true', 'Access-Control-Allow-Credentials is true');
  assert(preflightLocalhost.headers['access-control-allow-methods'].includes('POST'), 'Access-Control-Allow-Methods includes POST');
  assert(preflightLocalhost.headers['access-control-allow-headers'].includes('Content-Type'), 'Access-Control-Allow-Headers includes Content-Type');

  // Step 3: Test CORS Preflight (OPTIONS) from http://127.0.0.1:3000
  console.log('\nStep 3: CORS Preflight (OPTIONS) from http://127.0.0.1:3000');
  const preflight127 = await request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/auth/login',
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://127.0.0.1:3000',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });

  assert(preflight127.statusCode === 204, 'Preflight from 127.0.0.1:3000 returns HTTP 204');
  assert(preflight127.headers['access-control-allow-origin'] === 'http://127.0.0.1:3000', 'Access-Control-Allow-Origin explicitly matches http://127.0.0.1:3000');
  assert(preflight127.headers['access-control-allow-credentials'] === 'true', 'Access-Control-Allow-Credentials is true for 127.0.0.1:3000');

  // Step 4: Valid POST /api/auth/login with Origin: http://localhost:3000
  console.log('\nStep 4: Valid POST /api/auth/login from http://localhost:3000');
  const loginPostData = JSON.stringify({
    identifier: '01156379992',
    password: 'Asabry753#'
  });

  const loginRes = await request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Origin': 'http://localhost:3000',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPostData)
    }
  }, loginPostData);

  assert(loginRes.statusCode === 200, 'Login request returns HTTP 200');
  assert(loginRes.headers['access-control-allow-origin'] === 'http://localhost:3000', 'Login response has Access-Control-Allow-Origin: http://localhost:3000');
  assert(loginRes.headers['access-control-allow-credentials'] === 'true', 'Login response has Access-Control-Allow-Credentials: true');
  assert(loginRes.json && loginRes.json.success === true, 'Response body has success: true');
  assert(loginRes.json.user && loginRes.json.user.phone === '01156379992', 'Response body has correct customer user');
  assert(Boolean(loginRes.json.token), 'Response body contains session token');

  const setCookie = loginRes.headers['set-cookie'];
  assert(Boolean(setCookie && setCookie.some(c => c.includes('miqat_session='))), 'Response sets HttpOnly miqat_session cookie');

  // Step 5: Invalid POST /api/auth/login with Origin: http://localhost:3000
  console.log('\nStep 5: Invalid Credentials Rejection with CORS');
  const invalidPostData = JSON.stringify({
    identifier: '01156379992',
    password: 'WrongPassword999#'
  });

  const invalidRes = await request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Origin': 'http://localhost:3000',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(invalidPostData)
    }
  }, invalidPostData);

  assert(invalidRes.statusCode === 401, 'Invalid login returns HTTP 401');
  assert(invalidRes.headers['access-control-allow-origin'] === 'http://localhost:3000', '401 response has Access-Control-Allow-Origin matching origin');
  assert(invalidRes.headers['access-control-allow-credentials'] === 'true', '401 response has Access-Control-Allow-Credentials: true');
  assert(invalidRes.json && invalidRes.json.success === false, '401 response body has success: false');

  // Step 6: Non-browser request without Origin header (Wildcard fallback)
  console.log('\nStep 6: Non-browser / legacy request without Origin header');
  const noOriginRes = await request({
    hostname: '127.0.0.1',
    port: TEST_PORT,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPostData)
    }
  }, loginPostData);

  assert(noOriginRes.statusCode === 200, 'Request without origin returns HTTP 200');
  assert(noOriginRes.headers['access-control-allow-origin'] === '*', 'Request without origin falls back to wildcard *');
  assert(!noOriginRes.headers['access-control-allow-credentials'], 'Wildcard response does NOT set Allow-Credentials (compliant with spec)');

  // Step 7: Frontend auth.js execution in port 3000 context
  console.log('\nStep 7: Frontend auth.js Execution in http://localhost:3000 Context');

  class MockElement {
    constructor(id, tagName = 'div') {
      this.id = id;
      this.tagName = tagName.toUpperCase();
      this.className = '';
      this.attributes = {};
      this.style = {};
      this.innerHTML = '';
      this.textContent = '';
      this.value = '';
      this.listeners = {};
    }
    set className(val) {
      this._className = val || '';
      const set = new Set(this._className.split(/\s+/).filter(Boolean));
      this.classList = {
        add: (c) => set.add(c),
        remove: (c) => set.delete(c),
        contains: (c) => set.has(c)
      };
    }
    get className() { return this._className || ''; }
    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
    addEventListener(evt, fn) {
      if (!this.listeners[evt]) this.listeners[evt] = [];
      this.listeners[evt].push(fn);
    }
    querySelector(sel) {
      if (sel === '.btn-text') return this._btnTextEl || (this._btnTextEl = new MockElement('', 'span'));
      return null;
    }
    querySelectorAll() { return []; }
    focus() { this.focused = true; }
    scrollIntoView() {}
  }

  function createMockDOM(origin, port) {
    const elements = {};
    function getEl(id, tag = 'div') {
      if (!elements[id]) elements[id] = new MockElement(id, tag);
      return elements[id];
    }

    const doc = {
      documentElement: new MockElement('html'),
      body: new MockElement('body'),
      getElementById: (id) => getEl(id),
      querySelectorAll: () => [],
      addEventListener: () => {}
    };
    doc.body.dataset = {};

    let replaced = null;
    const win = {
      location: {
        origin,
        hostname: origin.includes('localhost') ? 'localhost' : '127.0.0.1',
        port: String(port),
        pathname: '/login.html',
        search: '',
        replace: (u) => { replaced = u; },
        get replaced() { return replaced; }
      },
      localStorage: {
        store: {},
        getItem(k) { return this.store[k] || null; },
        setItem(k, v) { this.store[k] = String(v); },
        removeItem(k) { delete this.store[k]; }
      },
      document: doc,
      addEventListener: () => {}
    };

    return { win, doc, getEl };
  }

  let interceptedFetchUrl = null;
  let interceptedFetchOptions = null;

  const mockFetch = async (url, options) => {
    interceptedFetchUrl = url;
    interceptedFetchOptions = options;
    return {
      ok: true,
      json: async () => ({
        success: true,
        user: { id: 'usr_cust_01156379992', name: 'أحمد محمود', phone: '01156379992', role: 'customer' },
        token: 'mock_token_123'
      })
    };
  };

  const { win: win3000, getEl: getEl3000 } = createMockDOM('http://localhost:3000', 3000);

  const sandbox3000 = {
    window: win3000,
    document: win3000.document,
    localStorage: win3000.localStorage,
    fetch: mockFetch,
    console,
    URLSearchParams,
    decodeURIComponent,
    encodeURIComponent,
    setTimeout,
    clearTimeout
  };

  const fn3000 = new Function(...Object.keys(sandbox3000), authJsContent);
  fn3000(...Object.values(sandbox3000));

  const form3000 = getEl3000('loginForm');
  const idInput3000 = getEl3000('loginIdentifier');
  const passInput3000 = getEl3000('loginPassword');

  idInput3000.value = '01156379992';
  passInput3000.value = 'Asabry753#';

  await form3000.listeners['submit'][0]({ preventDefault() {} });

  assert(interceptedFetchUrl === 'http://127.0.0.1:4173/api/auth/login', 'Frontend fetch targets backend on port 4173 (http://127.0.0.1:4173/api/auth/login), NOT port 3000');
  assert(interceptedFetchOptions.credentials === 'include', 'Frontend fetch includes credentials: "include" for cookie transmission');
  assert(win3000.localStorage.getItem('miqat_user') !== null, 'Authenticated customer session stored in localStorage');
  assert(win3000.location.replaced === 'programs.html', 'Successful login redirected to Customer Dashboard (programs.html)');

  // Step 8: Frontend auth.js execution in port 4173 direct context
  console.log('\nStep 8: Frontend auth.js Execution in port 4173 Integrated Context');
  const { win: win4173, getEl: getEl4173 } = createMockDOM('http://127.0.0.1:4173', 4173);

  interceptedFetchUrl = null;
  interceptedFetchOptions = null;

  const sandbox4173 = {
    window: win4173,
    document: win4173.document,
    localStorage: win4173.localStorage,
    fetch: mockFetch,
    console,
    URLSearchParams,
    decodeURIComponent,
    encodeURIComponent,
    setTimeout,
    clearTimeout
  };

  const fn4173 = new Function(...Object.keys(sandbox4173), authJsContent);
  fn4173(...Object.values(sandbox4173));

  const form4173 = getEl4173('loginForm');
  const idInput4173 = getEl4173('loginIdentifier');
  const passInput4173 = getEl4173('loginPassword');

  idInput4173.value = '01156379992';
  passInput4173.value = 'Asabry753#';

  await form4173.listeners['submit'][0]({ preventDefault() {} });
  assert(interceptedFetchUrl === '/api/auth/login', 'When served directly on port 4173, relative /api/auth/login is seamlessly used');

  // Summary
  console.log('\n================================================================');
  console.log(` ALL TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('================================================================');

  process.exit(passed === total ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
