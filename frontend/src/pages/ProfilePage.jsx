import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  // Access authUser (user details), isUpdatingProfile (state), and updateProfile (function) from Zustand store
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  // State to store the selected profile picture for preview before uploading
  const [selectedImg, setSelectedImg] = useState(null);

  // Handles the image upload process when a new image is selected
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the image submitted by user in input field
    if (!file) return; // Exit if no file is selected

    const reader = new FileReader(); // FileReader is used to read the file as a Base64 string

    reader.readAsDataURL(file); // Convert the file into Base64 format

    // Once the file is read, this function is called with the result
    reader.onload = async () => {
      const base64Image = reader.result; // The Base64 string of the image
      setSelectedImg(base64Image); // Update the preview image
      await updateProfile({ profilePic: base64Image }); // Send the image to the backend for saving
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        {/* Container for the profile card */}
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            {/* Profile header */}
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Display profile picture or fallback to default image */}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                {/* Camera icon for profile picture upload */}
                <Camera className="w-5 h-5 text-base-200" />
                {/* Hidden input for selecting a file */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*" // Restrict file types to images
                  onChange={handleImageUpload} // Call handleImageUpload when a file is selected
                  disabled={isUpdatingProfile} // Disable input if an upload is already in progress
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..." // Show uploading message if the profile is being updated
                : "Click the camera icon to update your photo"} // Default message
            </p>
          </div>

          {/* Display user details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName} {/* Show the user's full name */}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email} {/* Show the user's email */}
              </p>
            </div>
          </div>

          {/* Account information section */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span> {/* Display account creation date */}
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span> {/* Show account status */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
