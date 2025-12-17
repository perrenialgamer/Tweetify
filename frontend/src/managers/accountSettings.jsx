import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import img from "../assets/user.png";
import img2 from "../assets/user2.png";
import { BASE_URL } from "./helper";


const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const refIm = useRef(0);
  // console.log(user)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");


  const handleImageChange = async (e) => {

     e.preventDefault();
     console.log(refIm.current.src);
     if (refIm.current.src.includes("user.png")) {
       refIm.current.src.replace("user.png", "user2.png")
     } else {
          refIm.current.src.replace("use2.png", "user.png")
     }


  }

  const handlePasswordChange = async (e) => {
    console.log(oldPassword, newPassword);
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("token"));
    // console.log(token);

    if (token === null) {
      toast.error("Please login first");
      return;
    }

    if (oldPassword === "") {
      toast.error("Old Password cannot be empty");
      return;
    }

    if (newPassword === "") {
      toast.error("New Password cannot be empty");
      return;
    }

    await axios
      .post(
        `http://${BASE_URL}/api/v1/users/changePassword`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          user: user._id,
        }, // Send empty body (optional)
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Success:", response.data);
        toast.success("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
      })
      .catch((error) => {
        toast.error("Old Password Incorrect");
      });
  };

  return (
    <div>
      <Toaster />
      <nav className="bg-slate-900 ">
        <ul className="flex justify-around">
          <div className="w-1/3 text-center py-4 text-white">
            <NavLink to="/me">
              <li>Go Back</li>
            </NavLink>
          </div>
          <div className="w-full text-center py-4 text-white">
            <NavLink to="/homepage">
              <li>Home</li>
            </NavLink>
          </div>
        </ul>
      </nav>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Account Settings
        </h1>
        <div className="flex items-center justify-around flex-wrap">
          <div className="flex-col">
          <img ref={refIm} src={img} className="h-96" alt="" />
          {/* <button onClick={handleImageChange}>change</button> */}
          </div>
        
        <div>
          <form className="flex flex-col items-center justify-center">
            <label className="text-lg text-slate-900 mt-6">Your Full Name:</label>
            <p className="text-xl font-bold">{user.fullName}</p>
            <label className="text-lg text-slate-900 mt-6">Your Email ID:</label>
            <p className="text-xl font-bold">{user.email}</p>
            <label className="text-lg text-slate-900 mt-6">Old Password</label>
            <input
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border border-slate-900 rounded-lg"
              type="password"
            />
            <label className="text-lg text-slate-900 mt-6">New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-slate-900 rounded-lg"
              type="password"
            />
            <button
              onClick={handlePasswordChange}
              className="w-full p-2 bg-slate-900 text-white rounded-lg mt-8"
            >
              Save Changes
            </button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
