// Importing the chat store and necessary components
import { useChatStore } from "../store/useChatStore"; // Access chat-related state and functions
import Sidebar from '../components/SideBar'; // Sidebar component to display the list of users
import NoChatSelected from "../components/NoChatSelected"; // Component shown when no chat is selected
import ChatContainer from "../components/ChatContainer"; // Main chat UI for messages

const HomePage = () => {
  const { selectedUser } = useChatStore(); // Retrieve the currently selected user from the chat store

  return (
    <div className="h-screen bg-base-200">
      {/* Main container for the HomePage layout */}
      <div className="flex items-center justify-center pt-20 px-4">
        {/* Outer box for the chat interface */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Flex container to arrange Sidebar and chat areas */}
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar /> {/* Sidebar to show the list of users for chatting */}

            {/* Conditional rendering: Show `NoChatSelected` if no user is selected, otherwise show `ChatContainer` */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; // Export the HomePage component for use in other parts of the app