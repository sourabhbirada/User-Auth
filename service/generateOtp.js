const crypto = require("crypto");


const generateOTP = (length = 4) => {
    return crypto.randomInt(Math.pow(10, length - 1), Math.pow(10, length)).toString();
}


module.exports = generateOTP;