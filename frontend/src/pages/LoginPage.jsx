// Import necessary dependencies and components
import { useState } from "react"; // React hook for managing local component state
import { useAuthStore } from "../store/useAuthStore"; // Zustand store for managing authentication
import AuthImagePattern from "../components/AuthImagePattern"; // Component for displaying an image/pattern on the right side
import { Link } from "react-router-dom"; // React Router's Link component for navigation
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react"; // Icons from lucide-react library

const LoginPage = () => {
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for form inputs (email and password)
  const [formData, setFormData] = useState({
    email: "", // Email input starts as an empty string
    password: "", // Password input starts as an empty string
  });

  // Extracting the login function and isLoggingIn state from the Zustand auth store
  const { login, isLoggingIn } = useAuthStore();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser behavior of form submission
    login(formData); // Call the login function with the form data (email and password)
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left side - Login form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and welcome message */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              {/* Icon with hover effect */}
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" /> {/* MessageSquare icon */}
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1> {/* Heading */}
              <p className="text-base-content/60">Sign in to your account</p> {/* Subheading */}
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span> {/* Email field label */}
              </label>
              <div className="relative">
                {/* Icon inside the input field */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" /> {/* Mail icon */}
                </div>
                {/* Email input box */}
                <input
                  type="email" // Input type is email
                  className={`input input-bordered w-full pl-10`} // CSS classes for styling
                  placeholder="you@example.com" // Placeholder text
                  value={formData.email} // Controlled input bound to formData.email
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update state on input change
                />
              </div>
            </div>

            {/* Password input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span> {/* Password field label */}
              </label>
              <div className="relative">
                {/* Icon inside the input field */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" /> {/* Lock icon */}
                </div>
                {/* Password input box */}
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  className={`input input-bordered w-full pl-10`} // CSS classes for styling
                  placeholder="••••••••" // Placeholder text
                  value={formData.password} // Controlled input bound to formData.password
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update state on input change
                />
                {/* Button to toggle password visibility */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" /> // Show eye-off icon if password is visible
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" /> // Show eye icon if password is hidden
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
{/* Show loader if login is true which means our apllication is validating the cresential of user. When it 
completes then it will set isLoggingin to false indicating the process is completed */}
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> {/* Loading spinner */}
                  Loading...
                </>
              ) : (
                "Sign in" // Default button text
              )}
            </button>
          </form>

          {/* Link to sign-up page */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary"> {/* Link to signup page */}
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/pattern */}
      <AuthImagePattern
        title={"Welcome back!"} // Title for the image/pattern
        subtitle={"Sign in to continue your conversations and catch up with your messages."} // Subtitle text
      />
    </div>
  );
};

export default LoginPage;
