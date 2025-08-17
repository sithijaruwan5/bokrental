import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore";
import { API_BASE_URL } from "../utils/api";
import toast from "react-hot-toast";

export const useRentalStore = create((set, get) => ({
  rentals: [],
  userRentals: [],

  getAuthHeader: () => {
    const user = useUserStore.getState().user;
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  },


  fetchRentals: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/rentals/all`, {
        headers: get().getAuthHeader(),
      });
      set({ rentals: res.data });
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast.error("Failed to fetch rentals");
    }
  },


  createRental: async (bookId) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/rentals/rent`,
        { bookId },
        { headers: get().getAuthHeader() }
      );
      set({ rentals: [...get().rentals, res.data] });
      toast.success("Book rented successfully");
      return res.data;
    } catch (error) {
      console.error("Error creating rental:", error);
      toast.error(error.response?.data?.message || "Failed to rent book");
      throw error;
    }
  },


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
      toast.success("Book returned successfully");
      return res.data;
    } catch (error) {
      console.error("Error returning rental:", error);
      toast.error(error.response?.data?.message || "Failed to return book");
      throw error;
    }
  },


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
      toast.success("Rental date extended successfully");
      return res.data;
    } catch (error) {
      console.error("Error extending rental:", error);
      toast.error(error.response?.data?.message || "Failed to extend rental");
      throw error;
    }
  },


  fetchRentalsByUser: async (userId) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/rentals/user`,
        { headers: get().getAuthHeader() }
      );
      set({ userRentals: res.data });
    } catch (error) {
      console.error("Error fetching rentals by user:", error);
      toast.error("Failed to fetch user rentals");
      throw error;
    }
  },
}));
