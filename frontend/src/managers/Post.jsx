import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { BASE_URL } from "./helper";
import { FaPaperclip } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { ClipLoader } from "react-spinners"; // Import the spinner

const Post = () => {

  const [isLoading, setIsLoading] = useState(false);  
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("user") === null
  ) {
    window.location.href = "/login";
  }

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tweet, settweet] = useState("");
  const [image, setImage] = useState(null); // State to store the selected image

  const handleTweetChange = (e) => {
    settweet(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image file
  };

  const uploadToCloudinary = async (file) => {
    try {
      // Replace these with your Cloudinary credentials
      const CLOUD_NAME = "dktqwjd5t";
      const UPLOAD_PRESET = "tweetify";
  
      // FormData to hold the image and Cloudinary parameters
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
  
      // Cloudinary URL
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  
      // Post the image to Cloudinary
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Return the URL of the uploaded image
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      
      toast.error("Failed to upload image");
      return null;
    }
  };

  const handlePost = async () => {
    // e.preventDefault();

    if(tweet.length === 0) {
      return;
    }

    const token = JSON.parse(localStorage.getItem("token"));

    if (token === null) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    

    let imageUrl = null;
    if(image) {
      imageUrl = await uploadToCloudinary(image);
      // imageUrl = "https://res.cloudinary.com/dktqwjd5t/image/upload/v1733337561/ikjre648j4acorvky5nm.gif";
      if(imageUrl === null) {
        return;
      }
      console.log(imageUrl);
    }
    
    await axios
      .post(`${BASE_URL}/api/v1/users/postTweet`, 
        {
          tweet: tweet,
          user: user._id,
          image: image ? imageUrl : null,
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      .then((response) => {
        console.log("Success:", response.data);
        toast.success("Tweet posted successfully");
        settweet("");
        setImage(null); // Reset image after successful post
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to post the tweet");
      });
  };

  const handlePostClick = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader
    await handlePost(); // Call the post handler (ensure it's async if necessary)
    setIsLoading(false); // Hide loader after completion
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <div className="flex min-h-full flex-1 flex-col justify-center">
        <Navbar />

        <div className="main m-10 mt-16">
          <h1 className="text-5xl p-5 font-bold text-center">POST HERE!</h1>

          <div>
            <label
              htmlFor="tweet"
              className="block text-lg font-bold leading-6 text-gray-900"
            >
              Tweet Here
            </label>
            <div className="mt-2">
            <textarea
        id="tweet"
        name="tweet"
        value={tweet}
        onChange={handleTweetChange}
        required
        className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 h-80 whitespace-pre-wrap"
      ></textarea>

      
            </div>
            <div className="mt-4">
      <label
        htmlFor="image"
        className="block text-lg font-bold leading-6 text-gray-900 mb-2"
      >
        Add an Image
      </label>

      {/* Styled Button with Clip Icon */}
      <label
        htmlFor="image"
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 cursor-pointer"
      >
        <FaPaperclip className="h-5 w-5 text-gray-500 mr-2" />
        Upload Image
      </label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden" // Hide the default input
      />

      {/* Display Selected Image */}
      {image && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">Selected Image:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Selected"
            className="mt-2 h-32 w-32 object-cover rounded-md border border-gray-300"
          />
        </div>
      )}
    </div>
            <div className="flex gap-5 items-center mt-5">
              <button
                className={`
                  ${tweet.length === 0 ? "cursor-not-allowed bg-gray-500" : "bg-blue-700 "}
                   p-3 rounded-lg text-white flex items-center gap-1`}
                   disabled={isLoading || tweet.length === 0}
                onClick={handlePostClick}
              >
                {isLoading ? (
          <ClipLoader color="#ffffff" size={24} /> // Spinner with react-spinners
        ) : (
          <>
            <lord-icon
              src="https://cdn.lordicon.com/zfzufhzk.json"
              trigger="hover"
              delay="1500"
              state="hover-line"
              style={{ width: "30px", height: "30px" }}
            ></lord-icon>
            POST
          </>
        )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
