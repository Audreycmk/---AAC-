import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, updateUser } from '@/lib/users-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, loginCode, role, userEmail } = body;

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

      // Update last login time
      updateUser(admin.id, {
        lastLoginAt: new Date().toISOString()
      });

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
      const user = users.find((u: any) => 
        u.loginCode === loginCode && 
        u.role === 'user'
      );

      if (!user) {
        console.log('User not found. Available codes:', users.filter((u: any) => u.role === 'user').map((u: any) => u.loginCode));
        return NextResponse.json(
          { error: 'Invalid login code' },
          { status: 401 }
        );
      }
      
      console.log('User found:', user.id, 'Updating email to:', userEmail);

      // Update user email and last login time
      updateUser(user.id, {
        userEmail: userEmail || user.userEmail,
        lastLoginAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        user: {
          loginCode: user.loginCode,
          role: user.role,
        },
        userData: {
          ...user,
          userEmail: userEmail || user.userEmail,
          lastLoginAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
