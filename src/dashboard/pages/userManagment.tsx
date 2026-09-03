import { useEffect, useState } from "react";
import Heading from "../../components/common/Heading";
import api from "../../api/axios";
import { useAuth } from "../../Auth/authStore";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

type ApiUser = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: "admin" | "member";
  createdAt: string;
};

export default function UserManagement() {
  const currentUser = useAuth((state) => state.user);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiUser | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "member") => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: res.data.data.role } : u)));
      toast.success("Role updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.success("User removed");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading users...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Heading title="User Management" content={`${users.length} registered user${users.length === 1 ? "" : "s"}`} />

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Joined</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => {
              const isSelf = user._id === currentUser?.id;
              return (
                <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {user.fname} {user.lname}
                    {isSelf && <span className="ml-2 text-xs font-normal text-slate-400">(you)</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      disabled={isSelf || updatingId === user._id}
                      onChange={(e) => handleRoleChange(user._id, e.target.value as "admin" | "member")}
                      className="border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(user)}
                      disabled={isSelf}
                      title={isSelf ? "You can't delete your own account" : "Remove user"}
                      className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Remove user?</h3>
              <button onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <p className="mb-6 text-sm text-slate-500">
              Are you sure you want to remove{" "}
              <span className="font-medium text-slate-900">{deleteTarget.fname} {deleteTarget.lname}</span>?
              Tasks currently assigned to them will show as <strong>Unassigned</strong>. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}