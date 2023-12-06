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
        opts.expiresIn = 60 * 60 * 24; //day
        const secret = process.env.JWT_SECRET
        const token = jwt.sign({ _id: user._id }, secret, opts);
        return res.status(200).json({
            message: "Auth Passed",
            token
        })
    }),
]

module.exports = {login}