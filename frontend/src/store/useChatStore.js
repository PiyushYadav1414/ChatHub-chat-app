// In Zustand, the store is like a container for all your app's states and functions.
import { create } from "zustand"; // Zustand library for state management
import toast from "react-hot-toast"; // Library for showing toast notifications
import { axiosInstance } from "../lib/axios"; // Pre-configured Axios instance for API requests
import { useAuthStore } from "./useAuthStore"; // Zustand store for authentication-related data

export const useChatStore = create((set, get) => ({ 
 // Store for managing chat-related data and actions
// All the variables and functions below are part of the store's state.
// Zustand provides a built-in `set` function to update the state in the store dynamically.

  messages: [], // Array to store messages in the chat
  users: [], // Array to store the list of users
  selectedUser: null, // Currently selected user for chatting
  isUsersLoading: false, // Flag to indicate if the users list is loading of LHS (chats)
  isMessagesLoading: false, // Flag to indicate if messages are loading 

  // Function to fetch all users available for messaging
  getUsers: async () => {
// We can show loader till the data is not fetched on Browser by setting set({ isUsersLoading: true });
    set({ isUsersLoading: true }); // Indicate that the users list is being fetched
    try {
      const res = await axiosInstance.get("/messages/users"); // API request to get users
      set({ users: res.data }); // Store the fetched users in the state users
    } catch (error) {
      // Show error notification if the request fails
      toast.error(error.response?.data?.message || "Failed to load users.");
    } finally {
      set({ isUsersLoading: false }); // Reset loading flag after completion
    }
  },

  // Function to fetch messages for a specific user
  getMessages: async (userId) => {
// We can show loader till the data is not fetched on Browser by setting set({ isMessagesLoading: true });    
    set({ isMessagesLoading: true }); // Indicate that messages are being fetched
    try {
      const res = await axiosInstance.get(`/messages/${userId}`); // API request to get messages
      set({ messages: res.data }); // Store the fetched messages in the state
    } catch (error) {
      // Show error notification if the request fails
      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false }); // Reset loading flag after completion
    }
  },

  // Function to send a new message to the selected user
  sendMessage: async (messageData) => {
// get is used to retrieve the current state (data) values for selectedUser (the user you’re chatting with)
//and messages (the list of messages so far) from the state of the store.This means we get the most up-to-date data to work with.
    const { selectedUser, messages } = get(); // Get the selected user and current messages from the state
    
    try {
// After sending the POST request to the `sendMessage` endpoint: The message, which can contain either text 
// or an image, will be processed.If the message includes an image, the image will be uploaded to Cloudinary.
// Cloudinary will return a `secure_url`, which is a public URL for the uploaded image.The `secure_url` 
// will be added to the `newMessage` object, alongside any text content.The `message.controller.js` will 
// then return the complete `newMessage` object to res, including the image URL or text, after saving everything to the database.
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData); // API request to send a message

 // Add the new message to the existing messages Eg keep all the previous message (...messages) and add 
 //  new message(res.data) and update the UI immediately
      set({ messages: [...messages, res.data] }); 
    } catch (error) {
      // Show error notification if the request fails
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  },

// Function to subscribe to real-time messages using WebSockets adn it will recieve real-time message from 
// message.controller.js sent by sender(user). We will call below funcytion in ChatContainer.jsx as it 
// display all the messages between sender and receiver adn we wil call it in useEffect so that it refreshes 
// everytime whenever there is new message
  subscribeToMessages: () => {
    const { selectedUser } = get(); // Get the currently selected user to chat 
    if (!selectedUser) return; // Exit  if no user is selected to chat

    const socket = useAuthStore.getState().socket;//Access the socket state from the authstore.js using getState()

    // Listen for newMessage  from the server auth.controller.js
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id; // Check if the message is from the selected user
      if (!isMessageSentFromSelectedUser) return; // Ignore messages from other users

      // Add the new message at the end to all the previous messages array
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // Function to unsubscribe from real-time messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;//Access the socket state from the authstore.js using getState()
    socket.off("newMessage"); // Remove the "newMessage" listener to stop receiving updates
  },

  // Function to set the currently selected user for chatting like on whatsapp we click on any user and 
  // his/her chat opens and we can further chat and can see message 
  setSelectedUser: (selectedUser) => set({ selectedUser }), // Update the selected user in the state
}));
