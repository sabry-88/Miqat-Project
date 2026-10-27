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
 * Utility: Send JSON response
 */
function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
        role: user.role
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
