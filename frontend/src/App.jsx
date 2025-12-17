
import Me from "./managers/me.jsx";
import Register from "./managers/register.jsx";
import { Routes } from "react-router-dom";
import Homepage from "./managers/Homepage.jsx";
import Post from "./managers/Post.jsx";
import { Route } from "react-router-dom";
import Login from "./managers/login.jsx";
import AboutApp from "./managers/AboutApp.jsx";
import Chat from "./managers/Chat.jsx";
import WorldChat from "./managers/worldChat.jsx";
import ChatWithFriends from "./managers/chatWithFriends.jsx";
import ChatRoom from "./managers/ChatRoom.jsx";
import AccountSettings from "./managers/accountSettings.jsx";
import LandingPage from "./managers/landingPage.jsx";
import AccountProfile from "./managers/accountProfile.jsx";
import Comment from "./managers/Comment.jsx";
import ForgotPassword from "./managers/ForgotPassword.jsx";
import ResetPassword from "./managers/resetPassword.jsx";
import SearchFriends from "./managers/SearchFriends.jsx";

function App() {

  
  
  return (
    <>
      <Routes>
        <Route path="/register"
          element={<Register />}>
        </Route>
        <Route path="/login"
          element={<Login />}>
        </Route>
        <Route path="/homepage"
          element={<Homepage />}>
        </Route>
        <Route path="/me"
          element={<Me />}>
        </Route>
        <Route path="/post"
          element={<Post />}>
        </Route>
        <Route path="/aboutApp"
          element={<AboutApp />}>
        </Route>
        <Route path="/chat"
          element={<Chat />}>
        </Route>
        <Route path="/worldChat"
          element={<WorldChat />}>
        </Route>
        <Route path="/chatWithFriends"
          element={<ChatWithFriends />}>
        </Route>
        <Route path="/ChatRoom/:slug"
          element={<ChatRoom />}>
        </Route>
        <Route path="/accountSettings"
          element={<AccountSettings />}>
        </Route>
        <Route path="/"
          element={<LandingPage />}>
        </Route>
        <Route path="/accountProfile/:slug"
          element={<AccountProfile />}>
        </Route>
        <Route path="/comment/:slug"
          element={<Comment />}>
        </Route>
        <Route path="/forgotPassword"
          element={<ForgotPassword />}>
        </Route>
        <Route path="/resetPassword"
          element={<ResetPassword />}>
        </Route>
        <Route path="/searchFriends"
          element={<SearchFriends />}>
        </Route>
       
      </Routes>
    </>
  );
}

export default App;
