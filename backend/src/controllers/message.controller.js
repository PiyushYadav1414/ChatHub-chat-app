import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {  // Define the function to get users for the sidebar
  try {
    const loggedInUserId = req.user._id;  // Get the logged-in user's ID from req.user (set by protectRoute)
    
    // Find all users excluding the logged-in user, and exclude the password field
//The $ne operator means "not equal", so we are excluding the logged-in user from the query results.
// As we want to show all the user who are online(loggedin) with green dot on our application except us like Whatsapp
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    
    // Respond with the filtered list of users
    res.status(200).json(filteredUsers);
  } catch (error) {
    // Log any errors and send a 500 status code with an error message
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


//This function retrieves all messages exchanged between the logged-in user (myId) and another user (userToChatId).
export const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params; // Extract the userToChatId from the route parameter
      const myId = req.user._id; // Get the logged-in user's ID from req.user
  
      // Find messages where either:
      // 1. The logged-in user sent a message to the other user
      // 2. The other user sent a message to the logged-in user
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
  
      // Send the found messages as the response
      res.status(200).json(messages);
    } catch (error) {
      // Log any errors and respond with a 500 status code
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };




  export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body; // Extract text and image from the request body
      const { id: receiverId } = req.params; // Extract receiver ID from the route parameter
      const senderId = req.user._id; // Get the logged-in user's ID from req.user
  
      let imageUrl;
  
      // If an image is provided, upload it to Cloudinary
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image); // Upload base64 image
        imageUrl = uploadResponse.secure_url; // Get the URL of the uploaded image
      }
  
      // Create a new message 
      const newMessage = new Message({
        senderId:senderId, 
        receiverId:receiverId, 
        text:text, 
        image: imageUrl,
      });
  
      await newMessage.save(); // Save the message to the database

// In below we are calling receiverSocketId function from lib/socket.js in order to get reciever socket id 
      const receiverSocketId = getReceiverSocketId(receiverId);
      
      if (receiverSocketId) { // If socket id exits which means user is online then send message in real-time using socket io
// io.emit will send message to all the user in frontend so we used id like io.to(receiverSocketId) to send 
// message to particular receiver in store.useChatStore.jsx whome we want to send newMessage we created 
// above as it is not a group chat as it is only a private chat.         
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      // TODO: Add real-time functionality using Socket.io
      res.status(201).json(newMessage); // Respond with the created message
    } catch (error) {
      console.log("Error in sendMessage controller:", error.message); // Log the error
      res.status(500).json({ error: "Internal server error" }); // Respond with a 500 status code
    }
  };
  
  
