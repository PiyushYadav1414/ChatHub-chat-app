const MessageSkeleton = () => {
    // Create an array of 6 items for skeleton messages to show empty placeholders while loading messages
    const skeletonMessages = Array(6).fill(null);
  
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loop through the skeletonMessages array to display empty placeholders */}
        {skeletonMessages.map((_, idx) => (
          <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
            {/* User profile image placeholder */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                {/* Circular skeleton element representing the user's profile image */}
                <div className="skeleton w-full h-full rounded-full" />
              </div>
            </div>
  
            {/* Chat header placeholder, simulating the username */}
            <div className="chat-header mb-1">
              {/* Skeleton element to simulate the username */}
              <div className="skeleton h-4 w-16" />
            </div>
  
            {/* Chat message placeholder */}
            <div className="chat-bubble bg-transparent p-0">
              {/* Skeleton element to simulate the message content */}
              <div className="skeleton h-16 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageSkeleton;
  