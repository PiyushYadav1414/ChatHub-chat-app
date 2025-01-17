import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the token from cookies and THE NAME OF THE TOKEN IS JWT 
        const token = req.cookies.jwt;

        // If no token is found, return an unauthorized error
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify the token using the JWT_SECRET
        // decoded is the result of verifying and decoding the JWT token using jwt.verify(token, secret).
        // It contains the data (payload) that was embedded in the token when it was created.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decode); => { "userId": "12345", "iat": 1673889600, "exp": 1674494400 }

        // If token verification fails
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Find the user in the database using the ID from the decoded token and we are selecting everthing except 
        const user = await User.findById(decoded.userId).select("-password");// the password of user

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user object to the request for future use so that req.user will have all the detail of user
        // This allows you to identify the user who made the request without needing them to send their userId explicitly.
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// -------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ### What is `decoded`?
// - **`decoded`** is the result of verifying and decoding the JWT token using `jwt.verify(token, secret)`.
// - It contains the **data (payload)** that was embedded in the token when it was created.

// ### Why does `decoded` have `userId`?
// - When the token was created (e.g., during user login), the **userId** was included in the payload:
//***       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });***
// - So, when you verify the token, **`decoded`** will contain the same `userId` that was added during token creation.


// ### What Type of Data is in `decoded`?
// - **Type**: `decoded` is an **object**.
// - **Data**: It contains the payload (e.g., `userId`) and other JWT metadata (like `iat` and `exp`).


// ### Example with Fake Data
// #### 1. When Token is Created:
//         const token = jwt.sign({ userId: "12345" }, "mysecretkey", { expiresIn: "7d" });

// #### 2. When Token is Decoded:
//          const decoded = jwt.verify(token, "mysecretkey");
//          console.log(decoded);

// #### **Decoded Output:**
// {
//   "userId": "12345",         // Payload added during token creation
//   "iat": 1673889600,         // Issued At (timestamp when the token was created)
//   "exp": 1674494400          // Expiration (timestamp when the token will expire)
// }


// ### Why Use `decoded.userId`?
// - **`decoded.userId`** accesses the `userId` field from the token payload.
// - This allows you to identify the user who made the request without needing them to send their `userId` explicitly.

// ### Simple Explanation

// - The **JWT token** is like a sealed letter containing user information (`userId`).
// - When the token is **decoded**, you "open the letter" and retrieve the `userId` (or other data) for authentication or further processing.

// -------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!------------------IMPORTANT!!!--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
