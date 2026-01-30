# Multi-Device Login System - Setup Complete

## How It Works Now

### Architecture
```
Device A (Admin)          Server Database          Device B (User)
    ↓                           ↓                         ↓
Create User/Code ──→ API POST /api/users ──→ Stored in data/users.json
                                 ↓
              Query API ←─── /api/users/[id]
                                 ↓
                    Other devices can now login
```

## Features Implemented

### 1. **Server-Side User Database**
- **Location**: `/data/users.json`
- **Persistence**: All users saved permanently on server
- **Shared**: All devices query the same database

### 2. **API Endpoints**

#### Get All Users
```
GET /api/users
Returns: Array of all users
```

#### Create User (Add from Dashboard)
```
POST /api/users
Body: {
  email: string,           // (admin only)
  password: string,        // (admin only)
  loginCode: string,       // (user only)
  role: 'admin' | 'user',
  trialType: 'unlimited' | '14days' | 'notrial'
}
```

#### Update User (Edit Role/Trial)
```
PUT /api/users/[id]
Body: {
  role?: 'admin' | 'user',
  trialType?: 'unlimited' | '14days' | 'notrial'
}
```

#### Delete User
```
DELETE /api/users/[id]
```

#### Login (Authenticate)
```
POST /api/auth/login
Body (Admin):
{
  email: string,
  password: string,
  role: 'admin'
}

Body (Normal User):
{
  loginCode: string,
  role: 'user'
}
```

### 3. **Local Caching**
- localStorage still stores data for offline access
- Data syncs with server on app load
- Changes saved to both localStorage and server

## How to Use Across Devices

### On Device A (Admin Device):
1. Open the app
2. Login with admin code: `admin`
3. Email: `admin@aac.com`
4. Password: `admin123`
5. Go to Dashboard
6. Click "新增使用者 / Add User"
7. Create a user with login code (e.g., `user123`)

### On Device B (Another Device):
1. Open the **same website** (must be hosted/deployed)
2. Click Login
3. Enter the login code: `user123`
4. ✅ User logged in with full access!

## Key Improvements

✅ **Multi-Device Support**: Users created on one device can login on any other device  
✅ **Persistent Storage**: Data survives server restarts  
✅ **Offline Support**: localStorage caching for offline use  
✅ **API-First**: All operations go through APIs  
✅ **Server-Side Validation**: Logins verified on server  

## File Structure

```
/app
  /api
    /users
      route.ts              ← Get all users, Create user
      [id]/route.ts         ← Get, Update, Delete individual user
    /auth
      /login/route.ts       ← Authenticate users
/lib
  users-db.ts               ← Database functions (read/write JSON)
/data
  users.json                ← User database file
```

## Testing

### Test Multi-Device Login:
1. Open app in Browser 1 (Admin)
2. Create a user with code: `testuser1`
3. Open app in Browser 2 (Different device/incognito)
4. Enter code: `testuser1`
5. ✅ Should be logged in!

### Default Admin Credentials:
- Email: `admin@aac.com`
- Password: `admin123`
- Code: `admin`

## Important Notes

- **Hosting Required**: To use across different devices, the app must be hosted (not just localhost)
- **User Codes are Unique**: Each user should have a unique login code
- **Trial Auto-Expiry**: 14-day trials automatically expire after 14 days
- **localStorage Backup**: Even if API fails, offline data is preserved

## Deployment Reminder

When deploying to production:
1. Ensure `/data` directory is writable on server
2. Consider using a real database (MongoDB, PostgreSQL) instead of JSON file for better scalability
3. Add user authentication tokens for security (JWT)
4. Encrypt passwords before storing
