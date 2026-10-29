/**
 * MIQAT JOURNEYHUB — PRODUCTION API & WEB SERVER
 * 
 * Serves:
 * 1. Semantic Static Web Assets for Miqat UI-UX
 * 2. RESTful APIs for Programs, Authentication, and Customer Request Persistence
 * 3. WhatsApp Integration Dispatch Engine
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const whatsapp = require('./whatsapp');
const mockPaymentService = require('./mockPaymentService');

const PORT = process.env.PORT || 4173;
const ROOT_DIR = path.resolve(__dirname, '..', 'Miqat UI-UX');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

/**
 * Utility: Parse JSON Request Body
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload Too Large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', err => reject(err));
  });
}

/**
 * Allowed CORS Origins for Local Frontend & Development
 */
const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4173',
  'http://127.0.0.1:4173'
]);

function getCorsHeaders(req) {
  const origin = req && req.headers ? req.headers['origin'] : null;
  const isAllowed = origin && (
    ALLOWED_ORIGINS.has(origin) ||
    /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
  );

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  }

  return headers;
}

/**
 * Utility: Send JSON response
 */
function sendJson(res, statusCode, data, headers = {}) {
  const cors = getCorsHeaders(res.req);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...cors,
    ...headers
  });
  res.end(JSON.stringify(data));
}

/**
 * Utility: Extract Session Token from Cookie or Header
 */
function getSessionUser(req) {
  let token = null;

  // Authorization Header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // Cookie
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const c of cookies) {
      const [k, v] = c.trim().split('=');
      if (k === 'miqat_session') {
        token = decodeURIComponent(v);
        break;
      }
    }
  }

  if (!token) return null;
  return db.getUserBySessionToken(token);
}

/**
 * Main HTTP Handler
 */
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    const cors = getCorsHeaders(req);
    res.writeHead(204, {
      ...cors,
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // ==================== REST APIS ====================

  // 1. GET /api/health
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJson(res, 200, {
      status: 'ok',
      service: 'Miqat JourneyHub Platform API',
      timestamp: new Date().toISOString(),
      whatsappReceiver: whatsapp.WHATSAPP_RECEIVER_PHONE_LOCAL
    });
  }

  // 2. GET /api/config/whatsapp
  if (pathname === '/api/config/whatsapp' && req.method === 'GET') {
    const apiStatus = whatsapp.getOfficialApiStatus();
    return sendJson(res, 200, {
      receiverPhoneLocal: whatsapp.WHATSAPP_RECEIVER_PHONE_LOCAL,
      receiverPhoneIntl: whatsapp.WHATSAPP_RECEIVER_PHONE_INTL,
      cloudApiStatus: apiStatus
    });
  }

  // 3. GET /api/programs
  if (pathname === '/api/programs' && req.method === 'GET') {
    const category = searchParams.get('category') || undefined;
    const tripType = searchParams.get('tripType') || undefined;
    const programs = db.getAllPrograms({ category, tripType });
    return sendJson(res, 200, {
      success: true,
      count: programs.length,
      data: programs
    });
  }

  // 4. GET /api/programs/:id
  if (pathname.startsWith('/api/programs/') && req.method === 'GET') {
    const programId = pathname.replace('/api/programs/', '').trim();
    const program = db.getProgramById(programId);
    if (!program) {
      return sendJson(res, 404, { success: false, error: 'Program not found' });
    }
    return sendJson(res, 200, { success: true, data: program });
  }

  // 5. POST /api/auth/login
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { identifier, password } = await parseJsonBody(req);
      if (!identifier || !password) {
        return sendJson(res, 400, { success: false, error: 'Identifier and password are required' });
      }

      const user = db.getUserByPhoneOrEmail(identifier);
      if (!user) {
        return sendJson(res, 401, { success: false, error: 'Invalid credentials' });
      }

      const isMatch = db.verifyPassword(password, user.password_salt, user.password_hash);
      if (!isMatch) {
        return sendJson(res, 401, { success: false, error: 'Invalid credentials' });
      }

      const { token, expiresAt } = db.createSession(user.id);
      const safeUser = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        governorate: user.governorate,
        role: user.role,
        created_at: user.created_at
      };

      const cookieHeader = `miqat_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`;
      return sendJson(res, 200, {
        success: true,
        user: safeUser,
        token
      }, { 'Set-Cookie': cookieHeader });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 6. GET /api/auth/me
  if (pathname === '/api/auth/me' && req.method === 'GET') {
    const user = getSessionUser(req);
    return sendJson(res, 200, {
      success: true,
      authenticated: Boolean(user),
      user: user || null
    });
  }

  // 7. POST /api/auth/logout
  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    let token = null;
    if (req.headers.cookie) {
      const match = req.headers.cookie.match(/miqat_session=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (token) db.deleteSession(token);

    const clearCookie = `miqat_session=; Path=/; HttpOnly; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    return sendJson(res, 200, { success: true }, { 'Set-Cookie': clearCookie });
  }

  // 7b. GET /api/account (Authoritative Customer Account Profile)
  if (pathname === '/api/account' && req.method === 'GET') {
    const user = getSessionUser(req);
    if (!user) {
      return sendJson(res, 401, { success: false, error: 'AUTH_REQUIRED', message: 'Authentication required' });
    }
    const freshUser = db.getUserById(user.id);
    if (!freshUser) {
      return sendJson(res, 404, { success: false, error: 'USER_NOT_FOUND', message: 'User record not found' });
    }
    return sendJson(res, 200, {
      success: true,
      user: freshUser
    });
  }

  // 7c. PUT/PATCH /api/account (Update Permitted Contact Fields: Phone & Email)
  if (pathname === '/api/account' && (req.method === 'PUT' || req.method === 'PATCH')) {
    try {
      const user = getSessionUser(req);
      if (!user) {
        return sendJson(res, 401, { success: false, error: 'AUTH_REQUIRED', message: 'Authentication required' });
      }

      const body = await parseJsonBody(req);

      // Name is strictly immutable through this account-update operation
      if (body.name !== undefined && body.name !== user.name) {
        return sendJson(res, 400, {
          success: false,
          error: 'NAME_IMMUTABLE',
          message: 'Modifying customer name is not permitted to preserve identity and booking integrity.'
        });
      }

      // Permitted update fields: phone, email
      let newPhone = user.phone;
      let newEmail = user.email;

      if (body.phone !== undefined) {
        const rawPhone = String(body.phone).trim();
        if (!rawPhone) {
          return sendJson(res, 400, {
            success: false,
            error: 'PHONE_EMPTY',
            message: 'Phone number cannot be empty.'
          });
        }
        const cleanPhone = db.normalizePhone(rawPhone);
        const egPhoneRegex = /^01[0125][0-9]{8}$/;
        if (!egPhoneRegex.test(cleanPhone)) {
          return sendJson(res, 400, {
            success: false,
            error: 'PHONE_INVALID',
            message: 'Invalid Egyptian mobile number format. Must be 11 digits starting with 01.'
          });
        }

        // Check uniqueness if changing
        if (cleanPhone !== user.phone) {
          const conflict = db.checkPhoneOrEmailExists(cleanPhone, null, user.id);
          if (conflict && conflict.conflict === 'phone') {
            return sendJson(res, 409, {
              success: false,
              error: 'PHONE_EXISTS',
              message: 'Phone number is already registered to another account.'
            });
          }
        }
        newPhone = cleanPhone;
      }

      if (body.email !== undefined) {
        const rawEmail = body.email ? String(body.email).trim() : '';
        if (rawEmail) {
          const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
          if (!emailRegex.test(rawEmail)) {
            return sendJson(res, 400, {
              success: false,
              error: 'EMAIL_INVALID',
              message: 'Invalid email address format.'
            });
          }

          // Check uniqueness if changing
          if (!user.email || rawEmail.toLowerCase() !== user.email.toLowerCase()) {
            const conflict = db.checkPhoneOrEmailExists(null, rawEmail, user.id);
            if (conflict && conflict.conflict === 'email') {
              return sendJson(res, 409, {
                success: false,
                error: 'EMAIL_EXISTS',
                message: 'Email address is already registered to another account.'
              });
            }
          }
          newEmail = rawEmail;
        } else {
          newEmail = null;
        }
      }

      const updatedUser = db.updateUserProfile(user.id, { phone: newPhone, email: newEmail });

      return sendJson(res, 200, {
        success: true,
        message: 'Account updated successfully',
        user: updatedUser
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: 'SERVER_ERROR', message: err.message });
    }
  }

  // 8. POST /api/requests (Submit Program Details Inquiry)
  if (pathname === '/api/requests' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const sessionUser = getSessionUser(req);

      const customerId = sessionUser ? sessionUser.id : (body.customerId || null);
      const customerName = (sessionUser ? sessionUser.name : body.customerName || '').trim();
      const customerPhone = (sessionUser ? sessionUser.phone : body.customerPhone || '').trim();
      const customerEmail = (sessionUser ? sessionUser.email : body.customerEmail || '').trim() || null;
      const customerGovernorate = sessionUser ? sessionUser.governorate : (body.customerGovernorate || null);
      const programId = (body.programId || '').trim();
      const notes = (body.notes || '').trim() || null;

      // Validation
      if (!customerName) {
        return sendJson(res, 400, { success: false, error: 'Customer name is required' });
      }
      if (!customerPhone) {
        return sendJson(res, 400, { success: false, error: 'Customer phone is required' });
      }
      if (!programId) {
        return sendJson(res, 400, { success: false, error: 'Program ID is required' });
      }

      // Create persistent database record
      const requestRecord = db.createRequest({
        customerId,
        customerName,
        customerPhone,
        customerEmail,
        customerGovernorate,
        programId,
        notes
      });

      // Prepare official WhatsApp notification dispatch payload
      const waInfo = whatsapp.generateWhatsAppUrl({
        requestId: requestRecord.id,
        customerName: requestRecord.customer_name,
        customerPhone: requestRecord.customer_phone,
        programName: requestRecord.program_name,
        programCategory: requestRecord.program_category,
        timestamp: requestRecord.created_at
      });

      return sendJson(res, 201, {
        success: true,
        request: requestRecord,
        whatsapp: {
          recipientLocal: waInfo.recipientDisplay,
          recipientIntl: waInfo.recipientPhone,
          messageText: waInfo.messageText,
          waLink: waInfo.waLink,
          status: 'ready_to_send',
          instructionAr: 'اضغط على زر فتح واتساب للانتقال إلى المحادثة المباشرة مع فريق ميقات (يرجى الضغط على زر إرسال في واتساب).'
        }
      });
    } catch (err) {
      console.error('Request creation error:', err);
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 9. POST /api/requests/:id/whatsapp-dispatched
  if (pathname.startsWith('/api/requests/') && pathname.endsWith('/whatsapp-dispatched') && req.method === 'POST') {
    const parts = pathname.split('/');
    const requestId = parts[3];
    const updated = db.recordWhatsAppDispatched(requestId);
    if (!updated) {
      return sendJson(res, 404, { success: false, error: 'Request not found' });
    }
    return sendJson(res, 200, { success: true, request: updated });
  }

  // 10. GET /api/requests (Admin & Assignment Workflow)
  if (pathname === '/api/requests' && req.method === 'GET') {
    const status = searchParams.get('status') || undefined;
    const programId = searchParams.get('programId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const requests = db.getAllRequests({ status, programId, limit, offset });
    return sendJson(res, 200, {
      success: true,
      count: requests.length,
      data: requests
    });
  }

  // 11. PATCH /api/requests/:id (Status / Employee Assignment)
  if (pathname.startsWith('/api/requests/') && req.method === 'PATCH') {
    try {
      const requestId = pathname.replace('/api/requests/', '').trim();
      const body = await parseJsonBody(req);
      const sessionUser = getSessionUser(req);
      const actor = sessionUser ? sessionUser.name : 'Admin API';

      const updated = db.updateRequestStatus(requestId, {
        status: body.status,
        assignedEmployee: body.assignedEmployee,
        notes: body.notes,
        actor
      });

      if (!updated) {
        return sendJson(res, 404, { success: false, error: 'Request not found' });
      }

      return sendJson(res, 200, { success: true, request: updated });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==================== PAYMENT REST APIS ====================

  // 12. GET /api/payments/preview (Authoritative Price Calculation)
  if (pathname === '/api/payments/preview' && req.method === 'GET') {
    try {
      const programId = searchParams.get('programId');
      const travelersCount = searchParams.get('travelers') || searchParams.get('travelersCount') || 1;
      const paymentOption = searchParams.get('paymentOption') || searchParams.get('option') || 'full';
      const preview = mockPaymentService.previewPayment({ programId, travelersCount, paymentOption });
      return sendJson(res, 200, { success: true, data: preview });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 13. POST /api/payments/initiate (Create Pending Payment Attempt)
  if (pathname === '/api/payments/initiate' && req.method === 'POST') {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser) {
        return sendJson(res, 401, { success: false, error: 'Authentication required' });
      }

      const body = await parseJsonBody(req);
      const programId = body.programId;
      const travelersCount = body.travelersCount || 1;
      const paymentOption = body.paymentOption || 'full';
      const requestId = body.requestId || null;
      const idempotencyKey = body.idempotencyKey || null;

      const payment = mockPaymentService.initiatePayment({
        customerUser: sessionUser,
        programId,
        travelersCount,
        paymentOption,
        requestId,
        idempotencyKey
      });

      return sendJson(res, 201, { success: true, payment });
    } catch (err) {
      if (err.code === 'PRICING_UNVERIFIED') {
        return sendJson(res, 422, { success: false, error: err.message, code: err.code, details: err.details });
      }
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 14. POST /api/payments/:reference/process (Simulate Outcome)
  if (pathname.startsWith('/api/payments/') && pathname.endsWith('/process') && req.method === 'POST') {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser) {
        return sendJson(res, 401, { success: false, error: 'Authentication required' });
      }

      const parts = pathname.split('/');
      const reference = parts[3];
      const body = await parseJsonBody(req);
      const scenario = body.scenario || 'success';

      const updated = mockPaymentService.processPaymentSimulation({
        paymentReference: reference,
        customerId: sessionUser.id,
        scenario
      });

      return sendJson(res, 200, { success: true, payment: updated });
    } catch (err) {
      if (err.code === 'NOT_FOUND') return sendJson(res, 404, { success: false, error: err.message });
      if (err.code === 'FORBIDDEN') return sendJson(res, 403, { success: false, error: err.message });
      if (err.code === 'CONFLICT') return sendJson(res, 409, { success: false, error: err.message });
      return sendJson(res, 400, { success: false, error: err.message });
    }
  }

  // 15. GET /api/payments/my (Authenticated Customer Transactions Only)
  if (pathname === '/api/payments/my' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }

    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const items = db.getPaymentsByCustomerId(sessionUser.id, { status, limit, offset });
    return sendJson(res, 200, { success: true, count: items.length, data: items });
  }

  // 16. GET /api/payments/admin (Admin Only Transactions Search & Inspection)
  if (pathname === '/api/payments/admin' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'admin') {
      return sendJson(res, 403, { success: false, error: 'Admin authorization required' });
    }

    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const items = db.getAllPaymentsAdmin({ search, status, limit, offset });
    return sendJson(res, 200, { success: true, count: items.length, data: items });
  }

  // 17. POST /api/payments/:reference/refund (Admin Only Mock Refund Execution)
  if (pathname.startsWith('/api/payments/') && pathname.endsWith('/refund') && req.method === 'POST') {
    try {
      const sessionUser = getSessionUser(req);
      if (!sessionUser) {
        return sendJson(res, 401, { success: false, error: 'Authentication required' });
      }
      if (sessionUser.role !== 'admin') {
        return sendJson(res, 403, { success: false, error: 'Admin authorization required' });
      }

      const parts = pathname.split('/');
      const reference = parts[3];
      const body = await parseJsonBody(req);
      const reason = body.reason;

      const refunded = mockPaymentService.executeMockRefund({
        paymentReference: reference,
        reason,
        adminUser: sessionUser
      });

      return sendJson(res, 200, { success: true, payment: refunded });
    } catch (err) {
      if (err.message === 'REFUND_REASON_INVALID') {
        return sendJson(res, 400, { success: false, error: 'A valid non-empty refund reason (5-500 characters) is required.' });
      }
      if (err.message === 'PAYMENT_NOT_FOUND') {
        return sendJson(res, 404, { success: false, error: 'Payment not found' });
      }
      if (err.message === 'PAYMENT_NOT_ELIGIBLE_FOR_REFUND' || err.message === 'PAYMENT_ALREADY_REFUNDED' || err.message === 'PAYMENT_STATUS_CONFLICT') {
        return sendJson(res, 409, { success: false, error: err.message });
      }
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 18. GET /api/payments/:reference (Payment & Receipt Details)
  if (pathname.startsWith('/api/payments/') && !pathname.includes('/process') && !pathname.includes('/refund') && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }

    const reference = pathname.replace('/api/payments/', '').trim();
    const payment = db.getPaymentByReference(reference);
    if (!payment) {
      return sendJson(res, 404, { success: false, error: 'Payment not found' });
    }

    // Access guard: Customer must own transaction OR user must be admin
    if (sessionUser.role !== 'admin' && payment.customer_id !== sessionUser.id) {
      return sendJson(res, 403, { success: false, error: 'Access denied' });
    }

    return sendJson(res, 200, { success: true, payment });
  }

  // ==================== STATIC FILE SERVING ====================
  let reqPath = decodeURIComponent(pathname);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(ROOT_DIR, reqPath);

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': mime,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': (ext === '.html' || ext === '.css') ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`=======================================================`);
  console.log(`  MIQAT JOURNEYHUB PLATFORM SERVER IS RUNNING          `);
  console.log(`  Local URL: http://127.0.0.1:${PORT}/                 `);
  console.log(`  Programs API: http://127.0.0.1:${PORT}/api/programs `);
  console.log(`  Requests API: http://127.0.0.1:${PORT}/api/requests `);
  console.log(`  WhatsApp Receiver: +${whatsapp.WHATSAPP_RECEIVER_PHONE_INTL} (${whatsapp.WHATSAPP_RECEIVER_PHONE_LOCAL})`);
  console.log(`=======================================================`);
});
