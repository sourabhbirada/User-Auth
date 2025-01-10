const USER = require("../Model/user");
const bcrypt = require('bcrypt');
const { Createtoken } = require("../service/jwtauth");
const verfytoken = require("../Middleware/googleverfy");
const generateOTP = require("../service/generateOtp");
const sendEmail = require("../service/emailsend");
const saltRounds = 10;



const Usersingup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const exituser = await USER.findOne({
            $or: [{ email }, { username }],
        });

        if (exituser) {
            const reason = exituser.email === email ?'EMAIL ': "USERNAME";
            return res.status(409).json({ message: `${reason} already exists` });
        }

        const newpassword = await bcrypt.hash(password, saltRounds);

        const user = await USER.create({ username, email, password: newpassword, logintype: "website" });
        const token = Createtoken(user);
        res.cookie("token", token).json({ message: 'User created' })
    } catch (error) {
        if (error.name === "ValidationError") {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: errorMessages.join(", ") });
        }
        console.error("Error in user signup:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

const Userlogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await USER.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.logintype === "google" && user.password === '') {
            return res.status(400).json({
                message: "you have login using google login you can login using google or forget the password"
            })
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = Createtoken(user);
        res.cookie("token", token).json({ message: 'Successfully logged in', user: user.email });
    } catch (error) {
        console.error("Error verifying token:", error);
    }
}

const forgetPassword = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return res.status(400).json({ message: "Invalid email address provided." });
        }

        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist. Please check the email and try again." });
        }

        const otp = generateOTP();
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = Date.now() + 300000

        await user.save({ validateBeforeSave: false });
        console.log("Generated OTP for user:", { email: user.email, otp });

        await sendEmail(user.email, otp)

        res.status(200).json({ message: "OTP has been sent to your registered email address." });

    } catch (error) {
        console.error("Error in forgetPassword function:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid data provided. Please check and try again." });
        }

        if (error.message.includes("Failed to send email")) {
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }

        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
};


const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    try {
        if (!email || !otp || !password) {
            return res.status(400).json({ message: "Email, OTP, and new password are required." });
        }

        const user = await USER.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({
                message: "Invalid email, OTP, or OTP has expired. Please try again.",
            });
        }

        const newpassword = await bcrypt.hash(password, saltRounds);

        user.password = newpassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password has been changed successfully." });

    } catch (error) {
        console.error("Error in resetPassword function:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid input data. Please check and try again." });
        }

        res.status(500).json({ message: "An unexpected error occurred. Please try again later." });
    }
};



const Gogoolelogin = async (req , res) => {
    const {token} = req.body
    try {
        const googleuser = await verfytoken(token);

        const {username , email }  = googleuser;

        const user = await USER.findOne({email});
        
        if(!user){
            user = await USER.create({
                username , 
                email,
                password:'',
                logintype:"google"
            })
        }

        const tok = Createtoken(user);
        res.cookie("token" , tok).status(200).json({message:"user verify succufully" , user})
        
    } catch (error) {
        console.log(error);
        res.status(400).json({message:'invailed token'})
    }
}

module.exports = {
    Userlogin,
    Usersingup,
    forgetPassword,
    resetPassword,
    Gogoolelogin
}
