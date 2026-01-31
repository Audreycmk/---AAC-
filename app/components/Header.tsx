import Icon from './Icon';

interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  user: { email?: string; loginCode?: string; role: 'admin' | 'user' } | null;
  setShowDashboard: (show: boolean) => void;
  handleLogout: () => void;
  setShowLoginCodeModal: (show: boolean) => void;
}

export default function Header({
  menuOpen,
  setMenuOpen,
  showHistory,
  setShowHistory,
  showSettings,
  setShowSettings,
  user,
  setShowDashboard,
  handleLogout,
  setShowLoginCodeModal,
}: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1e3a5f] text-white shadow-lg z-50 px-4 py-3 flex items-center justify-between">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 transform min-h-[60px] min-w-[60px] flex items-center justify-center"
        aria-label="選單 Menu"
      >
        <span className="text-white text-3xl font-bold transition-all duration-500">
          {menuOpen ? '✕' : '≡'}
        </span>
      </button>

      <h1 className="text-lg sm:text-3xl font-bold flex-1 text-center mx-2 sm:mx-0">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1">
          <div className="whitespace-nowrap">AAC</div>
          <div className="whitespace-nowrap">輔助</div>
          <div className="whitespace-nowrap">通訊</div>
        </div>
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
          aria-label="歷史記錄 History"
        >
          <Icon emoji="⭐️" size={32} />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
          aria-label="設定 Settings"
        >
          <Icon emoji="⚙" size={32} />
        </button>

        {user ? (
          <>
            {user.role === 'admin' && (
              <button
                onClick={() => setShowDashboard(true)}
                className="p-3 bg-[#f97316] rounded-xl shadow-lg hover:bg-[#ea580c] hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
                aria-label="管理儀表板 Dashboard"
              >
                <Icon emoji="📊" size={32} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="p-3 bg-red-500 rounded-xl shadow-lg hover:bg-red-600 hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
              aria-label="登出 Logout"
            >
              <Icon emoji="🚪" size={32} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginCodeModal(true)}
            className="p-3 bg-green-500 rounded-xl shadow-lg hover:bg-green-600 hover:scale-110 active:scale-95 transition-all duration-300 min-h-[60px] min-w-[60px] flex items-center justify-center"
            aria-label="登入 Login"
          >
            <Icon emoji="🔐" size={32} />
          </button>
        )}
      </div>
    </div>
  );
}
