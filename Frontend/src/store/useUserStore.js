import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import toast from "react-hot-toast";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      registerUser: async (formdata) => {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/register`, formdata);
          set({ user: res.data });

          toast.success("Registration Successful");
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message || "Registration failed. Please try again.";
          console.error("Registration error:", error);
          toast.error(message);
          throw error;
        }
      },

      loginUser: async (formdata) => {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/login`, formdata);
          set({ user: res.data });

          toast.success("Login Successful");
          return res.data;
        } catch (error) {
          const message = error.response?.data?.message || "Login failed. Please try again.";
          console.error("Login error:", error);
          toast.error(message);
          throw error;
        }
      },

      logoutUser: () => {
        set({ user: null });
        toast.success("Logged Out");
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
