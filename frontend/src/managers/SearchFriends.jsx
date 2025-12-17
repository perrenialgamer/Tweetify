import React from "react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {toast, Toaster} from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import profile from "../assets/profile.png";
import { BASE_URL } from "./helper";

const SearchFriends = () => {

     const [email, setEmail] = useState("");
     const [recentSearches, setRecentSearches] = useState([]); // [email1, email2, email3, ...
     const navigate = useNavigate();
     console.log(recentSearches);



     const handleSearchUser = async () => {
          if(email === ""){
               toast.error("Please enter email address to search for user");
               return;
          }
          const token = JSON.parse(localStorage.getItem("token"));

          await axios.post(`${BASE_URL}/api/v1/users/emailToUserID`, {
               email: email

          },
          {
               headers: { Authorization: `Bearer ${token}` },
             })
             .then((response) => {
               console.log("Success:", response.data);
               toast.success("User found successfully");

               
               
               if(recentSearches.includes([response.data.data.email, response.data.data._id, response.data.data.fullName]) === false){
                    setRecentSearches((recentSearches) => [...recentSearches, [response.data.data.email, response.data.data._id, response.data.data.fullName]]);

                    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
               }

               setTimeout(() => {
                    navigate(`/accountProfile/${response.data.data._id}`)
               }, 2000);
               // settweet("");
             })
             .catch((error) => {
               console.error("Error:", error);
               toast.error("User not found");
             });

     }


     useEffect(() => {
          if(localStorage.getItem("recentSearches") !== null){
               const recentSearchesLocal = JSON.parse(localStorage.getItem("recentSearches"));
               console.log(recentSearchesLocal, recentSearches);
               console.log((recentSearches).includes(recentSearchesLocal));
               if(recentSearches.includes(recentSearchesLocal) === false)
                    setRecentSearches(recentSearchesLocal);
          }
     
       
     }, [])
     




  return (
    <div>
     <Toaster />
      <nav className="bg-slate-900 ">
        <ul className="flex justify-around">
          <div className="w-1/3 text-center py-4 text-white">
            <NavLink to="/chatWithFriends">
              <li>Go Back</li>
            </NavLink>
          </div>
          <div className="w-full text-center py-4 text-white">
            <NavLink to={window.location}>
              <li>Search For Friends</li>
            </NavLink>
          </div>
        </ul>
      </nav>

      <div className="text-center mt-24 h-screen px-8">
        <div className="flex flex-col gap-10">
          <h1 className="text-5xl font-semibold">
            Enter email address of the person:{" "}
          </h1>
          <div className="flex justify-center">
            <div className="flex md:w-1/2 w-96 relative">
              <input
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full w-full h-16 pl-6"
              />
              <button className="absolute right-4 top-4" onClick={handleSearchUser}>
                <lord-icon
                  src="https://cdn.lordicon.com/kkvxgpti.json"
                  trigger="hover"
                  style={{ width: "30px", height: "30px" }}
                ></lord-icon>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 mx-auto w-1/2">
          <h1 className="font-bold text-3xl">Recent Searches:</h1>
          {recentSearches.map((search, index) => {
               return (
                    <div key={index} className="flex items-center justify-around">
               <div className="flex items-center gap-2 mt-5">
                    
                    <button onClick={() => navigate(`/accountProfile/${search[1]}`)}>
                         <img src={profile} className="h-10 w-10" alt="" />
                    </button>
                    <h1 className="text-xl cursor-pointer" onClick={()=>navigate(`/accountProfile/${search[1]}`)}>{search[2]}</h1>
                    </div>
                    <div className="pt-7 cursor-pointer" onClick={() => navigate(`/accountProfile/${search[1]}`)}>
                         <lord-icon
                  src="https://cdn.lordicon.com/kkvxgpti.json"
                  trigger="hover"
                  style={{ width: "30px", height: "30px" }}
                ></lord-icon>
                </div>
                    </div>
               
               );
          })}


        </div>
      </div>
    </div>
  );
};

export default SearchFriends;
