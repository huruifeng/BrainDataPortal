import {create} from "zustand";

const userStore = create((set) => ({
  user: null, // Holds the logged-in user data
  login: (userData) => set({ user: userData }), // Set user data on login
  logout: () => set({ user: null }), // Clear user data on logout
}));

export default userStore;
