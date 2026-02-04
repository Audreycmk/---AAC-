import { getDb, SCHEMA, MIGRATION_DATA } from './lib/db';

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...\n');
    
    const sql = getDb();
    
    // Create tables
    console.log('📋 Creating database schema...');
    await sql`${SCHEMA}`;
    console.log('✅ Schema created successfully!\n');
    
    // Insert default data
    console.log('📊 Inserting default users...');
    await sql`${MIGRATION_DATA}`;
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
