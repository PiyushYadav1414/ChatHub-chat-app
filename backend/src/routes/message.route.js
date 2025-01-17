import express from "express";  // Import Express module
import { protectRoute } from "../middleware/auth.middleware.js";  // Import the protectRoute middleware
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message.controller.js";  // Import the controller for getting users

const router = express.Router();  // Create an Express router instance

// Define a GET route for fetching users for the sidebar, with authentication
router.get("/users", protectRoute, getUsersForSidebar);  // Protect the route with protectRoute middleware
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

 





export default router;  // Export the router for use in other parts of the application
