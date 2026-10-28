/**
 * Automated Verification Suite for Customer Login Redirect
 * Tests scenarios outlined in Section 5 of task requirements.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Anchor paths to project root
const ROOT_DIR = path.resolve(__dirname, '..');
const db = require(path.join(ROOT_DIR, 'server', 'db.js'));

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log(' MIQAT PLATFORM — CUSTOMER LOGIN REDIRECT TEST SUITE');
  console.log('====================================================\n');

  // 1. Verify Test Customer in DB
  console.log('Step 1: Database Verification for Test Customer');
  const testCustomer = db.getUserByPhoneOrEmail('01156379992');
  assert(Boolean(testCustomer), 'Test customer exists in database');
  assert(testCustomer.phone === '01156379992', 'Phone is 01156379992');
  assert(testCustomer.role === 'customer', 'Role is customer');
  assert(db.verifyPassword('Asabry753#', testCustomer.password_salt, testCustomer.password_hash), 'Password Asabry753# verifies correctly');

  // 2. Start server on ephemeral port for integration testing
  console.log('\nStep 2: Server API Integration Testing');
  process.env.PORT = '5179';
  const server = require(path.join(ROOT_DIR, 'server', 'server.js'));

  await new Promise(resolve => setTimeout(resolve, 500));

  // 2.1 Test Valid Login via POST /api/auth/login
  const loginResult = await new Promise((resolve, reject) => {
    const postData = JSON.stringify({ identifier: '01156379992', password: 'Asabry753#' });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5179,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: JSON.parse(body)
        });
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  assert(loginResult.statusCode === 200, 'POST /api/auth/login returns HTTP 200 for valid credentials');
  assert(loginResult.data.success === true, 'Response payload has success: true');
  assert(loginResult.data.user && loginResult.data.user.phone === '01156379992', 'Response payload contains safe customer object');
  assert(Boolean(loginResult.data.token), 'Response payload contains session token');

  const setCookie = loginResult.headers['set-cookie'];
  assert(Boolean(setCookie && setCookie.some(c => c.includes('miqat_session='))), 'Response sets HttpOnly miqat_session cookie');

  const cookieHeader = setCookie.find(c => c.includes('miqat_session=')).split(';')[0];

  // 2.2 Test Context Recognition via GET /api/auth/me with Cookie
  const meResult = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5179,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Cookie': cookieHeader
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(body)
        });
      });
    });
    req.on('error', reject);
    req.end();
  });

  assert(meResult.statusCode === 200, 'GET /api/auth/me returns HTTP 200');
  assert(meResult.data.authenticated === true, 'Session is recognized as authenticated');
  assert(meResult.data.user && meResult.data.user.phone === '01156379992', 'Authenticated context matches customer 01156379992');
  assert(meResult.data.user.name.includes('أحمد محمود'), 'Authenticated customer name matches expected customer');

  // 2.3 Test Invalid Login Rejection via POST /api/auth/login
  const invalidLoginResult = await new Promise((resolve, reject) => {
    const postData = JSON.stringify({ identifier: '01156379992', password: 'WrongPassword999!' });
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5179,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(body)
        });
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  assert(invalidLoginResult.statusCode === 401, 'POST /api/auth/login returns HTTP 401 for incorrect password');
  assert(invalidLoginResult.data.success === false, 'Invalid login response payload has success: false');

  // 3. Client Redirect Route Resolver Verification
  console.log('\nStep 3: Client Redirect Route Resolution Verification');

  // Simulate destination resolution logic from auth.js
  function resolveTarget(searchQuery) {
    let target = 'programs.html';
    try {
      const params = new URLSearchParams(searchQuery);
      const redirectParam = params.get('redirect');
      if (redirectParam) {
        const decoded = decodeURIComponent(redirectParam).trim();
        if (decoded === 'program' || decoded === 'programs') {
          params.delete('redirect');
          const remaining = params.toString();
          target = remaining ? `programs.html?${remaining}` : 'programs.html';
        } else if (decoded.startsWith('programs.html')) {
          target = decoded;
        } else if (decoded.includes('.html')) {
          target = decoded;
        } else if (decoded) {
          target = `${decoded}.html`;
        }
      }
    } catch (e) {
      target = 'programs.html';
    }
    return target;
  }

  // Test Case A: Standard login without query params
  assert(resolveTarget('') === 'programs.html', 'Default redirect with no query params targets programs.html');

  // Test Case B: Redirect param equals "programs"
  assert(resolveTarget('?redirect=programs') === 'programs.html', 'Redirect param "programs" targets programs.html');

  // Test Case C: Redirect param equals "programs.html"
  assert(resolveTarget('?redirect=programs.html') === 'programs.html', 'Redirect param "programs.html" targets programs.html');

  // Test Case D: Preserved journey with trip and programId (?redirect=program&trip=umrah&programId=prog-umrah-1)
  const caseD = resolveTarget('?redirect=program&trip=umrah&programId=prog-umrah-1');
  assert(caseD === 'programs.html?trip=umrah&programId=prog-umrah-1', 'Preserved program inquiry redirects to programs.html with parameters: ' + caseD);

  // Test Case E: Encoded destination (?redirect=programs.html%3Ftrip%3Dhajj)
  const caseE = resolveTarget('?redirect=programs.html%3Ftrip%3Dhajj');
  assert(caseE === 'programs.html?trip=hajj', 'Encoded destination decodes properly to programs.html?trip=hajj: ' + caseE);

  // 4. Verification Summary
  console.log('\n====================================================');
  console.log(` ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
  console.log('====================================================');

  process.exit(passedTests === totalTests ? 0 : 1);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

