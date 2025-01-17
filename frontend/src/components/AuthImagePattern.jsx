// This component renders a decorative pattern and a message, typically shown on the right side of an authentication page.
// It receives `title` and `subtitle` as props to display customizable content.

const AuthImagePattern = ({ title, subtitle }) => {
    return (
      // The outermost container is hidden on small screens and only visible on large screens (lg:flex).
      // It centers the content and applies background color, padding, and alignment styles.
      <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
        
        {/* Inner container to constrain the text and grid layout to a max width */}
        <div className="max-w-md text-center">
          
          {/* A decorative grid of squares with animations */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Creating an array of 9 items using Array(9) and mapping over it to render 9 squares */}
            {[...Array(9)].map((_, i) => (
              // Each square is a small box with a background color, rounded corners, and optional animation.
              <div
                key={i} // Unique key for each square, required for rendering lists in React.
                className={`aspect-square rounded-2xl bg-primary/10 ${
                  i % 2 === 0 ? "animate-pulse" : "" // Adds a pulsing animation to every alternate square.
                }`}
              />
            ))}
          </div>
  
          {/* Title section for displaying a bold, prominent message */}
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          
          {/* Subtitle section for displaying additional details or a description */}
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    );
  };
  
  export default AuthImagePattern;
  