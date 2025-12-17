import React from "react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TweetCardForMe from "./TweetCardForMe";
import { useRef } from "react";
import Fade from "react-awesome-reveal";
import Zoom from "react-awesome-reveal";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./helper";


const Me = () => {
  const ref = useRef(0);
  const navigate = useNavigate();

  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("user") === null
  ) {
    window.location.href = "/login";
  }
  const user = JSON.parse(localStorage.getItem("user"));

  const slideUp = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const [tweets, setTweets] = useState([]);

  const getTweets = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    // console.log(token);

    await axios
      .post(
        `${BASE_URL}/api/v1/users/showTweets`,
        {}, // Send empty body (optional)
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Success:", response.data.data);
        //     console.log(user._id);

        for (let i = 0; i < response.data.data.length; i++) {
          if (response.data.data[i].user._id === user._id) {
            console.log(response.data.data[i].user._id, user._id);
            if (tweets.reverse().includes(response.data.data[i]) === false)
              setTweets((tweets) => [...tweets, response.data.data[i]]);
          }
        }
        console.log(tweets);

        // alert("Tweets fetched successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getTweets();
  }, []);













  return (
    <div>
      

      <div className="relative min-h-screen w-full bg-white">
        <Navbar />
        
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <p className="text-center pr-96 pt-36 text-6xl font-extrabold ">
          Welcome
        </p>
        <Zoom triggerOnce={true} duration={1500}>
          <p className="text-center text-8xl font-extrabold ">
            {user.fullName} !
          </p>
        </Zoom>
        <div className="flex justify-around pt-8 flex-wrap">
          <span>
            <dotlottie-player
              src="https://lottie.host/f34ac4e7-126b-4fd6-a695-499d2915a8f1/PuyTiVUtS7.json"
              background="transparent"
              speed="0.5"
              style={{ width: "275px", height: "275px" }}
              loop
              autoplay
            ></dotlottie-player>
            <Fade triggerOnce={true} delay={1500} bottom duration={1500}>
              <p className="text-center text-3xl">Spark ideas,</p>
            </Fade>
          </span>
          {/* </Fade> */}
          <span className="pt-16">
            <dotlottie-player
              src="https://lottie.host/66815490-488b-473c-aabc-5d2090cec74d/RAF0m2lcbq.json"
              background="transparent"
              speed="0.75"
              style={{ width: "150px", height: "150px" }}
              loop
              autoplay
            ></dotlottie-player>
            <Fade triggerOnce={true} delay={3000} bottom duration={1500}>
              <p className="text-center text-3xl pt-14">Raise Issues, </p>
            </Fade>
          </span>

          <span>
            <dotlottie-player
              src="https://lottie.host/925c768e-93f0-4b29-a025-4a2fca344f10/QpI0bC7CWd.json"
              background="transparent"
              speed="0.75"
              style={{ width: "275px", height: "275px" }}
              loop
              autoplay
            ></dotlottie-player>
            <Fade triggerOnce={true} delay={4500} bottom duration={1500}>
              <p className="text-center text-3xl"> Share thoughts!</p>
            </Fade>
          </span>
        </div>
        <div className="flex justify-center">
          <button className="md:absolute bottom-16 " onClick={slideUp}>
            <lord-icon
              style={{ width: "130px", height: "130px" }}
              src="https://cdn.lordicon.com/xcrjfuzb.json"
              trigger="hover"
            ></lord-icon>
          </button>
        </div>
      </div>
      <div className="h-24 bg-gradient-to-b from-white to-slate-300"></div>
    
      <div className="bg-slate-300" ref={ref}>
        <h1 className="text-5xl text-center font-extrabold pb-20 pt-24">
          Your Posts
        </h1>

        <div>
          {tweets.reverse().map((tweet, index) => {
            return <TweetCardForMe key={index} tweet={tweet} />;
          })}
        </div>

        {/* <div className="h-24 bg-gradient-to-b from-slate-300 to-slate-600"></div> */}

        <div className="bg-slate-800 h-24 flex justify-center items-center">
          <div className="w-full text-center text-white">
            <NavLink to="/aboutApp">
              <button className="">About App</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Me;
