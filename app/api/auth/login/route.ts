import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { readUsers } from '@/lib/users-db';
import { consumeEmailVerificationCode, getValidEmailVerificationCode } from '@/lib/email-verification-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, loginCode, role, userEmail, verificationCode } = body;
    
    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      const users: any[] = readUsers();
      
      if (role === 'admin') {
        const admin = users.find((u: any) => u.email === email && u.password === password && u.role === 'admin');
        if (!admin) {
          return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          user: { email: admin.email, role: admin.role },
          userData: { id: admin.id, email: admin.email, role: admin.role, customizations: admin.customizations || {} }
        });
      } else {
        if (!userEmail || !verificationCode) {
          return NextResponse.json({ error: 'Email verification code is required' }, { status: 400 });
        }

        const user = users.find((u: any) => u.loginCode === loginCode && u.role === 'user');
        if (!user) {
          return NextResponse.json({ error: 'Invalid login code' }, { status: 401 });
        }

        const validRecord = getValidEmailVerificationCode(userEmail, loginCode);
        if (!validRecord || validRecord.code !== verificationCode) {
          return NextResponse.json(
            // { error: 'Invalid or expired verification code' }, 
             { error: 'Invalid verification code' }, 
            { status: 401 });
        }

        const consumed = consumeEmailVerificationCode(userEmail, loginCode, verificationCode);
        if (!consumed) {
          return NextResponse.json(
            // { error: 'Invalid or expired verification code' }, 
            { error: 'Cannot consume email verification code' }, 
            { status: 401 });
        }

        return NextResponse.json({
          success: true,
          user: { loginCode: user.loginCode, role: user.role },
          userData: { id: user.id, loginCode: user.loginCode, role: user.role, customizations: user.customizations || {} }
        });
      }
    }
    
    const sql = getDb();

    if (role === 'admin') {
      // Admin login with email and password
      const result = await sql`
        SELECT 
          id,
          email,
          role,
          trial_type as "trialType",
          created_at as "createdAt",
          customizations
        FROM users
        WHERE email = ${email} 
          AND password = ${password} 
          AND role = 'admin'
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const admin = result[0];

      // Update last login time
      await sql`
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = ${admin.id}
      `;

      return NextResponse.json({
        success: true,
        user: {
          email: admin.email,
          role: admin.role,
        },
        userData: {
          ...admin,
          lastLoginAt: new Date().toISOString()
        }
      });
    } else {
      // Normal user login with code
      console.log('Login attempt - Code:', loginCode, 'Email:', userEmail);

      if (!userEmail || !verificationCode) {
        return NextResponse.json(
          { error: 'Email verification code is required' },
          { status: 400 }
        );
      }
      
      const result = await sql`
        SELECT 
          id,
          login_code as \"loginCode\",
          role,
          trial_type as \"trialType\",
          trial_start_date as \"trialStartDate\",
          created_at as \"createdAt\",
          customizations
        FROM users
        WHERE login_code = ${loginCode} 
          AND role = 'user'
      `;

      if (result.length === 0) {
        console.log('User not found with login code:', loginCode);
        return NextResponse.json(
          { error: 'Invalid login code' },
          { status: 401 }
        );
      }

      const verificationResult = await sql`
        SELECT id, code, expires_at as "expiresAt"
        FROM email_verification_codes
        WHERE login_code = ${loginCode}
          AND user_email = ${userEmail}
        ORDER BY created_at DESC
        LIMIT 1
      `;

      if (verificationResult.length === 0) {
        return NextResponse.json(
          // { error: 'Invalid or expired verification code' },
          { error: 'Verificiation Result Length == 0' },
          { status: 401 }
        );
      }

      const latestCode = verificationResult[0];
      const isExpired = new Date(latestCode.expiresAt + "Z").getTime() <= Date.now();
      if (latestCode.code !== verificationCode || isExpired) {
        console.log('Invalid or expired code. Provided:', verificationCode, 'Expected:', latestCode.code, 'Expired:', isExpired, 'ExpiresAt:', new Date(latestCode.expiresAt).getTime(), 'CurrentTime:', Date.now());
        return NextResponse.json(
          { error: 'Expired verification code' },
          { status: 401 }
        );
      }

      await sql`
        DELETE FROM email_verification_codes
        WHERE id = ${latestCode.id}
      `;
      
      const user = result[0];
      console.log('User found:', user.id, 'Updating email to:', userEmail);

      // Update last login time
      await sql`
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = ${user.id}
      `;
      
      // Insert into login history to track each email used
      await sql`
        INSERT INTO login_history (user_id, login_code, user_email, logged_in_at)
        VALUES (${user.id}, ${loginCode}, ${userEmail || null}, NOW())
      `;

      return NextResponse.json({
        success: true,
        user: {
          loginCode: user.loginCode,
          role: user.role,
        },
        userData: {
          ...user,
          userEmail: userEmail,
          lastLoginAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
