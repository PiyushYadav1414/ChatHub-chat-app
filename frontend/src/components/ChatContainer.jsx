import { useChatStore } from "../store/useChatStore"; // Importing the custom Zustand store for chat-related state
import { useEffect, useRef } from "react"; // React hooks for side effects and accessing DOM elements
import ChatHeader from "./ChatHeader"; // Importing ChatHeader component for the chat header section
import MessageInput from "./MessageInput"; // Importing MessageInput component for sending messages
import MessageSkeleton from "./skeletons/MessageSkeleton"; // Importing skeleton component to show loading state
import { useAuthStore } from "../store/useAuthStore"; // Importing Zustand store for authentication-related data
import { formatMessageTime } from "../lib/utils"; // Utility function for formatting message timestamps

const ChatContainer = () => {
  const {
    messages, // Array of messages for the selected user
    getMessages, // Function to fetch messages from the server
    isMessagesLoading, // Flag to indicate if messages are loading
    selectedUser, // Currently selected user for the chat
    subscribeToMessages, // Function to subscribe to real-time message updates
    unsubscribeFromMessages, // Function to unsubscribe from message updates
  } = useChatStore();
  const { authUser } = useAuthStore(); // Get the current authenticated user from the store
  const messageEndRef = useRef(null); // Reference to scroll down to latest message so that we don't have top scroll again and again

// Effect to fetch messages when a user selects another person to chat with
// In Sidebar.jsx:
// - Display a list of users on the left-hand side (LHS) as rectangular boxes (like buttons).
// - Call the `getUsers` function from `useChatStore.jsx` to get a list of all users.
// - Map through the list of users to display their details in the UI.
// - When a user clicks on a user from the list to chat,then the user is selected  to chat.
// - The selected user is set by calling `setSelectedUser(user)`, which stores the selected user in the state.
// - Once a user is selected, we can fetch and display the chat history with that user.
  useEffect(() => {
// Fetch messages for the selected user as selectedUser._id will give the id of another person which 
    getMessages(selectedUser._id);  // user wants to chat
    subscribeToMessages(); // Subscribe to real-time updates for new messages

// unsubscribeFromMessages: Clea n-up function to unsubscribe from messages when the component unmounts
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


// Whenever there is new message run this useEffect and Scroll to the latest message whenever the messages array changes
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the latest message
    }
  }, [messages]);

  // If messages are still loading, show loading skeleton
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader /> {/* Display chat header like another person profile picture name and online or Offline*/}
        <MessageSkeleton /> {/* Display loading skeleton for messages between user and another person  */}
        <MessageInput />{/* Display the input area for messages where we can send messages to another person */}
      </div>
    );
  }

  // Display the chat interface once messages are loaded
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader /> {/* Display the chat header */}

      {/* Display the list of messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
// If we are the user then display my message at the (LHS) end if other person is sending message then dispaly message on start at (RHS)
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef} // Set ref to scroll to the latest message
          >
            <div className=" chat-image avatar">
              <div className="rounded-full border size-10">
                <img
                  src={  
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png" // Show the sender's profile picture
                      : selectedUser.profilePic || "/avatar.png" // Show the recipient's profile picture
                  }
                  alt="profile pic"
                />
              </div>
            </div>
        {/* Format and display the time when message sent by user and another person */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)} 
              </time>
            </div>
            {/* Below will be there if user has uploaded both image and text */}
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2" // Display image attachment if present
                />
              )}
              {message.text && <p>{message.text}</p>} {/* Display text message */}
            </div>
          </div>
        ))}
      </div>

      <MessageInput /> {/* Input field for sending a new message */}
    </div>
  );
};

export default ChatContainer; // Export the ChatContainer component to be used in other parts of the app
