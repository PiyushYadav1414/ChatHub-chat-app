import { THEMES } from "../constants"; // Array of themes coming from constants/index.js
import { useThemeStore } from "../store/useThemeStore"; // Zustand store for managing the current theme
import { Send } from "lucide-react"; // Icon for the send button

// Mock messages to preview the chat interface 
const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false }, // Message from the other user
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true }, // Message from the user
];

const SettingsPage = () => {
  // Access the current theme and the function to update it from the Zustand store
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      {/* Page container */}
      <div className="space-y-6">
        {/* Theme Selection Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        {/* Display all available themes coming from constants/index.js*/}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t} // Unique key for each theme button
              className={`
                group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === t ? "bg-base-200" : "hover:bg-base-200/50"} 
                // Highlight the currently selected theme
              `}
// Change the theme on button click and calls setTheme function from store/useThemeStore.js which sets the 
// theme and will update al components whish uses theme including the div of App.jsx which apply it it whole chat application
              onClick={() => setTheme(t)} 
            >
              {/* Preview of the theme colors like 4 in each container */}
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div> {/* Primary color */}
                  <div className="rounded bg-secondary"></div> {/* Secondary color */}
                  <div className="rounded bg-accent"></div> {/* Accent color */}
                  <div className="rounded bg-neutral"></div> {/* Neutral color */}
                </div>
              </div>
              {/* Theme name displayed under the preview */}
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)} {/* Capitalize the theme name */}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              {/* Mock Chat Interface */}
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <div className="flex items-center gap-3">
                    {/* User's avatar */}
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                      J {/* Initial of the user */}
                    </div>
                    {/* User details */}
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-base-content/70">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id} // Unique key for each message
                      className={`flex ${message.isSent ? "justify-end" : "justify-start"}`} // Align based on sender
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-xl p-3 shadow-sm
                          ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"} 
                          // Different styles for sent and received messages
                        `}
                      >
                        <p className="text-sm">{message.content}</p> {/* Message content */}
                        <p
                          className={`
                            text-[10px] mt-1.5
                            ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                            // Timestamp style based on sender
                          `}
                        >
                          12:00 PM {/* Hardcoded timestamp for preview */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    {/* Input field for typing messages */}
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      placeholder="Type a message..."
                      value="This is a preview" // Static value for preview
                      readOnly // Input is read-only in the preview
                    />
                    {/* Send button */}
                    <button className="btn btn-primary h-10 min-h-0">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
