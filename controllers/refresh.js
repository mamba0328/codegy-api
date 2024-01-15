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
           const error = new Error();
           error.code = 401;
           error.message = 'Unauthorized';
           throw error
        }

        const {_id, is_author} = jwtDecode(refreshToken)

        const Model = is_author ? Author : Users;
        const entity = await Model.findById(_id);
        const entityExist = entity !== null;

        if(!entityExist){
            const error = new Error();
            error.code = 401;
            error.message = 'Unauthorized';
            throw error
        }


        const opts = {}
        opts.expiresIn = 60 * 15; //15 mins

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ _id: entity._id, is_author: !!is_author,}, secret, opts);
        console.log(token)

        return res.send({
            message: "Auth Passed",
            token
        })
    }),
]

module.exports = refresh