const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
    try {
        console.log(`Sending OTP to: ${email}`);
        
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Sourabh" <officialsourabhchoudhary@gmail.com>`,
            to: email, 
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};


module.exports = sendEmail;
