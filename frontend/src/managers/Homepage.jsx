import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./suggestions.css";
import profile from "../assets/profile.png";
import TweetCard from "./TweetCard";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import Navbar from "../components/Navbar";
import { Zoom } from "react-awesome-reveal";
import logo2 from "../assets/logo2.png";
import { toast, Toaster } from "react-hot-toast";
import { BASE_URL } from "./helper";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";

const Homepage = () => {
  // const user = localStorage.getItem("user");
  const [email, setEmail] = useState("");
  // const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [possibleValues, setPossibleValues] = useState([]);
  const [open, setOpen] = useState(false);

  // console.log(response)

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("user") === null
  ) {
    window.location.href = "/login";
  }
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value.length > 0) {
      const filteredSuggestions = possibleValues.filter((suggestion) =>
        suggestion[0].toLowerCase().includes(e.target.value.toLowerCase())
      );
      // console.log(filteredSuggestions);
      if (filteredSuggestions.length > 0) {
        for (let i = 0; i < filteredSuggestions.length; i++) {
          if (suggestions.includes(filteredSuggestions[i][0])) continue;
          if (suggestions.includes("No matches found")) suggestions.pop();
          setSuggestions((prev) => [...prev, filteredSuggestions[i][0]]);
        }
      } else setSuggestions(["No matches found"]);
    } else {
      setSuggestions([]);
    }
  };

  //  console.log(user)

  const handleSearchUser = async (email2) => {
    if (email === "" && email2 === undefined) {
      toast.error("Please enter email address to search for user");
      return;
    }
    if(email2 !== undefined){
      setEmail(email2)
    }
    const token = JSON.parse(localStorage.getItem("token"));

    await axios
      .post(
        `${BASE_URL}/api/v1/users/emailToUserID`,
        {
          email: email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        // console.log("Success:", response.data);
        toast.success("User found successfully");
        console.log(response.data.data);

        setTimeout(() => {
          navigate(`/accountProfile/${response.data.data._id}`);
        }, 2000);
        // settweet("");
      })
      .catch((error) => {
        toast.error("User not found");
        console.error("Error:", error);
      });
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("token"));
    // console.log(token);

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
        // console.log("Success:", response.data.data);

        setTweets(response.data.data.reverse());

        localStorage.setItem(
          "noOfUsers",
          JSON.stringify(response.data.data.length)
        );

        // console.log(response.data.data);
        // const noOfActiveUsers = response.data.data.length;

        // alert("Tweets fetched successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    toast.promise(
      getTweets(),
      {
        loading: "Fetching tweets...",
      },
      {
        position: "top-right",
      }
    );

    const getAllUsers = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios
        .get(
          `${BASE_URL}/api/v1/users/getAllUsers`,
          {}, // Send empty body (optional)
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          // console.log("Success:", response.data.data);
          response.data.data.map((user) => {
            if (!possibleValues.includes([user.email, user._id])) {
              setPossibleValues((prev) => [...prev, [user.email, user._id]]);
            }
          });
          // console.log(possibleValues);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    getAllUsers();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
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
              onClick={() => {
                setOpen(false);
              }}
            />
          </p>

          <p className="text-[#6D38C3] mt-4 text-xl font-semibold text-center">
            Are you sure you want to logout ?
          </p>

          <div className="w-full flex justify-between mt-6">
            <button
              onClick={handleLogout}
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

      <div className="flex min-h-full flex-1 flex-col justify-center">
        <Navbar />
        <Toaster />
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="mt-20 mr-10 bg-slate-300 rounded-lg hover:scale-125 transform p-1 hover:bg-red-400 hover:text-white w-fit"
          >
            <lord-icon
              src="https://cdn.lordicon.com/gwvmctbb.json"
              trigger="hover"
              style={{ width: "30px", height: "30px" }}
            ></lord-icon>
          </button>
        </div>

        <div className="flex mt-2 items-center justify-center md:justify-between flex-wrap">
          <img
            src={logo2}
            className="w-16 h-16 ml-4 md:static absolute top-20"
            alt=""
          />
          <div className="md:absolute w-screen">
            <Zoom triggerOnce={true} delay={200}>
              <h1 className="text-5xl p-5 font-bold text-center">
                Welcome {user.fullName}!
              </h1>
            </Zoom>
          </div>

          <div className="flex flex-col mx-auto md:mx-0 gap-10">
            <div className="flex justify-center">
  <form
    onSubmit={(e) => {
      e.preventDefault(); // Prevent default form submission
      handleSearchUser(); // Call the search handler
    }}
    className="flex w-96 relative md:mr-5"
  >
    <div className="autocomplete-wrapper w-full ml-4 md:ml-0">
      <input
        type="text"
        placeholder="Enter Email Address to search for user"
        value={email}
        onChange={handleInputChange}
        className="rounded-full w-96 h-16 pl-6"
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
      />
      {suggestions.length > 0 && (
        <ul
          id="autocomplete-list"
          className={`suggestions-list z-30 ${
            suggestions.includes("No matches found") ? "h-fit" : "h-64"
          } overflow-scroll`}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={()=>{
                setSuggestions([])
                handleSearchUser(suggestions[index])
              }}
              role="option"
              className="flex items-center gap-1 cursor-pointer"
            >
              {suggestion.includes("No matches found") ? (
                ""
              ) : (
                <img src={profile} className="h-10" alt="" />
              )}
              <p className="pb-1">{suggestion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
    <button
      type="submit" // Specifies the button submits the form
      className="absolute right-4 top-4"
    >
      <lord-icon
        src="https://cdn.lordicon.com/kkvxgpti.json"
        trigger="hover"
        style={{ width: "30px", height: "30px" }}
      ></lord-icon>
    </button>
  </form>
</div>

          </div>
        </div>
        <p className="text-3xl font-bold p-5">Today's Feed</p>
      </div>

      <div>
        {tweets.map((tweet, index) => {
          return <TweetCard key={index} tweet={tweet} />;
        })}
      </div>
    </div>
  );
};

export default Homepage;
