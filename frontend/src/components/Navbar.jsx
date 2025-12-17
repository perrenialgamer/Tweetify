import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { MdOutlineSettings } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { useState } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from '../managers/helper.js';
import { toast, Toaster } from 'react-hot-toast';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { MdClose } from 'react-icons/md';




const Navbar = () => {
  const navigate = useNavigate();


  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const handleLogout = async () => {

    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token);

    if (token === null) {
      alert("Please login first");
      return;
    }
    toast("Logging Out!", {
      icon: "⏳",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    
  };
  

  return (
    <div className='absolute w-full top-0 z-50'>
      <Toaster />

<div
        className={`h-screen w-80 fixed z-50 bg-slate-700 ${
          sideMenuOpen ? "left-0" : "-left-80"
        }`}
        style={{
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div className="ml-3 mt-3 justify-between flex items-center">
          <MdKeyboardArrowLeft
            size={60}
            color="white"
            className="cursor-pointer"
            onClick={() => setSideMenuOpen(false)}
          />
          <p className='text-white text-xl pr-24 text-center'>Tweetify</p>
          
        </div>

        <ul className="flex flex-col ml-8 text-white text-lg gap-2 justify-around mt-6">
          <li onClick={()=>navigate(`/accountProfile/${JSON.parse(localStorage.getItem("user"))._id}`)} className="flex hover:bg-white rounded-xl cursor-pointer hover:text-slate-600 h-full w-full p-3 items-center gap-4">
            <FaUserCircle size={20} />
            Account
          </li>
          <li onClick={()=>navigate("/chat")} className="flex hover:bg-white rounded-xl cursor-pointer hover:text-slate-600 h-full w-full p-3 items-center gap-4">
            <TiMessages size={20} />
            Chat
          </li>
          <li onClick={()=>navigate("/accountSettings")} className="flex hover:bg-white rounded-xl cursor-pointer hover:text-slate-600 h-full w-full p-3 items-center gap-4">
            <MdOutlineSettings size={20} />
            System Settings
          </li>
          
          <li onClick={handleOpen} className="flex hover:bg-white rounded-xl cursor-pointer hover:text-slate-600 h-full w-full p-3 items-center gap-4">
            <MdLogout size={20} />
            Logout
          </li>
        </ul>
      </div>

      <Modal
            open={open}
            onClose={()=>{
              setOpen(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <p className="flex items-center justify-end">
                
                <IoIosCloseCircleOutline
                  className="cursor-pointer"
                  size={30}
                  onClick={()=>{
                    setOpen(false);

                  }
                  }
                />
              </p>

              <p className="text-slate-700 mt-4 text-xl font-semibold text-center">
                Are you sure you want to logout ?
              </p>

              <div className="w-full flex justify-between mt-6">
                <button
                  onClick={handleLogout
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg border"
                >
                  Logout
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="bg-white border text-black px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
             
            </Box>
          </Modal>




      <nav className="bg-slate-900">
        <span onClick={()=>setSideMenuOpen(true)} className='top-2 left-4 cursor-pointer absolute'><BiMenuAltLeft size={35} color='white' /></span>
          <ul className="flex justify-around">
            <div className="w-full text-center py-4 text-white">
              <NavLink to="/homepage">
                <li>Home</li>
              </NavLink>
            </div>
            <div className="w-full text-center py-4 text-white">
              <NavLink to="/post">
                <li>Post</li>
              </NavLink>
            </div>
            <div className="w-full text-center py-4 text-white">
              <NavLink to="/chat">
                <li>Chat</li>
              </NavLink>
            </div>
            <div className="w-full text-center py-4 text-white">
              <NavLink to="/me">
                <li>Me</li>
              </NavLink>
            </div>
          </ul>
        </nav> 
    </div>
  )
}

export default Navbar
