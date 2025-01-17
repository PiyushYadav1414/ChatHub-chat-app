import mongoose from "mongoose";

// Define the message schema
const messageSchema = new mongoose.Schema({
  // senderId references the User model and is required
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // receiverId references the User model and is required
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // text field stores the actual message content (optional)
  text: { type: String },

  // image field stores the image URL or path (optional)
  image: { type: String }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create the Message model based on the schema
const Message = mongoose.model("Message", messageSchema);

// Export the Message model for use in other parts of the application
export default Message;
