import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; 
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore"; // Zustand store to manage authentication state
import { Loader } from "lucide-react"; // Icon component for showing a loading spinner
import { Navigate } from "react-router-dom"; // Component to handle navigation based on conditions
import { Toaster } from "react-hot-toast"; // Library for displaying toast notifications
import { useThemeStore } from "./store/useThemeStore"; // Zustand store to manage theme state


const App = () => {
  // Accessing authentication-related states and functions from the `useAuthStore` Zustand store
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  // Accessing the current theme from the `useThemeStore` Zustand store
  const { theme } = useThemeStore();


  console.log({ onlineUsers });


  // Effect to check if the user is authenticated when the app loads
  useEffect(() => {
    checkAuth(); // Call the `checkAuth` function to verify the user's authentication status
  }, [checkAuth]); // Dependency array ensures checkAuth is only re-run if it changes

  console.log({ authUser });// Logs the current authenticated user (for debugging)
// If the app is still checking authentication and no user is logged in, show a loading spinner
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Loader component or element to indicate loading */}
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }



  return (
    // Apply the theme from the Zustand store to the entire app using the `data-theme` attribute
    <div data-theme={theme}>

      <Navbar />

      {/* Define all routes here */}
      {/* <Routes>: This is like a container where you define all the different paths (URLs) that can exist in your
app. It's responsible for checking the URL and deciding which page to display.       */}
      {/* Inside <Routes>, you create individual routes. Each route has a path (URL) and an element (component) that will be shown when that path is visited. */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
 
  
      <Toaster />

    </div>
  );
};

export default App;
