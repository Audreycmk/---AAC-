import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { readUsers } from '@/lib/users-db';
import { saveEmailVerificationCode } from '@/lib/email-verification-db';
import { sendVerificationEmail } from '@/lib/email';

const CODE_TTL_MINUTES = 10;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, loginCode } = body as { email?: string; loginCode?: string };

    if (!email || !loginCode) {
      return NextResponse.json({ error: 'Email and login code are required' }, { status: 400 });
    }

    if (loginCode.toLowerCase() === 'admin') {
      return NextResponse.json({ error: 'Admin login does not use email verification' }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      const users = readUsers();
      const user = users.find((u: any) => u.loginCode === loginCode && u.role === 'user');
      if (!user) {
        return NextResponse.json({ error: 'Invalid login code' }, { status: 401 });
      }

      saveEmailVerificationCode({
        email,
        loginCode,
        code,
        expiresAt,
        createdAt: new Date().toISOString(),
      });

      await sendVerificationEmail({ to: email, code });
      return NextResponse.json({ success: true });
    }

    const sql = getDb();

    const userResult = await sql`
      SELECT id
      FROM users
      WHERE login_code = ${loginCode}
        AND role = 'user'
    `;

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'Invalid login code' }, { status: 401 });
    }

    await sql`
      DELETE FROM email_verification_codes
      WHERE login_code = ${loginCode}
        AND user_email = ${email}
    `;

    await sql`
      INSERT INTO email_verification_codes (login_code, user_email, code, expires_at)
      VALUES (${loginCode}, ${email}, ${code}, ${expiresAt})
    `;

    await sendVerificationEmail({ to: email, code });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
