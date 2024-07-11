import express from "express";
import db from '../../db.js';
import nodemailer from 'nodemailer';


const router = express.Router();



router.post('/send-email', async (req, res) => {
  const {
    userData,
    selectedSeason,
    courseObject,
    dogData,
    ownerData,
    consentData,
  } = req.body;

    const transporter = nodemailer.createTransport({
        host: "lx8.hoststar.hosting",
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "anmeldung@hundeschule-voecklabruck.at",
          pass: "Huschu100%Sicher",
        },
      
       
      });
   

      const mailOptions = {
        from: 'anmeldung@hundeschule-voecklabruck.at',
        to: 'superjiley@gmail.com',
        subject: 'Anmeldebestätigung',
        text: `Vielen Dank für Ihre Anmeldung, ${userData.vorname}! 
      DU hast dich für den kurs ${courseObject.kurs_name} angemeldet`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Bestätigungs-E-Mail wurde gesendet.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/send-dataEmail', async (req, res) => {
  const {
    userData,
    selectedSeason,
    courseObject,
    dogData,
    ownerData,
    consentData,
  } = req.body;

  const transporter = nodemailer.createTransport({
      host: "lx8.hoststar.hosting",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "anmeldung@hundeschule-voecklabruck.at",
        pass: "Huschu100%Sicher",
      },
    
     
    });
 

    const mailOptions = {
      from: 'anmeldung@hundeschule-voecklabruck.at',
      to: 'superjiley@gmail.com',
      subject: 'Anmeldebestätigung',
      text: `Vielen Dank für Ihre Anmeldung, ${userData.vorname}! 
      Du hast dich für den kurs ${courseObject.kurs_name} angemeldet`,


  };

  try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Bestätigungs-E-Mail wurde gesendet.' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: error.message });
  }
});




export default router;

