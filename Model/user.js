const { model, Schema } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "Provide a username"],
            match: [/^[a-zA-Z0-9]+$/, "Username is invalid"],
            index: true,
        },
        email: {
            type: String,
            lowercase: true,
            required: [true, "Provide a correct email"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid"],
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        logintype: {
            type: String,
            required: [true, "Login type is required"],
        },
        resetPasswordOTP: {
            type: String,
            default: null,
        },
        resetPasswordOTPExpires: {
            type: Date,
            default: null,
        },
        createdtime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, 
    }
);

const USER = model("User", UserSchema);

module.exports = USER;
