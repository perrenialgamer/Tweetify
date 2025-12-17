import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaComment } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { Toaster, toast } from "react-hot-toast";
import profile from "../assets/profile.png";
import logo2 from "../assets/logo2.png";

import sound1 from "../assets/like.wav";
import { BASE_URL } from "./helper.js";

function TweetCard({ tweet }) {
  const reportRef = useRef(0);
  const reportButtonRef = useRef(0);
  const imgHover = useRef(0);
  const [others, setOthers] = useState(false);
  // console.log(tweet.user.fullName);
  const [isLiked, setIsLiked] = useState(false);
  const tweetRef = useRef(0);
  const readMoreRef = useRef(0);
  const refLike = useRef(0);
  const buttonRef = useRef(0);
  const navigate = useNavigate();
  const [likedUsers, setlikedUsers] = useState([]);
  const followRef = useRef(0);

  // console.log(tweet)

  // const [start, setstart] = useState(1)
  const sound = new Audio(sound1);

  const date = new Date(tweet.createdAt);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState("");

  const openImagePopup = (imageSrc) => {
    setPopupImage(imageSrc);
    setIsPopupOpen(true);
  };

  const closeImagePopup = () => {
    setIsPopupOpen(false);
    setPopupImage("");
  };


  // useEffect(() => {
  //   window.location.reload();
  // });

  useEffect(() => {
    // Disable scrolling on the background when popup is open
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      // Cleanup in case the component is unmounted
      document.body.style.overflow = "auto";
    };
  }, [isPopupOpen]);

  const handleCommentRedirect = () => {
    // const location = useLocation();
    navigate(`/comment/${tweet._id}`, { state: tweet });
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    const user = JSON.parse(localStorage.getItem("user"));

 
    if (!token) {
      toast.error("User token expired, please login again");
      return; // No need to fetch like status if not logged in
    }

    axios
      .post(
        `${BASE_URL}/api/v1/users/showLikeTweet`,
        {
          tweetId: tweet._id,
          user: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("Success:", response.data.data.isLiked);
        setIsLiked(response.data.data.isLiked);

        if (response.data.data.isLiked) {
          buttonRef.current.style.backgroundColor = "red";
        } else {
          buttonRef.current.style.backgroundColor = "black";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .post(
        `${BASE_URL}/api/v1/users/getFollowings`,
        {
          userID: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("Success:", response.data.data);
        if (response.data.data.followings.includes(tweet.user._id)) {
          followRef.current.innerHTML = "Following";
          followRef.current.style.backgroundColor = "blue";
          followRef.current.style.color = "white";
        } else {
          followRef.current.innerHTML = "Follow";
          followRef.current.style.backgroundColor = "white";
          followRef.current.style.color = "blue";
          followRef.current.style.border = "1px solid blue";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // console.log(tweet);

  const handleReport = () => {
    const sendEmail = async () => {
      const timeNow = new Date().toLocaleString();
      const user = JSON.parse(localStorage.getItem("user"));

      let dataSend = {
        email: user.email,
        subject: "Report of a tweet on Tweetify",
        message: `Hi ${user.fullName},\n\nThank you for reporting the tweet at ${timeNow}. We will review your report and will let you know whether it violates our [Platform Guidelines] \n\nHere's what you need to do next:\n\n • If you've been impacted by the content of the tweet, please let us know if there's further assistance we can offer (e.g., reporting the user for harassment). \n\n • If you have any further details about the reported tweet or the user, please reply to this email with those specifics.\n\nWe appreciate your vigilance in helping us keep our platform safe.\nSincerely,\n\nThe Tweetify Team.\n\nHappy tweeting!`,
      };

      const res = await axios
        .post(`${BASE_URL}/api/v1/users/sendEmail`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(dataSend),
        })
        .then((res) => {
          console.log("Email sent successfully");
        })
        .catch((error) => {
          console.error("Error:", error);
          return;
        });
    };
    toast.success("Tweet reported successfully");
    sendEmail();

    // close();
  };

  const handleFollow = async () => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      toast.error("User token expired, please login again");
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    axios
      .post(
        `${BASE_URL}/api/v1/users/followUser`,
        {
          userID: tweet.user._id,
          followerID: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Success:", response.data.data.isFollowed);
        if (response.data.data.isFollowed) {
          // toast.success("User followed successfully");
          followRef.current.innerHTML = "Following";
          followRef.current.style.backgroundColor = "blue";
          followRef.current.style.color = "white";
        } else {
          // toast.error("User unfollowed successfully");
          followRef.current.innerHTML = "Follow";
          followRef.current.style.backgroundColor = "white";
          followRef.current.style.color = "blue";
          followRef.current.style.border = "1px solid blue";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("User could not be followed");
      });
  };

  const handleLike = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    // console.log(token);
    if (!token) {
      toast.error("User token expired, please login again");
      window.location.href = "/login";
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    await axios
      .post(
        `${BASE_URL}/api/v1/users/likeTweet`,
        {
          tweetId: tweet._id,
          user: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("Success:", response.data.data.isLiked);
        setIsLiked(response.data.data.isLiked);

        if (response.data.data.isLiked) {
          buttonRef.current.style.backgroundColor = "red";
          sound.play();
        } else {
          buttonRef.current.style.backgroundColor = "black";
        }

        // alert("Tweet liked successfully");
        const loc = useLocation();

        navigate(loc);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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

    if (!token) {
      toast.error("User token expired, please login again");
      window.location.href = "/login";
      return;
    }
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
        // console.log("Success:", response.data.data.fullName)
        setlikedUsers((likedUsers) => [
          ...likedUsers,
          [response.data.data.fullName, response.data.data._id],
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    tweet.likes.users.map((user, index) => {
      getUser(user);
    });

    const handleHover = () => {
      refLike.current.style.opacity = 1;
      refLike.current.style.zIndex = 40;
    };
    const handleLeave = () => {
      refLike.current.style.opacity = 0;
      refLike.current.style.zIndex = 0;
    };
    const handleHoverReport = () => {
      reportRef.current.style.opacity = 1;
    };
    const handleLeaveReport = () => {
      reportRef.current.style.opacity = 0;
    };
    buttonRef.current.addEventListener("mouseover", handleHover);
    reportButtonRef.current.addEventListener("mouseover", handleHoverReport);
    buttonRef.current.addEventListener("mouseout", handleLeave);
    reportButtonRef.current.addEventListener("mouseout", handleLeaveReport);

    // Cleanup function to remove event listeners on unmount
    return () => {
      try {
        buttonRef.current.removeEventListener("mouseover", handleHover);
        buttonRef.current.removeEventListener("mouseout", handleLeave);
      } catch (error) {}
    };
  }, []);

  return (
    <div className="">
      <Toaster />

      <div
        className={`bg-white-600 shadow-md rounded px-8 pt-6 pb-8 relative h-full mb-4 flex flex-col my-2`}
      >
        <img
          src={logo2}
          alt=""
          className="h-60 opacity-10 absolute top-1/2 -translate-y-1/2 -scale-x-100 left-1/2"
          ref={imgHover}
        />
        <div className="text-gray-900 text-start pr-10 flex gap-1 items-center">
          <img src={profile} className="h-10" alt="" />
          <p
            className="pb-1 cursor-pointer font-bold text-xl"
            onClick={() => navigate(`/accountProfile/${tweet.user._id}`)}
          >
            {tweet.user.fullName}
          </p>

          <button
            className={`text-blue-700 border border-blue-700 rounded-md px-1 mb-1 ml-2 hover:bg-blue-700 hover:text-white ${
              JSON.parse(localStorage.getItem("user"))._id === tweet.user._id
                ? "hidden"
                : ""
            }`}
            ref={followRef}
            onClick={handleFollow}
          >
            Follow
          </button>
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
          {tweet.image? <img className="w-48 mb-6 cursor-pointer"  src={tweet.image} alt="" onClick={() => openImagePopup(tweet.image)} />: ""}

           {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <img
            className="max-w-full max-h-full"
            src={popupImage}
            alt="Popup"
          />
          <button
            className="absolute top-8 right-8 text-white scale-150 text-xl"
            onClick={closeImagePopup}
          >
            &times;
          </button>
        </div>
      )}
        </div>
        <br />
        <div className="relative w-32 mt-5 flex items-center gap-3">
          {isLiked ? (
            <div className="flex">
              <button
                ref={buttonRef}
                className=" text-white w-fit p-2 rounded-lg my-2"
                onClick={handleLike}
              >
                <BiSolidLike className="w-6 h-6" />
              </button>
              <div
                className="opacity-0 absolute w-20 p-1 rounded-lg right-0 text-white text-center top-0 bg-red-500"
                ref={refLike}
              >
                I Like this!
              </div>
            </div>
          ) : (
            <div className="flex">
              <button
                ref={buttonRef}
                className=" text-white w-fit p-2 rounded-lg my-2"
                onClick={handleLike}
              >
                <BiLike className="w-6 h-6" />
              </button>
              <div
                className="opacity-0 absolute w-20 p-1 rounded-lg right-0 top-0 text-white text-center bg-slate-600"
                ref={refLike}
              >
                I Don't Like this!
              </div>
            </div>
          )}

          <button
            onClick={handleCommentRedirect}
            className="text-white z-30 bg-slate-900 p-2 rounded-lg"
          >
            <FaComment className="h-6 w-6" />
          </button>
        </div>
        <div className="w-32">
          <Popup
            trigger={
              <button className="text-gray-700 text-base text-start">
                <u>Likes</u>: {tweet.likes.users.length}
              </button>
            }
            modal
            nested
          >
            {(close, index) => (
              <div
                key={index}
                className="modal border border-slate-800 w-96 min-h-48 overflow-scroll max-h-80 bg-white"
              >
                <div className="flex bg-slate-800 text-white py-1 items-center">
                  <button className="close text-2xl ml-3" onClick={close}>
                    &times;
                  </button>
                  <div className="header ml-28"> Liked Users </div>
                </div>
                {tweet.likes.users.length > 0 &&
                  likedUsers.map((user, index) => {
                    // console.log(tweet.likes.users)

                    // console.log(user);
                    // console.log(getUser(user));
                    // console.log(user)
                    return (
                      <button
                        className="w-full text-start"
                        key={index}
                        onClick={() =>
                          (window.location.href = `/accountProfile/${user[1]}`)
                        }
                      >
                        <div className="content p-1 flex gap-1 items-center">
                          <img src={profile} className="h-8 pt-1" alt="" />{" "}
                          {user[0]}{" "}
                        </div>
                      </button>
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
        </div>
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/comment/${tweet._id}`, { state: tweet })}
        >
          Comments: {tweet.comments.length}
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-gray-700 text-base">
              Posted At {date.getHours()}:{date.getMinutes()}:
              {date.getSeconds()}
            </div>
            <div className="text-gray-700 text-base">
              Dated: {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
            </div>
          </div>
          <div className="relative">
            <div
              className="bg-orange-400 flex items-center p-1 px-2 rounded-lg w-fit cursor-pointer"
              ref={reportButtonRef}
            >
              <Popup
                trigger={
                  <button>
                    <lord-icon
                      src="https://cdn.lordicon.com/abvsilxn.json"
                      trigger="hover"
                      style={{
                        width: "25px",
                        height: "25px",
                        paddingTop: "3px",
                      }}
                    ></lord-icon>
                  </button>
                }
                modal
                nested
              >
                {(close) => (
                  <div className="modal rounded-xl shadow-xl border border-slate-800 w-full pb-8  bg-slate-600 text-white">
                    <div className="flex rounded-t-xl bg-slate-800 text-white py-1 items-center">
                      <button className="close text-2xl ml-3" onClick={close}>
                        &times;
                      </button>
                      <div className="header ml-28"> Report this Tweet? </div>
                    </div>

                    <h1 className="text-red-600 font-bold text-center mt-4 text-2xl flex items-center justify-center gap-2">
                      <img className="h-12" src={profile} alt="" />
                      {tweet.user.fullName}
                    </h1>
                    <div className="content mt-5 p-2 px-6">
                      {" "}
                      What best describes your concern regarding this tweet?{" "}
                    </div>
                    <div className="ml-3 px-6">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="" id="" /> Sexual
                        Harassment{" "}
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="" id="" /> Violence{" "}
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="" id="" /> Hate Speech{" "}
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="" id="" /> Spam{" "}
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" name="" id="" /> False
                        Information{" "}
                      </div>

                      <div
                        onClick={() => setOthers(!others)}
                        className="flex items-center gap-2"
                      >
                        <input type="checkbox" name="" id="" /> Others{" "}
                      </div>
                      <input
                        type="text"
                        placeholder="Please specify"
                        className={`h-6 transition-all text-black ml-6 ${
                          others ? "" : "hidden"
                        }`}
                      />
                    </div>

                    <div className="actions flex gap-3 mt-6 ml-3 px-6">
                      <button
                        className="bg-red-500 px-2 py-1 rounded-lg hover:bg-red-700 hover:text-white"
                        onClick={handleReport}
                      >
                        Report
                      </button>
                      <button
                        className="button bg-slate-400 px-2 py-1 rounded-lg hover:bg-slate-700 hover:text-white"
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

            <div
              ref={reportRef}
              className="w-24 right-12 top-0 mt-2 opacity-0 bg-slate-300 p-1 rounded-lg absolute"
            >
              Report this?
            </div>
          </div>
        </div>

        {/* <button className='text-left bg-slate-700 w-fit p-2 text-white mt-8 rounded-md' onClick={deleteTweet}>Delete</button> */}
      </div>
    </div>
  );
}

export default TweetCard;
