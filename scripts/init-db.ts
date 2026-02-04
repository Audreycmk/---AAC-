import { readFileSync } from 'fs';
import { join } from 'path';
import { getDb, SCHEMA, MIGRATION_DATA } from '../lib/db';

// Load .env.local manually
const envPath = join(process.cwd(), '.env.local');
try {
  const envFile = readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
} catch (error) {
  console.log('⚠️  No .env.local file found, using environment variables');
}

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...\n');
    
    const sql = getDb();
    
    // Create tables
    console.log('📋 Creating database schema...');
    
    // Execute schema statements individually
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        password VARCHAR(255),
        login_code VARCHAR(50) UNIQUE,
        user_email VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        trial_type VARCHAR(20) NOT NULL DEFAULT '14days',
        trial_start_date TIMESTAMP,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        customizations JSONB NOT NULL DEFAULT '{
          "favorites": [],
          "customPhrases": [],
          "customCategoryIcons": {},
          "customCategoryNames": {}
        }'::jsonb
      )
    `;
    
    await sql`CREATE INDEX IF NOT EXISTS idx_users_login_code ON users(login_code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    
    console.log('✅ Schema created successfully!\n');
    
    // Insert default data
    console.log('📊 Inserting default users...');
    
    await sql`
      INSERT INTO users (id, email, password, role, trial_type, created_at)
      VALUES (1, 'admin@aac.com', 'admin123', 'admin', 'unlimited', '2026-01-31T00:00:00.000Z')
      ON CONFLICT (id) DO NOTHING
    `;
    
    await sql`
      INSERT INTO users (login_code, role, trial_type, trial_start_date, user_email, created_at)
      VALUES ('btc2026', 'user', '14days', '2026-01-30T19:40:13.767Z', 'karenchungkk@gmail.com', '2026-01-30T19:40:13.767Z')
      ON CONFLICT (login_code) DO NOTHING
    `;
    
    console.log('✅ Default users inserted!\n');
    
    // Verify
    console.log('🔍 Verifying database...');
    const users = await sql`SELECT id, email, login_code as "loginCode", role FROM users`;
    console.log('✅ Current users in database:');
    console.table(users);
    
    console.log('\n✨ Database initialization complete!');
    console.log('\n📝 You can now:');
    console.log('   1. Login as admin: admin@aac.com / admin123');
    console.log('   2. Login as user: btc2026');
    console.log('   3. View admin dashboard to manage users\n');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
