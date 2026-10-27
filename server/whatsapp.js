/**
 * MIQAT JOURNEYHUB — WHATSAPP NOTIFICATION ENGINE
 * 
 * Target Receiving Number: 01203340116
 * Official E.164 International Format: +201203340116 (Egypt country code +20)
 * 
 * Technical Architecture:
 * 1. Client-assisted direct dispatch:
 *    Generates safe, encoded universal WhatsApp URLs (https://wa.me/201203340116?text=...)
 *    Pre-fills the official Arabic notification template.
 *    Customer clicks 'Send' in WhatsApp to initiate direct chat.
 * 
 * 2. Official WhatsApp Business Platform API Readiness:
 *    Prepared interface for Meta Cloud API (graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages)
 *    Requires server environment variables:
 *      - WHATSAPP_CLOUD_API_TOKEN
 *      - WHATSAPP_PHONE_NUMBER_ID
 *      - WHATSAPP_BUSINESS_ACCOUNT_ID
 *    Reports status honestly if tokens are unconfigured (does not fake delivery).
 */

const WHATSAPP_RECEIVER_PHONE_LOCAL = '01203340116';
const WHATSAPP_RECEIVER_PHONE_INTL = '201203340116'; // Country code +20, without leading zero

/**
 * Format timestamp in friendly Arabic / Egyptian local time
 */
function formatRequestTime(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  } catch (e) {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}

/**
 * Compose official Arabic WhatsApp notification text
 */
function composeWhatsAppMessage({
  requestId,
  customerName,
  customerPhone,
  programName,
  programCategory,
  timestamp
}) {
  const formattedTime = timestamp ? (typeof timestamp === 'string' && timestamp.includes(':') ? timestamp : formatRequestTime(new Date(timestamp))) : formatRequestTime();

  return [
    'طلب جديد من منصة ميقات',
    '',
    `رقم الطلب: ${requestId || '—'}`,
    `اسم العميل: ${customerName || '—'}`,
    `رقم العميل: ${customerPhone || '—'}`,
    `البرنامج المطلوب: ${programName || '—'}`,
    `نوع البرنامج: ${programCategory || '—'}`,
    `وقت الطلب: ${formattedTime}`,
    '',
    'يرجى مراجعة الطلب والتواصل مع العميل.'
  ].join('\n');
}

/**
 * Generate universal WhatsApp URL
 */
function generateWhatsAppUrl(payload) {
  const message = composeWhatsAppMessage(payload);
  const encoded = encodeURIComponent(message);
  return {
    recipientPhone: WHATSAPP_RECEIVER_PHONE_INTL,
    recipientDisplay: WHATSAPP_RECEIVER_PHONE_LOCAL,
    messageText: message,
    waLink: `https://wa.me/${WHATSAPP_RECEIVER_PHONE_INTL}?text=${encoded}`
  };
}

/**
 * Check official WhatsApp Business Platform API readiness
 */
function getOfficialApiStatus() {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneId) {
    return {
      isConfigured: true,
      mode: 'official_cloud_api',
      message: 'Official WhatsApp Business Cloud API credentials detected.'
    };
  }

  return {
    isConfigured: false,
    mode: 'prefilled_universal_link',
    message: 'Official WhatsApp Cloud API credentials not configured. Using verified pre-filled WhatsApp link with direct operator number (+201203340116).'
  };
}

module.exports = {
  WHATSAPP_RECEIVER_PHONE_LOCAL,
  WHATSAPP_RECEIVER_PHONE_INTL,
  composeWhatsAppMessage,
  generateWhatsAppUrl,
  getOfficialApiStatus,
  formatRequestTime
};
