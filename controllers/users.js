const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

const Users = require('../models/users');

const getUsers = asyncHandler(async (req, res, next) => {
        const {email, username} = req.query;
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const users = await Users.find({...email && {email}, ...username && {username}, }).skip(skip).limit(limit);
        return res.send(users);
});

const createUser = [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({min:8, max:64}),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }),
    body('username').trim().isLength({min:8, max:20}).escape(),
    body('first_name').escape(),
    body('last_name').escape(),
    asyncHandler(async (req, res, next) => {
        const { email, password, username, first_name, last_name, } = req.body;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const userExist = await Users.findOne({email});

        if(userExist){
            return res.status(400).send({msg: 'User with such email already exist'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const now = Date.now();

        const newUser = await Users.create({
            email,
            password: hashedPassword,
            username,
            first_name,
            last_name,
            created_at: now,
            updated_at: now,
        });


        const userWithoutPassword = { ...newUser._doc };
        delete userWithoutPassword.password;

        res.json(userWithoutPassword);
    })
]



module.exports = {
    getUsers,
    createUser,
};
