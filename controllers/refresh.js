require('dotenv').config()
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const {jwtDecode} = require("jwt-decode");

const Users = require('../models/users');

const refresh = [
    asyncHandler(async (req, res, next) => {
        const { refreshToken, } = req.cookies;

        if(!refreshToken){
            return res.status(401).message('Unauthorized');
        }

        const {_id} = jwtDecode(refreshToken)

        const user = await Users.findById(_id);
        const userExist = user !== null;

        if(!userExist){
            return res.status(401).json({ message: "No such user"})
        }


        const opts = {}
        opts.expiresIn = 60 * 15; //15 mins

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ _id: user._id }, secret, opts);

        return res.status(200).json({
            message: "Auth Passed",
            token
        })
    }),
]

module.exports = refresh