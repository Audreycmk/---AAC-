import fs from 'fs';
import path from 'path';

const CODES_FILE = path.join(process.cwd(), 'data', 'email-verification-codes.json');

export type EmailVerificationRecord = {
  email: string;
  loginCode: string;
  code: string;
  expiresAt: string;
  createdAt: string;
};

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readCodes(): EmailVerificationRecord[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(CODES_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(CODES_FILE, 'utf-8');
    const codes = JSON.parse(raw) as EmailVerificationRecord[];
    const now = Date.now();
    const filtered = codes.filter((c) => new Date(c.expiresAt).getTime() > now);
    if (filtered.length !== codes.length) {
      writeCodes(filtered);
    }
    return filtered;
  } catch (error) {
    console.error('Error reading email verification codes:', error);
    return [];
  }
}

function writeCodes(codes: EmailVerificationRecord[]) {
  ensureDataDir();
  fs.writeFileSync(CODES_FILE, JSON.stringify(codes, null, 2));
}

export function saveEmailVerificationCode(record: EmailVerificationRecord) {
  const codes = readCodes();
  const filtered = codes.filter(
    (c) => !(c.email === record.email && c.loginCode === record.loginCode)
  );
  filtered.push(record);
  writeCodes(filtered);
}

export function getValidEmailVerificationCode(email: string, loginCode: string) {
  const codes = readCodes();
  return codes.find((c) => c.email === email && c.loginCode === loginCode) || null;
}

export function consumeEmailVerificationCode(email: string, loginCode: string, code: string) {
  const codes = readCodes();
  const matchIndex = codes.findIndex(
    (c) => c.email === email && c.loginCode === loginCode && c.code === code
  );
  if (matchIndex === -1) {
    return false;
  }
  const record = codes[matchIndex];
  if (new Date(record.expiresAt).getTime() <= Date.now()) {
    const filtered = codes.filter((_, idx) => idx !== matchIndex);
    writeCodes(filtered);
    return false;
  }
  const filtered = codes.filter((_, idx) => idx !== matchIndex);
  writeCodes(filtered);
  return true;
}
