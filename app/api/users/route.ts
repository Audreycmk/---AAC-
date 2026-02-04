import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { CreateUserInput } from '@/lib/types';

// GET /api/users - Get all users
export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`
      SELECT 
        id,
        email,
        login_code as "loginCode",
        user_email as "userEmail",
        role,
        trial_type as "trialType",
        trial_start_date as "trialStartDate",
        last_login_at as "lastLoginAt",
        created_at as "createdAt",
        customizations
      FROM users
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body: CreateUserInput = await request.json();
    const sql = getDb();
    
    const result = await sql`
      INSERT INTO users (
        email,
        password,
        login_code,
        user_email,
        role,
        trial_type,
        trial_start_date
      )
      VALUES (
        ${body.email || null},
        ${body.password || null},
        ${body.loginCode || null},
        ${body.userEmail || null},
        ${body.role},
        ${body.trialType || '14days'},
        ${body.trialStartDate || null}
      )
      RETURNING 
        id,
        email,
        login_code as "loginCode",
        user_email as "userEmail",
        role,
        trial_type as "trialType",
        trial_start_date as "trialStartDate",
        last_login_at as "lastLoginAt",
        created_at as "createdAt",
        customizations
    `;
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
