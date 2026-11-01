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
const companyMockData = require('./companyMockData');

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
        company_name: user.company_name || (user.role === 'company' ? user.name : null),
        responsible_person: user.responsible_person || null,
        license_number: user.license_number || null,
        status: user.status || 'active',
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

  // 7c. GET /api/company/dashboard (Partner Company Dashboard Analytics)
  if (pathname === '/api/company/dashboard' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const period = searchParams.get('period') || 'all';
    const specificDate = searchParams.get('date') || null;
    const metrics = companyMockData.getDashboardMetrics(period, specificDate);

    // Merge authoritative session user details
    metrics.company = {
      ...metrics.company,
      id: sessionUser.id,
      name: sessionUser.name,
      responsible_person: sessionUser.responsible_person || 'محمد سعيد',
      phone: sessionUser.phone,
      email: sessionUser.email,
      governorate: sessionUser.governorate || 'الجيزة',
      license_number: sessionUser.license_number || '47852',
      status: sessionUser.status || 'active'
    };

    return sendJson(res, 200, {
      success: true,
      data: metrics
    });
  }

  // 7d. GET /api/company/profile (Partner Company Profile)
  if (pathname === '/api/company/profile' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    return sendJson(res, 200, {
      success: true,
      company: {
        id: sessionUser.id,
        name: sessionUser.name,
        company_name: sessionUser.company_name || sessionUser.name,
        responsible_person: sessionUser.responsible_person || 'محمد سعيد',
        phone: sessionUser.phone,
        email: sessionUser.email,
        governorate: sessionUser.governorate || 'الجيزة',
        license_number: sessionUser.license_number || '47852',
        role: sessionUser.role,
        status: sessionUser.status || 'active',
        created_at: sessionUser.created_at
      }
    });
  }

  // 7e. GET /api/company/bookings (Partner Company Bookings List)
  if (pathname === '/api/company/bookings' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const search = searchParams.get('search') || '';
    const program = searchParams.get('program') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    const bookingStatus = searchParams.get('bookingStatus') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';

    const bookings = companyMockData.getBookings({ search, program, dateFrom, dateTo, bookingStatus, paymentStatus });

    return sendJson(res, 200, {
      success: true,
      totalCount: companyMockData.RAW_BOOKINGS.length,
      filteredCount: bookings.length,
      data: bookings
    });
  }

  // 7e-2. GET /api/company/financial-overview (Partner Company Authoritative Financial Overview & Ledger)
  if (pathname === '/api/company/financial-overview' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const period = searchParams.get('period') || 'all';
    const search = searchParams.get('search') || '';
    const program = searchParams.get('program') || 'all';
    const source = searchParams.get('source') || 'all';
    const method = searchParams.get('method') || 'all';
    const verification = searchParams.get('verification') || 'all';

    const finData = companyMockData.getFinancialOverviewData({
      period,
      search,
      program,
      source,
      method,
      verification
    });

    finData.company = {
      ...finData.company,
      id: sessionUser.id,
      name: sessionUser.name,
      responsible_person: sessionUser.responsible_person || 'محمد سعيد',
      phone: sessionUser.phone,
      email: sessionUser.email,
      governorate: sessionUser.governorate || 'الجيزة',
      license_number: sessionUser.license_number || '47852',
      status: sessionUser.status || 'active'
    };

    return sendJson(res, 200, {
      success: true,
      data: finData
    });
  }

  // 7f. GET /api/company/bookings/:id (Single Booking Details)
  if (pathname.startsWith('/api/company/bookings/') && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) {
      return sendJson(res, 401, { success: false, error: 'Authentication required' });
    }
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const bookingId = decodeURIComponent(pathname.replace('/api/company/bookings/', '').trim());
    const booking = companyMockData.getBookingById(bookingId);
    if (!booking) {
      return sendJson(res, 404, { success: false, error: 'Booking not found' });
    }

    return sendJson(res, 200, {
      success: true,
      data: booking
    });
  }

  // 7g. POST /api/company/bookings/:id/confirm (Confirm Booking)
  if (pathname.startsWith('/api/company/bookings/') && pathname.endsWith('/confirm') && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }
    const bookingId = decodeURIComponent(pathname.replace('/api/company/bookings/', '').replace('/confirm', '').trim());
    const result = companyMockData.confirmBooking(bookingId, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7h. POST /api/company/bookings/:id/report-payment (Report Remaining Payment Received)
  if (pathname.startsWith('/api/company/bookings/') && pathname.endsWith('/report-payment') && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }
    const bookingId = decodeURIComponent(pathname.replace('/api/company/bookings/', '').replace('/report-payment', '').trim());
    const body = await parseJsonBody(req);
    const result = companyMockData.reportPayment(bookingId, body, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7i. POST /api/company/bookings/:id/reject (Reject Booking with Reason)
  if (pathname.startsWith('/api/company/bookings/') && pathname.endsWith('/reject') && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }
    const bookingId = decodeURIComponent(pathname.replace('/api/company/bookings/', '').replace('/reject', '').trim());
    const body = await parseJsonBody(req);
    const result = companyMockData.rejectBooking(bookingId, body, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7j. POST /api/company/bookings/:id/request-program-change (Propose Program Replacement)
  if (pathname.startsWith('/api/company/bookings/') && pathname.endsWith('/request-program-change') && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }
    const bookingId = decodeURIComponent(pathname.replace('/api/company/bookings/', '').replace('/request-program-change', '').trim());
    const body = await parseJsonBody(req);
    const result = companyMockData.requestProgramChange(bookingId, body, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7k. GET /api/company/programs (Partner Company Programs List & Summary)
  if (pathname === '/api/company/programs' && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const filters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      type: searchParams.get('type') || 'all',
      status: searchParams.get('status') || 'all',
      availability: searchParams.get('availability') || 'all',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      duration: searchParams.get('duration') || 'all'
    };

    const programs = companyMockData.getCompanyPrograms(filters);
    const summary = companyMockData.getCompanyProgramsSummary();

    return sendJson(res, 200, {
      success: true,
      data: programs,
      summary,
      totalCount: programs.length
    });
  }

  // 7l. GET /api/company/programs/:id (Single Program Details & Booking Stats)
  if (pathname.startsWith('/api/company/programs/') && !pathname.includes('/upload') && req.method === 'GET') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const programId = decodeURIComponent(pathname.replace('/api/company/programs/', '').trim());
    const program = companyMockData.getCompanyProgramById(programId);
    if (!program) {
      return sendJson(res, 404, { success: false, error: 'Program not found' });
    }

    return sendJson(res, 200, {
      success: true,
      data: program
    });
  }

  // 7m. POST /api/company/programs (Create New Program)
  if (pathname === '/api/company/programs' && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const body = await parseJsonBody(req);
    const result = companyMockData.createCompanyProgram(body, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 201, result);
  }

  // 7n. PUT /api/company/programs/:id (Update Program Details / Pricing / Dates)
  if (pathname.startsWith('/api/company/programs/') && req.method === 'PUT') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const programId = decodeURIComponent(pathname.replace('/api/company/programs/', '').trim());
    const body = await parseJsonBody(req);
    const result = companyMockData.updateCompanyProgram(programId, body, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7o. DELETE /api/company/programs/:id (Archive or Delete Program)
  if (pathname.startsWith('/api/company/programs/') && req.method === 'DELETE') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    const programId = decodeURIComponent(pathname.replace('/api/company/programs/', '').trim());
    const result = companyMockData.archiveOrDeleteCompanyProgram(programId, sessionUser);
    if (!result.success) return sendJson(res, 400, result);
    return sendJson(res, 200, result);
  }

  // 7p. POST /api/company/upload (Image Upload with Persistence)
  if (pathname === '/api/company/upload' && req.method === 'POST') {
    const sessionUser = getSessionUser(req);
    if (!sessionUser) return sendJson(res, 401, { success: false, error: 'Authentication required' });
    if (sessionUser.role !== 'company' && sessionUser.role !== 'partner_company') {
      return sendJson(res, 403, { success: false, error: 'Partner company authorization required' });
    }

    try {
      const body = await parseJsonBody(req);
      const { image, filename } = body;
      if (!image) {
        return sendJson(res, 400, { success: false, error: 'No image data provided' });
      }

      // Check format and size
      const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return sendJson(res, 400, { success: false, error: 'Invalid base64 image data' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      if (buffer.length > 5 * 1024 * 1024) {
        return sendJson(res, 400, { success: false, error: 'Image size exceeds maximum limit of 5MB' });
      }

      let ext = '.jpg';
      if (mimeType === 'image/png') ext = '.png';
      else if (mimeType === 'image/webp') ext = '.webp';
      else if (mimeType === 'image/jpeg') ext = '.jpg';
      else {
        return sendJson(res, 400, { success: false, error: 'Unsupported image type. Allowed: JPG, PNG, WebP' });
      }

      const safeBaseName = (filename || 'program-img').replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `upload_${Date.now()}_${safeBaseName}${ext}`;
      const uploadDir = path.join(ROOT_DIR, 'assets', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      return sendJson(res, 200, {
        success: true,
        url: `./assets/uploads/${uniqueName}`,
        filename: uniqueName,
        size: buffer.length
      });
    } catch (err) {
      console.error('Image upload error:', err);
      return sendJson(res, 500, { success: false, error: 'Failed to process image upload' });
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
