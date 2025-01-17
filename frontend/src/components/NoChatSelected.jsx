import { MessageSquare } from "lucide-react"; // Importing the MessageSquare icon from lucide-react

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      {/* Container for the "No Chat Selected" message */}
      <div className="max-w-md text-center space-y-6">
        
        {/* Icon Display - The icon displayed when no chat is selected */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              {/* Message icon with animation */}
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Chatty!</h2> {/* Main heading */}
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p> {/* Instruction text to prompt the user to select a conversation */}
      </div>
    </div>
  );
};

export default NoChatSelected; // Export the NoChatSelected component to be used in other parts of the app
