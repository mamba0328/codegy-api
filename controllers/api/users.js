const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')

const Users = require('../../models/users');
const jwt = require("jsonwebtoken");
const {jwtDecode} = require("jwt-decode");

const getUsers = asyncHandler(async (req, res, next) => {
        const {email, username} = req.query;
        const skip = req.query.skip ?? 0;
        const limit = req.query.limit ?? 50;

        const users = await Users.find({...email && {email}, ...username && {username}, }).skip(skip).limit(limit);
        return res.send(users);
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
        const token = req.header('authorization');
        const {_id} = jwtDecode(token)
        const user = await Users.findById(_id);

        if(!user){
            const error = new Error();
            error.code = 404;
            error.message = 'No such user';
            throw error;
        }

        return res.send(user);
});

const createUser = [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').isLength({min:8, max:64}),
    body('confirmPassword').custom((value, { req }) => {
        return value === req.body.password;
    }),
    body('username').trim().isLength({max:20}).escape(),
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


        const opts = {}
        opts.expiresIn = 60 * 15; //15 min

        const refreshOpts = {};
        refreshOpts.expiresIn = 60 * 60 * 24 * 14 // 2 weeks

        const secret = process.env.JWT_SECRET;
        const refreshSecret = process.env.REFRESH_SECRET;

        const token = jwt.sign({ _id: newUser._id, }, secret, opts);
        const refreshToken = jwt.sign({_id: newUser._id,}, refreshSecret, refreshOpts);

        //expires converted to ms from mins
        return res.status(200).cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + refreshOpts.expiresIn * 1000), httpOnly: true }).json({
            message: "Auth Passed",
            token
        })
    })
]

const updateUser = [
    param('id').isMongoId(),
    body('username').if(value => value).trim().isLength({min:8, max:20}).escape(),
    body('first_name').if(value => value).trim().escape(),
    body('last_name').if(value => value).trim().escape(),
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const {email} = req.query;
        const { username, first_name, last_name, } = req.body;

        console.log(id)
        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const user = id ? await Users.findById(id) : await Users.findOne({email});
        const userExist = user !== null;

        if(!userExist){
            const error = new Error('No such user');
            error.code = 400
            return next(error);
        }

        const now = Date.now();

        const userBody = {
            _id:id,
            ...username && {username},
            ...first_name && {first_name},
            ...last_name && {last_name},
            updated_at: now,
        }
        await Users.findByIdAndUpdate(user._id, userBody);
        const updatedUser = await Users.findById(id)

        res.json(updatedUser);
    })
]

const deleteUser =  [
    param('id').isMongoId,
    asyncHandler(async (req, res, next) => {
        const {id,} = req.params;
        const {email} = req.query;

        const result = validationResult(req);
        const errors = result.errors;

        if(errors.length){
            return res.status(400).json(errors);
        }

        const user = id ? await Users.findById(id) : await Users.findOne({email});
        const userExist = user !== null;

        if(!userExist){
            const error = new Error('No such user');
            error.code = 400
            return next(error);
        }

        await Users.findByIdAndDelete(user._id);

        res.send(true);
})]


module.exports = {
    getUsers,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
};
