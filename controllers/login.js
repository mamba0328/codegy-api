require('dotenv').config()
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const Users = require('../models/users');

const login = [
    body('email').isEmail(),
    body('password').isLength({min: 8}),
    asyncHandler(async (req, res, next) => {
        let { email, password } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const user = await Users.findOne({email}).select('+password');
        const userExist = user !== null;

        if(!userExist){
            return res.status(401).json({ message: "Email or password are wrong"})
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if(!passwordIsValid){
            return res.status(401).json({ message: "Email or password are wrong" })
        }

        const opts = {}
        opts.expiresIn = 60 * 15; //15 min

        const refreshOpts = {};
        refreshOpts.expiresIn = 60 * 60 * 24 * 14 // 2 weeks

        const secret = process.env.JWT_SECRET;
        const refreshSecret = process.env.REFRESH_SECRET;

        const token = jwt.sign({ _id: user._id }, secret, opts);
        const refreshToken = jwt.sign({_id: user._id}, refreshSecret, refreshOpts);

        //expires converted to ms from mins
        return res.status(200).cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + refreshOpts.expiresIn * 1000), httpOnly: true }).json({
            message: "Auth Passed",
            token
        })
    }),
]

module.exports = {login}