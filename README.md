# Tweetify: A MERN Stack Social Networking App
Tweetify is a full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). It allows users to create short posts (tweets), follow other users, and engage in real-time conversations. 
It helps the users to discuss real life common problems, political issues, critics, and even debate about a certain topic. It lets the users comment in a certain post and create a chain of comments which helps the users
engage in real time debates.

## Features:
• Real-time Chatting: Socket.io facilitates real-time communication between users, enabling instant messaging and group chats. 

• Login & Signup Authentication: Secure user accounts are managed through login and signup functionalities.

• Email Notifications: Nodemailer is used to send email notifications for various actions, such as login, signup, reset password, reporting of tweets, etc.

## Tech Stack
• Frontend: React.js + Vite

• Backend: Node.js, Express.js

• Database: MongoDB

• Real-time Messaging: Socket.io

• Email Notifications: Nodemailer


## Installation
### Clone this repository:
```bash
git clone https://github.com/ayushgit12/Tweetify.git
```

### Install dependencies:
#### For frontend
```bash
cd frontend
npm install
```

#### For backend
```bash
cd backend
npm install
```

#### Create a .env file in the root directory and configure your database connection string and any other environment variables.
### Running the Application
### Start the backend server:
```bash
npm start
```

### Run the frontend development server:
```bash
npm run dev
```

This will start both the backend server and the frontend development server. You can access the application at http://localhost:5173 in your web browser.



