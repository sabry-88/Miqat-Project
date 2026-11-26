/**
 * MIQAT SALES & CALL CENTER CRM — SECURE EMPLOYEE PROVISIONING & PASSWORD RESET CLI
 *
 * Idempotent CLI utility to provision or securely reset the password of a Sales & Call Center
 * employee account without hardcoding credentials in source code, logs, or shell history.
 *
 * Interactive usage (recommended — masks password input):
 *   node server/bootstrap-sales-employee.js --reset-password
 *
 * Non-interactive usage (via environment variable):
 *   MIQAT_SALES_PASSWORD="<secret>" node server/bootstrap-sales-employee.js --reset-password
 */

const readline = require('node:readline');
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

function promptHidden(promptText) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      return reject(new Error('Interactive TTY required when MIQAT_SALES_PASSWORD is not set.'));
    }
    const stdin = process.stdin;
    const stdout = process.stdout;
    stdout.write(promptText);

    const wasRaw = Boolean(stdin.isRaw);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let value = '';
    const onData = (ch) => {
      if (ch === '\r' || ch === '\n' || ch === '\u0004') {
        stdin.setRawMode(wasRaw);
        stdin.pause();
        stdin.removeListener('data', onData);
        stdout.write('\n');
        resolve(value);
      } else if (ch === '\u0003') {
        stdin.setRawMode(wasRaw);
        stdin.pause();
        stdin.removeListener('data', onData);
        stdout.write('\n');
        reject(new Error('Cancelled by user.'));
      } else if (ch === '\u007f' || ch === '\b') {
        if (value.length > 0) {
          value = value.slice(0, -1);
          stdout.write('\b \b');
        }
      } else {
        value += ch;
        stdout.write('*');
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  const args = parseArgs();
  const email = args.email || process.env.MIQAT_SALES_EMAIL || 'ahmed-sabrt-sales@gmail.com';
  const phone = args.phone || process.env.MIQAT_SALES_PHONE || '01156379994';
  const nameAr = args['name-ar'] || process.env.MIQAT_SALES_NAME_AR || 'أحمد صبري';
  const nameEn = args['name-en'] || process.env.MIQAT_SALES_NAME_EN || 'Ahmed Sabry';
  const resetPassword = Boolean(args['reset-password']);

  let password = process.env.MIQAT_SALES_PASSWORD || '';
  if (!password) {
    if (!process.stdin.isTTY) {
      console.error('\n[Error] Run interactively in a terminal (or pass MIQAT_SALES_PASSWORD via env) to set the password securely.\n');
      process.exit(1);
    }
    console.log('\nMiqat Sales CRM — Secure Credential Setup');
    console.log(`Target Account: ${email} | Phone: ${phone}`);
    password = await promptHidden('Enter new password (min 8 chars): ');
    const confirm = await promptHidden('Confirm new password: ');
    if (password !== confirm) {
      console.error('\n[Error] Passwords do not match. No changes were saved.\n');
      process.exit(1);
    }
  }

  if (!password || String(password).length < 8) {
    console.error('\n[Error] Password must be at least 8 characters.\n');
    process.exit(1);
  }

  const result = db.salesRepo.provisionSalesEmployee({
    email,
    phone,
    password,
    nameAr,
    nameEn,
    resetPassword
  });

  console.log('\n=======================================================');
  if (result.created) {
    console.log('  MIQAT SALES EMPLOYEE ACCOUNT PROVISIONED             ');
  } else if (result.passwordReset) {
    console.log('  MIQAT SALES EMPLOYEE PASSWORD SECURELY UPDATED       ');
  } else {
    console.log('  SALES EMPLOYEE ALREADY PROVISIONED (NO OVERWRITE)    ');
    console.log('  Tip: pass --reset-password to update credentials.    ');
  }
  console.log(`  User ID:      ${result.user.id}`);
  console.log(`  Employee ID:  ${result.employee ? result.employee.id : 'N/A'}`);
  console.log(`  Email:        ${result.user.email}`);
  console.log(`  Phone:        ${result.user.phone}`);
  console.log(`  Role:         ${result.user.role}`);
  console.log('=======================================================\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[Error] Failed to provision/update sales employee:', err.message, '\n');
  process.exit(1);
});
