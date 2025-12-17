import React from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Popup from "reactjs-popup";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRef } from "react";
import profile from "../assets/profile.png";
import { BASE_URL } from "./helper";

function TweetCardForMe({ tweet }) {
  const date = new Date(tweet.createdAt);
  const tweetRef = useRef(0);
  const readMoreRef = useRef(0);

  const navigate = useNavigate();
  const [likedUsers, setlikedUsers] = useState([])





  const handleReadMore = () => {
    if (tweetRef.current.style.height === "auto") {
      tweetRef.current.style.height = "80px";
      tweetRef.current.style.overflow = "hidden";
      readMoreRef.current.innerHTML = "Read More...";
    } else {
      tweetRef.current.style.height = "auto";
      tweetRef.current.style.overflow = "auto";
      readMoreRef.current.innerHTML = "Read Less...";
    }
  };




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
        console.log("Success:", response.data.data.fullName)
        setlikedUsers((likedUsers) => [...likedUsers, [response.data.data.fullName,response.data.data._id]]);

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }



  useEffect(() => {

    tweet.likes.users.map((user, index) => {
      
      getUser(user);
    })


  }, []);

  const deleteTweet = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    // console.log(token);
    if (!token) {
      alert("User token expired, please login again");
      window.location.href = "/login";
      return;
    }

    await axios
      .delete(`${BASE_URL}/api/v1/users/deleteTweet`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { tweetId: tweet._id },
      })
      .then((response) => {
        console.log("Success:", response.data);
        toast.success("Tweet deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className={`bg-white-600 shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2`}
      ><div className="text-gray-900 font-bold text-xl text-start pr-10 flex gap-1 items-center">
      <img src={profile} className="h-10" alt="" />
      <p className="pb-1">{tweet.user.fullName}</p>
    </div>
    <div className="flex justify-between flex-col-reverse md:flex-row">
          <div>
            <div
              ref={tweetRef}
              className="text-gray-900 h-20 overflow-hidden text-xl mb-2 pl-1"
            >
              {tweet.tweet}
            </div>
            {/* {console.log(tweet.tweet.length)} */}
            <p
              ref={readMoreRef}
              className={`${
                tweet.tweet.length > 500
                  ? "opacity-100 text-blue-700 cursor-pointer pl-1"
                  : "opacity-0 cursor-default"
              }`}
              onClick={handleReadMore}
            >
              Read More...
            </p>
          </div>
          {tweet.image? <img className="w-48 mb-6" src={tweet.image} alt="" />: ""}
        </div>
      <br />

        <Popup
          trigger={
            <button className="text-gray-700 text-base text-start">
              <u>Likes</u>: {tweet.likes.users.length}
            </button>
          }
          modal
          nested
        >
          {(close,index) => (
            <div key={index} className="modal border border-slate-800 w-96 min-h-48 overflow-scroll max-h-80 bg-white">
              <div className="flex bg-slate-800 text-white py-1 items-center">
                <button className="close text-2xl ml-3" onClick={close}>
                  &times;
                </button>
                <div className="header ml-28"> Liked Users </div>
              </div>
              {tweet.likes.users.length > 0 &&
                likedUsers.map((user, index) => {
                  console.log(tweet.likes.users);

                  // console.log(user);
                  // console.log(getUser(user));
                  return (
                    <NavLink to={`/accountProfile/${user[1]}`}>
                      <div className="content p-1 flex gap-1 items-center"><img src={profile} className="h-8 pt-1" alt="" /> {user[0]} </div>
                    </NavLink>
                  );
                })}
              {tweet.likes.users.length === 0 && (
                <div className="content p-1 text-center pt-14">
                  {" "}
                  No Likes Yet!{" "}
                </div>
              )}
            </div>
          )}
        </Popup>
        <div className="cursor-pointer" onClick={()=>navigate(`/comment/${tweet._id}`, {state : tweet})}>Comments: {tweet.comments.length}</div>

        <div className="text-gray-700 text-base">
          Posted At {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}
        </div>
        <div className="text-gray-700 text-base">
          Dated: {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
        </div>

        <Popup
          trigger={
            <button className="pt-1 bg-red-300 hover:bg-red-500 w-9 text-center mt-8 rounded-md">
              <lord-icon
    src="https://cdn.lordicon.com/skkahier.json"
    trigger="hover"
    style={{width:"30px", height:"30px"}}>
</lord-icon>
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal border border-slate-800 w-96 h-48 bg-white">
              <div className="flex bg-slate-800 text-white py-1 items-center">
                <button className="close text-2xl ml-3" onClick={close}>
                  &times;
                </button>
                <div className="header ml-28"> Delete Tweet </div>
              </div>
              <div className="content mt-5 p-2">
                {" "}
                Are you sure you want to delete this tweet?{" "}
              </div>
              <div className="actions flex gap-3 mt-10 ml-3">
                <button
                  className="bg-red-500 px-2 py-1 rounded-lg hover:bg-red-700 hover:text-white"
                  onClick={deleteTweet}
                >
                  Delete
                </button>
                <button
                  className="button bg-slate-400 px-2 py-1 rounded-lg hover:bg-slate-600 hover:text-white"
                  onClick={() => {
                    console.log("modal closed ");
                    close();
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </div>
  );
}

export default TweetCardForMe;
