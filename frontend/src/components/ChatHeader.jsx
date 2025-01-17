import { X } from "lucide-react"; // Importing the X (close) icon from lucide-react library
import { useAuthStore } from "../store/useAuthStore"; // Importing the auth store for authentication-related data
import { useChatStore } from "../store/useChatStore"; // Importing the chat store for chat-related data

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore(); // Getting the selected user and the function to change the selected user
  const { onlineUsers } = useAuthStore(); // Getting the list of online users

  return (
    <div className="p-2.5 border-b border-base-300">
      {/* This is the header of the chat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Section */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {/* Display the selected user's profile picture, if available, else show a default avatar */}
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User Information */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3> {/* Display selected user's full name */}
            <p className="text-sm text-base-content/70">
              {/* Show "Online" or "Offline" based on whether the selected user is in the list of online users */}
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={() => setSelectedUser(null)}>
          {/* The X icon to close the chat and reset the selected user */}
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
