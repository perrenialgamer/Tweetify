import dotenv from 'dotenv';
import {asyncHandler} from '../utils/asyncHandler.js';
import nodemailer from 'nodemailer';

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: false,
     auth: {
         user: process.env.SMTP_MAIL,
         pass: process.env.SMTP_PASSWORD
     }
})

const sendEmail = asyncHandler(async (req, res) => {
     // console.log(req)
  const { email, subject, message } = JSON.parse(req.body.data);
  console.log(email, subject, message);



  var mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: subject,
    text: message,
  };
  

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send('Something went wrong');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent');
    }
  })
})

export { sendEmail };


