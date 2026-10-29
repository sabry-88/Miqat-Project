/**
 * MIQAT PLATFORM — SECURE ADMINISTRATOR PROVISIONING UTILITY
 * 
 * Narrow CLI utility to provision or update an authorized administrator account
 * without committing hardcoded credentials to repository or frontend code.
 * 
 * Usage:
 *   node server/bootstrap-admin.js --phone 01000000001 --password SecretPass123# --name "Admin Name"
 *   OR via environment variables:
 *   MIQAT_ADMIN_PHONE=01000000001 MIQAT_ADMIN_PASSWORD=SecretPass123# node server/bootstrap-admin.js
 */

const db = require('./db');

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
      parsed[key] = val;
    }
  }
  return parsed;
}

const args = parseArgs();
const phone = args.phone || process.env.MIQAT_ADMIN_PHONE;
const password = args.password || process.env.MIQAT_ADMIN_PASSWORD;
const name = args.name || process.env.MIQAT_ADMIN_NAME || 'مدير النظام المعتمد';
const email = args.email || process.env.MIQAT_ADMIN_EMAIL || 'admin@miqat.test';

if (!phone || !password) {
  console.error('\n[Error] Admin phone and password are required.');
  console.error('Usage: node server/bootstrap-admin.js --phone <PHONE> --password <PASSWORD> [--name <NAME>] [--email <EMAIL>]\n');
  process.exit(1);
}

if (String(password).length < 8) {
  console.error('\n[Error] Admin password must be at least 8 characters.\n');
  process.exit(1);
}

try {
  const admin = db.provisionAdminUser({ phone, password, name, email });
  console.log('\n=======================================================');
  console.log('  MIQAT ADMIN ACCOUNT SUCCESSFULLY PROVISIONED        ');
  console.log(`  Admin ID:    ${admin.id}`);
  console.log(`  Name:        ${admin.name}`);
  console.log(`  Phone:       ${admin.phone}`);
  console.log(`  Email:       ${admin.email || 'N/A'}`);
  console.log(`  Role:        ${admin.role}`);
  console.log('=======================================================\n');
  process.exit(0);
} catch (err) {
  console.error('\n[Error] Failed to provision admin:', err.message, '\n');
  process.exit(1);
}

