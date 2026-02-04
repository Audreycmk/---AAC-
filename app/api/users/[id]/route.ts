import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { UpdateUserInput } from '@/lib/types';
import { readUsers, writeUsers } from '@/lib/users-db';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      const users: any[] = readUsers();
      const user = users.find((u: any) => String(u.id) === id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }
    
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
      WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateUserInput = await request.json();
    
    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      const users: any[] = readUsers();
      const userIndex = users.findIndex((u: any) => String(u.id) === id);
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      users[userIndex] = { ...users[userIndex], ...body };
      writeUsers(users);
      return NextResponse.json(users[userIndex]);
    }
    
    const sql = getDb();
    
    // For customizations-only updates (most common case)
    if (body.customizations && Object.keys(body).length === 1) {
      const result = await sql`
        UPDATE users
        SET customizations = ${JSON.stringify(body.customizations)}::jsonb
        WHERE id = ${id}
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
      
      if (result.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json(result[0]);
    }
    
    // For other field updates - handle each combination
    let result;
    
    if (body.email !== undefined && body.password !== undefined) {
      result = await sql`
        UPDATE users
        SET email = ${body.email}, password = ${body.password}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.email !== undefined) {
      result = await sql`
        UPDATE users
        SET email = ${body.email}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.password !== undefined) {
      result = await sql`
        UPDATE users
        SET password = ${body.password}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.userEmail !== undefined) {
      result = await sql`
        UPDATE users
        SET user_email = ${body.userEmail}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.role !== undefined) {
      result = await sql`
        UPDATE users
        SET role = ${body.role}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.trialType !== undefined) {
      const trialStartDate = body.trialStartDate || new Date().toISOString();
      result = await sql`
        UPDATE users
        SET trial_type = ${body.trialType}, trial_start_date = ${trialStartDate}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else if (body.lastLoginAt !== undefined) {
      result = await sql`
        UPDATE users
        SET last_login_at = ${body.lastLoginAt}
        WHERE id = ${id}
        RETURNING id, email, login_code as "loginCode", user_email as "userEmail", role, trial_type as "trialType", trial_start_date as "trialStartDate", last_login_at as "lastLoginAt", created_at as "createdAt", customizations
      `;
    } else {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      const users: any[] = readUsers();
      const userIndex = users.findIndex((u: any) => String(u.id) === id);
      if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      users.splice(userIndex, 1);
      writeUsers(users);
      return NextResponse.json({ message: 'User deleted successfully' });
    }
    
    const sql = getDb();
    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING id
    `;
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
