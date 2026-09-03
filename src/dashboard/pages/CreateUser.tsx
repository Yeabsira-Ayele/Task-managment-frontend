import { useState } from "react";
import api from "../../api/axios";
import Btn from "../../components/common/Btn";

function CreateUser() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await api.post("/create-user", { fname, lname, email, password, role });
      setMessage(res.data.message ?? "User created successfully.");
      setFname("");
      setLname("");
      setEmail("");
      setPassword("");
      setRole("member");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-7">

    
    <div className="w-full max-w-md rounded-2xl bg-white p-6  shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Create a new user</h2>
      <p className="mt-1 text-sm text-gray-500">
        Set up their account directly — they can log in right away.
      </p>

      {message && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="fname" className="text-sm font-medium text-gray-700">First Name</label>
            <input
              id="fname"
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lname" className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              id="lname"
              type="text"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            placeholder="teammate@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400">At least 8 characters, one uppercase letter, one number.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Btn variant="primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Btn>
      </form>
    </div>
    </div>
  );
}

export default CreateUser;