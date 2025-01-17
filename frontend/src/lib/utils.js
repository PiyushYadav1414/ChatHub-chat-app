// Function to format the message time
export function formatMessageTime(date) {
    // Convert the date string into a JavaScript Date object
    // Then format it into a time string (e.g., 12:30)
    return new Date(date).toLocaleTimeString("en-US", {
      // Format options for the time string:
      hour: "2-digit", // Show the hour with 2 digits (e.g., 12)
      minute: "2-digit", // Show the minute with 2 digits (e.g., 05)
      hour12: false, // Use 24-hour time format (e.g., 14:30 instead of 2:30 PM)
    });
  }
  