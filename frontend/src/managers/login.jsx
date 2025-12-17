import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "./helper";
import ClipLoader from "react-spinners/ClipLoader"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loader state for login button
  const [loggedInState, setLoggedInState] = useState(false);
  const passRef = useRef(null);
  const passEyeRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Email cannot be empty");
      return;
    }

    if (password === "") {
      toast.error("Please enter password");
      return;
    }

    setLoading(true); // Start loader
    setLoggedInState(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/users/login`, {
        email: email,
        password: password,
      });

      toast.success("Login Successful. Redirecting to Homepage...");
      localStorage.setItem("token", JSON.stringify(response.data.data.accessToken));
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      const sendEmail = async () => {
        const userAgent = navigator.userAgent;
        let deviceName = userAgent.match(/(?:iPhone|iPad|iPod|Android|Windows Phone|BlackBerry|Macintosh)/)?.[0] || "Desktop";
        const timeNow = new Date().toLocaleString();

        let dataSend = {
          email: email,
          subject: "Your Tweetify Account Login",
          message: `Hi ${response.data.data.user.fullName},\n\nThis email confirms that your Tweetify account was logged in by ${deviceName} at ${timeNow}.`,
        };

        await axios.post(`${BASE_URL}/api/v1/users/sendEmail`, dataSend);
        console.log("Email sent successfully");
      };

      sendEmail();
      setTimeout(() => {
        setLoading(false); // Stop loader
        window.location.href = "/homepage";
      }, 2000);
    } catch (error) {
      setLoading(false); // Stop loader in case of error
      toast.error("Invalid Credentials", { id: "invalid" });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      toast.success("Already Logged In. Redirecting to Homepage...");
      setTimeout(() => {
        window.location.href = "/homepage";
      }, 1500);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-200 to-blue-200 flex flex-col items-center justify-center">
      <Toaster />
      {loggedInState && <ClipLoader color="#2563EB" loading={loading} size={35} />}

      {/* Navbar */}
      <div className="flex justify-between w-full p-4 bg-gradient-to-r from-cyan-500 to-cyan-800 backdrop-blur-lg fixed top-0 z-50">
        <NavLink to="/" className="text-2xl font-bold text-white">Tweetify</NavLink>
      </div>

      {/* Login Form */}
      <div className="mt-20 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Log Into Your Account</h2>
        
        <form className="space-y-6 mt-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <NavLink to="/forgotPassword" className="text-sm text-red-600 font-bold hover:text-cyan-500">Forgot password?</NavLink>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                ref={passRef}
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500"
              />
              <div ref={passEyeRef} className="absolute right-3 top-2 cursor-pointer" onClick={() => {
                setShowPassword(!showPassword);
                passRef.current.type = showPassword ? "text" : "password";
              }}>
                {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-[90%] mx-auto py-2 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-600"
            } text-white font-semibold rounded-lg block`}
          >
            {loading ? (
              <ClipLoader 
                color="#ffffff"
                loading={loading}
                size={20}
              />
                // Assuming a small loader is available
            ) : (
              "Login Now!"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Not a user?{" "}
          <NavLink to="/register" className="font-semibold text-cyan-600 hover:text-cyan-500">
            Create your Account Now!
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
