// Import the necessary modules and methods
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { joinChat, leaveChat, sendMessage as sendChatMessage, listenForMessages } from "./Socket";
import { SOCKET_URL } from "./helper";
import io from "socket.io-client";

const WorldChat = () => {
  const world = window.location.pathname.split("/")[2]
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  const keepDown = useRef(null);
  const socket = io(`${SOCKET_URL}`);

  const user = JSON.parse(localStorage.getItem("user"));
  const joinMessageKey = `joinMessage_${world}_${user?.fullName}`;

  useEffect(() => {
  const handleNewMessage = (messageData) => {
    setMessageList((prev) => [...prev, messageData]);
  };

  listenForMessages(handleNewMessage);

  return () => {
    socket.off('receiveMessage'); // Clean up listener on unmount
  };
}, []);

  

  // Scroll to bottom on new message
  useEffect(() => {
    if (keepDown.current) {
      keepDown.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  // Load saved messages from localStorage on component mount
  

  // Handle joining chat and socket events
  useEffect(() => {
    if (!user) return;

    // Notify system of joining
    if (!localStorage.getItem(joinMessageKey)) {
      const joinMessage = {
        author: "System",
        message: `${user.fullName} joined the world`,
        time: new Date().toLocaleTimeString(),
      };
      setMessageList((prev) => [...prev, joinMessage]);
      localStorage.setItem(joinMessageKey, "true");
    }

    // Join the chat and listen for new messages
    joinChat(world, user.fullName);



    return () => {
      // Cleanup: Notify system and leave the chat
      const leaveMessage = {
        author: "System",
        message: `${user.fullName} left the world`,
        time: new Date().toLocaleTimeString(),
      };
      setMessageList((prev) => [...prev, leaveMessage]);
      leaveChat(world, user.fullName);
    };
  }, [world, joinMessageKey]);

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Send a message
  const sendMessage = () => {
    if (message.trim() === "") return;
  
    sendChatMessage(world, message, user.fullName); // Send the message to the server
    setMessage(""); // Clear the input field
  };
  

  return (
    <div className="w-screen bg-blue-50">
      <div className="flex flex-1 flex-col justify-center">
        <nav className="bg-slate-900 fixed top-0 w-full">
          <ul className="flex justify-around">
            <div className="w-1/3 text-center py-4 text-white">
              <NavLink to="/chat">
                <li>Go Back</li>
              </NavLink>
            </div>
            <div className="w-full text-center py-4 text-white">
              <NavLink to="/worldChat">
                <li>World Chat</li>
              </NavLink>
            </div>
          </ul>
        </nav>

        <div className="messages min-h-[calc(100vh-80px)] mb-24  mt-12">
          {messageList.map((msg, index) => (
            <div key={index} className={`flex my-4 ${msg.author === user.fullName ? 'justify-end' : 'justify-start'}`}>
              <div className={`message p-3 mx-1 rounded-xl break-words ${msg.author === user.fullName ? 'bg-green-500' :  msg.author === 'System' ? 'bg-blue-100 w-full' : 'bg-pink-400'}`}>
                <p className="text-xl text-wrap w-96 py-2 break-words">{msg.message}</p>
                <p className="text-sm font-bold">{msg.author}</p>
                <p className="text-sm">
  {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false })}{" "}
  {new Date(msg.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })}
</p>

              </div>
            </div>
          ))}
          <div ref={keepDown} />
        </div>

        <div className="sendMessage mb-4 bg-blue-50 flex gap-2 bottom-8 fixed left-0 -translate-x-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-1/3">
          <input
            type="text"
            value={message}
            onChange={handleMessageChange}
            className="w-full border p-2 rounded-lg border-slate-900"
            placeholder="Type your message here"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-slate-900 p-2 text-white rounded-lg px-3"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <div ref={keepDown} className="bg-slate-800 fixed bottom-0 w-full py-2 text-white text-center">Copyright</div>
    </div>
  );
};

export default WorldChat;
