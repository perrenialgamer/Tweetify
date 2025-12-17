import React from "react";
import img from "../assets/logo2.png";
import { Slide, Bounce } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { FcAndroidOs } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdLaptop } from "react-icons/md";
import { RiMacbookLine } from "react-icons/ri";
import "./buttonCss.css";
import devices from "../assets/devices.gif";
import look from "../assets/look.gif";
import { FaHashtag } from "react-icons/fa6";
import {Fade} from "react-awesome-reveal";

function landingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-b from-blue-100 to-cyan-100 min-h-screen">
      {/* Header with Buttons */}
      <div className="flex gap-10 pt-8 pl-8 fixed z-50 w-screen backdrop-blur-lg top-0">
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-fit px-5 py-2 rounded-lg text-white shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
        >
          Login Now
        </button>
        <button
          onClick={() => navigate("/register")}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-fit px-5 py-2 rounded-lg text-white shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out"
        >
          Join us Now
        </button>
      </div>
      <Fade delay={500}>
      <FaHashtag className="text-8xl md:text-9xl text-blue-700 absolute top-32 right-0 mr-10 mt-10" />
      </Fade>
<Fade delay={1000}>
      <FaHashtag className="text-8xl text-red-600 absolute top-[700px] left-12 mr-10 mt-10" />
      </Fade>

      {/* Hero Section */}
      <div className="h-screen flex items-center justify-center flex-col">
        <div className="flex items-center flex-wrap">
          <Slide delay={500}>
            <img
              src={img}
              className="h-56 drop-shadow-lg"
              alt="Tweetify Logo"
            />
          </Slide>
          <div>
            <h1 className="text-center text-6xl md:text-8xl font-serif font-extrabold text-blue-700">
              Tweetify
            </h1>
            <Bounce triggerOnce={true} delay={1500}>
              <h2 className="text-center mt-4 text-2xl md:text-3xl text-cyan-600">
                Tweet your heart out, connect with the world
              </h2>
            </Bounce>
          </div>
        </div>
      </div>

      {/* Features Section */}

      <div className=" pb-16">
      <div className="mx-auto w-fit">
        <img src={devices} alt="" />
      </div>
          <div className="w-fit mx-auto">
          <p className="font-bold text-5xl md:text-6xl text-blue-800">
            Tweet your{" "}
            <span className="text-cyan-500 text-7xl md:text-8xl">truth</span>,
          </p>
          <p className="font-bold text-4xl text-blue-700">
            {" "}
            no matter the tech.
          </p>
          </div>
        </div>
    <div className="bg-blue-800 h-[1px] my-20 w-3/4 md:w-1/2 mx-auto opacity-45"></div>


    <div className="flex items-center flex-wrap justify-center gap-32 mt-16 pb-16">
    <img src={look} alt="" />
      <div>
    <p className="font-bold text-5xl md:text-6xl text-blue-800">
            Have News to share? 

          </p>
          <p className="font-bold text-5xl md:text-6xl text-blue-800">
           We are Here to Listen

          </p>
          <p className="text-4xl text-end mt-4 font-bold">24/7</p>
          </div>

     
    </div>

    <div className="mt-32 bg-slate-800 text-white py-16 text-xl">
<p className="text-center mb-8 text-2xl">
    No compatibility issues here—unlike your ex.
    </p>
  <p className="text-center pb-7">Available On:</p>
  <div className="flex gap-24 flex-wrap justify-center">
    <p className="flex items-center">
      <FcAndroidOs className="h-8 w-8" />
      Android
    </p>
    <p className="flex items-center">
      <FaApple className="h-8 w-8 pb-1" />
      iOS
    </p>
    <p className="flex items-center">
      <MdLaptop className="h-8 w-8 pb-1" />
      Windows
    </p>
    <p className="flex items-center">
      <RiMacbookLine className="h-8 w-8 pb-1" />
      Macbook
    </p>
  </div>
  <p className="text-center text-gray-400 mt-7">
    And everything else with a screen (probably even your toaster)...
  </p>
</div>

    </div>
  );
}

export default landingPage;
