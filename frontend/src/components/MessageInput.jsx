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


// 1. **File Selected:** User selects `example.jpg` in the file input.
// 2. **Validation:**
//    - If `example.jpg` is not an image (e.g., `example.pdf`), an error message is shown.
//    - If it’s an image, proceed to the next step.
// 3. **Preview Set:**
//    - The file is converted to a base64 string like `data:image/jpeg;base64,...`.
//    - This string is saved in `imagePreview` to show the image above the input field.
  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // gets the first file selected by the user in the file input.
    if (!file.type.startsWith("image/")) { // ensures the selected file is an image (e.g., .png, .jpg).
      toast.error("Please select an image file"); // Show error if the file is not an image
      return;
    }

// A FileReader object is used to read the content of the file.It reads the file as a base64-encoded URL, 
// which is useful for displaying the image directly in the browser without uploading it to a server.
    const reader = new FileReader(); // Create a new FileReader to read the image
    reader.readAsDataURL(file); // reader.readAsDataURL(file) starts the file reading process and converts it to a base64 string.
    // onloadend is an event handler for the FileReader.It is like telling the FileReader:"When you finish reading the file, trigger this event and run the code inside."
    reader.onloadend = () => {    // reader.onloadend runs when the file reading is complete.
      // reader.result contains the base64 data of the image.
        setImagePreview(reader.result); // Set the image preview when file is loaded
      };
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
// Send the message (text and/or image) to the chat store which further make http request to backend to send message
      await sendMessage({text: text.trim(),image: imagePreview,});

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
            type="file" // This is the file input element where the user can select an image from their device.
            accept="image/*" // Ensures only image files can be selected.
            className="hidden"  // Hides the input from the UI.
            ref={fileInputRef} // Uses a reference (fileInputRef) to programmatically trigger the input when required.
            onChange={handleImageChange} // Trigger image change handler
          />

          {/* Button to open file input and select an image */}
          <button // This simulates a click on the hidden file input, allowing the user to select an image.
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
