// What is Zustand?
// Zustand is a lightweight state management library for React applications.
//State management means having a central place (store) to keep important data (state) that can be shared and accessed by multiple components in your app.
// It allows you to store and share data (state) across your app without manually passing props between components.
// Think of it as a shared "state container" that all parts of your app can access.

//You can think of Zustand's store as being similar to services in Angular. Both serve as centralized places to manage and share state or logic across your app.
import { create } from "zustand"; // Import Zustand to create and manage global state
import { axiosInstance } from "../lib/axios"; // Import a pre-configured Axios instance for API calls
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Create a Zustand store to manage authentication-related data and app states
export const useAuthStore = create((set,get) => ({
// Store for managing chat-related data and actions
// All the variables and functions below are part of the store's state.
// Zustand provides a built-in `set` function to update the state in the store dynamically.
// It also provide built-in get functon to access latest value of both state and function
//getState() is used outside the store to directly access the current state, and it’s a built-in method from Zustand.

    // Stores details of the currently authenticated user
    authUser: null, // Initially set to null (no user is logged in)

    // States for tracking ongoing actions
    isSigningUp: false, // Tracks if the user is signing up
    isLoggingIn: false, // Tracks if the user is logging in
    isUpdatingProfile: false, // Tracks if the user is updating their profile

    // Indicates whether the app is verifying if the user is logged in
    isCheckingAuth: true, // Initially true while authentication status is being checked
    onlineUsers: [], //   onlineUsers: List of currently online users
    socket: null, // This holds the current WebSocket connection instance or null if not connected


    

    signup: async (data) => {
        // Set isSigningUp to true to indicate that the signup process has started
        set({ isSigningUp: true });

        try {
            // Send a POST request to the server's signup endpoint with the user data
            const res = await axiosInstance.post("/auth/signup", data);

            // If signup is successful, store the user data in the authUser state
            set({ authUser: res.data });

            // Show a success message to the user using a toast notification
            toast.success("Account created successfully");

            // Call the connectSocket function to establish a real-time connection
            get().connectSocket();
        } catch (error) {
            // If there’s an error, display the error message using a toast notification
            // The error message comes from the server's response
            toast.error(error.response.data.message);
        } finally {
            // No matter what happens, set isSigningUp back to false
            // This indicates that the signup process has ended
            set({ isSigningUp: false });
        }
    },



    // Function to handle user login
    login: async (data) => {
        set({ isLoggingIn: true }); // Set `isLoggingIn` to true to indicate the login process has started
        try {
            // Send a POST request to the backend's login endpoint with user-provided data (email and password)
            const res = await axiosInstance.post("/auth/login", data);

            // If the login is successful, update the `authUser` state with the response data (user details)
            set({ authUser: res.data });

            // Display a success message to the user 
            toast.success("Logged in successfully");

            // Connect to the WebSocket or real-time service
              get().connectSocket(); // This function is defined below
        } catch (error) {
            // If there's an error during login, show an error message from the backend response
            toast.error(error.response.data.message);
        } finally {
            // Reset `isLoggingIn` to false to indicate the login process has ended
            {/* Show loader if login is true which means our apllication is validating the cresential of user. When it 
completes then it will set isLoggingin to false indicating the process is completed */}
            set({ isLoggingIn: false });
        }
    },


    // Function to handle user logout
    logout: async () => {
        try {
            // Send a POST request to the backend's logout endpoint to clear the session (cookie)
            await axiosInstance.post("/auth/logout");

            // Set `authUser` to null to indicate the user is no longer logged in
            set({ authUser: null });

            // Display a success message to the user
            toast.success("Logged out successfully");

            // Disconnect from the WebSocket or real-time service
            get().disconnectSocket();
        } catch (error) {
            // If there's an error during logout, show an error message from the backend response
            toast.error(error.response.data.message);
        }
    },


       // Function to check if the user is authenticated
       checkAuth: async () => {
        try {
            // Send a GET request to the server to verify authentication
            const res = await axiosInstance.get("/auth/check");
            set({
                authUser: res.data, // If successful, store the user data from the response to authUser
            });

            // Call the connectSocket function to establish a real-time connection
            get().connectSocket();
        } catch (error) {
            console.error("Error in checkAuth:", error); // Log any errors
            set({ authUser: null }); // If there’s an error, reset authUser and set its data to null
        } finally {
            set({ isCheckingAuth: false }); // Mark authentication check as complete (always runs) .It shows now app is not checking authentication
        }
    },


    updateProfile: async (data) => {
        // Set `isUpdatingProfile` to true to indicate that the profile update process has started
        set({ isUpdatingProfile: true });

        try {
            // Make a PUT request to the backend endpoint for updating the user's profile
            // `data` contains the information to be updated, such as the profile picture
            const res = await axiosInstance.put("/auth/update-profile", data);

// If the request is successful, update the `authUser` state with the response data. This ensures the 
// updated profile information is reflected throughout the app
// This will have profilePic:"https://res.cloudinary.com/dsvdvmu0m/image/upload/v1737119616/tfdo7cf1…" 
            set({ authUser: res.data });            // added to User database

            // Show a success notification to the user
            toast.success("Profile updated successfully");
        } catch (error) {
            // Log the error to the console for debugging purposes
            console.log("Error in update profile:", error);

            // Display an error notification with a message from the server's response
            toast.error(error.response.data.message);
        } finally {
            // No matter what happens, reset `isUpdatingProfile` to false
            // This ensures the UI reflects that the profile update process has ended
            set({ isUpdatingProfile: false });
        }
    },

    // Function to establish a WebSocket connection using Socket.IO
    connectSocket: () => {
        const { authUser } = get(); // Get the latest value of authUser to check if the user is authenticated

// Check if the user is not authenticated or if a socket connection already exists and is active??.Secondly,
// get().socket: Fetches the latest socket instance stored in the Zustand state..connected: Checks if the 
// socket instance exists and whether it’s currently connected to the server???.
        if (!authUser || get().socket?.connected) {// `?.connected` ensures we don't throw an error if `socket` is null
            return; // If the user is not logged in or already connected, exit the function
        }
 
// Create a new WebSocket connection to the server using the user's ID. Below,socket is just a variable
// But this variable holds a Socket.IO connection instance that allows you to interact with the server
        const socket = io(BASE_URL, {query: {userId: authUser._id}, // Send the authenticated user's ID as part of the connection query
        });

// This actually sends the request to via url BASE_URL to server and establishes the WebSocket connection.
        socket.connect();


        set({ socket: socket }); // Save the socket instance to the Zustand store for future use

// Listen for the "getOnlineUsers" event from the lib/socket.js and will recieves keys of userID as data
// which contains a list of user IDs that are currently online. 
// io.on("connection", (socket) => { ... }) : This is the event listener that waits for a client (frontend)
// to connect.When a connection is made (via socket.connect()), this code runs.
// socket.handshake.query.userId => handshake.query.userId allows us to access the userId that was sent from the frontend as a query parameter
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds }); // Update the `onlineUsers` state with the list of online users
        });
    },

// Function to disconnect the WebSocket connection
    disconnectSocket: () => {
        // Check if there is an active socket connection
        if (get().socket?.connected) {
            get().socket.disconnect(); // only then Disconnect the socket connection if it exists
        }
    },
        
    
    
    
    }));


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//You can think of Zustand's store as being similar to services in Angular. Both serve as centralized places 
// to manage and share state or logic across your app.

//When you use Zustand, any change to the store's state (like authUser) automatically triggers an update in 
// all the components or places where that state is being used. This happens because Zustand is built on top
// of React's state reactivity. In angular service uses BehaviorSubject or Observable to share and update data across components.

// ### **1. What is Zustand?**
// - **Zustand** is a **state management library** for React.
// - **State management** means having a **central place (store)** to keep important data (state) that can be shared and accessed by multiple components in your app.
// - Example: Instead of passing the user’s login status (`authUser`) as props to multiple components, Zustand makes it easily accessible anywhere in your app.

// ### **2. What is a store?**
// - A **store** is like a **shared storage** for your app’s data. 
// - You can put data (like user details, loading status, etc.) in the store and access it from any component without passing it down manually as props.

// ### **3. Why did we create the `useAuthStore`?**
// - `useAuthStore` is the **Zustand store** for managing **authentication-related data**.
// - It holds all the information and actions (like signup or checkAuth) related to the user’s authentication.


// ### **4. Why do we have fields like `authUser`, `isSigningUp`, etc., inside `useAuthStore`?**
// These fields define what kind of data we want to manage:
// 1. **`authUser`**: Stores the details of the logged-in user. 
//    - Example: `{ fullName: "John Doe", email: "john@example.com" }`
//    - Initially set to `null`, meaning no user is logged in.

// 2. **`isSigningUp`**: Tracks if the signup process is happening (useful to show a loading spinner or disable the button).

// 3. **`isLoggingIn`**: Tracks if the user is currently logging in.

// 4. **`isCheckingAuth`**: Indicates if the app is checking whether the user is logged in (useful to show a loading screen before rendering the app).



// ### **5. Why do we have functions like `checkAuth` and `signup` in the store?**
// - These functions are **actions** that allow components to interact with the store.

// #### **a. `checkAuth`:**
// - Purpose: Checks if the user is logged in when the app starts or reloads.
// - How it works:
//   - Sends a request to the server (`/auth/check`) to verify the user’s session.
//   - If the server confirms the user is logged in, their details are saved in `authUser`.
//   - If not, `authUser` is reset to `null`.

// #### **b. `signup`:**
// - Purpose: Handles the signup process when the user submits the signup form.
// - How it works:
//   - Sends the user’s data (name, email, password) to the server (`/auth/signup`).
//   - If the server successfully creates an account, the user’s details are stored in `authUser`.
//   - Shows success or error messages using `toast`.

// ---

// ### **6. What is `useAuthStore` doing?**
// - `useAuthStore` is a **custom hook** created by Zustand.
// - Components use `useAuthStore` to access and manage the shared authentication data.

// ---

// ### **7. Why not just use `useState` in components?**
// - **With Zustand:** All components can access the same authentication state from the central store.
// - **Without Zustand:** Each component would need its own state, and you’d have to pass data (like `authUser`) as props, which becomes messy and hard to maintain.

// ---

// ### **8. Example to Understand Better**
// Imagine your app has the following components:
// 1. **Navbar**: Displays the user’s name if they’re logged in.
// 2. **HomePage**: Shows personalized content based on the logged-in user.
// 3. **SignUpPage**: Allows the user to create an account.

// #### Without Zustand:
// - You’d need to pass `authUser` as a prop from the top-level `App` component to each of these components.
// - If you update `authUser` in one component, you’d have to make sure it updates everywhere.

// #### With Zustand:
// - `authUser` is stored in the central store (`useAuthStore`).
// - Any component can directly access or update `authUser` using `useAuthStore()`.

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// When you use Zustand, **any change to the store's state** (like `authUser`) automatically triggers an update in all the components or places where that state is being used. This happens because Zustand is built on top of React's state reactivity.


// ### Here's How It Works:

// #### **React + Zustand Example:**

// // Zustand Store (useAuthStore.js)
// import { create } from "zustand";

// export const useAuthStore = create((set) => ({
//   authUser: null, // Shared state for the authenticated user

//   login: (user) => set({ authUser: user }), // Function to update authUser
//   logout: () => set({ authUser: null }),   // Function to clear authUser
// }));
// ```

// #### **Components React Automatically to State Changes**

// // App.jsx
// import React from "react";
// import { useAuthStore } from "./useAuthStore";
// import Navbar from "./Navbar";
// import Profile from "./Profile";

// const App = () => {
//   const authUser = useAuthStore((state) => state.authUser); // Access authUser state

//   return (
//     <div>
//       <h1>Welcome to the App</h1>
//       <Navbar /> {/* Navbar will react to authUser changes */}
//       {authUser ? <Profile /> : <p>Please log in to access your profile.</p>}
//     </div>
//   );
// };

// export default App;

// // Navbar.jsx
// import React from "react";
// import { useAuthStore } from "./useAuthStore";

// const Navbar = () => {
//   const authUser = useAuthStore((state) => state.authUser); // Reacts to authUser changes

//   return (
//     <nav>
//       <h2>Navbar</h2>
//       {authUser ? <p>Logged in as: {authUser.name}</p> : <p>Not logged in</p>}
//     </nav>
//   );
// };

// export default Navbar;

// // Profile.jsx
// import React from "react";
// import { useAuthStore } from "./useAuthStore";

// const Profile = () => {
//   const authUser = useAuthStore((state) => state.authUser); // Reacts to authUser changes

//   return (
//     <div>
//       <h2>Profile</h2>
//       <p>Name: {authUser.name}</p>
//       <p>Email: {authUser.email}</p>
//     </div>
//   );
// };

// export default Profile;


// ### **What Happens When `authUser` Changes?**

// 1. **User Logs In:**
//    ```javascript
//    const login = useAuthStore((state) => state.login); // Access login function
//    login({ name: "John Doe", email: "john@example.com" }); // Updates `authUser`
//    ```

//    - `authUser` is updated in the Zustand store.
//    - All components (`App`, `Navbar`, `Profile`) that depend on `authUser` automatically re-render with the new data.

// 2. **User Logs Out:**
//    const logout = useAuthStore((state) => state.logout); // Access logout function
//    logout(); // Clears `authUser`
//    ```

//    - `authUser` becomes `null`.
//    - Components react to the change. For example:
//      - `Navbar` displays "Not logged in."
//      - `App` replaces the `<Profile />` with "Please log in."

// ---

// ### **Key Benefits**

// 1. **Automatic Updates:** You don't need to manually notify components of state changes. Zustand does it for you.
// 2. **Single Source of Truth:** The Zustand store (`authUser`) ensures all components use the same, consistent data.
// 3. **No Props Passing:** You don't need to pass `authUser` from `App` to `Navbar` or `Profile`. Each component accesses the store directly.


// ### **Think of Zustand Like This:**
// If `authUser` is like the "main actor," all components that depend on it (e.g., `Navbar`, `Profile`) will "react" whenever the actor changes their behavior or appearance.

// This makes Zustand feel **simple and powerful**, especially compared to Angular services! 

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// ### What is `useAuthStore`?

// - **`useAuthStore` is a function** created by Zustand. 
// - It gives you access to the state and functions inside the Zustand store.
// - You **call `useAuthStore` in any React component** to read or update the shared state (like a service in Angular).


// ### How It Works

// #### 1. **Create the Store (like Angular Service)**

// In Angular, you create a service with state and methods. In Zustand, you create a "store" with `create()`.

// ```javascript
// // useAuthStore.js
// import { create } from "zustand";

// export const useAuthStore = create((set) => ({
//   // Fields (state) in the store
//   authUser: null,          // Stores the logged-in user's info
//   isSigningUp: false,      // Tracks if the signup process is ongoing

//   // Functions in the store
//   login: (user) => set({ authUser: user }),  // Updates authUser with user details
//   logout: () => set({ authUser: null }),    // Clears the authUser data
// }));
// ```

// ---

// #### 2. **Use the Store in Components (like Injecting and Using an Angular Service)**

// In Angular, you inject the service and call its methods. In React, you call `useAuthStore()` to get the data or functions.

// ---

// ### Example: Using Fields and Functions from `useAuthStore`

// #### Component 1: **Login Component**

// ```javascript
// import React, { useState } from "react";
// import { useAuthStore } from "./useAuthStore";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Access the `login` function from the store
//   const login = useAuthStore((state) => state.login);

//   const handleLogin = () => {
//     // Call the `login` function to update the state
//     login({ name: "John Doe", email });
//     console.log("User logged in!");
//   };

//   return (
//     <div>
//       <h1>Login</h1>
//       <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Log In</button>
//     </div>
//   );
// };

// export default LoginPage;
// ```

// ---

// #### Component 2: **Navbar Component**

// ```javascript
// import React from "react";
// import { useAuthStore } from "./useAuthStore";

// const Navbar = () => {
//   // Access the `authUser` and `logout` from the store
//   const authUser = useAuthStore((state) => state.authUser);
//   const logout = useAuthStore((state) => state.logout);

//   return (
//     <nav>
//       <h2>Navbar</h2>
//       {authUser ? (
//         <div>
//           <p>Welcome, {authUser.name}!</p>
//           <button onClick={logout}>Logout</button>
//         </div>
//       ) : (
//         <p>Please log in</p>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
// ```

// ---

// ### Key Comparison: Angular vs. Zustand

// | **Feature**               | **Angular Service**                                             | **Zustand Store**                                   |
// |---------------------------|-----------------------------------------------------------------|----------------------------------------------------|
// | **State Storage**         | Stored in the service as class properties                      | Stored in the Zustand store using `create()`       |
// | **How to Access**         | Injected into components with DI (`constructor(private...)`)   | Called in components using `useAuthStore()`        |
// | **Reactive Updates**      | Use `BehaviorSubject` or `Observable` for updates              | React's state reactivity automatically updates UI  |
// | **Functions/Methods**     | Defined as class methods in the service                        | Defined as functions in the store (`set()` updates state) |
// | **HTTP Calls**            | Made inside the service using `HttpClient`                    | Made inside store using libraries like Axios       |

// ---


// 1. **When you call** `useAuthStore((state) => state.authUser)`:
//    - It **fetches the current value** of `authUser` from the store.
//    - If `authUser` changes (e.g., user logs in or logs out), **the component updates automatically**.

// 2. **When you call a function like `login`**:
//    - The store **changes the value** of `authUser` (e.g., sets the logged-in user's details).
//    - Any component that uses `authUser` is **notified and re-renders** to reflect the updated value.



// -------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
