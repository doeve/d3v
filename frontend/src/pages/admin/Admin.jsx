import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaChartLine, FaDatabase, FaSync } from 'react-icons/fa';
import adminApi from '../../api/admin';
import authApi from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/format';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ key: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getSystemStats()
      ]);

      setUsers(usersResponse.data.data.users);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      await authApi.createUser(newUser);
      setShowCreateUserModal(false);
      setNewUser({ key: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await adminApi.deleteUser(selectedUser._id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleUserAdmin = async (userId, isAdmin) => {
    try {
      await adminApi.updateUser(userId, { isAdmin: !isAdmin });
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" /> Create User
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaUsers className="inline mr-2" /> Users
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaChartLine className="inline mr-2" /> System Stats
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Management
            </h2>
            <button
              onClick={fetchData}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <FaSync className="mr-1" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {u._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(u.createdAt, 'long')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {u.lastLogin ? formatDate(u.lastLogin, 'long') : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.isAdmin 
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}>
                          {u.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex space-x-2">
                          {u._id !== user._id && (
                            <>
                              <button
                                onClick={() => toggleUserAdmin(u._id, u.isAdmin)}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {u.isAdmin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(u);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 dark:text-red-400 hover:underline"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              System Statistics
            </h2>
            <button
              onClick={fetchData}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <FaSync className="mr-1" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaUsers className="mr-2" /> User Statistics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Users:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.users.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Users (30d):</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.users.active}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaWallet className="mr-2" /> Wallet Statistics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Wallets:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.wallets.total}
                    </span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">By Blockchain:</p>
                    {stats.wallets.byBlockchain.map(item => (
                      <div key={item._id} className="flex justify-between pl-2">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{item._id}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaExchangeAlt className="mr-2" /> Copy Trade Statistics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Copy Trades:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.copyTrades.total}
                    </span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">By Status:</p>
                    {stats.copyTrades.byStatus.map(item => (
                      <div key={item._id} className="flex justify-between pl-2">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{item._id}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaDatabase className="mr-2" /> Transaction Statistics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Transactions:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.transactions.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create User Modal */}
      {showCreateUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <FaUserPlus className="mr-2" /> Create New User
              </h2>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-4">
              <div className="mb-4">
                <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Access Key (16 characters)
                </label>
                <input
                  type="text"
                  id="key"
                  name="key"
                  value={newUser.key}
                  onChange={(e) => setNewUser({ ...newUser, key: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter 16-character key"
                  maxLength={16}
                  minLength={16}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This key will be used for user login. Make sure to provide it to the user.
                </p>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={newUser.key.length !== 16}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed`}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete this user? All their data will be permanently removed. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default Admin;