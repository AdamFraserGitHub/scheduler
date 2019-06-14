var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service:'gmail',
  auth: {
    user:'adamfraserprograming@gmail.com',
    pass: 'EmpireBiscut 1'
  }
});

const mailOptions = {
  from: 'adamfraserprograming@gmail.com',
  to: 'adamfraserprograming@gmail.com',
  subject: "test",
  html: "<p>this worked oddly well</p>"
}

for(var i = 0; i < 10; i++) {
  transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
      console.log(err);
    } else {
      console.log(info)
    }
  });
}