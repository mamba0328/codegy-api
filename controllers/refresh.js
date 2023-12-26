require('dotenv').config()
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken')
const {jwtDecode} = require("jwt-decode");

const Users = require('../models/users');
const Author = require('../models/authors');

const refresh = [
    asyncHandler(async (req, res, next) => {
        const { refreshToken, } = req.cookies;

        if(!refreshToken){
            return res.status(401).message('Unauthorized');
        }

        const {_id, is_author} = jwtDecode(refreshToken)

        const Model = is_author ? Author : Users;
        const entity = await Model.findById(_id);
        const entityExist = entity !== null;

        if(!entityExist){
            return res.status(401).json({ message: "No such entity"})
        }


        const opts = {}
        opts.expiresIn = 60 * 15; //15 mins

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ _id: entity._id, is_author: !!is_author,}, secret, opts);

        return res.status(200).json({
            message: "Auth Passed",
            token
        })
    }),
]

module.exports = refresh