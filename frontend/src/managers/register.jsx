import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "./helper";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeringState, setRegisteringState] = useState(false);
  const navigate = useNavigate();
  const passRef = useRef(null);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleRegisterEmailChange = (e) => {
    setRegisterEmail(e.target.value);
  };

  const handleRegisterPasswordChange = (e) => {
    setRegisterPassword(e.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      toast.success("Already Logged In. Redirecting to Homepage...");
      setTimeout(() => {
        window.location.href = "/homepage";
      }, 1500);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisteringState(true);

    try {
      await axios.post(`${BASE_URL}/api/v1/users/register`, {
        fullName,
        email: registerEmail,
        password: registerPassword,
      });

      toast.success("Registration Successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Email already in use!");
    } finally {
      setRegisteringState(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-200 to-blue-200 flex flex-col items-center justify-center">
      <Toaster />
      {/* Navbar */}
      <div className="flex justify-between w-full p-4 bg-gradient-to-r from-cyan-500 to-cyan-800 backdrop-blur-lg fixed top-0 z-50">
        <NavLink to="/" className="text-2xl font-bold text-white">
          Tweetify
        </NavLink>
      </div>

      {/* Register Form */}
      <div className="mt-20 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create Your Account
        </h2>

        <form className="space-y-6 mt-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={registerEmail}
              onChange={handleRegisterEmailChange}
              required
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                ref={passRef}
                type={showPassword ? "text" : "password"}
                value={registerPassword}
                onChange={handleRegisterPasswordChange}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-cyan-500"
              />
              <div
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-[90%] mx-auto py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 flex items-center justify-center"
            disabled={registeringState}
          >
            {registeringState ? (
              <ClipLoader color="#ffffff" loading={registeringState} size={20} />
            ) : (
              "Register Now!"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already a user?{" "}
          <NavLink to="/login" className="font-semibold text-cyan-600 hover:text-cyan-500">
            Login Now!
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
