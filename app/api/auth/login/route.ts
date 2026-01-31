import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/users-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, loginCode, role } = body;

    const users = getAllUsers();

    if (role === 'admin') {
      // Admin login with email and password
      const admin = users.find((u: any) => 
        u.email === email && 
        u.password === password && 
        u.role === 'admin'
      );

      if (!admin) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          email: admin.email,
          role: admin.role,
        },
        userData: admin
      });
    } else {
      // Normal user login with code
      const user = users.find((u: any) => 
        u.loginCode === loginCode && 
        u.role === 'user'
      );

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid login code' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          loginCode: user.loginCode,
          role: user.role,
        },
        userData: user
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
