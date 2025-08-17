import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./useUserStore"; 
import { API_BASE_URL } from "../utils/api";

export const useBooksStore = create((set, get) => ({
  books: [],
  searchResults: [],

  setBooks: (books) => set({ books, searchResults: books }),

  getAuthHeader: () => {
    const user = useUserStore.getState().user;
    return user ? { Authorization: `Bearer ${user.token}` } : {};
  },

  setSearch: (query) => {
    const results = get().books.filter(
      (b) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        (b.isbn && b.isbn.toLowerCase().includes(query.toLowerCase()))
    );
    set({ searchResults: results });
  },


  fetchBooks: async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/books/all`, {
        headers: get().getAuthHeader(),
      });
      set({ books: res.data, searchResults: res.data });
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  },

  addBook: async (book) => {
    try {
      const res = await axios.post("/api/books/add", book, {
        headers: get().getAuthHeader(),
      });
      const updatedBooks = [...get().books, res.data];
      set({ books: updatedBooks, searchResults: updatedBooks });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  },

  updateBook: async (updatedBook) => {
    try {
      const res = await axios.put("/api/books/update", updatedBook, {
        headers: get().getAuthHeader(),
      });
      const updatedBooks = get().books.map((b) =>
        b.id === updatedBook.id ? res.data : b
      );
      set({ books: updatedBooks, searchResults: updatedBooks });
    } catch (error) {
      console.error("Error updating book:", error);
    }
  },

  deleteBook: async (bookId) => {
    try {
      await axios.delete(`/api/books/delete/${bookId}`, {
        headers: get().getAuthHeader(),
      });
      const updatedBooks = get().books.filter((b) => b.id !== bookId);
      set({ books: updatedBooks, searchResults: updatedBooks });
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  },
}));
