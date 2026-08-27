import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";

type AuthUser = {
  id: string;
  fname: string;
  lname: string;
  email: string;
  role: "admin" | "member";
};

interface AuthInterface {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (fname: string, lname: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthInterface>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/login", { email, password });
          const { token, user } = res.data;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ user, token, loading: false });
        } catch (err: any) {
          set({ error: err?.response?.data?.message ?? "Login failed", loading: false });
          throw err;
        }
      },

      register: async (fname, lname, email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post("/register", { fname, lname, email, password });
          const { token, user } = res.data;
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ user, token, loading: false });
        } catch (err: any) {
          set({ error: err?.response?.data?.message ?? "Registration failed", loading: false });
          throw err;
        }
      },

      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null });
      },
    }),
    { name: "auth" }
  )
);