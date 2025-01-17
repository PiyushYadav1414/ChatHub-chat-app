import mongoose from "mongoose";  // Importing mongoose for MongoDB interaction

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: { type: String, default: "" }
}, { timestamps: true });  // Enabling timestamps to track createdAt and updatedAt

// The { timestamps: true } option in Mongoose is used to automatically add two fields to your schema: createdAt and updatedAt.
// createdAt: This field stores the date and time when the document (record) was created.
// updatedAt: This field stores the date and time when the document was last updated.
// Imagine you're saving a new user in your database. Mongoose will automatically add the createdAt and updatedAt fields.

// Creating the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;  // Exporting the User model
