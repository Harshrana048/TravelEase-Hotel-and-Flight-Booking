import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../redux/slices/adminSlice';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

function UserManagement() {
  const dispatch = useDispatch();
  const { allUsers, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filtered = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton rows={6} cols={5} />;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Users</h2>
          <p className="text-sm text-slate-400">{allUsers.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 w-52 shadow-sm">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No users found"
            subtitle={search ? 'Try a different search term.' : 'No users registered yet.'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user) => {
                  const initials = user.name
                    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                    : '?';

                  // Different avatar colors per user
                  const colors = [
                    'from-blue-500 to-blue-700',
                    'from-emerald-500 to-emerald-700',
                    'from-violet-500 to-violet-700',
                    'from-amber-500 to-amber-700',
                    'from-rose-500 to-rose-700',
                    'from-teal-500 to-teal-700',
                  ];
                  const colorIdx = user.name?.charCodeAt(0) % colors.length || 0;

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/70 transition-colors duration-150">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                            <span className="text-xs font-bold text-white">{initials}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">{user.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">{user.phone || '—'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                            user.role === 'admin'
                              ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                              : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
