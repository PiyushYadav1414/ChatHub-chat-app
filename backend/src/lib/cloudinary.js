import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// 1. **What is Cloudinary?**
//    - **Cloudinary** is a tool to store and manage images or videos online.
//    - You can use it to **upload, resize, crop, or optimize media files**.

// 2. **What is `v2`?**
//    - `v2` is the version of the Cloudinary library you're using.
//    - It provides functions like `upload` or `manage` for media.

// 3. **Why `config()`?**
//    - `config()` connects your app to your **Cloudinary account** by providing your account details:
//      - **cloud_name**: Your Cloudinary account name.
//      - **api_key**: A key to access your account.
//      - **api_secret**: A secret to secure your account.

// 4. **Example:**
//    Imagine you want to upload an image to Cloudinary:
//    ```javascript
//    cloudinary.uploader.upload("image.jpg", (error, result) => {
//      if (error) console.log(error);
//      else console.log(result.url); // Returns the URL of the uploaded image
//    });
 