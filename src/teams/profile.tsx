import { useState } from "react";
import Heading from "../components/common/Heading";
import api from "../api/axios";
import { useAuth } from "../Auth/authStore";
import toast from "react-hot-toast";

export default function Profile() {
  const user = useAuth((state) => state.user);

  const [fname, setFname] = useState(user?.fname ?? "");
  const [lname, setLname] = useState(user?.lname ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  if (!user) {
    return <div className="p-10 text-center text-gray-400">Loading profile...</div>;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.patch("/users/me", { fname, lname });
      // FIX: keep the auth store's cached user in sync, since the sidebar and
      // other UI read `user.fname`/`user.lname` directly from useAuth, not
      // from this component's local state.
      useAuth.setState({
        user: { ...user, fname: res.data.data.fname, lname: res.data.data.lname },
      });
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await api.patch("/users/me/password", { currentPassword, newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message ?? "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <Heading title="Profile & Settings" content="Manage your account information" />

      <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-6">

        {/* Profile card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            {/* <AssigneeAvatar fname={user.fname} lname={user.lname} /> */}
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{user.fname} {user.lname}</h2>
              <p className="text-sm text-slate-400">{user.email}</p>
              <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-500">
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                title="Contact an admin to change your email"
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-400"
              />
              {/* NOTE: email editing intentionally left out for now — changing it
                  should require re-verification (e.g. confirm via the new address)
                  since it's also the login credential. That's a real feature to build
                  properly later, not a quick field to unlock. */}
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="self-end rounded-2xl bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Change Password</h2>

          {passwordError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="self-end rounded-2xl bg-slate-800 px-6 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
            >
              {savingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}