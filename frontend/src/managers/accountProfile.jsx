import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import img from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import TweetCard from "./TweetCard";
import { BASE_URL } from "./helper";

const accountProfile = () => {
     const navigate = useNavigate();
  const { slug } = useParams();
  
  useEffect(() => {
     //   window.location.reload();
    window.scrollTo(0, 0);
  }, [])
  

  const [data, setData] = useState([]);

  useEffect(() => {
    const getUser = async (userID) => {
      const token = JSON.parse(localStorage.getItem("token"));
      // console.log(token);


      await axios
        .post(
          `${BASE_URL}/api/v1/users/getUserDetails`,
          {
            userID: userID,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log("Success:", response.data.data);
          console.log(response.data);
          setData(response.data.data);
          //     setlikedUsers((likedUsers) => [...likedUsers, [response.data.data.fullName,response.data.data._id]]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    getUser(slug);
  }, []);




  const [tweets, setTweets] = useState([]);

  const getTweets = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    // // console.log(token);
    // if (token === null) {
    //   alert("Please login first");
    //   navigate("/login")
    // }

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
          if (response.data.data[i].user._id === slug) {
               // console.log("hi")
          //   console.log(response.data.data[i].user._id, data._id);
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
      <nav className="bg-slate-900 ">
        <ul className="flex justify-around">
          <div className="w-1/3 text-center py-4 text-white">
            <NavLink to="/Homepage">
              <li>Go Back</li>
            </NavLink>
          </div>
          <div className="w-full text-center py-4 text-white">
            <NavLink to={`/accountProfile/${slug}`}>
              <li>{data.fullName}'s Profile</li>
            </NavLink>
          </div>
        </ul>
      </nav>
      <div></div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Account Settings
        </h1>
        <div className="flex items-center justify-around flex-wrap">
          <div className="flex-col">
            <img src={img} className="h-96" alt="" />
            {/* <button onClick={handleImageChange}>change</button> */}
          </div>

          <div>
            <form className="flex flex-col items-center justify-center">
              <label className="text-lg text-slate-900 mt-6">
                User's Full Name:
              </label>
              <p className="text-xl font-bold">{data.fullName}</p>
              <label className="text-lg text-slate-900 mt-6">
                User's Email ID:
              </label>
              <p className="text-xl font-bold">{data.email}</p>
            </form>
          </div>
        </div>
      </div>
      <div className="h-20 bg-gradient-to-b from-white to-slate-300"></div>


      <div className="bg-slate-300">
        <h1 className="text-5xl text-center font-extrabold pb-20 pt-8">
          User's Posts
        </h1>

        <div>
          {tweets.length>0 && tweets.map((tweet, index) => {
               console.log(tweet)
            return <TweetCard key={index} tweet={tweet} />;
          })}
        </div>

        {tweets.length === 0 && <div className="text-center text-2xl pt-1 pb-10">No Posts Yet!</div>}
        </div>
    </div>
  );
};

export default accountProfile;
