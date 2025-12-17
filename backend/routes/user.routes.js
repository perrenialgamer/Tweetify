import { Router } from "express";
import { getFollowings, loginUser, logoutUser, registerUser, showTweet } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { postTweet } from "../controllers/user.controllers.js";
import { deleteTweet } from "../controllers/user.controllers.js";
import { likeTweet } from "../controllers/user.controllers.js";
import { showLikeTweet } from "../controllers/user.controllers.js";
import { getUserDetails } from "../controllers/user.controllers.js";
import { changePassword } from "../controllers/user.controllers.js";
import { sendEmail } from "../controllers/email.controllers.js";
import { commentAdded } from "../controllers/user.controllers.js";
import { getComments } from "../controllers/user.controllers.js";
import { forgotPassword } from "../controllers/user.controllers.js";
import { emailToUserID } from "../controllers/user.controllers.js";
import { getAllUsers } from "../controllers/user.controllers.js";
import { followUser } from "../controllers/user.controllers.js";



const router = Router();
// console.log("user.routes.js");
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/postTweet').post(verifyJWT,postTweet);
router.route('/showTweets').post(showTweet)
router.route('/deleteTweet').delete(deleteTweet);
router.route('/likeTweet').post(likeTweet);
router.route('/showLikeTweet').post(showLikeTweet);
router.route('/getUserDetails').post(verifyJWT, getUserDetails);
router.route('/changePassword').post(verifyJWT,changePassword);
router.route('/sendEmail').post(sendEmail);
router.route('/commentAdded').post(commentAdded);
router.route('/getComments').post(getComments);
router.route('/forgotPassword').post(forgotPassword);
router.route('/emailToUserID').post(emailToUserID);
router.route('/getAllUsers').get(getAllUsers);
router.route('/followUser').post(verifyJWT, followUser);
router.route('/getFollowings').post(verifyJWT, getFollowings);



export default router;
