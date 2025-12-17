import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { APIresponse } from "../utils/APIresponse.js";
import { Tweet } from "../models/tweets.models.js";

const registerUser = asyncHandler(async (req, res) => {
  // res.status(200).json({ message: 'OK' })

  // console.log(req.body)

  const { fullName, email, password } = await req.body;
  // console.log(username, fullName, email, password)

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
    // console.log('User with email or username already exists')
  }
  // console.log(req.files)
  // const avatarLocalPath = req.files?.avatar[0]?.path
  // const coverImageLocalPath = req.files?.coverImage[0]?.path
  // let coverImageLocalPath;
  // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  //   coverImageLocalPath = req.files.coverImage[0].path
  // }

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, 'Avatar file is required')
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  // if (!avatar)
  //   throw new ApiError(500, 'Avatar Image required')

  const user = await User.create({
    fullName,
    // avatar: avatar.url,
    // coverImage: coverImage.url ? coverImage.url : "",
    email,
    password,
    // username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new APIresponse(201, createdUser, "User registered successfully"));
});

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(accessToken, refreshToken)
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // compare email and password
  // generate token

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // localStorage.setItem('refreshToken', refreshToken)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // localStorage.setItem('user', json.stringify(loggedInUser))

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new APIresponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // remove refresh token from database
  console.log(req.user._id);
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new APIresponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error(error);
  }
});

const getUserDetails = asyncHandler(async (req, res) => {
  // console.log(req.user)

  // console.log("****" + req.body.userID + "****");
  const userID = req.body.userID

  const user = await User.findById(userID).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new APIresponse(200, user, "User details fetched successfully"));
});

const postTweet = asyncHandler(async (req, res) => {

  const { tweet, image } = req.body;

  const newTweet = await Tweet.create({
    tweet,
    user: req.user._id,
    image: image
  });

  if (!newTweet) {
    throw new ApiError(500, "Something went wrong while posting the tweet");
  }

  return res
    .status(201)
    .json(new APIresponse(201, newTweet, "Tweet posted successfully"));
});

const showTweet = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({}).populate("user", "fullName");
  // console.log(tweets)
  if (!tweets) {
    throw new ApiError(404, "No tweets found");
  }

  // console.log(tweets);

  return res
    .status(200)
    .json(new APIresponse(200, tweets, "Tweets fetched successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = req.body.tweetId;

  const tweet = await Tweet.findByIdAndDelete(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new APIresponse(200, {}, "Tweet deleted successfully"));
});

const showLikeTweet = asyncHandler(async (req, res) => {
  const tweetId = req.body.tweetId;
  const user = req.body.user;
  // console.log(user);
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  let isLiked;

  if (tweet.likes.users.includes(user)) {
    // console.log("yes");
    isLiked = true;
    // console.log(isLiked + "**********")
  } else {
    // console.log(isLiked + "**********")
    // console.log(tweet.likes.users);
    isLiked = false;
  }

  return res
    .status(200)
    .json(new APIresponse(200, { isLiked }, "Like Process Successful"));
});

const likeTweet = asyncHandler(async (req, res) => {
  const tweetId = req.body.tweetId;
  const user = req.body.user;
  // console.log(user);
  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  let isLiked;
  // console.log("hello")
  // console.log(tweet.likes)
  // console.log(User.findById(user))
  console.log(tweet.likes.users.includes(user));
  if (tweet.likes.users.includes(user)) {
    console.log(tweet.likes.users);
    console.log("yes");
    isLiked = false;
    tweet.likes.users.pull(user);
  } else {
    tweet.likes.users.push(user);
    console.log(tweet.likes);
    isLiked = true;
  }

  await tweet.save();

  return res
    .status(200)
    .json(new APIresponse(200, { isLiked }, "Like Process Successful"));
});

const changePassword = asyncHandler(async (req, res) => { 
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new APIresponse(200, {}, "Password changed successfully"));
  
});


const commentAdded = asyncHandler(async (req, res) => {
  const tweetId = req.body.tweetId;
  const comment = req.body.comment;
  const user = req.body.user;
  const date = new Date();
  const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  
  console.log(time, date);

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  tweet.comments.push({ user, comment, date: date, time});

  await tweet.save();

  return res
    .status(200)
    .json(new APIresponse(200, {}, "Comment added successfully"));
})

const getComments = asyncHandler(async (req, res) => {
  const tweetId = req.body.tweetId;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const comments = tweet.comments;

  return res
    .status(200)
    .json(new APIresponse(200, comments, "Comments fetched successfully"));
})



const forgotPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(200)
    .json(new APIresponse(200, {}, "Password changed successfully"));




});


const emailToUserID = asyncHandler(async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({email})

  if(!user){
    throw new ApiError(404, "User not found")
  }

  return res
    .status(200)
    .json(new APIresponse(200, user, "User found successfully"))
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  return res
    .status(200)
    .json(new APIresponse(200, users, "Users fetched successfully"));
})


const followUser = asyncHandler(async (req, res) => {
  const { userID, followerID } = req.body;

  const user = await User.findById (userID);

  if(!user){
    
    throw new ApiError(404, "User not found")
  }

  const follower = await User.findById(followerID);

  if(!follower){
    throw new ApiError(404, "User not found")
  }
  

  let isFollowed;


  if(user.followers.users.includes(follower._id)){
    user.followers.users.pull(follower._id);
    follower.following.users.pull(user._id);
    isFollowed = false;

  }
  else{
    user.followers.users.push(follower._id);
    follower.following.users.push(user._id);
    isFollowed = true;
}
  await user.save();
  await follower.save();

  return res
    .status(200)
    .json(new APIresponse(200, {isFollowed}, "User follow process worked successfully"))

})

const getFollowings = asyncHandler(async (req, res) => { 
  const { userID } = req.body;

  const user = await User.findById (userID);

  if(!user){
    throw new ApiError(404, "User not found")
  }

  const followings = user.following.users;

  return res
    .status(200)
    .json(new APIresponse(200, {followings}, "Followers fetched successfully"))
  


})


export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  postTweet,
  showTweet,
  deleteTweet,
  likeTweet,
  showLikeTweet,
  changePassword,
  commentAdded,
  getComments,
  forgotPassword,
  emailToUserID,
  getAllUsers,
  followUser,
  getFollowings
};
