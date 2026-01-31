'use client';

import Icon from './Icon';

interface User {
  id: string;
  email?: string;
  password?: string;
  loginCode?: string;
  role: 'admin' | 'user';
  createdAt: string;
  trialType: 'unlimited' | '14days' | 'notrial';
  trialStartDate?: string;
}

interface AdminDashboardProps {
  showDashboard: boolean;
  setShowDashboard: (show: boolean) => void;
  user: { email?: string; loginCode?: string; role: 'admin' | 'user' } | null;
  allUsers: User[];
  showAddUserModal: boolean;
  setShowAddUserModal: (show: boolean) => void;
  newUserType: 'admin' | 'user';
  setNewUserType: (type: 'admin' | 'user') => void;
  newUserEmail: string;
  setNewUserEmail: (email: string) => void;
  newUserPassword: string;
  setNewUserPassword: (password: string) => void;
  newUserLoginCode: string;
  setNewUserLoginCode: (code: string) => void;
  addUser: () => void;
  deleteUserConfirm: string | null;
  setDeleteUserConfirm: (id: string | null) => void;
  deleteUser: (id: string) => void;
  editingUserId: string | null;
  setEditingUserId: (id: string | null) => void;
  editingUserRole: 'admin' | 'user';
  setEditingUserRole: (role: 'admin' | 'user') => void;
  updateUserRole: (id: string, role: 'admin' | 'user') => void;
  editingUserTrial: 'unlimited' | '14days' | 'notrial';
  setEditingUserTrial: (trial: 'unlimited' | '14days' | 'notrial') => void;
  updateUserTrial: (id: string, trial: 'unlimited' | '14days' | 'notrial') => void;
  getTrialStatus: (user: User) => { daysLeft: number; isExpired: boolean };
}

export default function AdminDashboard({
  showDashboard,
  setShowDashboard,
  user,
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
  addUser,
  deleteUserConfirm,
  setDeleteUserConfirm,
  deleteUser,
  editingUserId,
  setEditingUserId,
  editingUserRole,
  setEditingUserRole,
  updateUserRole,
  editingUserTrial,
  setEditingUserTrial,
  updateUserTrial,
  getTrialStatus,
}: AdminDashboardProps) {
  if (!showDashboard || user?.role !== 'admin') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowDashboard(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full mx-4 border-4 border-[#f97316] my-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-4xl font-bold text-[#1e3a5f] flex items-center gap-2">
            <Icon emoji="📊" size={48} />
            管理員儀表板 / Admin Dashboard
          </h3>
          <button
            onClick={() => setShowDashboard(false)}
            className="text-[#1e3a5f] hover:text-[#f97316] text-3xl font-bold transition-all duration-300"
          >
            ✕
          </button>
        </div>

        {/* Add User Button */}
        <button
          onClick={() => setShowAddUserModal(true)}
          className="mb-6 px-6 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold text-lg hover:bg-[#0a1a2e] transition-all duration-300 flex items-center gap-2"
        >
          <Icon emoji="➕" size={24} />
          新增使用者 / Add User
        </button>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowAddUserModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 border-4 border-[#f97316]">
              <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">新增使用者 / Add User</h4>
              <div className="space-y-4">
                <select
                  value={newUserType}
                  onChange={(e) => {
                    setNewUserType(e.target.value as 'admin' | 'user');
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserLoginCode('');
                  }}
                  className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                >
                  <option value="user">一般使用者 / Normal User</option>
                  <option value="admin">管理員 / Admin</option>
                </select>

                {newUserType === 'admin' && (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                    />
                    <div className="text-sm text-[#1e3a5f] font-bold bg-blue-50 p-3 rounded-lg">
                      試用期限 / Trial: 無限制 (Unlimited)
                    </div>
                  </>
                )}

                {newUserType === 'user' && (
                  <>
                    <input
                      type="text"
                      placeholder="登入碼 (Login Code)"
                      value={newUserLoginCode}
                      onChange={(e) => setNewUserLoginCode(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#1e3a5f] rounded-xl font-bold text-lg bg-white text-[#1e3a5f] outline-none focus:border-[#f97316]"
                    />
                    <div className="text-sm text-[#1e3a5f] font-bold bg-blue-50 p-3 rounded-lg">
                      試用期限 / Trial: 14日 (14 Days)
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUserEmail('');
                    setNewUserPassword('');
                    setNewUserLoginCode('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500"
                >
                  取消 / Cancel
                </button>
                <button
                  onClick={addUser}
                  className="flex-1 px-4 py-3 bg-[#1e3a5f] text-white rounded-xl font-bold hover:bg-[#0a1a2e]"
                >
                  新增 / Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">身份 / Info</th>
                <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">角色 / Role</th>
                <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">建立日期 / Created</th>
                <th className="border-2 border-[#1e3a5f] px-4 py-3 text-left font-bold">試用期限 / Trial</th>
                <th className="border-2 border-[#1e3a5f] px-4 py-3 text-center font-bold">操作 / Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => {
                const trialStatus = getTrialStatus(u);
                return (
                  <tr key={u.id} className="border-b-2 border-[#1e3a5f]">
                    <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-[#1e3a5f]">
                      {u.role === 'admin' ? `📧 ${u.email}` : `🔐 ${u.loginCode}`}
                    </td>
                    <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold">
                      {editingUserId === u.id && !editingUserId?.endsWith('_trial') ? (
                        <select
                          value={editingUserRole}
                          onChange={(e) => setEditingUserRole(e.target.value as 'admin' | 'user')}
                          className="px-3 py-2 border-2 border-[#f97316] rounded-lg font-bold bg-white text-[#1e3a5f]"
                        >
                          <option value="user">使用者 / User</option>
                          <option value="admin">管理員 / Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-lg font-bold text-white ${
                            u.role === 'admin' ? 'bg-[#f97316]' : 'bg-[#1e3a5f]'
                          }`}
                        >
                          {u.role === 'admin' ? '管理員' : '使用者'}
                        </span>
                      )}
                    </td>
                    <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-[#1e3a5f] text-sm">
                      {new Date(u.createdAt).toLocaleDateString('zh-HK')}
                    </td>
                    <td className="border-2 border-[#1e3a5f] px-4 py-3 font-bold text-center">
                      {editingUserId === `${u.id}_trial` ? (
                        <select
                          value={editingUserTrial}
                          onChange={(e) => setEditingUserTrial(e.target.value as 'unlimited' | '14days' | 'notrial')}
                          className="px-3 py-2 border-2 border-[#f97316] rounded-lg font-bold bg-white text-[#1e3a5f] w-full"
                        >
                          <option value="unlimited">Unlimited</option>
                          <option value="14days">14日</option>
                          <option value="notrial">No Trial</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-lg font-bold text-white cursor-pointer hover:opacity-80 ${
                            u.trialType === 'unlimited'
                              ? 'bg-green-600'
                              : u.trialType === '14days'
                              ? 'bg-blue-500'
                              : 'bg-red-500'
                          }`}
                          onClick={() => {
                            setEditingUserId(`${u.id}_trial`);
                            setEditingUserTrial(u.trialType);
                          }}
                        >
                          {u.trialType === 'unlimited'
                            ? '無限制'
                            : u.trialType === '14days'
                            ? `14日 (${trialStatus.daysLeft}天)`
                            : '無試用'}
                        </span>
                      )}
                    </td>
                    <td className="border-2 border-[#1e3a5f] px-4 py-3 text-center">
                      {editingUserId?.startsWith(u.id) ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              if (editingUserId.endsWith('_trial')) {
                                updateUserTrial(u.id, editingUserTrial);
                              } else {
                                updateUserRole(u.id, editingUserRole);
                              }
                            }}
                            className="px-3 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 text-sm"
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="px-3 py-2 bg-gray-400 text-white rounded-lg font-bold hover:bg-gray-500 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setEditingUserId(u.id);
                              setEditingUserRole(u.role);
                            }}
                            className="px-3 py-2 bg-[#1e3a5f] text-white rounded-lg font-bold hover:bg-[#0a1a2e] text-sm"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => setDeleteUserConfirm(u.id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 text-sm"
                          >
                            刪除
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation */}
        {deleteUserConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border-4 border-red-500">
              <h4 className="text-2xl font-bold text-[#1e3a5f] mb-4">確認刪除 / Confirm Delete</h4>
              <p className="text-lg font-bold text-[#1e3a5f] mb-6">
                確定要刪除 {allUsers.find((u) => u.id === deleteUserConfirm)?.email} 嗎? / Are you sure?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteUserConfirm(null)}
                  className="flex-1 px-4 py-3 bg-gray-400 text-white rounded-xl font-bold hover:bg-gray-500"
                >
                  取消 / Cancel
                </button>
                <button
                  onClick={() => deleteUser(deleteUserConfirm)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600"
                >
                  刪除 / Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
