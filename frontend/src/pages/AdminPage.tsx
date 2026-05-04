import Navbar from "../components/common/Navbar";
import { useAuth } from "../context/AuthContext";
import { useUsers } from "../hooks/useUsers";
import { Alert, Badge, Button, Spinner, EmptyState } from "../components/ui";

const AdminPage = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, success, deleteUser } = useUsers();

  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount  = users.filter(u => u.role === "user").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all registered users</p>
        </div>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        {users.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Users", value: users.length,  color: "text-blue-600",   bg: "bg-blue-50" },
              { label: "Admins",      value: adminCount,    color: "text-purple-600",  bg: "bg-purple-50" },
              { label: "Members",     value: userCount,     color: "text-green-600",   bg: "bg-green-50" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-white shadow-sm`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ────────────────────────────────────────────────────────── */}
        {error   && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
        {success && <div className="mb-4"><Alert type="success">{success}</Alert></div>}

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        {loading ? (
          <Spinner text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" subtitle="No registered users in the system." />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Tasks
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map(user => {
                  const isSelf = user.id === currentUser?.id;
                  const taskCount = user._count?.tasks ?? 0;

                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors hover:bg-gray-50 ${isSelf ? "bg-blue-50/30" : ""}`}
                    >
                      {/* User info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                            text-white flex items-center justify-center text-sm font-bold uppercase flex-shrink-0">
                            {user.name?.[0] ?? "U"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800 truncate">{user.name}</p>
                              {isSelf && (
                                <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <Badge color={user.role === "admin" ? "purple" : "blue"}>
                          {user.role}
                        </Badge>
                      </td>

                      {/* Task count */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium
                          ${taskCount > 0 ? "text-gray-700" : "text-gray-400"}`}>
                          📋 {taskCount}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-gray-400 text-sm hidden md:table-cell">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {!isSelf ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        ) : (
                          <span className="text-gray-300 text-xs italic">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
              {users.length} user{users.length !== 1 ? "s" : ""} total
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
