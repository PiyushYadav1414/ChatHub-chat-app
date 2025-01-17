import { useRef, useState } from "react"; // Importing hooks for state and referencing DOM elements
import { useChatStore } from "../store/useChatStore"; // Importing chat store to send messages
import { Image, Send, X } from "lucide-react"; // Importing icons for image, send, and close
import toast from "react-hot-toast"; // Importing toast notifications to show alerts

const MessageInput = () => {
  // Defining state for text input and image preview
  const [text, setText] = useState(""); // State to hold the text of the message

// State to hold the image preview
// When a user selects an image from their file system to send to another person:
// - The selected image will be displayed as a preview above the input field on the left-hand side (LHS).
// - This allows the user to see what image they're about to send before confirming it.
// - After confirming, the image will be sent to the other person as part of the chat message.
  const [imagePreview, setImagePreview] = useState(null); 
  const fileInputRef = useRef(null); // Reference to file input element
  const { sendMessage } = useChatStore(); // Getting sendMessage function from chat store

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file"); // Show error if the file is not an image
      return;
    }

    const reader = new FileReader(); // Create a new FileReader to read the image
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview when file is loaded
    };
    reader.readAsDataURL(file); // Read the file as base64 URL
  };

  // Function to remove the image preview
  const removeImage = () => {
    setImagePreview(null); // Clear image preview
    if (fileInputRef.current){
        fileInputRef.current.value = ""; // Clear the file input
    } 
  };

  // Function to handle sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submit action
    if (!text.trim() && !imagePreview) return; // Don't send if no text or no image in input field 

    try {
// Send the message (text and/or image) to the chat store which urther make http request to backend to send message
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear the input fields after sending the message (resetting everthing for new input from user)
      setText(""); // Clear text input
      setImagePreview(null); // Clear image preview
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input
    } catch (error) {
      console.error("Failed to send message:", error); // Log error if sending fails
    }
  };

  return (
    <div className="p-4 w-full">
    {/* Show image preview if there is one above of input field before seding image to another person  */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {/* Button to remove image preview */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Form to input and send message */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input for typing message */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Update text state as the user types
          />
    {/* Input to select image from our machine. Hidden file input for selecting image */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange} // Trigger image change handler
          />

          {/* Button to open file input and select an image */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} // Trigger file input click
          >
            <Image size={20} />
          </button>
        </div>
        {/* Button to send the message */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable if no text or image
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
