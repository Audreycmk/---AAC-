import { neon } from '@neondatabase/serverless';

// Initialize database connection
export function getDb() {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }
  return neon(process.env.POSTGRES_URL);
}

// Database schema - run this once to initialize
export const SCHEMA = `
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
  );

  -- Create index for faster lookups
  CREATE INDEX IF NOT EXISTS idx_users_login_code ON users(login_code);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

export const MIGRATION_DATA = `
  -- Insert default admin user
  INSERT INTO users (id, email, password, role, trial_type, created_at)
  VALUES (1, 'admin@aac.com', 'admin123', 'admin', 'unlimited', '2026-01-31T00:00:00.000Z')
  ON CONFLICT DO NOTHING;

  -- Insert btc2026 user
  INSERT INTO users (login_code, role, trial_type, trial_start_date, user_email, created_at)
  VALUES ('btc2026', 'user', '14days', '2026-01-30T19:40:13.767Z', 'karenchungkk@gmail.com', '2026-01-30T19:40:13.767Z')
  ON CONFLICT (login_code) DO NOTHING;
`;
