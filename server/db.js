const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PAYMENTS_FILE)) fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([]));
}

function readPayments() {
  ensureDataDir();
  const raw = fs.readFileSync(PAYMENTS_FILE, 'utf8');
  try {
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writePayments(payments) {
  ensureDataDir();
  fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
}

module.exports = { readPayments, writePayments };
