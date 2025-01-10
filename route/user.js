const express = require('express');
const { body} = require('express-validator');
const { Userlogin, Usersingup, Gogoolelogin, forgetPassword, resetPassword } = require('../controller/user');
const limiter = require('../Middleware/ratelimit');
const validationresult = require('../Middleware/validationResult');


const router = express.Router();

router.post('/login', limiter, Userlogin );
router.post('/signup', [
    body('email').isEmail().withMessage("Invaild Email"),
    body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/\d/)
            .withMessage('Password must contain at least one number')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter'),
] , validationresult,Usersingup);

router.post('/auth/google' , Gogoolelogin)

router.post('/password/forgot' , forgetPassword)
router.post('/password/reset' , resetPassword)

module.exports = router;


