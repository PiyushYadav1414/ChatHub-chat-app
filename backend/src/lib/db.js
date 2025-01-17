import mongoose from "mongoose";  // Import mongoose to interact with MongoDB

export const connectDB = async () => {  // Asynchronous function to connect to MongoDB
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {  // Connect using the URI from environment variables
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);  // Log connection success
  } catch (error) {
    console.error("MongoDB connection error:", error);  // Log any error that occurs during connection
  }
};
