var nodemailer = require("nodemailer");
const mongoose = require("mongoose");

module.exports = app => {
  app.post("/api/feedback", (req, res) => {
    const output = `
    <p>Intercessor Feedback</p>
    <h3>User Details</h3>
    <ul>
      <li>Name: ${req.user.firstName} ${req.user.lastName}</li>
      <li>Email: ${req.user.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.feedback}</p>
  `;

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "app.intercessor@gmail.com",
        pass: "040796yh"
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: "'Intercessor', app.intercessor@gmail.com", // sender address
      to: "yanghakim0@gmail.com", // list of receivers
      subject: "Intercessor Feedback", // Subject line
      text: "Hello world?", // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.send("contact", { msg: "Email has been sent" });
    });
  });
};
