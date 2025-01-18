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
// 1. When the component first loads (mounts), `useEffect` runs and checks the current state.
// 2. When the user clicks on a different person to chat, the `selectedUser` changes. 
//    This is because the `selectedUser` stores the user that you are chatting with, and when it changes, it updates to the new selected person.
// 3. The `selectedUser._id` changes, which means we need to load the messages for the new user. This triggers the `getMessages(selectedUser._id)` function to fetch the chat history with that user.
// 4. The `getMessages` function will update the `messages` array with the latest chat between the user and the selected person.
// 5. The dependency array `[selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]` ensures that the `useEffect`:
    // - Runs when `selectedUser._id` changes (i.e., when a new person is selected to chat).
    // - Runs again when `getMessages` or the subscription functions (`subscribeToMessages`, `unsubscribeFromMessages`) change.
    // This ensures the app fetches the latest messages for the newly selected user and subscribes to real-time updates.

    // 6. `subscribeToMessages`:
    //    - After selecting a new user, we call `subscribeToMessages()` to start receiving real-time messages for that user.
    //    - This function listens for new messages sent to the selected user and automatically updates the chat UI when a new message is received.
    
    // 7. `unsubscribeFromMessages`:
    //    - The cleanup function (`return () => unsubscribeFromMessages()`) is triggered when the component unmounts or when the selected user changes.
    //    - It stops listening for messages from the previous user to avoid memory leaks and ensures that the app only receives messages for the current selected user.
useEffect(() => {
// Fetch messages for the selected user as selectedUser._id will give the id of another person which 
    getMessages(selectedUser._id);  // user wants to chat (receiver id)
    subscribeToMessages(); // Subscribe to real-time updates for new messages

// unsubscribeFromMessages: Clean-up function to unsubscribe from messages when the component unmounts
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
// If we are the user then display my message at the (LHS) end if other person is sending message then dispaly that message on start at (RHS)
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
                  className="rounded-md mb-2 sm:max-w-[200px]" // Display image attachment if present
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
