# Database Migration Guide: JSON File → PostgreSQL

## Current Status
- ✅ **Packages Installed**: `@neondatabase/serverless`
- ✅ **Code Updated**: All API routes now use PostgreSQL
- ⚠️ **Database Setup**: Requires Vercel Postgres configuration

---

## Setup Instructions

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Select your project

2. **Navigate to Storage Tab**
   - Click "Storage" in the top menu
   - Click "Create Database"
   - Select "Postgres"

3. **Create Database**
   - Database Name: `aac-users` (or any name)
   - Region: Choose closest to your users (Hong Kong/Singapore recommended)
   - Click "Create"

4. **Copy Environment Variables**
   - After creation, Vercel shows environment variables
   - Click "Copy Snippet" - this includes:
     - `POSTGRES_URL`
     - `POSTGRES_PRISMA_URL`
     - `POSTGRES_URL_NON_POOLING`
     - And others...

5. **Add to Project**
   - Click ".env.local" tab
   - Vercel automatically adds these to your project
   - Click "Redeploy" to apply changes

### Step 2: Initialize Database Schema

**Option A: Use Vercel Dashboard Query Tab**
1. In Vercel Dashboard → Storage → Your Database
2. Click "Query" tab
3. Copy and paste from `lib/db.ts` - the `SCHEMA` constant
4. Run the query
5. Copy and paste `MIGRATION_DATA` constant
6. Run the query to insert default users

**Option B: Create Migration Script**
```bash
# Create a one-time migration script
node -e "
const { neon } = require('@neondatabase/serverless');
const { SCHEMA, MIGRATION_DATA } = require('./lib/db');

async function migrate() {
  const sql = neon(process.env.POSTGRES_URL);
  await sql\`\${SCHEMA}\`;
  await sql\`\${MIGRATION_DATA}\`;
  console.log('Migration complete!');
}

migrate();
"
```

### Step 3: Test Locally

1. **Create `.env.local` file** (if not exists)
```bash
POSTGRES_URL=postgresql://...copy-from-vercel...
```

2. **Run development server**
```bash
npm run dev
```

3. **Test login**
   - Try logging in with `btc2026` code
   - Try admin login with `admin@aac.com` / `admin123`

### Step 4: Verify Database

**Check if tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Check users:**
```sql
SELECT id, email, login_code, role, created_at 
FROM users;
```

**Check customizations:**
```sql
SELECT id, login_code, customizations 
FROM users 
WHERE role = 'user';
```

---

## API Endpoints Available

### Users Management
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Authentication
- `POST /api/auth/login` - Login (admin or user)

### Example: Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "loginCode": "testuser123",
    "role": "user",
    "trialType": "14days"
  }'
```

### Example: Update User Customizations
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customizations": {
      "favorites": ["日常", "飲食"],
      "customPhrases": [
        {"text": "我要休息", "category": "日常"}
      ]
    }
  }'
```

---

## Database Schema

```sql
CREATE TABLE users (
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
);

CREATE INDEX idx_users_login_code ON users(login_code);
CREATE INDEX idx_users_email ON users(email);
```

---

## Migration Data

**Default Users:**
1. **Admin User**
   - Email: `admin@aac.com`
   - Password: `admin123`
   - Role: admin
   - Trial: unlimited

2. **Test User**
   - Login Code: `btc2026`
   - Role: user
   - Trial: 14 days
   - Email: `karenchungkk@gmail.com`

---

## Troubleshooting

### Issue: "POSTGRES_URL is not set"
**Solution:** 
- Check `.env.local` exists with `POSTGRES_URL`
- On Vercel, check Environment Variables in Settings
- Redeploy after adding variables

### Issue: Login fails with 500 error
**Solution:**
- Check Vercel Logs for SQL errors
- Verify database tables exist
- Run schema initialization again

### Issue: Customizations not saving
**Solution:**
- Check PostgreSQL supports JSONB (it does)
- Verify update endpoint with:
```bash
curl -X PUT http://localhost:3000/api/users/:id \
  -H "Content-Type: application/json" \
  -d '{"customizations": {"favorites": ["test"]}}'
```

---

## Next Steps After Setup

1. ✅ **Test all CRUD operations**
2. ✅ **Test login from multiple devices** (no more read-only filesystem issues!)
3. ✅ **Test admin dashboard** - view user customizations
4. ✅ **Monitor Vercel Postgres dashboard** for query performance
5. 🔄 **Backup old `data/users.json`** (can delete after successful migration)

---

## Benefits of PostgreSQL vs JSON File

| Feature | JSON File | PostgreSQL |
|---------|-----------|------------|
| Serverless Compatible | ❌ No (read-only FS) | ✅ Yes |
| Concurrent Writes | ❌ Corrupts file | ✅ ACID transactions |
| Query Performance | ❌ Load entire file | ✅ Indexed queries |
| Scalability | ❌ < 100 users | ✅ Millions of users |
| Data Integrity | ❌ Manual validation | ✅ Schema enforcement |
| Backup/Recovery | ❌ Manual file copy | ✅ Automatic snapshots |

---

## Cost Estimate (Vercel Postgres Free Tier)

- **Storage**: 256 MB
- **Compute**: 60 hours/month
- **Rows**: Unlimited
- **Cost**: **FREE** for hobby projects

For your AAC app with ~100 users:
- Storage usage: ~5-10 MB
- Compute usage: ~10-20 hours/month
- **Cost: $0.00** ✅
