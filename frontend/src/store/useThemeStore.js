import { create } from "zustand"; // Import Zustand to create and manage global state

export const useThemeStore = create((set) => ({
  // Store the current theme in the state
  // Retrieve the theme from localStorage if it exists; otherwise, default to "coffee"
  theme: localStorage.getItem("chat-theme") || "coffee",

  // Function to update the theme
  setTheme: (theme) => {
// Save the selected theme in localStorage to persist user preference () user selected theme across 
// sessions even if we reload the page the theme will persist as it is stored in local storage
    localStorage.setItem("chat-theme", theme);

    // Update the `theme` state in the store with the new theme
    set({ theme });
  },
}));

// In this we want to give user opportunity to sleect the theme of application like in which theme or colour
// of application they want to chat with others
