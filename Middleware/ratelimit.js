const ratelimit = require('express-rate-limit');


const limiter = ratelimit({
    windowMs: 2*60*1000,
    max:6,
    message:{
        message: 'Too many requests, please try again later'
    }
})

module.exports = limiter;