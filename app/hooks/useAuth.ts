import { useState, useEffect } from 'react';

export type AuthUser = {
  email?: string;
  loginCode?: string;
  role: 'admin' | 'user';
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showLoginCodeModal, setShowLoginCodeModal] = useState(false);
  const [loginCode, setLoginCode] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Load saved user session on mount
  useEffect(() => {
    const savedUserSession = localStorage.getItem('aac-current-user');
    if (savedUserSession) {
      setUser(JSON.parse(savedUserSession));
    }
  }, []);

  // Sync user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('aac-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aac-current-user');
    }
  }, [user]);

  const verifyUserLogin = async (role: 'admin' | 'user', loginData: string, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          role === 'admin' ? { email: loginData, password, role } : { loginCode: loginData, role }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Authentication failed');
        return;
      }

      setUser(result.user);
      setShowLoginCodeModal(false);
      setShowLoginModal(false);
      setLoginCode('');
      setLoginEmail('');
      setLoginPassword('');
    } catch (error) {
      console.error('Login error:', error);
      alert('登入失敗 / Login failed');
    }
  };

  const handleLoginCode = () => {
    if (!loginCode) {
      alert('請輸入登入碼 / Please enter login code');
      return;
    }
    verifyUserLogin('user', loginCode);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert('請輸入郵箱和密碼 / Please enter email and password');
      return;
    }
    verifyUserLogin('admin', loginEmail, loginPassword);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const hasFullAccess = () => !!user;

  return {
    // State
    user,
    showLoginCodeModal,
    setShowLoginCodeModal,
    loginCode,
    setLoginCode,
    showLoginModal,
    setShowLoginModal,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    // Functions
    handleLoginCode,
    handleLogin,
    handleLogout,
    hasFullAccess,
  };
}
