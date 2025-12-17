import React from 'react'
import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from './helper';

const resetPassword = () => {
     const navigate = useNavigate();

     const [password, setPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");



     const handlePasswordChange = async (e) => {

           e.preventDefault();
           // console.log("HI")
           // console.log(email

               if (password === "") {
                    toast.error("Password cannot be empty");
                    return;
               }
     
               if (confirmPassword === "") {
                    toast.error("Confirm Password cannot be empty");
                    return;
               }
     
               if (password !== confirmPassword) {
                         toast.error("Passwords do not match. Try again!");
                         return;
               }
     
                else{
     
                const data = {
                email: localStorage.getItem("email"),
                newPassword: password
                }
     
                axios.post(`${BASE_URL}/api/v1/users/forgotPassword`, data)
                .then((res) => {
                console.log(res.data);
                toast.success("Password changed successfully. Redirecting to login page");
                localStorage.removeItem("email");
                setTimeout(() => {
                    
                     navigate("/login");
                }, 3000); 
                })
                .catch((err) => {
                console.log(err);
                toast.error("Some error occured at our side. Please try again later.");
                })
     
                }
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
             htmlFor="password"
             className="block text-sm font-medium leading-6 text-gray-900"
           >
             Enter new Password
           </label>
           <div className="mt-2">
             <input
               id="email"
               name="email"
               type="password"
               value={password}
               onChange={(e)=>setPassword(e.target.value)}
               required
               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             />
           </div>
         </div>


         <div>
           <div className="flex items-center justify-between">
             <label
               htmlFor="password"
               className="block text-sm font-medium leading-6 text-gray-900"
             >
               Confirm new Password
             </label>
           </div>
           <div className="mt-2">
             <input
               id="password"
               name="password"
               type="password"
               value={confirmPassword}
               onChange={(e)=>setConfirmPassword(e.target.value)}
               required
               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             />
           </div>
         </div>

         <div>
           <button
             type="submit"
             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             onClick={handlePasswordChange}
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
  )
}

export default resetPassword
