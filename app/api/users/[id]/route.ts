import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { UpdateUserInput } from '@/lib/types';

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const sql = getDb();
    
    // Build update object
    const updates: any = {};
    if (body.email !== undefined) updates.email = body.email;
    if (body.password !== undefined) updates.password = body.password;
    if (body.userEmail !== undefined) updates.user_email = body.userEmail;
    if (body.role !== undefined) updates.role = body.role;
    if (body.trialType !== undefined) updates.trial_type = body.trialType;
    if (body.trialStartDate !== undefined) updates.trial_start_date = body.trialStartDate;
    if (body.lastLoginAt !== undefined) updates.last_login_at = body.lastLoginAt;
    
    if (Object.keys(updates).length === 0 && !body.customizations) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    // Handle customizations separately if provided
    if (body.customizations) {
      const result = await sql`
        UPDATE users
        SET ${sql(updates, Object.keys(updates))},
            customizations = customizations || ${JSON.stringify(body.customizations)}::jsonb
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
    } else {
      const result = await sql`
        UPDATE users
        SET ${sql(updates, Object.keys(updates))}
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
