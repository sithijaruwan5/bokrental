import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
import { API_BASE_URL } from "../utils/api";


export const useRentalStore = create((set, get) => ({
  rentals: [],

  // Get auth header with Bearer token
  getAuthHeader: () => {
    const user = useUserStore.getState().user;
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  },

  // Fetch all rentals
  fetchRentals: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rentals/all`, {
        headers: get().getAuthHeader(),
      });
      set({ rentals: res.data });
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  },

  // Create rental
  createRental: async (rentalRequest) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/rentals/rent`,
        rentalRequest,
        { headers: get().getAuthHeader() }
      );
      set({ rentals: [...get().rentals, res.data] });
      return res.data;
    } catch (error) {
      console.error("Error creating rental:", error);
      throw error;
    }
  },

  // Return rental
  returnRental: async (rentalId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/rentals/return/${rentalId}`,
        {},
        { headers: get().getAuthHeader() }
      );
      set({
        rentals: get().rentals.map((r) =>
          r.id === rentalId ? res.data : r
        ),
      });
      return res.data;
    } catch (error) {
      console.error("Error returning rental:", error);
      throw error;
    }
  },

  // Extend rental date
  extendRentalDate: async (rentalId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/rentals/extenddate/${rentalId}`,
        {},
        { headers: get().getAuthHeader() }
      );
      set({
        rentals: get().rentals.map((r) =>
          r.id === rentalId ? res.data : r
        ),
      });
      return res.data;
    } catch (error) {
      console.error("Error extending rental:", error);
      throw error;
    }
  },

  // Get rentals by user
  fetchRentalsByUser: async (userId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/rentals/user/${userId}`,
        { headers: get().getAuthHeader() }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching rentals by user:", error);
      throw error;
    }
  },
}));
