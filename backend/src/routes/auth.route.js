import express from "express";  // Importing the Express module
import { login, logout, signup,checkAuth,updateProfile } from "../controllers/auth.controller.js";  // Importing controller functions
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();  // Creating an Express router instance

// // Example of a basic GET route
// router.get("/", (req, res) => {
//     res.send("Hello");
// });

// Defining the routes 
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Adding protectRoute middleware  so that only loggedIn user can update their profile
router.put("/update-profile",protectRoute, updateProfile)// protectRoute: Ensures the user is authenticated by verifying the JWT token

//checkAuth sends back the user's information once they are confirmed to be logged in.It works after the 
// protectRoute middleware, which checks if the user has a valid token (proof that they are logged in).
router.get("/check", protectRoute, checkAuth);// This is to check if user is authenticated or not



export default router;  // Exporting the router for use in other parts of the application
