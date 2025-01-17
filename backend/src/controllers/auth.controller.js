import User from "../models/user.model.js";  // Importing the User model
import { generateToken } from "../lib/utils.js"; // Adjust the path as needed
import bcrypt from "bcryptjs";  // Importing bcryptjs for password hashing
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {  // Define the signup function as an async function
    const { fullName, email, password } = req.body;  // Destructure the incoming request body
    try {
        // If user has not entered fullName,email,password
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if the password is at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        // Check if the email already exists in the database
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
// Hash the password using bcrypt
// genSalt is a function from the bcrypt library that creates a random string called a salt. This salt is 
// added to a password before it is hashed.The purpose of using a salt is to ensure that even if two users have 
// the same password, their hashed passwords will be different. This makes the password hashes more secure.
// The 10 in bcrypt.genSalt(10) is the difficulty level for hashing the password.
        const salt = await bcrypt.genSalt(10);  // Generate salt for password hashing
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

        // Create a new user instance with the hashed password
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        await newUser.save();  // Save the new user to the database
        
        if (newUser) {
            // Generate JWT token here
            generateToken(newUser._id, res);

            // Respond with the user details (excluding password)
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            }); 
        } else {
            // If the user data is invalid, send a 400 error
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        // Log the error and send a 500 status code for server errors
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};




export const login = async (req, res) => {
  const { email, password } = req.body;  // Destructure email and password from the request body

  try {
   
    // Find the user by email
    const user = await User.findOne({ email });
    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare the provided password with the hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // If the password is incorrect, return an error
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the authenticated user
    generateToken(user._id, res);  // Generate and send the token as a cookie

    // Respond with the user data (excluding password) and a 200 status
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
    
  } catch (error) {
    // Log the error and return a 500 Internal Server Error status
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const logout = (req, res) => {
    try {
      // Clear the JWT cookie by setting it to an empty string and maxAge to 0 (expires immediately)
      res.cookie("jwt", "", {
        httpOnly: true,  // Prevents JavaScript from accessing the cookie
        secure: process.env.NODE_ENV !== "development",  // Only use HTTPS in production
        sameSite: "strict",  // Helps prevent CSRF attacks
        maxAge: 0,  // Set cookie expiration to 0 to remove it immediately
      });
  
      // Send success message
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      // Log the error and send a 500 Internal Server Error status
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };




  export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body; // Extract `profilePic` from the request body
      const userId = req.user._id; // Get the user's ID from the authenticated user
  
      // Validate that `profilePic` is provided
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      // Upload the profile picture to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
  
      // Update the user's profile picture in the database
// By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
//uploadResponse.secure_url: It is the URL of the uploaded image on Cloudinary, returned after a successful upload.
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true } // Return the updated user document
      );
  
      // Send the updated user as the response
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("Error in updateProfile:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };



// protectRoute checks if the user has a valid token (authentication).
// If valid, checkAuth sends the user's details (like their name and email) back as a response.
  export const checkAuth = (req, res) => {
    try {
    // Send the authenticated user data (attached in `req.user` by the protectRoute middleware) to frontend
      res.status(200).json(req.user);
    } catch (error) {
      // Log any errors and send a 500 status code with a message
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  