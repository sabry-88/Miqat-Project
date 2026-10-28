/**
 * End-to-End DOM Simulation Test for Customer Login
 * Tests auth.js form submission, validation, authentication, and redirection.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
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

async function runDomTest() {
  console.log('====================================================');
  console.log(' MIQAT PLATFORM — BROWSER DOM SIMULATION TEST');
  console.log('====================================================\n');

  // Set up mock window and document environment
  const localStorageStore = {};
  const mockLocalStorage = {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, val) => { localStorageStore[key] = String(val); },
    removeItem: (key) => { delete localStorageStore[key]; },
    clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
  };

  let replacedLocation = null;
  let assignedLocation = null;

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

  // Create form elements
  const loginForm = new MockElement('loginForm', 'form');
  const loginIdentifier = new MockElement('loginIdentifier', 'input');
  const loginPassword = new MockElement('loginPassword', 'input');
  const identifierError = new MockElement('identifierError');
  const passwordError = new MockElement('passwordError');
  const submitBtn = new MockElement('submitBtn', 'button');
  const authStatusBox = new MockElement('authStatusBox');

  const elementsById = {
    loginForm,
    loginIdentifier,
    loginPassword,
    identifierError,
    passwordError,
    submitBtn,
    authStatusBox
  };

  const mockDocument = {
    documentElement: new MockElement('html'),
    body: new MockElement('body'),
    getElementById: (id) => elementsById[id] || null,
    querySelector: (sel) => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
  };

  mockDocument.body.dataset = {};

  const mockWindow = {
    location: {
      search: '',
      pathname: '/login.html',
      replace: (url) => { replacedLocation = url; },
      set href(url) { assignedLocation = url; },
      get href() { return replacedLocation || assignedLocation || '/login.html'; }
    },
    localStorage: mockLocalStorage,
    document: mockDocument,
    addEventListener: () => {}
  };

  // Scenario 1: Valid Customer Login without redirect query param
  console.log('Scenario 1: Customer enters valid credentials (01156379992 / Asabry753#)');

  // Mock global fetch for Scenario 1
  let fetchCalledWith = null;
  const mockFetchSuccess = async (url, options) => {
    fetchCalledWith = { url, options: JSON.parse(options.body) };
    return {
      ok: true,
      json: async () => ({
        success: true,
        user: {
          id: 'usr_cust_01156379992',
          name: 'أحمد محمود الشريف (حساب العميل التجريبي)',
          phone: '01156379992',
          email: 'ahmed.customer@miqat.test',
          governorate: 'cairo',
          role: 'customer'
        },
        token: 'test_session_token_12345'
      })
    };
  };

  // Run auth.js in context
  const runAuthContext = (customWindow, customFetch) => {
    const sandbox = {
      window: customWindow,
      document: customWindow.document,
      localStorage: customWindow.localStorage,
      fetch: customFetch,
      console: console,
      URLSearchParams: URLSearchParams,
      decodeURIComponent: decodeURIComponent,
      encodeURIComponent: encodeURIComponent,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout
    };
    const fn = new Function(...Object.keys(sandbox), authJsContent);
    fn(...Object.values(sandbox));
  };

  runAuthContext(mockWindow, mockFetchSuccess);

  // Trigger login submit
  loginIdentifier.value = '01156379992';
  loginPassword.value = 'Asabry753#';

  const submitHandlers = loginForm.listeners['submit'];
  assert(Boolean(submitHandlers && submitHandlers.length > 0), 'Submit event listener registered on loginForm');

  await submitHandlers[0]({ preventDefault: () => {} });

  assert(fetchCalledWith && fetchCalledWith.options.identifier === '01156379992', 'Submitted identifier matches clean normalized phone 01156379992');
  assert(fetchCalledWith && fetchCalledWith.options.password === 'Asabry753#', 'Submitted password matches Asabry753#');
  assert(mockLocalStorage.getItem('miqat_user') !== null, 'Authenticated customer user stored in localStorage (miqat_user)');
  const storedUser = JSON.parse(mockLocalStorage.getItem('miqat_user'));
  assert(storedUser.phone === '01156379992', 'Stored user phone is 01156379992');
  assert(storedUser.role === 'customer', 'Stored user role is customer');
  assert(mockLocalStorage.getItem('miqat_token') === 'test_session_token_12345', 'Session token stored in localStorage (miqat_token)');
  assert(replacedLocation === 'programs.html', 'Immediately redirected to programs.html via location.replace: ' + replacedLocation);
  assert(submitBtn.classList.contains('is-loading'), 'Submit button remains disabled/loading during redirect transition to prevent duplicate submission');

  // Scenario 2: Preserved Program Details Redirect (?redirect=program&trip=umrah&programId=prog-umrah-1)
  console.log('\nScenario 2: Preserved Program Details Flow (?redirect=program&trip=umrah&programId=prog-umrah-1)');
  replacedLocation = null;
  mockWindow.location.search = '?redirect=program&trip=umrah&programId=prog-umrah-1';

  await submitHandlers[0]({ preventDefault: () => {} });
  assert(replacedLocation === 'programs.html?trip=umrah&programId=prog-umrah-1', 'Redirected to Customer Page with preserved program context: ' + replacedLocation);

  // Scenario 3: Invalid Credentials (Wrong Password)
  console.log('\nScenario 3: Invalid Credentials Handling');
  replacedLocation = null;
  mockLocalStorage.clear();

  const mockFetchFailure = async (url, options) => {
    return {
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        error: 'Invalid credentials'
      })
    };
  };

  const mockWindowFail = {
    location: {
      search: '',
      pathname: '/login.html',
      replace: (url) => { replacedLocation = url; },
      set href(url) { assignedLocation = url; },
      get href() { return replacedLocation || assignedLocation || '/login.html'; }
    },
    localStorage: mockLocalStorage,
    document: mockDocument,
    addEventListener: () => {}
  };

  runAuthContext(mockWindowFail, mockFetchFailure);
  loginIdentifier.value = '01156379992';
  loginPassword.value = 'IncorrectPassword!';

  const submitFailHandlers = loginForm.listeners['submit'];
  await submitFailHandlers[submitFailHandlers.length - 1]({ preventDefault: () => {} });

  assert(replacedLocation === null, 'No redirect occurs on failed login');
  assert(mockLocalStorage.getItem('miqat_user') === null, 'No customer session stored on failed login');
  assert(authStatusBox.classList.contains('is-visible'), 'Error status alert is displayed on failed login');
  assert(!submitBtn.classList.contains('is-loading'), 'Submit button loading state cleared so customer can retry');

  console.log('\n====================================================');
  console.log(` DOM TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('====================================================');
  process.exit(passed === total ? 0 : 1);
}

runDomTest().catch(err => {
  console.error('DOM test failure:', err);
  process.exit(1);
});
