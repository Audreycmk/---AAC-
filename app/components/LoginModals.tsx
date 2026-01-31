'use client';

import Icon from './Icon';

interface LoginModalsProps {
  showLoginCodeModal: boolean;
  setShowLoginCodeModal: (show: boolean) => void;
  loginCode: string;
  setLoginCode: (code: string) => void;
  handleLoginCode: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  handleLogin: () => void;
}

export default function LoginModals({
  showLoginCodeModal,
  setShowLoginCodeModal,
  loginCode,
  setLoginCode,
  handleLoginCode,
  showLoginModal,
  setShowLoginModal,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
}: LoginModalsProps) {
  return (
    <>
      {/* 登入碼模態 - First Step Login */}
      {showLoginCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginCodeModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-[#1e3a5f]">
            <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <Icon emoji="🔐" size={40} />
              登入 / Login
            </h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="登入碼 (Login Code)"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
              />

              {/* Get Login Code Button */}
              <div className="border-t-2 border-gray-200 pt-4">
                <p className="text-sm font-semibold text-[#1e3a5f] mb-2">需要登入碼？ / Need a Login Code?</p>
                <a
                  href="mailto:audreycmk@gmail.com?subject=AAC%20Login%20Code%20Request&body=Hi%2C%0A%0AI%20would%20like%20to%20request%20a%20login%20code%20for%20the%20AAC%20app.%0A%0AThank%20you!"
                  className="w-full px-4 py-3 bg-[#f97316] text-white rounded-xl font-bold hover:bg-[#ea580c] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Icon emoji="📧" size={24} />
                  <span>取得登入碼 / Get Code</span>
                </a>
                <p className="text-xs text-gray-600 mt-2 text-center">audreycmk@gmail.com</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginCodeModal(false)}
                className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300"
              >
                取消 / Cancel
              </button>
              <button
                onClick={handleLoginCode}
                disabled={!loginCode}
                className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                登入 / Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 登入模態 - Admin Email & Password Login */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-4 border-[#1e3a5f]">
            <h3 className="text-3xl font-bold text-[#1e3a5f] mb-6 flex items-center gap-2">
              <Icon emoji="🔐" size={40} />
              登入 / Login
            </h3>
            <div className="space-y-4 mb-6">
              <input
                type="email"
                placeholder="Email (admin for admin role)"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316] focus:bg-yellow-50"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500 transition-all duration-300"
              >
                取消 / Cancel
              </button>
              <button
                onClick={handleLogin}
                disabled={!loginEmail}
                className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                登入 / Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
