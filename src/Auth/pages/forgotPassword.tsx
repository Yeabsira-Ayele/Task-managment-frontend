import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import InputField from "../../components/forms/InputField";
import Btn from "../../components/common/Btn";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null); // DEV ONLY — remove once email sending works

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/forgot-password", { email });
      setSubmitted(true);
      if (res.data.resetLink) setDevLink(res.data.resetLink); // DEV ONLY
    } catch {
      // Deliberately show the same success state even on error, to avoid
      // leaking whether the request itself failed vs the email not existing —
      // matches the backend's intentionally generic response.
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
          </p>

          {/* DEV ONLY — remove this block entirely once real email sending is wired up */}
          {devLink && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs text-amber-700">
              <p className="font-semibold">Dev mode — no email service configured yet:</p>
              <a href={devLink} className="mt-1 block break-all underline">{devLink}</a>
            </div>
          )}

          <button
            onClick={() => navigate("/login")}
            className="mt-6 text-sm font-semibold text-blue-600 hover:underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we'll send you a link to reset it.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            register={{ value: email, onChange: (e: any) => setEmail(e.target.value), name: "email" } as any}
          />
          <Btn variant="primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Btn>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 text-sm text-gray-500 hover:underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
}