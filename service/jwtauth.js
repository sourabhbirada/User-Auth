const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY

function Createtoken(user){
    const payload = {
        id:user._id,
        name:user.name,
        email:user.email
    }
    const token = jwt.sign(payload , secret)
    return token;
}

function Verfiytoken(token){
    const payload = jwt.verify(token , secret);
    return payload;
}

module.exports = {
    Createtoken,
    Verfiytoken
}