import { useState, useEffect } from 'react';

export type User = {
  id: string;
  email?: string;
  password?: string;
  loginCode?: string;
  role: 'admin' | 'user';
  createdAt: string;
  trialType: 'unlimited' | '14days' | 'notrial';
  trialStartDate?: string;
  customizations?: {
    favorites: string[];
    customPhrases: any[];
    customCategoryIcons: Record<string, string>;
    customCategoryNames: Record<string, { zh: string; en: string }>;
  };
};

export function useAdminManagement() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserType, setNewUserType] = useState<'admin' | 'user'>('user');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserLoginCode, setNewUserLoginCode] = useState('');
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<'admin' | 'user'>('user');
  const [editingUserTrial, setEditingUserTrial] = useState<'unlimited' | '14days' | 'notrial'>('14days');

  // Load users from API on mount
  useEffect(() => {
    const loadUsersFromAPI = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          setAllUsers(users);
          localStorage.setItem('aac-users', JSON.stringify(users));
        }
      } catch (error) {
        const savedUsers = localStorage.getItem('aac-users');
        if (savedUsers) {
          setAllUsers(JSON.parse(savedUsers));
        }
      }
    };

    loadUsersFromAPI();
  }, []);

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('aac-users', JSON.stringify(allUsers));
  }, [allUsers]);

  const getTrialStatus = (u: User) => {
    if (u.trialType === 'unlimited') return { daysLeft: Infinity, isExpired: false };
    if (u.trialType === 'notrial') return { daysLeft: 0, isExpired: true };

    const trialStart = u.trialStartDate ? new Date(u.trialStartDate).getTime() : new Date(u.createdAt).getTime();
    const trialEnd = trialStart + 14 * 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil((trialEnd - Date.now()) / (24 * 60 * 60 * 1000));
    return { daysLeft: Math.max(0, daysLeft), isExpired: daysLeft < 0 };
  };

  const addUser = async () => {
    if (newUserType === 'admin') {
      if (!newUserEmail || !newUserPassword) {
        alert('請填寫所有欄位 / Please fill in all fields');
        return;
      }
      if (allUsers.some((u) => u.email === newUserEmail)) {
        alert('該郵箱已存在 / This email already exists');
        return;
      }
    } else {
      if (!newUserLoginCode) {
        alert('請輸入登入碼 / Please enter login code');
        return;
      }
      if (allUsers.some((u) => u.loginCode === newUserLoginCode)) {
        alert('該登入碼已存在 / This login code already exists');
        return;
      }
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...(newUserType === 'admin' ? { email: newUserEmail, password: newUserPassword } : { loginCode: newUserLoginCode }),
      role: newUserType,
      createdAt: new Date().toISOString(),
      trialType: newUserType === 'admin' ? 'unlimited' : '14days',
      trialStartDate: newUserType === 'user' ? new Date().toISOString() : undefined,
    };

    setAllUsers((prev) => [...prev, newUser]);
    setShowAddUserModal(false);
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserLoginCode('');
    setNewUserType('user');
  };

  const deleteUser = (id: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteUserConfirm(null);
  };

  const updateUserRole = (id: string, role: 'admin' | 'user') => {
    setAllUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditingUserId(null);
  };

  const updateUserTrial = (id: string, trial: 'unlimited' | '14days' | 'notrial') => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, trialType: trial, trialStartDate: new Date().toISOString() }
          : u
      )
    );
    setEditingUserId(null);
  };

  return {
    // State
    allUsers,
    showAddUserModal,
    setShowAddUserModal,
    newUserType,
    setNewUserType,
    newUserEmail,
    setNewUserEmail,
    newUserPassword,
    setNewUserPassword,
    newUserLoginCode,
    setNewUserLoginCode,
    deleteUserConfirm,
    setDeleteUserConfirm,
    editingUserId,
    setEditingUserId,
    editingUserRole,
    setEditingUserRole,
    editingUserTrial,
    setEditingUserTrial,
    // Functions
    getTrialStatus,
    addUser,
    deleteUser,
    updateUserRole,
    updateUserTrial,
  };
}
