import React from "react";
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "./helper";

const ForgotPassword = () => {
  const resetButtonRef = useRef(0);
  const otpRef = useRef(0);
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

     const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    localStorage.setItem("email", e.target.value);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    // console.log("HI")
    // console.log(email

     if (otp === "") {
           toast.error("OTP cannot be empty");
           return;
     }

     if (otp !== code) {
               toast.error("Invalid OTP. Try again!");
               return;
     }

    else{

      navigate("/resetPassword")
      
    }

  };

  function generateRandomCode() {
     // Generate a random number between 100000 and 999999.
     const code = Math.floor(Math.random() * 900000) + 100000;
   
     // Return the code as a string.
     return code.toString();
   }


  const handleCodeSend = async (e) => {
     e.preventDefault();

     if(email === ""){
          toast.error("Email cannot be empty");
          return;
     }

     const sendEmail = async () => {
          
          
          const timeNow = new Date().toLocaleString();
          const codeGen = generateRandomCode();
          console.log(codeGen);
          setCode(codeGen);
          console.log(code);





          let dataSend = {
            email: email,
            subject: "Tweetify Password Reset Request",
            message: `Hi User, \n\nWe received a request to reset your password for your Tweetify accountat ${timeNow}.. To ensure it's you making this change, here's your verification code: \n\n${codeGen}:\n\nImportant: This code will expire in 5 minutes. Please do not share this code with anyone. \n\nIf you did not request this reset:.\nYou can safely ignore this email. However, for your account security, we recommend changing your password at your earliest convenience. You can do this by following these steps:\n\n1. Log in to your Tweetify account.\n2. Go to your account settings.\n3. Change your password to a new, strong one.\n\nIf you have any questions or need further assistance, please don't hesitate to contact Tweetify Support at tweetifyserver@gmail.com .\n\nStay Connected\n\nThe Tweetify Security Team.\n\nHappy tweeting!`,
          };

          const res = await axios
            .post(`http://${BASE_URL}/api/v1/users/sendEmail`, {
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify(dataSend),
            })
            .then((res) => {
              toast.success("Verification Code sent successfully");
              otpRef.current.style.opacity = "100";
               resetButtonRef.current.style.opacity = "100";
            })
            .catch((error) => {
              console.error("Error:", error);
              return;
            });
        };

        sendEmail();
  }


  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
      <Toaster />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleCodeSend}
            >
              Send Verification Code
            </button>
          </div>

          <div ref={otpRef} className="opacity-0">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Verification Code
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={otp}
                onChange={handleOtpChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div ref={resetButtonRef} className="opacity-0">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handlePasswordReset}
            >
              Reset Password
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a user?{" "}
          <NavLink
            to="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Create your Account Now!
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
