// Why Socket.IO?
// When you were using Express and MongoDB, you could send messages and store them in a database, but the 
// messages would not be instantly visible on the other person's screen unless you refresh the page or use 
// some other polling technique. This is fine for static websites but not ideal for applications like chat
//  apps where real-time communication is necessary.

// Socket.IO enables real-time, two-way communication between the client (your frontend) and the server 
// (your backend) over a single, long-lived connection. This makes it possible to instantly send and 
// receive messages without needing to refresh the page.

// Benefits of Using Socket.IO:
// Real-time communication: Instant message delivery between users.
// Reduced server load: Instead of constantly requesting data from the server (polling), the server pushes updates to clients only when necessary.
// Bidirectional communication: The server can send data to clients, and clients can send data to the server.



import { Server } from "socket.io"; // Importing Socket.IO to enable real-time communication
import http from "http"; // Importing HTTP module to create a server
import express from "express"; // Importing Express for setting up the server

const app = express(); // Create an Express application

//We create an HTTP server using http.createServer(app) so that both Express (for HTTP requests) and 
// Socket.IO (for WebSocket communication) can use the same server.
const server = http.createServer(app); // Create an HTTP server using the Express app

// Attach the HTTP Server to Socket.IO and enable Cross-Origin Resource Sharing (CORS)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Allow requests from this origin (frontend)
    },
});

// Now Express and Socket.IO share the same server:
// If a GET, POST, or PUT request comes, Express handles it.
// If a WebSocket event like connection or message happens, Socket.IO handles it.


// Function to get the socket ID of a user whome we(sender) want to send message(receiver)
export function getReceiverSocketId(userId) {
    return userSocketMap[userId]; // Return the socket ID of the given user
}

//This is an object that maps user IDs to socket IDs. It's used to keep track of which user is connected to which socket.
// Object to store online users and their corresponding socket IDs
// Example: { "user123": "socketId123", "user456": "socketId456" }
const userSocketMap = {}; // use to store online users like {userId: socketId}

// Listen for new client connections to the Socket.IO server. Every time a new user connects, the callback is triggered.
io.on("connection", (socket) => {
    console.log("A user connected", socket.id); // Log when a user connects

// When a client connects, they can send a userId in the connection request.Get the user ID from the query
// parameters in the connection handshake from useAuthStore.js connectSocket funtion
    const userId = socket.handshake.query.userId;

//socket.id: This is a unique identifier for each connected user.
// If a user ID is provided,assign the user socket ID in the userSocketMap with useId like {userId: socketId}
    if (userId) {
// This shows that user has become online so for this we have to update userSocketMap and adding key value pairs
        userSocketMap[userId] = socket.id;
    }

// io.emit() is used to send events to all the connected clients in frontend in useAuthStore.js connect 
// method . It Notify all connected clients about the updated list of online users. We are sending keys of
// userSocketMap object i.e objectId's only from  {userId: socketId}
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

// Handle when a client disconnects. 
// socket.on("disconnect"): This listens for when a user disconnects from the server (e.g., by closing the 
// browser or losing internet).When a user disconnects, their socket ID is removed from userSocketMap, 
// and the remaining connected users are notified.
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id); // Log when a user disconnects
        delete userSocketMap[userId]; // Remove the disconnected user's socket ID from the userSocketMap

// io.emit will now notify all the clients in frontend in useAuthStore.js connect method that user is 
// offline by removing his userID from userSocketMap and we are sedning keys which are userID of online users       
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    });
});

// Export the Socket.IO server, Express app, and HTTP server for use in other parts of the application
export { io, app, server };




// When you use app.listen, it hides the HTTP server creation step internally, so you can't access the HTTP server instance to attach Socket.IO.
// By explicitly creating an HTTP server with http.createServer(app) and passing it to Socket.IO, you can handle both HTTP requests (via Express) and WebSocket events (via Socket.IO) on the same server

// ### **Why `http.createServer(app)`?**
// We create an HTTP server using `http.createServer(app)` so that both **Express (for HTTP requests)** and **Socket.IO (for WebSocket communication)** can use the same server.

// ### **How it works?**
// 1. **Create the HTTP Server**:
//    const server = http.createServer(app);
//    - This links the Express app (`app`) to the HTTP server (`server`).

// 2. **Attach the HTTP Server to Socket.IO**:
//    const io = new Server(server);
//    - This allows Socket.IO to use the same HTTP server for WebSocket connections.

// 3. **Start the Server**:
//    server.listen(5000, () => {
//        console.log("Server running on http://localhost:5000");
//    });

// ### **What happens?**
// - The same server (`server`) handles:
//   - HTTP requests (`GET`, `POST`, etc.) via `app` (Express).
//   - WebSocket events (`connection`, `message`, etc.) via `io` (Socket.IO).


// const http = require("http");
// const express = require("express");
// const { Server } = require("socket.io");

// const app = express();                  // Create an Express app
// const server = http.createServer(app);  // Create an HTTP server with the Express app
// const io = new Server(server);          // Attach Socket.IO to the HTTP server

// // Define an Express route
// app.get("/", (req, res) => {
//     res.send("Hello from Express!");
// });

// // Handle WebSocket connections
// io.on("connection", (socket) => {
//     console.log("A user connected", socket.id);

//     socket.on("disconnect", () => {
//         console.log("A user disconnected", socket.id);
//     });
// });

// // Start the server
// server.listen(5000, () => {
//     console.log("Server running on http://localhost:5000");
// });

// ### **Key Points**:
// - **`app.get`** handles normal HTTP routes.
// - **`io.on`** handles WebSocket events.
// - Both use the same `server`, so everything works together seamlessly.











// ### **What is `socket`?**
// - `socket` represents the **individual connection** between the server and a specific client (e.g., your browser or app).
// - **`socket.id`**: A unique ID that identifies each connected client.


// ### **Events and Their Purpose**

// 1. **`connection` Event**
//    - **What it does**: Happens when a client connects to the server. Inside this event, you can handle new user connections.
//    - **Example**:
//      io.on("connection", (socket) => {
//          console.log("A user connected:", socket.id);
//      });
//    - **Explanation**:
//      - When a client connects, the server runs this code.
//      - `socket.id` is automatically created by Socket.IO to uniquely identify the connected user.



// 2. **`disconnect` Event**
//    - **What it does**: Happens when a user disconnects (e.g., closes their browser).
//    - **Example**:
//      socket.on("disconnect", () => {
//          console.log("A user disconnected:", socket.id);
//      });
//    - **Explanation**:
//      - Runs when the user loses connection.
//      - Removes the user from any tracking (e.g., a list of online users).

// ---

// 3. **`socket.on`**
//    - **What it does**: Listens for a specific event from the client.
//    - **Example**:
//      socket.on("sendMessage", (data) => {
//          console.log("Message received:", data);
//      });
//    - **Explanation**:
//      - Listens for the event `"sendMessage"`.
//      - `data` contains the message sent by the client.

// ---

// 4. **`io.emit`**
//    - **What it does**: Sends an event to **all connected clients**.
//    - **Example**:
//      io.emit("newMessage", "Hello, everyone!");
//    - **Explanation**:
//      - All connected clients will receive the event `"newMessage"` with the message `"Hello, everyone!"`.

// ---

// ### **Putting it Together**

// Here’s a complete example:
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id); // Step 1: New user connects

//     // Listen for a "sendMessage" event from the client
//     socket.on("sendMessage", (message) => {
//         console.log("Message received:", message); // Step 2: Log the message
//         io.emit("newMessage", message); // Step 3: Broadcast the message to everyone
//     });

//     // Handle when a user disconnects
//     socket.on("disconnect", () => {
//         console.log("A user disconnected:", socket.id); // Step 4: User disconnects
//     });
// });

// ---

// ### **Flow of Events**
// 1. **Client connects**:  
//    Server logs: `A user connected: socket_id`.

// 2. **Client sends a message**:  
//    - Client: `socket.emit("sendMessage", "Hello Server!")`.
//    - Server: Logs `"Message received: Hello Server!"` and broadcasts `"Hello Server!"` to all clients.

// 3. **Client disconnects**:  
//    Server logs: `A user disconnected: socket_id`.

