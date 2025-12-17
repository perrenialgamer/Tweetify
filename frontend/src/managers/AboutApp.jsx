import React from 'react'
import { NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar';

const AboutApp = () => {

const tweetsSize = localStorage.getItem("noOfUsers");
// console.log(tweetsSize);








  return (
    <div>
      

      <Navbar />

        <div className='mt-16'>
          <h1 className="text-5xl p-5 font-bold text-center">
            About App
          </h1>
          <p className="text-3xl font-bold p-5">This is a simple social media app built using MERN stack</p>
          <p className="text-3xl font-bold p-5">It has features like login, register, post, like and comment</p>
          <p className="text-3xl font-bold p-5">It is built using React, Node, Express and MongoDB</p>
          <p className="text-3xl font-bold p-5"><a href="https://github.com/ayushgit12" target='__blank'> It is built by Ayush Raj Baranwal</a></p>
        </div>

     <div className='flex justify-around flex-wrap'>
        <div className='text-3xl w-fit border p-3 border-slate-800 rounded-lg'>
          No. of Active Tweets:
          <br />
          <p className='text-center font-extrabold text-5xl'>{tweetsSize}</p>
        </div>
        <div className='text-3xl w-fit border p-3 border-slate-800 rounded-lg'>
          No. of Active Users:
          <br />
          <p className='text-center font-extrabold text-5xl'>{tweetsSize}</p>
        </div>
        </div>
    </div>
  )
}

export default AboutApp
