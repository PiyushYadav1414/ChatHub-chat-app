// Importing the Axios library to make HTTP requests
import axios from "axios";

// Creating a custom instance of Axios with specific configurations (MAKING CUSTOM HOOK)
export const axiosInstance = axios.create({
  // Setting the base URL for all requests made with this Axios instance
  // This means every request you make will automatically have this URL as the base
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",

// Enabling the 'withCredentials' option to include credentials (cookies, HTTP authentication) with cross-origin requests
// This is important if you are sending requests that need authentication, such as login/logout, or working with cookies
  withCredentials: true,
});



// Let’s make it even simpler:
// ### **Why create an Axios instance?**

// - **What happens without an instance?**  
//   If you use `axios.get()` directly, you must provide the full API URL (e.g., `http://localhost:5001/api/users`) 
// and other settings (like sending cookies) every single time. This means you repeat yourself a lot.  

// - **What does an Axios instance do?**  
//   An Axios instance is like a **shortcut**. You set the common settings (like the base URL and options) 
// once, and every time you use this instance, it automatically includes those settings.  

// ### **Example Without an Instance**:
// If you don’t use an Axios instance, you’ll write this every time:

// axios.get("http://localhost:5001/api/users", { withCredentials: true })
//   .then(response => console.log(response.data));

// - Here, you have to:
//   - Write the full URL.
//   - Specify `{ withCredentials: true }` each time.


// ### **Example With an Instance**:
// With a custom Axios instance, you can do this instead:

// import { axiosInstance } from "./axiosInstance";

// axiosInstance.get("/users").then(response => console.log(response.data));

// - The instance **already knows**:
//   - The base URL is `http://localhost:5001/api`.
//   - `withCredentials` should always be `true`.

// ---

// ### **How Does It Save Time?**
// - **Less typing**: You only provide the endpoint (`/users`) instead of the full URL.  
// - **No repetition**: The same settings (like `withCredentials`) are applied automatically.

// Think of it like setting a default phone number for your calls. Instead of dialing the entire number every time, you just press a shortcut! 😊