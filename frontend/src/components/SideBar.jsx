import { useEffect, useState } from "react"; // Import hooks for side effects and state management
import { useChatStore } from "../store/useChatStore"; // Access chat-related data from the Zustand store
import { useAuthStore } from "../store/useAuthStore"; // Access authentication-related data from the Zustand store
import SidebarSkeleton from "./skeletons/SidebarSkeleton"; // Placeholder component displayed while the users list is loading
import { Users } from "lucide-react"; // Icon for the "Users" section

// In Sidebar.jsx:
// - Display a list of users on the left-hand side (LHS) as rectangular boxes (like buttons).
// - Call the `getUsers` function from `useChatStore.jsx` to get a list of all users.
// - Map through the list of users to display their details in the UI.
// - When a user clicks on a user from the list to chat,then the user is selected  to chat.
// - The selected user is set by calling `setSelectedUser(user)`, which stores the selected user in the state.
// - Once a user is selected, we can fetch and display the chat history with that user.

const Sidebar = () => {
  // Destructure necessary states and functions from the chat store
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
// getUsers is a function which retrieves all the user from database and it put into users which is an Array of object
// selected user is that user whome we have clicked or are chatting with end-to-end and setSelectedUser function
// is use to set that selectedUser when we click and isUsersLoading show loader till the data is not fetched from database


  // Destructure online users from the auth store and we have got it using socket.io
  const { onlineUsers } = useAuthStore();

  // Local state to control whether to show only online users or not
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch users when the component is mounted or when getUsers function changes
  useEffect(() => {
    getUsers(); // Fetch the list of users
  }, [getUsers]);

  // Filter the users based on the showOnlineOnly state
  // Only show users that are online. OR . Show all users if the filter is off
  const filteredUsers = showOnlineOnly? users.filter((user) => onlineUsers.includes(user._id)) : users; 

  // If users are still being fetched, show the skeleton loader, otherwise display the sidebar <aside>
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" /> {/* Display Users icon */}
          <span className="font-medium hidden lg:block">Contacts</span> {/* Label for the contacts section */}
        </div>

        {/* Checkbox to toggle the filter for online users */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox" // Checkbox to enable/disable the online users filter
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)} // Update filter state based on checkbox
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span> {/* Label for the checkbox */}
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> {/* Display the number of online users */}
        </div>
      </div>

{/* Display a list of users on the LHS, with a rectangular UI(Button) for each user(like WhatsApp Web).
  - When a user clicks on a specific user, we set that user as the selected user using `setSelectedUser(user)`.
  - After the user is selected, the color of the selected user's container (or button) will change to visually indicate the selection.
  - Once `setSelectedUser(user)` is called, on the LHS, the corresponding chats with that user will be displayed.
  - We can also chat with the selected user.*/}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button 
            key={user._id} // Unique key for each user
            onClick={() => setSelectedUser(user)} // Set the selected user when clicked
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
        {/* Display user's profile image if image does not exist then show /avatar.png*/}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"} // Use default avatar if no profile picture
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
            {/* If user is Online then Show online status indicator of Green colour dot */}
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* Display user information (visible only on larger screens) */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-medium truncate">{user.fullName}</div> {/* Show full name */}
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"} {/* Display online/offline status */}
              </div>
            </div> 
          </button>
        ))}

        {/* Display a message when no users are available */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div> // Message shown when no online users are found
        )}
      </div>
    </aside>
  );
};

export default Sidebar; // Export the Sidebar component for use in other parts of the app
