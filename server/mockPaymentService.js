/**
 * MIQAT JOURNEYHUB — MOCK PAYMENT ENGINE & STATE MACHINE
 * 
 * Production-oriented simulated payments engine:
 * 1. Authoritative backend pricing validation (Zero trust for frontend prices)
 * 2. Strict state machine transitions (Pending -> Paid | Failed | Cancelled; Paid -> Refunded)
 * 3. Idempotent initiation and duplicate submission prevention
 * 4. Atomic database-level refund execution with uniqueness protection
 * 5. Complete isolation between customer accounts
 */

const crypto = require('crypto');
const db = require('./db');

/**
 * Verified Program Base Prices (Authoritative Integer in EGP)
 * Only programs with price_verified === 1 in the database have authoritative numeric prices.
 */
const VERIFIED_PROGRAM_BASE_PRICES = {
  umrah_economy: 33000,
  umrah_premium: 62000
};

/**
 * Generate Unique Payment Transaction Reference
 * Format: MQT-PAY-YYYYMMDD-XXXXX (e.g. MQT-PAY-20261029-7B8A2)
 */
function generatePaymentReference() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `MQT-PAY-${y}${m}${d}-${rand}`;
}

/**
 * Check Authoritative Program Pricing
 * Strictly enforces that unverified programs cannot be paid for until officially confirmed.
 */
function getProgramPricing(programId) {
  if (!programId) {
    return { isEligible: false, reason: 'PROGRAM_ID_REQUIRED' };
  }

  const program = db.getProgramById(programId);
  if (!program) {
    return { isEligible: false, reason: 'PROGRAM_NOT_FOUND' };
  }

  // Check database price_verified flag
  if (program.price_verified !== 1 || !VERIFIED_PROGRAM_BASE_PRICES[program.id]) {
    return {
      isEligible: false,
      isPriceUnverified: true,
      programId: program.id,
      programTitleAr: program.title_ar,
      programTitleEn: program.title_en,
      category: program.category,
      reason: 'PRICING_UNVERIFIED',
      messageAr: 'هذا البرنامج يتطلب تأكيد السعر الرسمي من إدارة ميقات قبل إتمام الدفع.',
      messageEn: 'This program requires official price confirmation from Miqat administration before payment.'
    };
  }

  const unitPrice = VERIFIED_PROGRAM_BASE_PRICES[program.id];
  return {
    isEligible: true,
    isPriceUnverified: false,
    programId: program.id,
    programTitleAr: program.title_ar,
    programTitleEn: program.title_en,
    category: program.category,
    currency: 'EGP',
    unitPrice
  };
}

/**
 * Preview Payment Calculation
 */
function previewPayment({ programId, travelersCount = 1, paymentOption = 'full' }) {
  const count = parseInt(travelersCount, 10);
  if (isNaN(count) || count < 1 || count > 5) {
    throw new Error('TRAVELERS_COUNT_INVALID');
  }

  const pricing = getProgramPricing(programId);
  if (!pricing.isEligible) {
    return pricing;
  }

  const packageTotal = pricing.unitPrice * count;
  const isDeposit = String(paymentOption || '').toLowerCase() === 'deposit_30' || String(paymentOption || '').toLowerCase() === 'deposit';
  const depositAmount = Math.round((packageTotal * 30) / 100);
  const remainingAmount = isDeposit ? (packageTotal - depositAmount) : 0;
  const totalAmount = isDeposit ? depositAmount : packageTotal;

  return {
    isEligible: true,
    programId: pricing.programId,
    programTitleAr: pricing.programTitleAr,
    programTitleEn: pricing.programTitleEn,
    category: pricing.category,
    travelersCount: count,
    currency: pricing.currency,
    unitPrice: pricing.unitPrice,
    packageTotal,
    paymentOption: isDeposit ? 'deposit_30' : 'full',
    depositAmount,
    remainingAmount,
    totalAmount,
    isSimulated: true,
    noticeAr: 'عملية دفع تجريبية — لا يتم خصم أي أموال حقيقية',
    noticeEn: 'Simulated Test Payment — No real money will be charged'
  };
}

/**
 * Initiate Payment Attempt (Pending)
 */
function initiatePayment({
  customerUser,
  programId,
  travelersCount = 1,
  paymentOption = 'full',
  requestId = null,
  idempotencyKey = null
}) {
  if (!customerUser || !customerUser.id) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }

  // Check Idempotency Key
  if (idempotencyKey) {
    const existing = db.getPaymentByIdempotencyKey(idempotencyKey);
    if (existing) {
      if (existing.customer_id !== customerUser.id) {
        throw new Error('IDEMPOTENCY_KEY_COLLISION');
      }
      return existing;
    }
  }

  const count = parseInt(travelersCount, 10);
  if (isNaN(count) || count < 1 || count > 5) {
    throw new Error('TRAVELERS_COUNT_INVALID');
  }

  // Authoritative Pricing check
  const pricing = getProgramPricing(programId);
  if (!pricing.isEligible) {
    const err = new Error(pricing.messageAr || 'PRICING_UNVERIFIED');
    err.code = 'PRICING_UNVERIFIED';
    err.details = pricing;
    throw err;
  }

  // Validate optional Request ID
  let validRequestId = null;
  if (requestId) {
    const reqRecord = db.getRequestById(requestId);
    if (reqRecord) {
      validRequestId = reqRecord.id;
    }
  }

  const packageTotal = pricing.unitPrice * count;
  const isDeposit = String(paymentOption || '').toLowerCase() === 'deposit_30' || String(paymentOption || '').toLowerCase() === 'deposit';
  const depositAmount = Math.round((packageTotal * 30) / 100);
  const remainingAmount = isDeposit ? (packageTotal - depositAmount) : 0;
  const totalAmount = isDeposit ? depositAmount : packageTotal;

  const paymentId = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const reference = generatePaymentReference();

  return db.createPaymentRecord({
    id: paymentId,
    reference,
    customerId: customerUser.id,
    customerName: customerUser.name,
    customerPhone: customerUser.phone,
    customerEmail: customerUser.email || null,
    requestId: validRequestId,
    programId: pricing.programId,
    programTitleAr: pricing.programTitleAr,
    programTitleEn: pricing.programTitleEn,
    travelersCount: count,
    currency: pricing.currency,
    unitPrice: pricing.unitPrice,
    packageTotal,
    paymentOption: isDeposit ? 'deposit_30' : 'full',
    remainingAmount,
    totalAmount,
    status: 'Pending',
    simulatedMethod: 'mock_card',
    idempotencyKey: idempotencyKey || null
  });
}

/**
 * Process Simulated Payment Scenario
 * Allowed outcomes: 'success' | 'fail' | 'cancel'
 */
function processPaymentSimulation({ paymentReference, customerId, scenario = 'success' }) {
  if (!paymentReference) {
    throw new Error('PAYMENT_REFERENCE_REQUIRED');
  }

  const payment = db.getPaymentByReference(paymentReference);
  if (!payment) {
    const err = new Error('PAYMENT_NOT_FOUND');
    err.code = 'NOT_FOUND';
    throw err;
  }

  // Enforce customer ownership
  if (payment.customer_id !== customerId) {
    const err = new Error('PAYMENT_ACCESS_DENIED');
    err.code = 'FORBIDDEN';
    throw err;
  }

  // Idempotency check: If already paid and success is requested again, return existing
  if (payment.status === 'Paid') {
    if (scenario === 'success') {
      return payment;
    }
    const err = new Error('PAID_PAYMENT_CANNOT_CHANGE');
    err.code = 'CONFLICT';
    throw err;
  }

  // Terminal state check
  if (payment.status === 'Refunded') {
    const err = new Error('PAYMENT_ALREADY_REFUNDED');
    err.code = 'CONFLICT';
    throw err;
  }

  // Only 'Pending' payments can be processed
  if (payment.status !== 'Pending') {
    const err = new Error(`CANNOT_PROCESS_STATUS_${payment.status}`);
    err.code = 'CONFLICT';
    throw err;
  }

  const cleanScenario = String(scenario).toLowerCase().trim();
  const now = new Date().toISOString();

  if (cleanScenario === 'success') {
    return db.updatePaymentStatus(paymentReference, {
      status: 'Paid',
      paidAt: now,
      actor: payment.customer_name,
      details: `Simulated payment of ${payment.total_amount} ${payment.currency} succeeded. Auth code: MOCK-AUTH-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
    });
  } else if (cleanScenario === 'fail') {
    return db.updatePaymentStatus(paymentReference, {
      status: 'Failed',
      failureReason: 'Simulated card authorization decline (Insufficient test balance or bank decline)',
      actor: payment.customer_name,
      details: 'Customer initiated test payment simulation with failure scenario.'
    });
  } else if (cleanScenario === 'cancel') {
    return db.updatePaymentStatus(paymentReference, {
      status: 'Cancelled',
      failureReason: 'Transaction cancelled by customer before completion',
      actor: payment.customer_name,
      details: 'Customer manually aborted simulated checkout.'
    });
  } else {
    const err = new Error('INVALID_SIMULATION_SCENARIO');
    err.code = 'BAD_REQUEST';
    throw err;
  }
}

/**
 * Execute Mock Refund (Administrator Only)
 */
function executeMockRefund({ paymentReference, reason, adminUser }) {
  if (!adminUser || adminUser.role !== 'admin') {
    const err = new Error('ADMIN_AUTHORIZATION_REQUIRED');
    err.code = 'FORBIDDEN';
    throw err;
  }

  const cleanReason = (reason || '').trim();
  if (!cleanReason || cleanReason.length < 5 || cleanReason.length > 500) {
    const err = new Error('REFUND_REASON_INVALID');
    err.code = 'BAD_REQUEST';
    throw err;
  }

  return db.executeRefundAtomic({
    paymentReference,
    reason: cleanReason,
    adminId: adminUser.id,
    adminName: adminUser.name
  });
}

module.exports = {
  VERIFIED_PROGRAM_BASE_PRICES,
  generatePaymentReference,
  getProgramPricing,
  previewPayment,
  initiatePayment,
  processPaymentSimulation,
  executeMockRefund
};

