import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, loginCode, role, userEmail } = body;
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
      
      const user = result[0];
      console.log('User found:', user.id, 'Updating email to:', userEmail);

      // Update user email and last login time
      await sql`
        UPDATE users
        SET user_email = ${userEmail || null},
            last_login_at = NOW()
        WHERE id = ${user.id}
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
