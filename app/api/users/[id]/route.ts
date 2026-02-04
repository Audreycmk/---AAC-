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
    
    // For other field updates, build query with explicit fields
    const setters = [];
    if (body.email !== undefined) setters.push(sql`email = ${body.email}`);
    if (body.password !== undefined) setters.push(sql`password = ${body.password}`);
    if (body.userEmail !== undefined) setters.push(sql`user_email = ${body.userEmail}`);
    if (body.role !== undefined) setters.push(sql`role = ${body.role}`);
    if (body.trialType !== undefined) setters.push(sql`trial_type = ${body.trialType}`);
    if (body.trialStartDate !== undefined) setters.push(sql`trial_start_date = ${body.trialStartDate}`);
    if (body.lastLoginAt !== undefined) setters.push(sql`last_login_at = ${body.lastLoginAt}`);
    if (body.customizations !== undefined) setters.push(sql`customizations = ${JSON.stringify(body.customizations)}::jsonb`);
    
    if (setters.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    const result = await sql`
      UPDATE users
      SET ${sql.join(setters, sql`, `)}
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
