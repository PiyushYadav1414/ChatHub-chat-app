import express from "express";  // Importing the Express module
import dotenv from "dotenv";  // Importing dotenv to manage environment variables
import { connectDB } from "./lib/db.js";  // Importing the connectDB function to connect to MongoDB
import authRoutes from "./routes/auth.route.js";  // Importing authRoutes for authentication routes
import cookieParser from "cookie-parser";  // Import cookie-parser to handle cookies
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";



dotenv.config();  // Loading environment variables from .env file

// const app = express();  // We have cretaed an Express application instance in lib/socket.js
const PORT = process.env.PORT ;  // Setting the port from environment variables or default to 5000
const __dirname = path.resolve();

app.use(express.json());  // Middleware to parse JSON requests (important for POST requests)
// Cookie Parser => Parses(reads) the cookies sent by the browser in a request and makes them easily accessible in your code via req.cookies..
// Allows you to set cookies in the response (e.g., using res.cookie).
// Access cookies: req.cookies.jwt (if there's a jwt cookie) OR Set cookies: res.cookie('jwt', token)
app.use(cookieParser());  //cookie-parser is middleware in Express that helps you read and set cookies in your application.

app.use(cors({
    origin: "http://localhost:5173", // Allow requests from this frontend URL
    credentials: true // Allow cookies to be included in cross-origin requests
  }));
  

app.use("/api/auth", authRoutes);  // Defining the route for authentication API
app.use("/api/messages", messageRoutes); 



if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

// Attach the HTTP Server to Express
server.listen(PORT, () => {  // Starting the server and listening on the specified port
    console.log(`Server is listening at http://localhost:${PORT}`); // Log a message when the server starts
    connectDB();  // Connect to MongoDB using the connection URI from .env
});
