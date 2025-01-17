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
const server = http.createServer(app); // Create an HTTP server using the Express app

// Create a new Socket.IO server and enable Cross-Origin Resource Sharing (CORS)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Allow requests from this origin (frontend)
    },
});

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
        // This shows that user has become online so for this we have to update userSocketMap
        userSocketMap[userId] = socket.id;
    }

// io.emit() is used to send events to all the connected clients n frontend in useAuthStore.js connect 
// method . It Notify all connected clients about the updated list of online users. We are seding keys of
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
