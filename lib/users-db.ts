import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Initialize default users if file doesn't exist
function initializeDefaultUsers() {
  ensureDataDir();
  
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@aac.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString(),
        trialType: 'unlimited',
        trialStartDate: undefined,
        customizations: {
          favorites: [],
          customPhrases: [],
          customCategoryIcons: {},
          customCategoryNames: {},
        }
      },
      {
        id: '2',
        loginCode: 'btc2026',
        role: 'user',
        createdAt: new Date().toISOString(),
        trialType: '14days',
        trialStartDate: new Date().toISOString(),
        customizations: {
          favorites: [],
          customPhrases: [],
          customCategoryIcons: {},
          customCategoryNames: {},
        }
      }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }
}

// Get all users
export function getAllUsers() {
  try {
    initializeDefaultUsers();
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Get user by ID
export function getUserById(id: string) {
  const users = getAllUsers();
  return users.find((u: any) => u.id === id);
}

// Get user by login code (for normal users)
export function getUserByLoginCode(loginCode: string) {
  const users = getAllUsers();
  return users.find((u: any) => u.loginCode === loginCode && u.role === 'user');
}

// Get user by email (for admin users)
export function getUserByEmail(email: string) {
  const users = getAllUsers();
  return users.find((u: any) => u.email === email && u.role === 'admin');
}

// Add new user
export function addUser(user: any) {
  try {
    const users = getAllUsers();
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      customizations: {
        favorites: [],
        customPhrases: [],
        customCategoryIcons: {},
        customCategoryNames: {},
      }
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

// Update user
export function updateUser(id: string, updates: any) {
  try {
    const users = getAllUsers();
    const userIndex = users.findIndex((u: any) => u.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return users[userIndex];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete user
export function deleteUser(id: string) {
  try {
    const users = getAllUsers();
    const filteredUsers = users.filter((u: any) => u.id !== id);
    fs.writeFileSync(USERS_FILE, JSON.stringify(filteredUsers, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
