import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { Badge, Button, Spinner, EmptyState } from "../components/ui";
import DeleteUserModal from "../components/ui/DeleteUserModal";
import { FiUsers, FiShield, FiUser, FiSearch, FiTrash2 } from "react-icons/fi";

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, deleteUser } = useUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const adminUsers = users.filter(u => u.role === "admin");
  const regularUsers = users.filter(u => u.role === "user");

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  // Admin always pinned at top
  const sortedFiltered = [
    ...filteredUsers.filter(u => u.role === "admin"),
    ...filteredUsers.filter(u => u.role === "user"),
  ];

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteUser(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <Sidebar>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all registered users and their accounts</p>
        </div>

        {/* Stat cards */}
        {users.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                label: "Total Users",
                value: users.length,
                icon: FiUsers,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                iconBg: "bg-indigo-100",
              },
              {
                label: "Admins",
                value: adminUsers.length,
                icon: FiShield,
                color: "text-purple-600",
                bg: "bg-purple-50",
                iconBg: "bg-purple-100",
              },
              {
                label: "Members",
                value: regularUsers.length,
                icon: FiUser,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                iconBg: "bg-emerald-100",
              },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-200`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                    <s.icon size={13} className={s.color} />
                  </div>
                </div>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5 mb-5">
          <div className="relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                placeholder-slate-400 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Spinner text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" subtitle="No registered users in the system." />
        ) : sortedFiltered.length === 0 ? (
          <EmptyState title="No results" subtitle={`No users match "${searchQuery}"`} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest hidden sm:table-cell">
                    Tasks
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sortedFiltered.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const isAdminUser = u.role === "admin";
                  const taskCount = u._count?.tasks ?? 0;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors hover:bg-slate-50 ${isSelf ? "bg-indigo-50/40" : ""}`}
                    >
                      {/* User info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 text-white
                              ${isAdminUser ? "bg-purple-600" : "bg-indigo-500"}`}
                          >
                            {u.name?.[0] ?? "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-slate-800 text-sm truncate">{u.name}</p>
                              {isSelf && (
                                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5">
                        <Badge color={isAdminUser ? "purple" : "indigo"}>
                          {u.role}
                        </Badge>
                      </td>

                      {/* Task count */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className={`text-sm font-medium ${taskCount > 0 ? "text-slate-700" : "text-slate-300"}`}>
                          {taskCount}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-slate-400 text-xs hidden md:table-cell">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {!isSelf ? (
                          <button
                            onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                            title="Delete user"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                              text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                          >
                            <FiTrash2 size={12} />
                            Remove
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                {sortedFiltered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete user confirmation modal */}
      {deleteTarget && (
        <DeleteUserModal
          userName={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </Sidebar>
  );
};

export default AdminPage;
