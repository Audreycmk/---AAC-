import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Fallback to file-based system if POSTGRES_URL not set
    if (!process.env.POSTGRES_URL) {
      // For file-based system, just return users with their current email
      const usersPath = join(process.cwd(), 'data', 'users.json');
      const users = JSON.parse(readFileSync(usersPath, 'utf-8'));
      
      return NextResponse.json(users.filter((u: any) => u.role === 'user').map((u: any) => ({
        id: u.id,
        loginCode: u.loginCode,
        userEmail: u.userEmail,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt
      })));
    }
    
    const sql = getDb();
    
    // Get all login history with user details
    const history = await sql`
      SELECT 
        lh.id,
        lh.login_code as "loginCode",
        lh.user_email as "userEmail",
        lh.logged_in_at as "loggedInAt",
        u.trial_type as "trialType",
        u.created_at as "createdAt"
      FROM login_history lh
      JOIN users u ON lh.user_id = u.id
      ORDER BY lh.logged_in_at DESC
    `;
    
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching login history:', error);
    return NextResponse.json({ error: 'Failed to fetch login history' }, { status: 500 });
  }
}
